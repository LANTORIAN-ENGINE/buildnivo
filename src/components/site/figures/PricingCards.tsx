"use client";

/**
 * Grille tarifaire : Project payé par le porteur, Company par l'entreprise, Studios par
 * métier. Le prix se compose au chargement (compteur) — la donnée reste en mono, comme
 * partout ailleurs dans le produit.
 */

import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { freeTierRows, keyFigures, plans } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { CountUp, Reveal } from "../motion";

const familyLabel: Record<string, "familyProject" | "familyCompany" | "familyStudio"> = {
  project: "familyProject",
  company: "familyCompany",
  studio: "familyStudio",
};

const ctaHref: Record<string, string> = {
  project: "/connexion",
  essential: "/contact",
  business: "/contact",
  studio: "/studios",
};

export function PricingCards({ className }: { className?: string }) {
  const { d, t } = useI18n();

  return (
    <div className={cn("grid gap-4 lg:grid-cols-4", className)}>
      {plans.map((plan, i) => {
        const copy = d.site.pricing.plans[plan.id as keyof typeof d.site.pricing.plans];
        return (
          <Reveal key={plan.id} delay={i * 90} className="h-full">
            <div
              className={cn(
                "relative flex h-full flex-col rounded-(--radius-card) border p-5 transition-all duration-300",
                plan.featured
                  ? "border-blue bg-card shadow-[0_18px_44px_oklch(0.51_0.2_264/0.18)] lg:-translate-y-2"
                  : "border-line bg-card hover:-translate-y-1 hover:border-blue/40 hover:shadow-(--shadow-card)"
              )}
            >
              <p className="font-mono text-[10px] tracking-[0.16em] text-ink-faint uppercase">
                {t(`site.pricing.${familyLabel[plan.family]}`)}
              </p>
              <h3 className="mt-2 text-[17px] font-bold tracking-tight text-ink">{copy.name}</h3>
              <p className="mt-1 min-h-9 text-[12px] leading-snug text-ink-soft">{copy.tagline}</p>

              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="font-mono text-[34px] leading-none font-semibold text-ink">
                  <CountUp to={plan.price} duration={1100} />
                  <span className="ml-0.5">€</span>
                </span>
              </p>
              <p className="mt-1 text-[11.5px] text-ink-soft">
                {d.site.common.perMonth}
                {plan.featured && ` · ${d.site.common.target}`}
              </p>

              <ul className="mt-5 flex-1 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12px] leading-snug text-ink">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" />
                    {t(`site.pricing.features.${f}`)}
                  </li>
                ))}
              </ul>

              {plan.id === "project" && (
                <p className="mt-4 rounded-lg bg-blue-soft/60 p-3 text-[11px] leading-relaxed text-blue-deep">
                  <span className="font-bold">{d.site.pricing.extraTitle} · {keyFigures.extraProjectPrice} €</span>
                  <br />
                  {d.site.pricing.extraText}
                </p>
              )}

              <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">{copy.note}</p>

              <Link
                href={ctaHref[plan.id]}
                className={cn(
                  "mt-4 inline-flex h-10 items-center justify-center rounded-[10px] text-[13px] font-bold transition-colors duration-150",
                  plan.featured
                    ? "bg-blue text-blue-ink hover:bg-blue-deep"
                    : "border border-line text-ink hover:border-blue/50 hover:text-blue-deep"
                )}
              >
                {copy.cta}
              </Link>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* --------------------------- Socle gratuit permanent ----------------------- */

export function FreeTierTable({ className }: { className?: string }) {
  const { d, t } = useI18n();

  return (
    <div className={cn("overflow-x-auto rounded-(--radius-card) border border-line bg-card", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="px-4 py-3 text-[11px] font-bold tracking-[0.14em] text-ink-faint uppercase">
              {d.site.pricing.freeCols.fonction}
            </th>
            <th className="w-[120px] px-4 py-3 text-[11px] font-bold tracking-[0.14em] text-ink-faint uppercase">
              {d.site.pricing.freeCols.statut}
            </th>
            <th className="w-[260px] px-4 py-3 text-[11px] font-bold tracking-[0.14em] text-ink-faint uppercase">
              {d.site.pricing.freeCols.condition}
            </th>
          </tr>
        </thead>
        <tbody>
          {freeTierRows.map((row) => (
            <tr key={row.id} className="border-b border-line-soft transition-colors duration-150 last:border-0 hover:bg-line-soft/40">
              <td className="px-4 py-3 text-[12.5px] leading-snug text-ink">{t(`site.pricing.free.${row.id}.name`)}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap",
                    row.paid ? "bg-line-soft text-ink-soft" : "bg-ok-soft text-ok-deep"
                  )}
                >
                  {row.paid ? <Lock className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                  {row.paid ? d.site.common.paid : d.site.common.free}
                </span>
              </td>
              <td className="px-4 py-3 text-[12px] leading-snug text-ink-soft">{t(`site.pricing.free.${row.id}.condition`)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
