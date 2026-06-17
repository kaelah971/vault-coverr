import { NextResponse } from "next/server";

const NODE_ADDRESS =
  process.env.CASPER_NODE_ADDRESS ??
  "https://node.testnet.casper.network/rpc";

const isDev = process.env.NODE_ENV === "development";

function safeKeys(v: unknown): string[] | string {
  if (v === null || v === undefined) return String(v);
  if (typeof v === "string") return `string(${(v as string).length})`;
  if (typeof v === "object") return Object.keys(v as Record<string, unknown>);
  return typeof v;
}

function errJson(message: string, extra: Record<string, unknown> = {}, status = 500) {
  return NextResponse.json(
    isDev ? { error: message, ...extra } : { error: message },
    { status }
  );
}

// ── Signature normalization ──────────────────────────────────────────────────────

/**
 * Normalize a raw Casper Wallet signature into the format:
 *   algorithm_byte + DER_signature
 *
 * Casper Wallet returns compact secp256k1 signatures (64 bytes, 128 hex chars).
 * The Casper network expects: 02 + DER-encoded signature.
 */
async function normalizeCasperSignature(
  sigHex: string,
  userWallet: string
): Promise<string> {
  // Strip 0x prefix
  if (sigHex.startsWith("0x") || sigHex.startsWith("0X")) {
    sigHex = sigHex.slice(2);
  }

  const keyPrefix = userWallet.slice(0, 2);

  console.log("[normalize] userWallet prefix:", keyPrefix);
  console.log("[normalize] raw sig length:", sigHex.length, "chars");
  console.log("[normalize] raw sig startsWith 30:", sigHex.startsWith("30"));

  // Ed25519 (prefix "01")
  if (keyPrefix === "01") {
    if (sigHex.startsWith("01")) return sigHex;
    return "01" + sigHex;
  }

  // Secp256k1 (prefix "02")
  if (keyPrefix === "02") {
    // Already has algorithm prefix
    if (sigHex.startsWith("02")) return sigHex;

    // DER format — reject, Casper expects compact
    if (sigHex.startsWith("30")) {
      throw new Error(
        "DER signature returned by wallet, expected compact secp256k1 signature"
      );
    }

    // Compact format (128 hex chars = 64 bytes) — just prefix with "02"
    if (sigHex.length === 128) {
      return "02" + sigHex;
    }

    throw new Error(
      `Unsupported secp256k1 signature format (length=${sigHex.length})`
    );
  }

  throw new Error(`Unsupported key algorithm (prefix=${keyPrefix})`);
}

