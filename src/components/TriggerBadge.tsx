interface TriggerBadgeProps {
  label: string;
  variant?: "default" | "active";
}

export function TriggerBadge({ label, variant = "default" }: TriggerBadgeProps) {
  const isActive = variant === "active";

  return (
    <span
      className={`inline-flex rounded-[4px] px-3 py-1 text-xs ${
        isActive
          ? "border border-border-strong bg-[rgba(230,192,138,0.12)] text-gold"
          : "border border-border-divider bg-raised text-text-secondary"
      }`}
    >
      {label}
    </span>
  );
}
