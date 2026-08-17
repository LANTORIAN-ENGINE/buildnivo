"use client";

/**
 * Le mur du contrôle financier : dix informations ouvertes, douze fermées.
 *
 * Une idée, une animation — les deux colonnes se remplissent en cascade depuis
 * la ligne de partage centrale, comme un mur qui se monte de part et d'autre.
 * Rien d'autre ne bouge.
 */

import { Check, X } from "lucide-react";
import { financeHidden, financeVisible } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { useInView } from "@/components/site/motion";

export function AccessWall({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={cn("grid gap-4 lg:grid-cols-2", className)}>
      {/* ------------------------------ Ouvert ------------------------------ */}
      <section className="rounded-(--radius-card) border border-ok/30 bg-ok-soft/30 p-5">
        <header className="flex items-center gap-2.5 border-b border-ok/25 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ok text-white">
            <Check className="h-4 w-4" />
          </span>
          <h3 className="text-[13.5px] font-bold text-ok-deep">{d.controle.visibility.visibleTitle}</h3>
          <span className="ml-auto font-mono text-[12px] font-bold text-ok-deep">{financeVisible.length}</span>
        </header>

        <ul className="mt-3 space-y-1.5">
          {financeVisible.map((id, i) => (
            <li
              key={id}
              style={{ transitionDelay: `${i * 45}ms` }}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border border-ok/20 bg-card px-3 py-2 transition-all duration-500 ease-out",
                inView ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
              )}
            >
              <span className="h-3.5 w-0.75 shrink-0 rounded-full bg-ok" aria-hidden="true" />
              <span className="text-[12.5px] leading-snug text-ink">{t(`controle.visibility.visible.${id}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------ Fermé ------------------------------- */}
      <section className="rounded-(--radius-card) border border-line bg-paper p-5">
        <header className="flex items-center gap-2.5 border-b border-line pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-faint text-white">
            <X className="h-4 w-4" />
          </span>
          <h3 className="text-[13.5px] font-bold text-ink">{d.controle.visibility.hiddenTitle}</h3>
          <span className="ml-auto font-mono text-[12px] font-bold text-ink-faint">{financeHidden.length}</span>
        </header>

        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {financeHidden.map((id, i) => (
            <li
              key={id}
              style={{ transitionDelay: `${i * 35}ms` }}
              className={cn(
                "figure-void flex items-center gap-2.5 rounded-lg border border-dashed border-line px-3 py-2 transition-all duration-500 ease-out",
                inView ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
              )}
            >
              <X className="h-3 w-3 shrink-0 text-ink-faint" aria-hidden="true" />
              <span className="text-[12px] leading-snug text-ink-faint line-through decoration-ink-faint/50">
                {t(`controle.visibility.hidden.${id}`)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
