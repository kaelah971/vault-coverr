import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandLogo({
  className = "w-40 sm:w-48",
  priority = false,
  sizes = "(max-width: 640px) 10rem, 12rem",
}: BrandLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative block overflow-hidden ${className}`}
      style={{ aspectRatio: "2508 / 627" }}
    >
      <Image
        src="/vaultcover-logo-v2.png"
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain"
      />
    </span>
  );
}
