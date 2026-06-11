interface RiskScoreBarProps {
  score: number;
  label: "Low" | "Medium" | "High";
  showValue?: boolean;
}

export function RiskScoreBar({
  score,
  label,
  showValue = true,
}: RiskScoreBarProps) {
  const barColor =
    score <= 30
      ? "bg-safe"
      : score <= 65
        ? "bg-gold"
        : "bg-danger";

  const textColor =
    score <= 30
      ? "text-safe"
      : score <= 65
        ? "text-gold"
        : "text-danger";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-text-muted">
        <span>Risk Score</span>
        {showValue && (
          <span className={`font-mono ${textColor}`}>
            {score} / 100 &middot; {label}
          </span>
        )}
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-elevated">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
