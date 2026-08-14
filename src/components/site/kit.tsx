"use client";

/**
 * Vocabulaire visuel de la vitrine.
 *
 * Le repère de section reprend le marqueur de niveau des plans d'architecte (un filet,
 * un triangle, une cote) — cohérent avec le nom du produit et avec la marque, qui est
 * elle-même faite de trois barres montantes.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";

/* ------------------------------ Repère de niveau --------------------------- */

export function LevelMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" className={className} aria-hidden="true" fill="none">
      <path d="M0 2.5H20" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 3.5h10l-5 7.5z" fill="currentColor" />
    </svg>
  );
}

export function Eyebrow({
  children,
  level,
  className,
  onDark = false,
}: {
  children: React.ReactNode;
  /** cote de niveau affichée à gauche du libellé (N+00, N+01…) */
  level?: string;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase",
        onDark ? "text-blue-ink/70" : "text-blue",
        className
      )}
    >
      <LevelMark className="h-3 w-5 shrink-0" />
      {level && <span className={onDark ? "text-blue-ink/50" : "text-ink-faint"}>{level}</span>}
      <span>{children}</span>
    </p>
  );
}

/* -------------------------------- Sections --------------------------------- */

export function SiteSection({
  id,
  children,
  className,
  tone = "paper",
  size = "md",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "card" | "dark";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-5 sm:px-8",
        size === "sm" && "py-14 sm:py-16",
        size === "md" && "py-18 sm:py-24",
        size === "lg" && "py-24 sm:py-32",
        tone === "card" && "border-y border-line bg-card",
        tone === "dark" && "site-drench text-blue-ink",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  level,
  title,
  lead,
  onDark = false,
  align = "left",
  className,
}: {
  eyebrow?: string;
  level?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  onDark?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <Eyebrow level={level} onDark={onDark} className={align === "center" ? "justify-center" : undefined}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "mt-4 text-[26px] leading-[1.12] font-bold tracking-[-0.02em] text-balance sm:text-[34px] lg:text-[40px]",
          onDark ? "text-blue-ink" : "text-ink"
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-4 max-w-[68ch] text-[15px] leading-relaxed",
            align === "center" && "mx-auto",
            onDark ? "text-blue-ink/75" : "text-ink-soft"
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ------------------------------ Appels à l'action -------------------------- */

type CtaVariant = "primary" | "onDark" | "ghostDark" | "outline";

export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "sheen-host group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-[11px] px-5 text-[13.5px] font-bold transition-all duration-200",
        variant === "primary" && "bg-blue text-blue-ink shadow-[0_10px_24px_oklch(0.51_0.2_264/0.25)] hover:bg-blue-deep hover:shadow-[0_14px_30px_oklch(0.51_0.2_264/0.32)]",
        variant === "onDark" && "bg-blue-ink text-blue-deep shadow-[0_10px_30px_oklch(0.2_0.1_264/0.45)] hover:bg-white",
        variant === "ghostDark" && "border border-blue-ink/30 text-blue-ink hover:border-blue-ink/60 hover:bg-blue-ink/10",
        variant === "outline" && "border border-line bg-card text-ink hover:border-blue/50 hover:text-blue-deep",
        className
      )}
    >
      {(variant === "primary" || variant === "onDark") && (
        <span className="sheen pointer-events-none absolute inset-y-0 -left-8 w-10 bg-white/25" aria-hidden="true" />
      )}
      <span className="relative">{children}</span>
      {icon && <span className="relative transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
    </Link>
  );
}

/* --------------------------------- Détails --------------------------------- */

export function Chip({
  children,
  tone = "line",
  className,
}: {
  children: React.ReactNode;
  tone?: "line" | "blue" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold whitespace-nowrap",
        tone === "line" && "border border-line bg-card text-ink-soft",
        tone === "blue" && "bg-blue-soft text-blue-deep",
        tone === "dark" && "border border-blue-ink/25 bg-blue-ink/10 text-blue-ink/85",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Grand chiffre de démonstration : mono, comme toute donnée terrain de l'app. */
export function StatBlock({
  value,
  label,
  hint,
  onDark = false,
  className,
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={cn("font-mono text-[30px] leading-none font-semibold tracking-tight sm:text-[34px]", onDark ? "text-blue-ink" : "text-blue-deep")}>
        {value}
      </p>
      <p className={cn("mt-2 text-[13px] font-semibold", onDark ? "text-blue-ink/85" : "text-ink")}>{label}</p>
      {hint && <p className={cn("mt-1 text-[12px] leading-relaxed", onDark ? "text-blue-ink/55" : "text-ink-faint")}>{hint}</p>}
    </div>
  );
}

/* ---------------------------- Bandeau final commun ------------------------- */

/** Même sortie sur toutes les pages : voir la démo, ou parler à quelqu'un. */
export function FinalCta() {
  const { d } = useI18n();
  return (
    <SiteSection tone="dark" size="sm">
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading onDark title={d.site.cta.title} lead={d.site.cta.lead} />
        <div className="flex shrink-0 flex-wrap gap-3">
          <CtaLink href="/connexion" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
            {d.site.cta.primary}
          </CtaLink>
          <CtaLink href="/contact" variant="ghostDark">
            {d.site.cta.secondary}
          </CtaLink>
        </div>
      </div>
      <p className="mt-8 font-mono text-[10.5px] tracking-[0.14em] text-blue-ink/45 uppercase">{d.site.cta.note}</p>
    </SiteSection>
  );
}

/* -------------------------- En-tête de page rubrique ----------------------- */

export function PageHero({
  eyebrow,
  title,
  lead,
  aside,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** contenu à droite sur grand écran (figure, chiffres) */
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="site-drench relative overflow-hidden px-5 pt-28 pb-16 text-blue-ink sm:px-8 sm:pt-32 sm:pb-20">
      <div className={cn("mx-auto grid w-full max-w-[1120px] gap-10", aside && "lg:grid-cols-[1.15fr_1fr] lg:items-center")}>
        <div>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h1 className="mt-4 max-w-[20ch] text-[32px] leading-[1.08] font-bold tracking-[-0.025em] text-balance sm:text-[44px] lg:text-[52px]">
            {title}
          </h1>
          {lead && <p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-blue-ink/75">{lead}</p>}
          {children && <div className="mt-7">{children}</div>}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}

/** Filet de cote : sépare deux sections comme une ligne de cotation de plan. */
export function DimensionRule({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn("mx-auto flex w-full max-w-[1120px] items-center gap-3 px-5 sm:px-8", className)} aria-hidden="true">
      <span className="h-2.5 w-px bg-line" />
      <span className="h-px flex-1 bg-line" />
      {label && <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint uppercase">{label}</span>}
      <span className="h-px flex-1 bg-line" />
      <span className="h-2.5 w-px bg-line" />
    </div>
  );
}
