"use client";

/** Les quatre Studios métier : un empilement au-dessus de Company, pas un produit à part. */

import { Building2, Compass, DraftingCompass, HardHat } from "lucide-react";
import { studios } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { Reveal } from "../motion";

const studioIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  promoteur: Building2,
  architecte: DraftingCompass,
  moe: Compass,
  entreprise: HardHat,
};

export function StudioCards({ className }: { className?: string }) {
  const { d, t } = useI18n();

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {studios.map((studio, i) => {
        const Icon = studioIcons[studio.id];
        return (
          <Reveal key={studio.id} delay={i * 90} className="h-full">
            <article className="group card flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-viz/40 hover:shadow-(--shadow-pop)">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-viz-soft text-viz transition-colors duration-300 group-hover:bg-viz group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-ink">{t(`site.studiosSection.items.${studio.id}.name`)}</h3>
                  <p className="truncate text-[12px] text-ink-soft">{t(`site.studiosSection.items.${studio.id}.text`)}</p>
                </div>
                <span className="ml-auto shrink-0 text-right">
                  <span className="block font-mono text-[15px] font-semibold text-ink">{studio.price} €</span>
                  <span className="block text-[10px] text-ink-faint">{d.site.common.perMonth}</span>
                </span>
              </div>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {studio.features.map((f, j) => (
                  <li
                    key={f}
                    className="rounded-full border border-line bg-line-soft/50 px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft transition-colors duration-200 group-hover:border-viz/25 group-hover:bg-viz-soft/50 group-hover:text-viz"
                    style={{ transitionDelay: `${j * 25}ms` }}
                  >
                    {t(`site.studiosSection.features.${f}`)}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
