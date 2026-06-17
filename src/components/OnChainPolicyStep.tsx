"use client";

import { useState, useRef, useCallback } from "react";
import { createCasperProvider, signAndSendDeploy, formatAddress } from "@/lib/casper-wallet";

// ── Types ────────────────────────────────────────────────────────────────────────

export interface OnChainPolicyState {
  deployHash: string;
  policyId: string;
  status: "submitted" | "confirmed" | "failed" | "timeout" | "error";
  confirmed: boolean;
  error?: string;
}

type FlowState =
  | "idle"
  | "building"
  | "wallet_sign"
  | "broadcasting"
  | "submitted"
  | "confirming"
  | "confirmed"
  | "failed";

interface Props {
  vaultId: string;
  coverAmount: number;
  premium: number;
  walletAddress: string | null;
  isWalletConnected: boolean;
  onConnect: () => void;
  confirmed: boolean;
  onConfirm: (state: OnChainPolicyState) => void;
  onReset: () => void;
  savedState: OnChainPolicyState | null;
}

// ── Constants ────────────────────────────────────────────────────────────────────

const CONTRACT_HASH =
  "hash-2f485675833c0abd6faa96803dd3cd02a35e6afc363fc545d2cdb4a05733b68a";
const NODE_ADDRESS = "https://node.testnet.casper.network/rpc";
const CHAIN_NAME = "casper-test";
const PAYMENT_MOTES = 10_000_000_000;
const POLL_INTERVAL_MS = 8_000;
const POLL_MAX_ATTEMPTS = 15;

