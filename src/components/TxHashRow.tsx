import type { TxHash } from "@/lib/types";

interface TxHashRowProps {
  tx: TxHash;
}

function truncateHash(hash: string): string {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function TxHashRow({ tx }: TxHashRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
        {tx.label || tx.type}
      </span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-gold">
          {truncateHash(tx.hash)}
        </span>
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border border-border-divider text-[10px] text-text-muted"
          aria-hidden="true"
        >
          ⎘
        </span>
      </div>
    </div>
  );
}
