import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
          {eyebrow}
        </p>
      )}

      <h2 className="font-display text-4xl leading-[1.1] text-[var(--color-charcoal)] md:text-5xl lg:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}