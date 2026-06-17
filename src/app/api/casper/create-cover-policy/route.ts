import { NextResponse } from "next/server";

const CHAIN_NAME = process.env.CASPER_CHAIN_NAME ?? "casper-test";
const NODE_ADDRESS =
  process.env.CASPER_NODE_ADDRESS ??
  "https://node.testnet.casper.network/rpc";
const CONTRACT_HASH =
  process.env.VAULTCOVER_CONTRACT_HASH ??
  "hash-2f485675833c0abd6faa96803dd3cd02a35e6afc363fc545d2cdb4a05733b68a";

const SUPPORTED_VAULTS = ["rwa-invoice-vault", "stable-yield-vault", "high-apy-experimental"];
const MAX_COVER_AMOUNT = 10_000;
const PAYMENT_MOTES = 10_000_000_000;

function loadPrivateKey(): string {
  const b64 = process.env.CASPER_RELAYER_PRIVATE_KEY_PEM_B64;
  if (!b64) {
    throw new Error("CASPER_RELAYER_PRIVATE_KEY_PEM_B64 is not set");
  }
  return Buffer.from(b64, "base64").toString("utf-8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      policyId: rawPolicyId,
      vaultId = "rwa-invoice-vault",
      coverAmount = 10_000,
      premium = 250,
      expiry = 9_999_999_999,
      userWallet,
    } = body as {
      policyId?: string;
      vaultId?: string;
      coverAmount?: number;
      premium?: number;
      expiry?: number;
      userWallet?: string;
    };

    // Validate
    if (!userWallet) {
      return NextResponse.json(
        { error: "userWallet is required. Connect your Casper Wallet first." },
        { status: 400 }
      );
    }

    if (!SUPPORTED_VAULTS.includes(vaultId)) {
      return NextResponse.json(
        { error: `Unsupported vault: ${vaultId}` },
        { status: 400 }
      );
    }

    if (coverAmount > MAX_COVER_AMOUNT) {
      return NextResponse.json(
        { error: `coverAmount must be <= ${MAX_COVER_AMOUNT} for demo` },
        { status: 400 }
      );
    }

    const policyId = rawPolicyId ?? `policy-rwa-ui-${Date.now()}`;

    // ── Load SDK and key ──────────────────────────────────────────────
    const sdk = await import("casper-js-sdk");
    const {
      KeyAlgorithm,
      PrivateKey,
      CLValue,
      CLTypeString,
      CLTypeUInt64,
      CLValueString,
      CLValueUInt64,
      Args,
      ContractCallBuilder,
      RpcClient,
      HttpHandler,
    } = sdk;

    const pem = loadPrivateKey();
    const isEd25519 = pem.includes("Ed25519") || pem.includes("ED25519");
    const algorithm = isEd25519
      ? KeyAlgorithm.ED25519
      : KeyAlgorithm.SECP256K1;
    const privateKey = PrivateKey.fromPem(pem, algorithm);

    // ── Build arguments ───────────────────────────────────────────────
    const mkString = (val: string) => {
      const v = new CLValue(CLTypeString);
      v.stringVal = new CLValueString(val);
      return v;
    };
    const mkU64 = (val: number) => {
      const v = new CLValue(CLTypeUInt64);
      v.ui64 = new CLValueUInt64(val);
      return v;
    };

    const args = Args.fromMap({
      policy_id: mkString(policyId),
      vault_id: mkString(vaultId),
      cover_amount: mkU64(coverAmount),
      premium: mkU64(premium),
      expiry: mkU64(expiry),
    });

    // ── Build, sign, submit ───────────────────────────────────────────
    const tx = new ContractCallBuilder()
      .from(privateKey.publicKey)
      .byHash(CONTRACT_HASH.replace(/^hash-/, ""))
      .entryPoint("create_cover_policy")
      .runtimeArgs(args)
      .chainName(CHAIN_NAME)
      .payment(PAYMENT_MOTES)
      .build();

    tx.sign(privateKey);

    const rpc = new RpcClient(new HttpHandler(NODE_ADDRESS));
    const result = await rpc.putTransaction(tx);
    const deployHash = result.transactionHash.toHex();

    return NextResponse.json({
      deployHash,
      policyId,
      status: "submitted",
      network: "casper-test",
      userWallet,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[casper deploy error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
