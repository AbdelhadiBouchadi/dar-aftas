import { RevealText } from "@/components/animations/RevealText";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  /** Small mono eyebrow. Names the section — never decorative. */
  readonly eyebrow: string;
  readonly title: string;
  readonly as?: "h2" | "h3";
  readonly className?: string;
  /**
   * Classes for the heading element itself.
   *
   * Measure constraints belong here, not on `className`: `ch` resolves
   * against the element's own font-size, so `max-w-[20ch]` on the wrapper
   * would be measured in 16px body text and crush the display type into a
   * ~175px column (which the line mask then clips).
   */
  readonly titleClassName?: string;
  /** Place on a dark ground. */
  readonly inverse?: boolean;
}

/**
 * The site's one heading treatment: a mono eyebrow, a hairline rule, then a
 * large didone statement. Repeated exactly at every section so structure is
 * legible without decoration.
 */
export function SectionHeading({
  eyebrow,
  title,
  as = "h2",
  className,
  titleClassName,
  inverse = false,
}: SectionHeadingProps): React.JSX.Element {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Reveal className="flex items-center gap-4">
        <span
          className={cn(
            "label-mono",
            inverse ? "text-ochre-light" : "text-ochre-ink",
          )}
        >
          {eyebrow}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "h-px flex-1 max-w-32",
            inverse ? "bg-sand/25" : "bg-haze/40",
          )}
        />
      </Reveal>

      <RevealText
        as={as}
        className={cn(
          "text-balance text-[clamp(2.25rem,6vw,5.5rem)]",
          inverse ? "text-sand" : "text-basalt",
          titleClassName,
        )}
      >
        {title}
      </RevealText>
    </div>
  );
}