// ── Route ────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let bodyObj: Record<string, unknown> = {};

  try {
    bodyObj = (await request.json()) as Record<string, unknown>;

    const deployJson = bodyObj.deployJson as Record<string, unknown> | undefined;
    const walletSignature = bodyObj.walletSignature as Record<string, unknown> | undefined;
    const userWallet = bodyObj.userWallet as string | undefined;

    console.log("[send-signed-deploy] body keys:", Object.keys(bodyObj));
    console.log("[send-signed-deploy] deployJson keys:", safeKeys(deployJson));
    console.log("[send-signed-deploy] walletSignature keys:", safeKeys(walletSignature));

    if (!deployJson || typeof deployJson !== "object") {
      return errJson("deployJson is required and must be an object", {
        bodyKeys: Object.keys(bodyObj),
        deployJsonType: typeof deployJson,
      }, 400);
    }
    if (!walletSignature) {
      return errJson("walletSignature is required", { bodyKeys: Object.keys(bodyObj) }, 400);
    }
    if (!userWallet) {
      return errJson("userWallet is required", { bodyKeys: Object.keys(bodyObj) }, 400);
    }

    if (walletSignature.cancelled === true) {
      return errJson("Wallet signature was cancelled", {}, 400);
    }

    // ── Extract raw signature ──────────────────────────────────────
    const rawSig =
      (walletSignature.signatureHex as string) ??
      (walletSignature.signature as string);

    if (!rawSig || typeof rawSig !== "string" || rawSig.length < 10) {
      return errJson("Wallet did not return a valid signature", {
        walletSignatureKeys: safeKeys(walletSignature),
      });
    }

    console.log("[send-signed-deploy] raw signature starts with:", rawSig.slice(0, 10));

    // ── Normalize signature ────────────────────────────────────────
    let normalizedSig: string;
    try {
      normalizedSig = await normalizeCasperSignature(rawSig, userWallet);
    } catch (e: unknown) {
      return errJson("Failed to normalize wallet signature", {
        rawSigLen: rawSig.length,
        rawSigPrefix: rawSig.slice(0, 10),
        userWalletPrefix: userWallet.slice(0, 2),
        details: e instanceof Error ? e.message : String(e),
      });
    }

    console.log("[send-signed-deploy] normalized sig prefix:", normalizedSig.slice(0, 2));
    console.log("[send-signed-deploy] normalized sig length:", normalizedSig.length);

    // ── Attach approval ────────────────────────────────────────────
    const existing = (deployJson.approvals as Array<Record<string, unknown>>) ?? [];
    const filtered = existing.filter((a) => a.signer !== userWallet);
    const approvals = [
      ...filtered,
      { signer: userWallet, signature: normalizedSig },
    ] as unknown[];
    deployJson.approvals = approvals;

    console.log("[send-signed-deploy] approvals count:", approvals.length);

    // ── Reconstruct and submit ─────────────────────────────────────
    const sdk = await import("casper-js-sdk");
    const { Deploy } = sdk;

    let deploy: InstanceType<typeof Deploy>;
    try {
      deploy = Deploy.fromJSON(deployJson);
    } catch (e: unknown) {
      return errJson("Deploy.fromJSON failed after signature normalization", {
        deployJsonKeys: safeKeys(deployJson),
        approvalsCount: approvals.length,
        details: e instanceof Error ? e.message : String(e),
      });
    }

    console.log("[send-signed-deploy] Deploy.fromJSON succeeded");

    // ── Serialize deploy to JSON for JSON-RPC ───────────────────────
    const finalDeployJson = Deploy.toJSON(deploy);
    console.log("[send-signed-deploy] finalDeployJson keys:", safeKeys(finalDeployJson));

    // ── Broadcast via raw JSON-RPC ──────────────────────────────────
    const rpcPayload = {
      id: Date.now(),
      jsonrpc: "2.0",
      method: "account_put_deploy",
      params: { deploy: finalDeployJson },
    };

    let rpcResponse: Response;
    try {
      rpcResponse = await fetch(NODE_ADDRESS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rpcPayload),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errJson(`RPC request failed: ${msg}`, { details: msg });
    }

    let rpcData: Record<string, unknown>;
    try {
      rpcData = (await rpcResponse.json()) as Record<string, unknown>;
    } catch {
      const text = await rpcResponse.text();
      return errJson("RPC response is not valid JSON", {
        status: rpcResponse.status,
        body: text.slice(0, 500),
      });
    }

    if (rpcData.error) {
      return errJson("account_put_deploy failed", {
        rpcError: rpcData.error,
        deployJsonKeys: safeKeys(finalDeployJson),
        approvalsCount: approvals.length,
        signaturePrefix: normalizedSig.slice(0, 2),
        signatureLength: normalizedSig.length,
      });
    }

    const result = rpcData.result as Record<string, unknown> | undefined;
    const deployHash =
      (result?.deploy_hash as string) ??
      (result?.value as Record<string, unknown>)?.deploy_hash as string;

    if (!deployHash) {
      return errJson("No deploy_hash in RPC result", {
        rpcResult: result,
      });
    }

    console.log("[send-signed-deploy] submitted", {
      deployHash: deployHash.slice(0, 10) + "...",
    });

    return NextResponse.json({
      deployHash,
      status: "submitted",
      network: "casper-test",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("[send-signed-deploy uncaught]", msg, stack);

    return errJson("Failed to broadcast signed deploy", {
      message: msg,
      stack: isDev ? stack : undefined,
      bodyKeys: Object.keys(bodyObj),
      details: msg,
    });
  }
}
