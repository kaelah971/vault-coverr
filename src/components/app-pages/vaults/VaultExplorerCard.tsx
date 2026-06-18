import Link from "next/link";
import type { Vault } from "@/lib/types";

interface VaultExplorerCardProps {
  vault: Vault;
  href: string;
}

function getRiskStyle(score: number) {
  if (score > 80) {
    return {
      line: "#FFFCE1",
      label: "High risk",
      status: "Trigger active",
      statusClass: "border-[#FFFCE1]/30 text-[#FFFCE1]",
    };
  }

  if (score >= 40) {
    return {
      line: "#00BAE2",
      label: "Medium risk",
      status: "Cover available",
      statusClass: "border-[#00BAE2]/35 text-[#00BAE2]",
    };
  }

  return {
    line: "#ABFF84",
    label: "Low risk",
    status: "Cover available",
    statusClass: "border-[#ABFF84]/35 text-[#ABFF84]",
  };
}

export function VaultExplorerCard({ vault, href }: VaultExplorerCardProps) {
  const risk = getRiskStyle(vault.riskScore);

  return (
    <article className="group flex min-h-[500px] flex-col rounded-lg border border-[#42433D] bg-[#0E100F]/50 p-5 shadow-[0_4px_16px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[#BBBAA6] motion-reduce:transform-none motion-reduce:transition-none sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="text-[10px] text-[#7C7C6F]">{vault.tag}</span>
        <span
          className={`inline-flex min-h-8 items-center rounded-full border px-3 text-[10px] font-semibold ${risk.statusClass}`}
        >
          {risk.status}
        </span>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-[10px] text-[#7C7C6F]">RISK SCORE</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-6xl font-normal leading-none">{vault.riskScore}</span>
            <span className="text-sm text-[#BBBAA6]">/ 100</span>
          </div>
          <p className="mt-2 text-sm" style={{ color: risk.line }}>
            {risk.label}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-[10px] text-[#7C7C6F]">APY / SECONDARY</p>
          <p className="mt-2 text-2xl text-[#BBBAA6]">{vault.apy}%</p>
        </div>
      </div>

      <div
        className="mt-5 h-1 overflow-hidden bg-[#42433D]"
        role="progressbar"
        aria-label={`${vault.name} risk score`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={vault.riskScore}
        aria-valuetext={`${vault.riskScore} out of 100, ${vault.riskLabel} risk`}
      >
        <div
          className="h-full"
          style={{ width: `${vault.riskScore}%`, backgroundColor: risk.line }}
        />
      </div>

      <h3 className="mt-8 text-2xl font-normal leading-tight sm:text-3xl">
        {vault.name}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#BBBAA6]">
        {vault.description}
      </p>

      <dl className="mt-6 grid grid-cols-2 border-y border-[#42433D] py-4 sm:grid-cols-3">
        <Metric label="TVL" value={vault.tvlFormatted} />
        <Metric label="Active policies" value={String(vault.activePolicies)} />
        <Metric label="Risk class" value={vault.riskLabel} wide />
      </dl>

      <div className="mt-6">
        <p className="text-[10px] text-[#7C7C6F]">PROTECTED AGAINST</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${vault.name} cover triggers`}>
          {vault.triggers.map((trigger) => (
            <li
              key={trigger}
              className="rounded-full border border-[#42433D] px-3 py-1.5 text-[10px] text-[#BBBAA6]"
            >
              {trigger}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={href}
        className="mt-auto flex min-h-11 items-center justify-between border-b border-[#42433D] pt-8 text-sm transition hover:border-[#ABFF84] hover:text-[#ABFF84] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00BAE2]"
      >
        View vault and cover options <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

function Metric({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`border-l border-[#42433D] px-3 first:border-l-0 first:pl-0 ${
        wide ? "col-span-2 mt-4 border-l-0 border-t pt-4 sm:col-span-1 sm:mt-0 sm:border-l sm:border-t-0 sm:pt-0" : ""
      }`}
    >
      <dt className="text-[9px] text-[#7C7C6F]">{label}</dt>
      <dd className="mt-1 text-sm text-[#FFFCE1] sm:text-base">{value}</dd>
    </div>
  );
}
