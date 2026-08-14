"use client";

/**
 * L'essai Company de 30 jours, manipulable : on déplace le curseur dans le temps et
 * l'on voit ce qui reste ouvert (le chantier) et ce qui se verrouille (la gestion de
 * l'entreprise). C'est la mécanique commerciale du produit, rendue tangible.
 */

import { useEffect, useState } from "react";
import { Check, Lock, Unlock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { keyFigures } from "@/data";
import { cn } from "@/components/ui";
import { useInView, useReducedMotion } from "../motion";

const MAX_DAY = 45;
const PROJECT_FEATURES = ["pointage", "taches", "photos", "reserves", "documents", "journal"];
const COMPANY_FEATURES = ["crm", "rh", "multiChantier", "paie", "achats", "stocks"];

export function TrialTimeline({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.4 });
  const [day, setDay] = useState(0);
  const [touched, setTouched] = useState(false);

  // Lecture automatique à l'entrée : J0 → J38, puis la main passe à l'utilisateur.
  useEffect(() => {
    if (!inView || touched) return;
    if (reduced) {
      setDay(38);
      return;
    }
    let frame = 0;
    const started = performance.now();
    const run = (now: number) => {
      const t2 = Math.min(1, (now - started) / 4200);
      setDay(Math.round(t2 * 38));
      if (t2 < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, touched]);

  const trialOver = day > keyFigures.trialDays;
  const pct = (day / MAX_DAY) * 100;
  const trialPct = (keyFigures.trialDays / MAX_DAY) * 100;

  return (
    <div ref={ref} className={cn("card p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-bold text-ink">{d.site.growth.trialTitle}</p>
          <p className="mt-1 text-[12px] text-ink-soft">{d.site.growth.trialOnce}</p>
        </div>
        <p className="font-mono text-[26px] leading-none font-semibold text-blue-deep">
          J+{day}
        </p>
      </div>

      {/* Rail temporel */}
      <div className="relative mt-6 pt-6">
        {/* Le curseur natif est transparent et posé au-dessus du rail : il porte le
            clavier et le glissement, le rail dessiné en dessous porte le style. */}
        <input
          type="range"
          min={0}
          max={MAX_DAY}
          value={day}
          onChange={(e) => {
            setTouched(true);
            setDay(Number(e.target.value));
          }}
          aria-label={d.site.growth.trialDaysLabel}
          className="peer absolute inset-x-0 top-6 z-10 h-2.5 w-full cursor-ew-resize opacity-0"
        />

        <div className="relative h-2.5 rounded-full bg-line-soft">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-blue transition-[width] duration-200"
            style={{ width: `${Math.min(pct, trialPct)}%` }}
          />
          {trialOver && (
            <div
              className="absolute inset-y-0 rounded-full bg-ink-faint/40 transition-[width] duration-200"
              style={{ left: `${trialPct}%`, width: `${pct - trialPct}%` }}
            />
          )}
          {/* borne des 30 jours */}
          <span className="absolute -top-6 -translate-x-1/2 font-mono text-[10.5px] font-bold text-ink" style={{ left: `${trialPct}%` }}>
            J+{keyFigures.trialDays}
          </span>
          <span className="absolute -top-1.5 h-5.5 w-px bg-ink" style={{ left: `${trialPct}%` }} />
          {/* curseur */}
          <span
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue bg-card shadow-(--shadow-card) transition-[left] duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-blue peer-focus-visible:ring-offset-2"
            style={{ left: `${pct}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="mt-2 flex justify-between font-mono text-[10.5px] text-ink-faint">
          <span>J0</span>
          <span>J+{MAX_DAY}</span>
        </div>
      </div>

      {/* Ce qui reste ouvert / ce qui se ferme */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ok/30 bg-ok-soft/50 p-4">
          <p className="flex items-center gap-2 text-[12.5px] font-bold text-ok-deep">
            <Unlock className="h-4 w-4" />
            {d.site.stack.levels.project.name}
          </p>
          <ul className="mt-3 space-y-1.5">
            {PROJECT_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[12px] leading-snug text-ink">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" />
                {t(`site.stack.features.${f}`)}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11.5px] font-semibold text-ok-deep">{d.site.common.free}</p>
        </div>

        <div
          className={cn(
            "rounded-xl border p-4 transition-colors duration-500",
            trialOver ? "border-line bg-line-soft/60" : "border-blue/30 bg-blue-soft/50"
          )}
        >
          <p className={cn("flex items-center gap-2 text-[12.5px] font-bold transition-colors duration-500", trialOver ? "text-ink-soft" : "text-blue-deep")}>
            {trialOver ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            {d.site.stack.levels.company.name}
          </p>
          <ul className="mt-3 space-y-1.5">
            {COMPANY_FEATURES.map((f) => (
              <li
                key={f}
                className={cn(
                  "flex items-start gap-2 text-[12px] leading-snug transition-all duration-500",
                  trialOver ? "text-ink-faint line-through" : "text-ink"
                )}
              >
                {trialOver ? (
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" />
                ) : (
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue" />
                )}
                {t(`site.stack.features.${f}`)}
              </li>
            ))}
          </ul>
          <p className={cn("mt-3 text-[11.5px] font-semibold", trialOver ? "text-ink-soft" : "text-blue-deep")}>
            {trialOver ? d.site.growth.states.subscriber.name : d.site.growth.states.trial.name}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-ink-faint">{d.site.growth.trialKeep}</p>
    </div>
  );
}

/* ------------------------ Continuité de service (impayé) ------------------- */

export function GraceTimeline({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.4 });

  const steps = [
    { id: "j0", tone: "safety" as const },
    { id: "j15", tone: "safety" as const },
    { id: "lock", tone: "danger" as const },
  ];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="absolute top-4 left-4 hidden h-[calc(100%-2rem)] w-px bg-line sm:block" aria-hidden="true">
        <span
          className={cn("block w-px origin-top bg-safety transition-transform duration-[1800ms] ease-out", inView ? "scale-y-100" : "scale-y-0")}
          style={{ height: "100%" }}
        />
      </div>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li
            key={step.id}
            className={cn(
              "reveal relative flex gap-4 transition-all sm:pl-0",
              inView && "is-in"
            )}
            style={{ transitionDelay: `${i * 220}ms` }}
          >
            <span
              className={cn(
                "z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-card font-mono text-[10.5px] font-bold",
                step.tone === "safety" ? "border-safety text-safety-deep" : "border-danger text-danger-deep"
              )}
            >
              {step.id === "lock" ? "15" : step.id === "j15" ? "→" : "0"}
            </span>
            <div className="min-w-0 pb-1">
              <p className="text-[13.5px] font-bold text-ink">{t(`site.growth.grace.${step.id}.title`)}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{t(`site.growth.grace.${step.id}.text`)}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-xl border border-line bg-line-soft/50 p-3.5 text-[11.5px] leading-relaxed text-ink-soft">
        {d.site.growth.graceNote}
      </p>
    </div>
  );
}
