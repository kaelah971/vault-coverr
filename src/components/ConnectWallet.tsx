"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { formatAddress } from "@/lib/casper-wallet";

// ── Inline SVGs ────────────────────────────────────────────────────────────────

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M19 7H5C3.89543 7 3 7.89543 3 9V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9C21 7.89543 20.1046 7 19 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DisconnectIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17L21 12L16 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ConnectWallet() {
  const {
    address,
    balance,
    isConnected,
    isInstalled,
    network,
    connect,
    disconnect,
    error,
  } = useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — silently ignore
    }
  };

  // ── Not installed ────────────────────────────────────────────────────────
  if (!isInstalled) {
    return (
      <div className="flex flex-col gap-2 px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-danger">
          Casper Wallet not detected
        </p>
        <a
          href="https://casperwallet.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[6px] border border-border-default bg-[rgba(230,192,138,0.06)] px-4 py-2 text-sm font-semibold text-gold transition hover:border-[rgba(230,192,138,0.45)] hover:bg-[rgba(230,192,138,0.10)]"
        >
          <WalletIcon />
          Install Casper Wallet
        </a>
      </div>
    );
  }

  // ── Not connected ────────────────────────────────────────────────────────
  if (!isConnected || !address) {
    return (
      <div className="flex flex-col gap-2 px-1">
        <button
          type="button"
          onClick={connect}
          className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[rgba(230,192,138,0.55)] bg-gold px-5 py-2.5 text-sm font-semibold text-obsidian transition hover:bg-[#F0CCA0] hover:shadow-[0_0_24px_rgba(230,192,138,0.16)] active:translate-y-px"
        >
          <WalletIcon />
          Connect Wallet
        </button>
        {error && (
          <p className="text-xs leading-5 text-danger">{error}</p>
        )}
      </div>
    );
  }

  // ── Connected ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-2 px-1">
      {/* Connected address box — clickable for details */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-[6px] border border-[rgba(118,217,156,0.24)] bg-[rgba(118,217,156,0.06)] px-4 py-2.5 text-left transition hover:border-[rgba(118,217,156,0.40)]"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-safe" />
          <span className="flex-1 truncate font-mono text-xs text-safe">
            {formatAddress(address)}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`shrink-0 text-safe transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-[12px] border border-border-default bg-surface p-4 shadow-[0_8px_32px_rgba(0,0,0,0.48)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-safe" />
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-safe">
                  Connected
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-[6px] border border-border-subtle bg-raised px-3 py-2">
                <span className="flex-1 truncate font-mono text-xs text-text-primary">
                  {formatAddress(address)}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 rounded-[4px] p-1 text-text-muted transition hover:bg-[rgba(230,192,138,0.10)] hover:text-gold"
                  aria-label={copied ? "Copied" : "Copy address"}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-text-muted">
                <div className="flex items-center justify-between">
                  <span>Network</span>
                  <span className="font-medium text-text-secondary">
                    {network}
                  </span>
                </div>
                {balance && (
                  <div className="flex items-center justify-between">
                    <span>Balance</span>
                    <span className="font-mono font-medium text-text-primary">
                      {balance}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Disconnect Wallet — always visible below the connected box */}
      <button
        type="button"
        onClick={() => disconnect()}
        className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-border-divider bg-deep px-4 py-2.5 text-xs font-semibold text-text-muted transition hover:border-[rgba(230,192,138,0.45)] hover:text-gold"
      >
        <DisconnectIcon />
        Disconnect Wallet
      </button>

      {error && (
        <p className="text-xs leading-5 text-danger">{error}</p>
      )}
    </div>
  );
}
