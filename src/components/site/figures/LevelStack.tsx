"use client";

/**
 * L'empilement de valeur Project → Company → Studios, dessiné comme une coupe de
 * bâtiment : chaque offre est un niveau, coté à gauche comme sur un plan. La marque
 * elle-même est faite de trois barres montantes — le schéma reprend ce rythme.
 */

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { productLevels } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { Reveal } from "../motion";

const levelTone: Record<string, { bar: string; ring: string; chip: string }> = {
  project: { bar: "bg-blue", ring: "ring-blue/40", chip: "bg-blue-soft text-blue-deep" },
  company: { bar: "bg-blue-deep", ring: "ring-blue-deep/40", chip: "bg-blue-soft text-blue-deep" },
  studios: { bar: "bg-viz", ring: "ring-viz/40", chip: "bg-viz-soft text-viz" },
};

export function LevelStack({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const [active, setActive] = useState<string>("project");
  const level = productLevels.find((l) => l.id === active) ?? productLevels[0];
  const copy = d.site.stack.levels[level.id];
  const tone = levelTone[level.id];

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center", className)}>
      {/* Coupe : les trois niveaux, du socle au sommet */}
      <div className="relative">
        <div className="flex flex-col-reverse gap-2.5">
          {productLevels.map((l, i) => {
            const isActive = l.id === active;
            return (
              <Reveal key={l.id} delay={i * 120} dir="up">
                <button
                  type="button"
                  onMouseEnter={() => setActive(l.id)}
                  onFocus={() => setActive(l.id)}
                  onClick={() => setActive(l.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-(--radius-card) border px-4 py-4 text-left transition-all duration-300",
                    isActive
                      ? "border-transparent bg-card shadow-(--shadow-pop) ring-2 " + levelTone[l.id].ring
                      : "border-line bg-card/60 hover:border-blue/40 hover:bg-card",
                    isActive ? "translate-x-0" : "lg:translate-x-3"
                  )}
                >
                  <span className="w-12 shrink-0 font-mono text-[11px] tracking-[0.12em] text-ink-faint">{l.level}</span>
                  <span
                    className={cn(
                      "h-9 w-1.5 shrink-0 rounded-full transition-all duration-300",
                      levelTone[l.id].bar,
                      isActive ? "opacity-100" : "opacity-40",
                      // rythme de la marque : court / haut / moyen
                      l.id === "project" && "h-7",
                      l.id === "company" && "h-11",
                      l.id === "studios" && "h-9"
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold text-ink">{d.site.stack.levels[l.id].name}</span>
                    <span className="block truncate text-[12px] text-ink-soft">{d.site.stack.levels[l.id].tagline}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-[15px] font-semibold text-ink">{l.price} €</span>
                    <span className="block text-[10.5px] text-ink-faint">{d.site.common.perMonth}</span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-3 text-[11.5px] text-ink-faint">{d.site.stack.hint}</p>
      </div>

      {/* Détail du niveau sélectionné */}
      <div key={level.id} className="pop-in card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-md px-2 py-0.5 text-[10.5px] font-bold tracking-wide uppercase", tone.chip)}>
            {copy.badge}
          </span>
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-faint">{level.level}</span>
        </div>
        <h3 className="mt-3 text-[20px] font-bold tracking-tight text-ink">{copy.name}</h3>
        <p className="mt-1 text-[13px] font-semibold text-blue-deep">{copy.tagline}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{copy.text}</p>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-mono text-[30px] leading-none font-semibold text-ink">{level.price} €</span>
          <span className="text-[12px] text-ink-soft">
            {d.site.common.perMonth} · {copy.priceLabel}
          </span>
        </div>

        <ul className="mt-5 grid gap-x-4 gap-y-2 sm:grid-cols-2">
          {level.features.map((f, i) => (
            <li
              key={f}
              className="pop-in flex items-start gap-2 text-[12.5px] leading-snug text-ink"
              style={{ ["--delay" as string]: `${i * 35}ms` }}
            >
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" />
              {t(`site.stack.features.${f}`)}
            </li>
          ))}
        </ul>

        <Link
          href={level.id === "studios" ? "/studios" : "/produit"}
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-blue transition-colors duration-150 hover:text-blue-deep"
        >
          {d.site.common.learnMore}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