function truncateHash(hash: string): string {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

// ── Component ────────────────────────────────────────────────────────────────────

export function OnChainPolicyStep({
  vaultId,
  coverAmount,
  premium,
  walletAddress,
  isWalletConnected,
  onConnect,
  onConfirm,
  onReset,
  savedState,
}: Props) {
  const [result, setResult] = useState<OnChainPolicyState | null>(savedState);
  const [pollCount, setPollCount] = useState(0);
  const [flow, setFlow] = useState<FlowState>(savedState ? "confirmed" : "idle");
  const [flowError, setFlowError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  const display = result ?? savedState;

  // ── Reset everything ──────────────────────────────────────────────
  const fullReset = useCallback(() => {
    cancelledRef.current = true;
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setResult(null);
    setPollCount(0);
    setFlow("idle");
    setFlowError(null);
    onReset();
  }, [onReset]);

  // ── Create policy ─────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!walletAddress) return;

    cancelledRef.current = false;
    setResult(null);
    setPollCount(0);
    setFlowError(null);

    const provider = createCasperProvider();
    if (!provider) {
      setFlow("failed");
      setFlowError("Casper Wallet extension not detected. Please install it from casperwallet.io.");
      return;
    }
    if (typeof provider.sign !== "function") {
      const keys = Object.keys(provider).join(", ");
      setFlow("failed");
      setFlowError(
        `Casper Wallet does not support signing. Available: [${keys}]. Please update the extension.`
      );
      return;
    }

    const policyId = `policy-${vaultId}-${Date.now()}`;
    console.log("[OnChainPolicyStep] building deploy", { vaultId, policyId });

    let deployHash = "";

    try {
      setFlow("building");

      const signResult = await signAndSendDeploy(
        provider,
        walletAddress,
        {
          entryPoint: "create_cover_policy",
          args: {
            policy_id: policyId,
            vault_id: vaultId,
            cover_amount: coverAmount,
            premium,
            expiry: 9_999_999_999,
          },
          paymentMotes: PAYMENT_MOTES,
          chainName: CHAIN_NAME,
          nodeAddress: NODE_ADDRESS,
          contractHash: CONTRACT_HASH,
        },
        {
          onProgress: (step) => {
            if (cancelledRef.current) return;
            setFlow(step);
          },
        }
      );

      if (cancelledRef.current) return;

      // ── Send deployJson + walletSignature to backend ────────────
      setFlow("broadcasting");
      console.log("[OnChainPolicyStep] sending deploy + signature to API");

      const broadcastRes = await fetch("/api/casper/send-signed-deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deployJson: signResult.deployJson,
          walletSignature: signResult.walletSignature,
          policyId,
          vaultId,
          userWallet: walletAddress,
        }),
      });

      if (!broadcastRes.ok) {
        const text = await broadcastRes.text();
        let body: unknown = text;
        try { body = JSON.parse(text); } catch { /* not JSON */ }
        console.warn("[OnChainPolicyStep] broadcast failed", {
          status: broadcastRes.status,
          statusText: broadcastRes.statusText,
          body,
        });
        const errMsg =
          typeof body === "object" && body !== null
            ? String((body as Record<string, unknown>).error ?? text)
            : String(text);
        throw new Error(`Broadcast failed: ${errMsg}`);
      }

      const broadcastData = await broadcastRes.json();
      deployHash = broadcastData.deployHash as string;

      if (cancelledRef.current) return;

      console.log("[OnChainPolicyStep] deploy hash received", {
        deployHash: deployHash.slice(0, 10) + "...",
        policyId,
      });

      setFlow("submitted");
      setResult({ deployHash, policyId, status: "submitted", confirmed: false });

      // ── Poll for confirmation ────────────────────────────────
      setFlow("confirming");
      console.log("[OnChainPolicyStep] polling deploy status");

      let attempts = 0;
      pollRef.current = setInterval(async () => {
        if (cancelledRef.current) {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          return;
        }
        attempts++;
        setPollCount(attempts);

        try {
          const res = await fetch(
            `/api/casper/deploy-status?hash=${deployHash}`
          );
          const data = await res.json();

          if (cancelledRef.current) return;

          if (data.status === "confirmed") {
            clearInterval(pollRef.current!);
            pollRef.current = null;
            const state: OnChainPolicyState = {
              deployHash, policyId, status: "confirmed", confirmed: true,
            };
            setResult(state);
            setFlow("confirmed");
            onConfirm(state);
            console.log("[OnChainPolicyStep] confirmed");
          } else if (data.status === "failed") {
            clearInterval(pollRef.current!);
            pollRef.current = null;
            const decoded = (data.decodedError as string) ?? data.errorMessage ?? "Unknown error";
            setResult({
              deployHash, policyId, status: "failed", confirmed: false,
              error: `Transaction executed but contract rejected it: ${decoded}`,
            });
            setFlow("failed");
            setFlowError(`Transaction executed but contract rejected it: ${decoded}`);
            console.log("[OnChainPolicyStep] failed", data.errorMessage, decoded);
          }
        } catch {
          // network error — keep polling
        }

        if (attempts >= POLL_MAX_ATTEMPTS) {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setResult({
            deployHash, policyId, status: "timeout", confirmed: false,
            error: "Confirmation timed out. Check the deploy hash on Casper Testnet.",
          });
          setFlow("failed");
          setFlowError("Confirmation timed out after " + (POLL_MAX_ATTEMPTS * POLL_INTERVAL_MS / 1000) + "s.");
          console.log("[OnChainPolicyStep] poll timeout");
        }
      }, POLL_INTERVAL_MS);
    } catch (err: unknown) {
      if (cancelledRef.current) return;
      const msg = err instanceof Error ? err.message : String(err);
      setFlow("failed");
      setFlowError(msg);
      console.log("[OnChainPolicyStep] failed", msg);
    }
  };

  // ── Cancel spinner ────────────────────────────────────────────────
  const handleCancel = () => {
    fullReset();
  };

  // ── Render helpers ────────────────────────────────────────────────

  const isRunning = flow === "building" || flow === "wallet_sign" || flow === "broadcasting";
  const isPolling = flow === "submitted" || flow === "confirming";

  return (
    <div className="rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
      <h3 className="font-display text-lg font-bold text-gold">
        Step 1 — Create Policy on Casper Testnet
      </h3>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Your connected Casper Wallet will sign this transaction and pay
        Casper Testnet gas. This creates your cover policy on the VaultCover
        smart contract.
      </p>
      <p className="mt-1 text-xs text-text-muted">
        On-chain policy creation is required before cover activation.
      </p>

      <div className="mt-5">
        {/* Not connected */}
        {!isWalletConnected && (
          <div className="space-y-3">
            <div className="rounded-[6px] border border-border-subtle bg-surface-elevated px-5 py-3 text-center">
              <p className="text-sm text-text-muted">
                Connect your Casper Wallet to create an on-chain cover policy.
              </p>
            </div>
            <button
              type="button"
              onClick={onConnect}
              className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[rgba(230,192,138,0.55)] bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian transition hover:bg-[#F0CCA0]"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Idle — create button */}
        {isWalletConnected && flow === "idle" && (
          <div>
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-[6px] border border-[rgba(159,183,199,0.55)] px-6 py-3 text-center font-semibold text-[#9FB7C7] transition hover:border-[#9FB7C7] hover:-translate-y-0.5"
            >
              Create Policy on Casper Testnet
            </button>
            <p className="mt-3 text-xs leading-5 text-text-muted">
              This wallet needs Casper Testnet CSPR to submit the transaction.
            </p>
          </div>
        )}

        {/* Running spinner */}
        {isRunning && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-[6px] border border-border-subtle bg-surface-elevated px-5 py-3">
              <svg className="animate-spin text-gold" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path d="M12 2C6.47715 2 2 6.47715 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-sm text-text-secondary">
                {flow === "building" && "Building transaction..."}
                {flow === "wallet_sign" && "Waiting for Casper Wallet signature..."}
                {flow === "broadcasting" && "Signature received. Broadcasting transaction..."}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-danger underline transition hover:opacity-80"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Polling */}
        {isPolling && display && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border-default bg-raised p-5">
              <div className="space-y-3">
                <Row label="Network" value="Casper Testnet" />
                <Row label="Policy ID" value={display.policyId} mono />
                <Row
                  label="Deploy hash"
                  value={display.deployHash ? truncateHash(display.deployHash) : "—"}
                  mono
                  copyValue={display.deployHash}
                />
                <Row label="Signed by" value={walletAddress ? formatAddress(walletAddress) : "—"} />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[rgba(159,183,199,0.24)] bg-[rgba(159,183,199,0.06)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#9FB7C7]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9FB7C7]" />
                    Submitted
                  </span>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-text-muted">
                Waiting for confirmation{pollCount > 0 ? ` (attempt ${pollCount})` : ""}...
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-text-muted underline transition hover:text-gold"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Confirmed */}
        {flow === "confirmed" && display && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border-default bg-raised p-5">
              <div className="space-y-3">
                <Row label="Network" value="Casper Testnet" />
                <Row label="Policy ID" value={display.policyId} mono />
                <Row
                  label="Deploy hash"
                  value={truncateHash(display.deployHash)}
                  mono
                  copyValue={display.deployHash}
                />
                <Row label="Signed by" value={walletAddress ? formatAddress(walletAddress) : "—"} />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-safe/20 bg-safe/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.06em] text-safe">
                    <span className="h-1.5 w-1.5 rounded-full bg-safe" />
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-safe/20 bg-safe/[0.04] p-5 text-center">
              <p className="text-sm font-semibold text-safe">
                Confirmed on Casper Testnet
              </p>
              <p className="mt-1 text-xs text-text-muted">
                You can now activate cover in VaultCover.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-text-muted underline transition hover:text-gold"
            >
              Create new policy
            </button>
          </div>
        )}

        {/* Failed */}
        {flow === "failed" && (
          <div className="space-y-3">
            <div className="rounded-xl border border-[rgba(214,106,94,0.22)] bg-[rgba(214,106,94,0.04)] p-5">
              <p className="text-sm font-semibold text-danger">Transaction failed</p>
              <p className="mt-1 text-xs text-text-secondary">
                {flowError || "Unknown error"}
              </p>
              {/* Show last result info if available */}
              {display?.deployHash && (
                <div className="mt-3 space-y-2 border-t border-border-subtle pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Policy ID</span>
                    <code className="text-text-secondary">{display.policyId}</code>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Deploy hash</span>
                    <code className="text-text-secondary">{truncateHash(display.deployHash)}</code>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-text-muted underline transition hover:text-gold"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────────

function Row({
  label,
  value,
  mono,
  copyValue,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyValue?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-muted">{label}</span>
      <div className="flex items-center gap-1.5">
        {mono ? (
          <code className="rounded-[4px] bg-surface-elevated px-2 py-0.5 font-mono text-xs text-text-secondary">
            {value}
          </code>
        ) : (
          <span className="text-sm text-text-primary">{value}</span>
        )}
        {copyValue && (
          <button
            type="button"
            onClick={async () => {
              try { await navigator.clipboard.writeText(copyValue); } catch { /* noop */ }
            }}
            className="text-text-muted transition-colors hover:text-gold"
            aria-label="Copy"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
