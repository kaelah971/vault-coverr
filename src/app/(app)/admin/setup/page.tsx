"use client";

import { useState } from "react";
import Link from "next/link";

const DEMO_VAULTS = [
  "stable-yield-vault",
  "rwa-invoice-vault",
  "high-apy-experimental",
];

export default function AdminSetupPage() {
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState<Record<string, boolean> | null>(null);

  const refreshVerification = async () => {
    setChecking(true);
    const verifications: Record<string, boolean> = {};
    for (const vaultId of DEMO_VAULTS) {
      try {
        const r = await fetch(`/api/casper/check-vault?vaultId=${encodeURIComponent(vaultId)}`);
        const d = await r.json();
        verifications[vaultId] = d.registered === true;
      } catch {
        verifications[vaultId] = false;
      }
    }
    setVerified(verifications);
    setChecking(false);
  };

  const allVerified = verified && Object.values(verified).every(Boolean);

  return (
    <div className="mx-auto max-w-[720px]">
      <Link href="/vaults" className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-gold">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        Back to Vaults
      </Link>

      <h1 className="font-display text-3xl font-bold text-gold">Admin Setup</h1>

      <div className="mt-4 rounded-xl border border-[rgba(230,192,138,0.18)] bg-[rgba(230,192,138,0.04)] p-5">
        <p className="text-sm leading-6 text-text-secondary">
          This is a <span className="font-semibold text-gold">one-time admin setup</span>.
          Normal users do not need to run this. Once the demo vaults are
          registered on-chain, anyone can create cover policies for them.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border-default bg-surface p-6 lg:p-8">
        <h2 className="font-display text-lg font-bold text-gold">Register Demo Vaults</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Run the seed script from your VS Code terminal to register all
          three demo vaults on the deployed VaultCover contract.
        </p>

        <div className="mt-4 rounded-[6px] border border-border-subtle bg-deep p-4">
          <code className="text-sm text-gold">npm run seed:demo-vaults</code>
        </div>

        <p className="mt-3 text-xs text-text-muted">
          Requires <code className="text-text-secondary">casper-client</code> in
          WSL and <code className="text-text-secondary">CASPER_RELAYER_SECRET_KEY_PATH</code>{" "}
          set in <code className="text-text-secondary">.env.local</code>.
        </p>

        <div className="mt-6 border-t border-border-subtle pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">On-chain verification</p>
              <p className="text-xs text-text-muted">Check which vaults are currently registered.</p>
            </div>
            <button
              type="button"
              onClick={refreshVerification}
              disabled={checking}
              className="rounded-[6px] border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/20 disabled:opacity-50"
            >
              {checking ? "Checking..." : "Refresh"}
            </button>
          </div>

          {verified && (
            <div className="mt-3 space-y-1">
              {DEMO_VAULTS.map((vaultId) => (
                <div key={vaultId} className="flex items-center justify-between rounded-lg bg-deep px-4 py-3 text-xs">
                  <span className="text-text-muted">{vaultId}</span>
                  {verified[vaultId] ? (
                    <span className="text-safe">registered</span>
                  ) : (
                    <span className="text-danger">not registered</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {allVerified && (
            <div className="mt-4 rounded-lg border border-safe/20 bg-safe/[0.04] p-3 text-center">
              <p className="text-sm font-semibold text-safe">All three demo vaults are registered on-chain.</p>
              <p className="mt-1 text-xs text-text-muted">Users can now create cover policies for any vault from the Vaults page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
