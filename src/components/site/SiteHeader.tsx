"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, ChevronDown, Layers, Menu, ShieldCheck, Truck, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSelect, Logo, cn } from "@/components/ui";
import { CtaLink } from "./kit";

const platformLinks = [
  { href: "/produit", key: "product", hint: "productHint", Icon: Layers },
  { href: "/ia", key: "ai", hint: "aiHint", Icon: Bot },
  { href: "/securite", key: "security", hint: "securityHint", Icon: ShieldCheck },
  { href: "/supply", key: "supply", hint: "supplyHint", Icon: Truck },
] as const;

const directLinks = [
  { href: "/studios", key: "studios" },
  { href: "/tarifs", key: "pricing" },
  { href: "/comparatif", key: "compare" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader() {
  const { d } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const platformRef = useRef<HTMLDivElement>(null);

  // Le hero de chaque page est un aplat bleu : l'en-tête reste transparent au sommet,
  // puis devient une carte blanche dès le premier défilement.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setPlatformOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!platformOpen) return;
    const onDown = (e: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) setPlatformOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlatformOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [platformOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const onPlatform = platformLinks.some((l) => pathname.startsWith(l.href));
  const light = !scrolled && !mobileOpen;

  const navLink = (active: boolean) =>
    cn(
      "relative rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors duration-200",
      light
        ? active
          ? "text-blue-ink"
          : "text-blue-ink/75 hover:text-blue-ink"
        : active
          ? "text-blue-deep"
          : "text-ink-soft hover:text-ink"
    );

  const underline = (active: boolean) =>
    cn(
      "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-200",
      light ? "bg-blue-ink" : "bg-blue",
      active ? "scale-x-100" : "scale-x-0"
    );

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2 focus:text-[12.5px] focus:font-semibold focus:text-ink"
      >
        {d.site.nav.skip}
      </a>

      <header
        className={cn(
          "sticky top-0 z-90 transition-all duration-300",
          scrolled ? "border-b border-line bg-card/85 backdrop-blur-md" : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center gap-3 px-5 sm:px-8">
          <Link href="/" aria-label="BuildNivo" className="shrink-0">
            <Logo dark={light} />
          </Link>

          <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label={d.site.nav.platform}>
            <div
              ref={platformRef}
              className="relative"
              onMouseEnter={() => setPlatformOpen(true)}
              onMouseLeave={() => setPlatformOpen(false)}
            >
              <button
                onClick={() => setPlatformOpen((v) => !v)}
                aria-expanded={platformOpen}
                aria-haspopup="true"
                className={cn(navLink(onPlatform), "inline-flex items-center gap-1")}
              >
                {d.site.nav.platform}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", platformOpen && "rotate-180")} />
                <span className={underline(onPlatform)} />
              </button>

              {platformOpen && (
                <div className="rise-in absolute top-full left-0 w-[340px] pt-2">
                  <div className="overflow-hidden rounded-2xl border border-line bg-card p-1.5 shadow-(--shadow-pop)">
                    {platformLinks.map(({ href, key, hint, Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-blue-soft/60"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-soft text-blue transition-colors duration-150 group-hover:bg-blue group-hover:text-blue-ink">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-bold text-ink">{d.site.nav[key]}</span>
                          <span className="block text-[11.5px] leading-snug text-ink-soft">{d.site.nav[hint]}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {directLinks.map(({ href, key }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href} className={navLink(active)}>
                  {d.site.nav[key]}
                  <span className={underline(active)} />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:block">
              <LanguageSelect />
            </span>
            <CtaLink
              href="/connexion"
              variant={light ? "onDark" : "primary"}
              className="hidden h-9.5 px-4 text-[13px] sm:inline-flex"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              <span className="hidden md:inline">{d.site.nav.demo}</span>
              <span className="md:hidden">{d.site.nav.demoShort}</span>
            </CtaLink>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? d.site.nav.close : d.site.nav.menu}
              className={cn(
                "inline-flex h-9.5 w-9.5 items-center justify-center rounded-[10px] border transition-colors duration-200 lg:hidden",
                light ? "border-blue-ink/30 text-blue-ink" : "border-line bg-card text-ink"
              )}
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Panneau mobile : les entrées entrent en cascade */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-80 overflow-y-auto border-t border-line bg-card lg:hidden">
          <nav className="flex flex-col gap-1 px-5 py-6" aria-label={d.site.nav.menu}>
            {[...platformLinks.map((l) => ({ href: l.href, label: d.site.nav[l.key], hint: d.site.nav[l.hint] })), ...directLinks.map((l) => ({ href: l.href, label: d.site.nav[l.key], hint: undefined }))].map(
              (item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={cn(
                    "pop-in flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3",
                    pathname.startsWith(item.href) ? "bg-blue-soft/60" : "bg-card"
                  )}
                >
                  <span>
                    <span className="block text-[14px] font-bold text-ink">{item.label}</span>
                    {item.hint && <span className="block text-[11.5px] text-ink-soft">{item.hint}</span>}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-blue" />
                </Link>
              )
            )}
            <div className="mt-4 flex items-center gap-3">
              <LanguageSelect />
              <CtaLink href="/connexion" className="flex-1" icon={<ArrowRight className="h-4 w-4" />}>
                {d.site.nav.demo}
              </CtaLink>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
