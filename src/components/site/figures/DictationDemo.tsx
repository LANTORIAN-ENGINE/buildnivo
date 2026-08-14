"use client";

/**
 * La démonstration clé du produit : une phrase dictée sur le chantier devient une
 * anomalie, un risque planning, un avancement, une demande d'achat et trois entrées de
 * journal — proposés, jamais envoyés sans validation humaine.
 *
 * Le texte et les actions viennent du même jeu de données que l'écran Copilote de la
 * démo (`data/ai.ts`) : la vitrine et le produit racontent la même histoire.
 */

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, Check, Mic, NotebookPen, RotateCcw, ShoppingCart, TrendingUp } from "lucide-react";
import type { CopilotAction } from "@/types";
import { dictationActions, dictationText } from "@/data";
import { useI18n } from "@/lib/i18n";
import { Button, cn } from "@/components/ui";
import { useInView, useReducedMotion, useTypewriter } from "../motion";

const kindMeta: Record<CopilotAction["kind"], { Icon: React.ComponentType<{ className?: string }>; chip: string; dot: string }> = {
  anomalie: { Icon: AlertTriangle, chip: "bg-danger-soft text-danger-deep", dot: "bg-danger" },
  risque: { Icon: CalendarClock, chip: "bg-safety-soft text-safety-deep", dot: "bg-safety" },
  avancement: { Icon: TrendingUp, chip: "bg-ok-soft text-ok-deep", dot: "bg-ok" },
  achat: { Icon: ShoppingCart, chip: "bg-blue-soft text-blue-deep", dot: "bg-blue" },
  journal: { Icon: NotebookPen, chip: "bg-viz-soft text-viz", dot: "bg-viz" },
  tache: { Icon: Check, chip: "bg-blue-soft text-blue-deep", dot: "bg-blue" },
};

const BARS = 22;

export function DictationDemo({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.3 });
  const [run, setRun] = useState(0);
  const [validated, setValidated] = useState(false);

  const active = inView;
  const { typed, done, reset } = useTypewriter(dictationText, { active, speed: reduced ? 0 : 24 });
  const [revealed, setRevealed] = useState(0);

  // Les actions se déposent une à une, une fois la phrase transcrite.
  useEffect(() => {
    if (!done) {
      setRevealed(0);
      return;
    }
    if (reduced) {
      setRevealed(dictationActions.length);
      return;
    }
    const id = setInterval(() => {
      setRevealed((n) => {
        if (n >= dictationActions.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 340);
    return () => clearInterval(id);
  }, [done, reduced, run]);

  const bars = useMemo(
    () =>
      Array.from({ length: BARS }, (_, i) => ({
        dur: 0.7 + ((i * 37) % 9) / 10,
        delay: ((i * 53) % 11) / 10,
      })),
    []
  );

  const replay = () => {
    reset();
    setRevealed(0);
    setValidated(false);
    setRun((r) => r + 1);
  };

  return (
    <div ref={ref} className={cn("grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]", className)}>
      {/* Le terrain : dictée en cours */}
      <div className="card flex flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-bold text-ink">{d.site.ai.demoTitle}</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-bold text-danger-deep">
            <span className={cn("h-1.5 w-1.5 rounded-full bg-danger", !done && "presence-dot")} />
            {done ? "00:07" : d.site.ai.demoListening}
          </span>
        </div>

        {/* Onde vocale */}
        <div className="mt-5 flex h-16 items-center justify-center gap-1 rounded-xl bg-blue-soft/50 px-4">
          {bars.map((b, i) => (
            <span
              key={i}
              className={cn("w-1 rounded-full bg-blue/70", !done && !reduced && "wave-bar")}
              style={{
                height: `${18 + ((i * 29) % 30)}px`,
                ["--dur" as string]: `${b.dur}s`,
                ["--delay" as string]: `${b.delay}s`,
                transform: done ? "scaleY(0.25)" : undefined,
                transition: "transform 400ms ease-out",
              }}
            />
          ))}
        </div>

        <div className="mt-5 flex-1 rounded-xl border border-line bg-line-soft/40 p-4">
          <p className="font-mono text-[10.5px] tracking-[0.14em] text-ink-faint uppercase">
            {d.copilote.dictation}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink">
            « {typed}
            {!done && <span className="auth-caret ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-ink" />}
            {done && " »"}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-blue text-blue-ink">
            {!done && !reduced && <span className="node-ring absolute inset-0 rounded-full border-2 border-blue/50" />}
            <Mic className="h-5 w-5" />
          </span>
          <p className="text-[11.5px] leading-snug text-ink-soft">{d.site.ai.demoNote}</p>
        </div>
      </div>

      {/* La plateforme : actions structurées */}
      <div className="card flex flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-bold text-ink">
            {revealed >= dictationActions.length ? d.site.ai.demoDone : `${revealed} / ${dictationActions.length}`}
          </p>
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11.5px] font-semibold text-ink-soft transition-colors duration-150 hover:border-blue/40 hover:text-blue-deep"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {d.site.ai.demoReplay}
          </button>
        </div>

        <ul className="mt-4 flex-1 space-y-2.5">
          {dictationActions.slice(0, revealed).map((action, i) => {
            const meta = kindMeta[action.kind];
            return (
              <li
                key={`${run}-${action.label}`}
                className="pop-in flex items-start gap-3 rounded-xl border border-line bg-card p-3"
                style={{ ["--delay" as string]: `${i * 40}ms` }}
              >
                <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", meta.chip)}>
                  <meta.Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[12.5px] font-bold text-ink">{action.label}</span>
                    <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase", meta.chip)}>
                      {t(`copilote.actionKinds.${action.kind}`)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-soft">{action.detail}</span>
                </span>
                {validated && <Check className="mt-1 h-4 w-4 shrink-0 text-ok" />}
              </li>
            );
          })}
          {revealed === 0 && (
            <li className="flex h-full min-h-32 items-center justify-center rounded-xl border border-dashed border-line text-[12px] text-ink-faint">
              {d.site.ai.demoListening}
            </li>
          )}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <Button
            variant={validated ? "ok" : "primary"}
            disabled={revealed < dictationActions.length}
            onClick={() => setValidated(true)}
          >
            {validated ? <Check className="h-4 w-4" /> : null}
            {validated ? d.site.ai.demoValidated : d.site.ai.demoValidate}
          </Button>
          <p className="text-[11.5px] text-ink-faint">{d.site.ai.governance.human}</p>
        </div>
      </div>
    </div>
  );
}
