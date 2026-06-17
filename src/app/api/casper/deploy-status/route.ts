import { NextResponse } from "next/server";
import { decodeContractError } from "@/lib/contract-errors";

const NODE_ADDRESS =
  process.env.CASPER_NODE_ADDRESS ??
  "https://node.testnet.casper.network/rpc";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deployHash = searchParams.get("hash");

    if (!deployHash) {
      return NextResponse.json(
        { error: "hash query parameter is required" },
        { status: 400 }
      );
    }

    const sdk = await import("casper-js-sdk");
    const { RpcClient, HttpHandler } = sdk;
    const rpc = new RpcClient(new HttpHandler(NODE_ADDRESS));

    let executed = false;
    let errorMessage: string | null = null;

    try {
      const txResult = await rpc.getTransactionByTransactionHash(deployHash);
      const info = txResult.executionInfo;
      if (info) {
        executed = true;
        errorMessage = info.executionResult?.errorMessage ?? null;
      }
    } catch {
      // Fallback: legacy deploy lookup
      try {
        const deployResult = await rpc.getDeploy(deployHash);
        const execResults = deployResult.executionResultsV1 ?? [];
        if (execResults.length > 0) {
          executed = true;
          const first = execResults[0];
          errorMessage = first.result?.failure?.errorMessage ?? null;
        }
      } catch {
        return NextResponse.json({ status: "pending" });
      }
    }

    if (!executed) {
      return NextResponse.json({ status: "pending" });
    }

    if (errorMessage) {
      return NextResponse.json({
        status: "failed",
        deployHash,
        errorMessage,
        decodedError: decodeContractError(errorMessage),
        network: "casper-test",
      });
    }

    return NextResponse.json({
      status: "confirmed",
      deployHash,
      network: "casper-test",
    });
  } catch {
    return NextResponse.json({ status: "pending" });
  }
}
