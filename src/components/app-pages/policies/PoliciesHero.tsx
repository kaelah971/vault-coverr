const lifecycle = [
  {
    label: "Activate",
    detail: "Wallet-linked cover terms",
    accent: "bg-[#ABFF84]",
  },
  {
    label: "Monitor",
    detail: "AI checks selected triggers",
    accent: "bg-[#00BAE2]",
  },
  {
    label: "Verify",
    detail: "Claim signal records evidence",
    accent: "bg-[#FFFCE1]",
  },
  {
    label: "Receipt",
    detail: "Proof trail stays inspectable",
    accent: "bg-[#7C7C6F]",
  },
];

export function PoliciesHero() {
  return (
    <header className="relative min-w-0 max-w-full overflow-hidden rounded-lg border border-[#42433D] bg-[#0E100F] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.24)] sm:p-8 lg:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,252,225,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,252,225,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom_right,black,transparent_76%)]"
      />
      <div className="relative">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-end">
          <div className="min-w-0">
            <p className="flex items-center gap-3 text-xs text-[#ABFF84]">
              <span className="h-px w-8 bg-[#ABFF84]" aria-hidden="true" />
              YOUR PROTECTION / POLICY LEDGER
            </p>
            <h1 className="mt-6 max-w-3xl break-words text-[clamp(2.25rem,6vw,5.5rem)] font-normal leading-[0.94] text-[#FFFCE1]">
              Cover is only useful when the{" "}
              <span className="text-[#ABFF84]">proof holds.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#BBBAA6] sm:text-base">
              Follow every demo policy from wallet-linked activation through
              AI monitoring, claim evidence, and its final cover receipt.
            </p>
          </div>

          <ol
            aria-label="Policy lifecycle"
            className="grid overflow-hidden rounded-lg border border-[#42433D] bg-black/15 sm:grid-cols-2"
          >
            {lifecycle.map((step, index) => (
              <li
                key={step.label}
                className="relative min-h-32 border-b border-[#42433D] p-4 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(4)]:border-b-0 sm:[&:nth-child(4)]:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#7C7C6F]">
                    0{index + 1}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${step.accent}`}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-6 text-sm text-[#FFFCE1]">{step.label}</p>
                <p className="mt-2 text-xs leading-5 text-[#7C7C6F]">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </header>
  );
}
