export function OnchainPendingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[rgba(230,192,138,0.24)] bg-[rgba(230,192,138,0.06)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-gold">
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      On-chain Mode: pending
    </span>
  );
}
