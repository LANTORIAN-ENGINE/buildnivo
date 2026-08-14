"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Logo } from "@/components/ui";
import { Eyebrow } from "./kit";

const columns = [
  {
    titleKey: "product",
    links: [
      { href: "/produit", key: "product" },
      { href: "/studios", key: "studios" },
      { href: "/tarifs", key: "pricing" },
      { href: "/ia", key: "ai" },
    ],
  },
  {
    titleKey: "resources",
    links: [
      { href: "/securite", key: "security" },
      { href: "/supply", key: "supply" },
      { href: "/comparatif", key: "compare" },
      { href: "/contact", key: "contact" },
    ],
  },
] as const;

export function SiteFooter() {
  const { d } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-drench text-blue-ink">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed font-semibold text-blue-ink/85 text-balance">
              {d.site.footer.tagline}
            </p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.16em] text-blue-ink/50 uppercase">
              {d.site.footer.company}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.titleKey}>
              <Eyebrow onDark>{d.site.footer[col.titleKey]}</Eyebrow>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1 text-[13px] text-blue-ink/75 transition-colors duration-150 hover:text-blue-ink"
                    >
                      {d.site.nav[l.key]}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:text-right">
            <Eyebrow onDark className="md:justify-end">
              {d.site.footer.demoLink}
            </Eyebrow>
            <Link
              href="/connexion"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-[10px] bg-blue-ink px-4 text-[13px] font-bold text-blue-deep transition-colors duration-150 hover:bg-white"
            >
              {d.site.nav.demo}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-blue-ink/15 pt-6 text-[11.5px] text-blue-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {d.site.footer.company} — {d.site.footer.rights}
          </p>
          <p className="font-mono tracking-[0.14em] uppercase">{d.site.footer.confidential}</p>
        </div>
      </div>
    </footer>
  );
}
