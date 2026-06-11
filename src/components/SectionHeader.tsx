interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  body?: string;
}

export function SectionHeader({ eyebrow, title, body }: SectionHeaderProps) {
  return (
    <div className="mb-14">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
        {eyebrow}
      </p>
      <h2 className="font-display max-w-3xl text-[clamp(2.4rem,5vw,4rem)] font-bold uppercase leading-none text-gold">
        {title}
      </h2>
      {body && (
        <p className="mt-5 max-w-xl leading-8 text-text-secondary">{body}</p>
      )}
    </div>
  );
}
