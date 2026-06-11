interface MetricProps {
  label: string;
  value: string;
  muted?: boolean;
}

export function Metric({ label, value, muted = false }: MetricProps) {
  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
        {label}
      </span>
      <span
        className={`mt-2 block font-mono text-2xl font-semibold ${
          muted ? "text-text-secondary" : "text-text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
