"use client";

/**
 * BuildNivo Supply : le trajet d'une fourniture, du quantitatif au dédouanement.
 * Les étapes s'allument l'une après l'autre à l'entrée dans l'écran ; les scénarios
 * comparent délai et coût (valeurs de démonstration).
 */

import { useEffect, useState } from "react";
import { Boxes, Calculator, Ship, SlidersHorizontal, Sparkles } from "lucide-react";
import { supplyScenarios, supplySteps } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { useInView, useReducedMotion } from "../motion";

const stepIcons = [Calculator, Sparkles, SlidersHorizontal, Boxes, Ship];

const scenarioTone: Record<string, string> = {
  local: "bg-blue",
  mixte: "bg-viz",
  import: "bg-ok",
};

export function SupplyFlow({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.3 });
  const [step, setStep] = useState(-1);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setStep(supplySteps.length - 1);
      return;
    }
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= supplySteps.length - 1) {
          clearInterval(id);
          return s;
        }
        return s + 1;
      });
    }, 780);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const shown = picked ?? step;

  return (
    <div ref={ref} className={cn("space-y-8", className)}>
      {/* Le trajet */}
      <ol className="grid gap-3 sm:grid-cols-5">
        {supplySteps.map((id, i) => {
          const Icon = stepIcons[i];
          const reached = i <= step;
          const isShown = i === shown;
          return (
            <li key={id} className="relative">
              {/* connecteur */}
              {i > 0 && (
                <span
                  className="absolute top-6 -left-3 hidden h-px w-3 overflow-hidden bg-line sm:block"
                  aria-hidden="true"
                >
                  <span
                    className={cn("block h-px origin-left bg-blue transition-transform duration-500", reached ? "scale-x-100" : "scale-x-0")}
                  />
                </span>
              )}
              <button
                type="button"
                onClick={() => setPicked(i)}
                aria-pressed={isShown}
                className={cn(
                  "flex h-full w-full flex-col items-start gap-2 rounded-(--radius-card) border p-3.5 text-left transition-all duration-300",
                  isShown ? "border-blue/50 bg-card shadow-(--shadow-card)" : "border-line bg-card/60",
                  reached ? "opacity-100" : "opacity-45"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300",
                    reached ? "bg-blue text-blue-ink" : "bg-line-soft text-ink-faint"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em] text-ink-faint">0{i + 1}</span>
                <span className="text-[12.5px] leading-snug font-bold text-ink">{t(`site.supply.steps.${id}.name`)}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {shown >= 0 && (
        <p key={shown} className="pop-in max-w-[70ch] text-[13.5px] leading-relaxed text-ink-soft">
          {t(`site.supply.steps.${supplySteps[shown]}.text`)}
        </p>
      )}

      {/* Scénarios comparés */}
      <div>
        <p className="text-[13px] font-bold text-ink">{d.site.supply.scenarioTitle}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {supplyScenarios.map((s, i) => (
            <div key={s.id} className="card p-4">
              <p className="text-[13px] font-bold text-ink">{t(`site.supply.scenarios.${s.id}.name`)}</p>
              <p className="mt-1 min-h-8 text-[11.5px] leading-snug text-ink-soft">{t(`site.supply.scenarios.${s.id}.text`)}</p>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-mono text-[22px] leading-none font-semibold text-ink">{s.index}</span>
                <span className="font-mono text-[13px] text-ink-soft">{s.days} j</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line-soft">
                <span
                  className={cn("block h-full origin-left rounded-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]", scenarioTone[s.id])}
                  style={{
                    width: `${s.index}%`,
                    transform: inView ? "scaleX(1)" : "scaleX(0)",
                    transitionDelay: `${i * 140}ms`,
                  }}
                />
              </div>
              <p className="mt-2 flex justify-between text-[10.5px] text-ink-faint">
                <span>{d.site.supply.indexLabel}</span>
                <span>{d.site.supply.daysLabel}</span>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] text-ink-faint">
          {d.site.supply.indexHint} · {d.site.supply.demoNote}
        </p>
      </div>
    </div>
  );
}
