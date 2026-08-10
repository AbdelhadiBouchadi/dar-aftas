import { NAV_ITEMS, SITE } from '@/lib/content';

/**
 * Server component — no interactivity, so no client bundle cost.
 */
export function SiteFooter(): React.JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer data-ground="dark" className="grain relative bg-basalt text-sand">
      <div className="gutter py-20 sm:py-28">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          <div className="max-w-md">
            <p className="font-display text-[clamp(3rem,10vw,6rem)] leading-[0.85] tracking-[-0.04em]">
              {SITE.wordmark}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-haze-dim">
              {SITE.provenance}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3">
            <div>
              <h2 className="label-mono mb-5 text-ochre-light">The School</h2>
              <ul className="flex flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-sand/85 transition-colors duration-200 hover:text-ochre-light"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="label-mono mb-5 text-ochre-light">Find us</h2>
              <address className="flex flex-col gap-3 not-italic text-sm text-sand/85">
                <span>{SITE.location}</span>
                <span className="font-mono text-xs text-haze-dim" data-numeric>
                  {SITE.coordinates}
                </span>
              </address>
            </div>

            <div>
              <h2 className="label-mono mb-5 text-ochre-light">Reach us</h2>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-sand/85 transition-colors duration-200 hover:text-ochre-light"
                  >
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                    className="text-sand/85 transition-colors duration-200 hover:text-ochre-light"
                  >
                    {SITE.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-sand/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-haze-dim">
            © {year} {SITE.name}
          </p>
          <p className="label-mono text-haze-dim">
            {SITE.name} · {SITE.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
