import { NextResponse } from "next/server";

const NODE_ADDRESS =
  process.env.CASPER_NODE_ADDRESS ??
  "https://node.testnet.casper.network/rpc";

const CONTRACT_HASH = "hash-2f485675833c0abd6faa96803dd3cd02a35e6afc363fc545d2cdb4a05733b68a";

async function rpcCall(method: string, params: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(NODE_ADDRESS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Date.now(), jsonrpc: "2.0", method, params }),
  });
  return (await res.json()) as Record<string, unknown>;
}

async function getStateRootHash(): Promise<string | null> {
  const data = await rpcCall("chain_get_state_root_hash", null);
  if (data.error) return null;
  return (data.result as { state_root_hash?: string })?.state_root_hash ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vaultId = searchParams.get("vaultId");

  if (!vaultId) {
    return NextResponse.json({ error: "vaultId query parameter is required" }, { status: 400 });
  }

  try {
    const stateRootHash = await getStateRootHash();
    if (!stateRootHash) {
      return NextResponse.json({
        registered: false, vaultId,
        error: "Could not fetch state root hash",
      });
    }

    console.log("[check-vault] state root hash:", stateRootHash.slice(0, 10) + "...");
    console.log("[check-vault] querying dictionary vaults key:", vaultId);

    const data = await rpcCall("state_get_dictionary_item", {
      state_root_hash: stateRootHash,
      dictionary_identifier: {
        ContractNamedKey: {
          key: CONTRACT_HASH,
          dictionary_name: "vaults",
          dictionary_item_key: vaultId,
        },
      },
    });

    if (data.error) {
      console.error("[check-vault] RPC error:", JSON.stringify(data.error));
      return NextResponse.json({
        registered: false,
        vaultId,
        error: "Dictionary lookup failed",
        debug: data.error,
      });
    }

    const result = data.result as Record<string, unknown> | undefined;
    const storedValue = result?.stored_value as Record<string, unknown> | undefined;
    const clValue = storedValue?.CLValue ?? storedValue?.cl_value;
    const found = clValue !== undefined && clValue !== null;

    return NextResponse.json({ registered: found, vaultId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ registered: false, vaultId, error: "Query failed", debug: msg });
  }
}
