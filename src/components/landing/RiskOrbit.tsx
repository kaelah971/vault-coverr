const orbitSignals = [
  { label: "TVL", value: "−45.2%", position: "left-0 top-[18%]" },
  { label: "APY", value: "8.4%", position: "right-0 top-[24%]" },
  { label: "CONF", value: "91%", position: "bottom-[7%] left-[6%]" },
];

export function RiskOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full min-w-0 max-w-[560px]" aria-label="Live vault risk score: 84 out of 100, trigger detected">
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full border border-[#42433D]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[19%] rounded-full border border-dashed border-[#00BAE2]/45 motion-safe:animate-[spin_28s_linear_infinite]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[31%] rounded-full border border-[#ABFF84]/50"
      />

      <div
        aria-hidden="true"
        className="absolute inset-[8%] motion-safe:animate-[spin_16s_linear_infinite]"
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#ABFF84] shadow-[0_0_18px_rgba(171,255,132,0.8)]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-[19%] motion-safe:animate-[spin_22s_linear_infinite_reverse]"
      >
        <span className="absolute bottom-[8%] right-[8%] h-2 w-2 rounded-full bg-[#00BAE2] shadow-[0_0_18px_rgba(0,186,226,0.8)]" />
      </div>

      <div
        className="absolute inset-[31%] flex flex-col items-center justify-center rounded-full bg-[#0E100F] text-center shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        role="meter"
        aria-label="Vault risk score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={84}
        aria-valuetext="84 out of 100, trigger detected"
      >
        <span className="text-[10px] text-[#7C7C6F]">RISK SCORE</span>
        <strong className="mt-1 text-[clamp(3rem,8vw,5.5rem)] font-normal leading-none text-[#FFFCE1]">
          84
        </strong>
        <span className="mt-2 rounded-full border border-[#ABFF84]/40 px-3 py-1 text-[10px] text-[#ABFF84]">
          TRIGGER DETECTED
        </span>
      </div>

      {orbitSignals.map((signal) => (
        <div
          key={signal.label}
          className={`absolute ${signal.position} rounded-lg border border-[#42433D] bg-[#0E100F]/95 p-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)]`}
        >
          <span className="block text-[9px] text-[#7C7C6F]">{signal.label}</span>
          <span className="mt-1 block text-sm text-[#FFFCE1]">{signal.value}</span>
        </div>
      ))}

      <div className="absolute bottom-[5%] right-0 max-w-[190px] rounded-lg border border-[#00BAE2]/30 bg-[#00BAE2]/[0.06] p-3 text-xs leading-5 text-[#BBBAA6]">
        <span className="text-[#00BAE2]">signal://</span> liquidity fell below
        the covered threshold.
      </div>
    </div>
  );
}
