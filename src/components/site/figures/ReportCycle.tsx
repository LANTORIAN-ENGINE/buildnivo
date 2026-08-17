"use client";

/**
 * Le cycle d'un rapport : collecte → préparation → vérification → publication
 * → archivage.
 *
 * Une seule animation, et elle dit une seule chose : le rapport n'est pas
 * publié par la machine. Le trait progresse tout seul jusqu'à l'étape de
 * vérification, puis s'arrête net — il faut cliquer pour publier, comme le
 * promoteur doit valider. Le tampon « figé » tombe à ce moment-là.
 */

import { useEffect, useState } from "react";
import { Archive, Bot, Database, Lock, Stamp, UserCheck } from "lucide-react";
import { reportCycleSteps } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { useInView, useReducedMotion } from "@/components/site/motion";

const icons = [Database, Bot, UserCheck, Stamp, Archive];
/** L'étape de vérification humaine : le trait s'y arrête. */
const HUMAN_GATE = 2;

export function ReportCycle({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [released, setReleased] = useState(false);

  /* Progression automatique jusqu'à la porte humaine, puis arrêt. */
  useEffect(() => {
    if (!inView || released) return;
    if (reduced) {
      setStep(HUMAN_GATE);
      return;
    }
    if (step >= HUMAN_GATE) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), 900);
    return () => window.clearTimeout(id);
  }, [inView, step, released, reduced]);

  const publish = () => {
    setReleased(true);
    setStep(reportCycleSteps.length - 1);
  };

  const published = step >= 3;

  return (
    <div ref={ref} className={className}>
      <ol className="grid gap-3 md:grid-cols-5">
        {reportCycleSteps.map((id, i) => {
          const Icon = icons[i];
          const reached = i <= step;
          const isGate = i === HUMAN_GATE;
          return (
            <li key={id} className="relative">
              {/* Liaison vers l'étape suivante */}
              {i < reportCycleSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-[26px] -right-3 hidden h-0.5 w-3 overflow-hidden bg-line md:block"
                >
                  <span
                    className={cn(
                      "block h-full origin-left bg-blue transition-transform duration-500 ease-out",
                      i < step ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </span>
              )}

              <button
                onClick={() => (i > HUMAN_GATE && !released ? publish() : setStep(i))}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "flex h-full w-full flex-col items-start rounded-(--radius-card) border p-4 text-left transition-all duration-300",
                  reached ? "border-blue/35 bg-card shadow-(--shadow-card)" : "border-line bg-paper",
                  i === step && "ring-2 ring-blue/25"
                )}
              >
                <span className="flex w-full items-center gap-2">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300",
                      reached ? "bg-blue text-blue-ink" : "bg-line-soft text-ink-faint"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {isGate && (
                    <span className="ml-auto rounded-full bg-safety-soft px-2 py-0.5 text-[10px] font-bold text-safety-deep uppercase">
                      {d.site.finance.humanGate}
                    </span>
                  )}
                </span>

                <span className="mt-3 block text-[13px] font-bold text-ink">{t(`site.finance.cycle.${id}.name`)}</span>
                <span className="mt-1 block text-[12px] leading-relaxed text-ink-soft">
                  {t(`site.finance.cycle.${id}.text`)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* La porte humaine : rien ne part tant que personne n'a validé. */}
      <div className="mt-5 flex flex-wrap items-center gap-4 rounded-(--radius-card) border border-blue/25 bg-blue-soft/40 px-5 py-4">
        {published ? (
          <>
            <span className="report-seal seal-press inline-flex shrink-0 flex-col items-center rounded-[6px] px-3 py-1.5 text-ok-deep">
              <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase">{d.controle.rapports.frozen}</span>
              <span className="font-mono text-[9.5px] tracking-[0.08em] opacity-80">RPT-2026-08 · v1</span>
            </span>
            <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-ink">
              <span className="font-bold text-blue-deep">{d.site.finance.frozenTitle} — </span>
              {d.site.finance.frozen}
            </p>
          </>
        ) : (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue text-blue-ink">
              <Lock className="h-4 w-4" />
            </span>
            <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-ink">
              {t("site.finance.cycle.verification.text")}
            </p>
            <button
              onClick={publish}
              className="shrink-0 rounded-[10px] bg-blue px-4 py-2 text-[12.5px] font-bold text-blue-ink transition-colors duration-150 hover:bg-blue-deep"
            >
              {d.controle.rapports.publishAction}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
