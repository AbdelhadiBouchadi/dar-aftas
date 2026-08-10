"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Magnetic } from "@/components/animations/Magnetic";
import { useSmoothScroll } from "@/components/animations/SmoothScroll";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { NAV_ITEMS, SITE } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Fixed header that recedes on scroll-down and returns on scroll-up.
 *
 * Client component because it owns Lenis-driven anchor scrolling, a
 * ScrollTrigger, and the mobile menu's open state. It is deliberately the
 * only client boundary in the page chrome.
 */
export function SiteHeader(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  /**
   * True once the header has left the hero. Drives an opaque backdrop.
   *
   * The header used to rely on `mix-blend-difference` to stay legible over
   * anything. That works over very dark or very light grounds and fails
   * exactly in the middle — real photography put a pale grey sky behind the
   * nav and it became grey-on-grey. Two explicit states are predictable:
   * a gradient scrim over the hero, an opaque bar everywhere else.
   */
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { scrollTo } = useSmoothScroll();
  const router = useRouter();

  useGSAP(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const show = gsap.to(header, {
        yPercent: 0,
        duration: 0.45,
        ease: "power3.out",
        paused: true,
      });

      const trigger = ScrollTrigger.create({
        start: "top -120",
        end: "max",
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 200) {
            gsap.to(header, { yPercent: -100, duration: 0.4, ease: "power3.in" });
          } else {
            show.restart();
          }
          // Only re-render on an actual state change, not every frame.
          setIsScrolled((prev) => {
            const next = self.scroll() > window.innerHeight * 0.85;
            return prev === next ? prev : next;
          });
        },
      });

      return () => {
        trigger.kill();
        show.kill();
        gsap.set(header, { yPercent: 0 });
      };
    });

    return () => mm.revert();
  });

  // Lock the page while the mobile menu is open, and restore on close.
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleNavigate = (href: string): void => {
    setIsOpen(false);

    // The header also renders on routes that have no sections — /404, for
    // one. Scrolling to a selector that isn't in the document would silently
    // do nothing, so fall back to a real navigation home with the hash.
    if (href.startsWith("#") && !document.querySelector(href)) {
      router.push(`/${href}`);
      return;
    }

    scrollTo(href, -80);
  };

  return (
    <>
      <header
        data-site-header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          isScrolled && "border-b border-sand/10 bg-basalt/90 backdrop-blur-md",
        )}
      >
        {/* Scrim over the hero only. Guarantees the nav reads against any
            photograph without darkening the bar once it goes opaque. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-b from-basalt/80 via-basalt/40 to-transparent transition-opacity duration-300",
            isScrolled && "opacity-0",
          )}
        />

        <div className="gutter relative flex h-20 items-center justify-between sm:h-24">
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              handleNavigate("body");
            }}
            className="font-display text-lg tracking-[0.28em] text-sand"
            aria-label={`${SITE.name} — back to top`}
          >
            {SITE.wordmark}
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(item.href);
                    }}
                    className="label-mono text-sand/80 transition-colors duration-200 hover:text-ochre-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Magnetic className="hidden lg:inline-block" strength={10}>
            <a
              href="#enquire"
              onClick={(event) => {
                event.preventDefault();
                handleNavigate("#enquire");
              }}
              className="label-mono inline-block border border-sand/45 px-5 py-3 text-sand transition-colors duration-200 hover:border-sand hover:bg-sand hover:text-basalt"
            >
              Enquire
            </a>
          </Magnetic>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="-mr-2 flex size-11 items-center justify-center text-sand lg:hidden"
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile menu. Full-bleed basalt so contrast is unambiguous. */}
      <div
        id="mobile-menu"
        hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-[60] bg-basalt lg:hidden",
          isOpen && "animate-in fade-in duration-300",
        )}
      >
        <div className="gutter flex h-20 items-center justify-between sm:h-24">
          <span className="font-display text-lg tracking-[0.28em] text-sand">
            {SITE.wordmark}
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="-mr-2 flex size-11 items-center justify-center text-sand"
            aria-label="Close menu"
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="gutter mt-10">
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavigate(item.href);
                  }}
                  className="block py-3 font-display text-[clamp(2rem,9vw,3.25rem)] leading-none text-sand"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#enquire"
            onClick={(event) => {
              event.preventDefault();
              handleNavigate("#enquire");
            }}
            className="label-mono mt-12 inline-block border border-sand/40 px-7 py-4 text-sand"
          >
            Enquire
          </a>
        </nav>
      </div>
    </>
  );
}
