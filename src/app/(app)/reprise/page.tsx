"use client";

import {
  Bot,
  CheckCircle2,
  CircleDashed,
  FileStack,
  Loader2,
  PlayCircle,
  Rocket,
  Search,
  TriangleAlert,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import { repriseFiles, repriseResult, repriseSteps } from "@/data";
import { fmtEuro, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Badge, Button, cn, DemoTip, ProgressBar, SectionCard, StatusPill } from "@/components/ui";

type Phase = "idle" | "running" | "done";

export default function ReprisePage() {
  const { d, t, lang } = useI18n();
  const { toast } = useDemo();
  const [phase, setPhase] = useState<Phase>("idle");

  const totalPages = repriseFiles.reduce((s, f) => s + f.pages, 0);
  const marketTotal = repriseResult.lots.reduce((s, l) => s + l.marketAmount, 0);

  const runAnalysis = () => {
    setPhase("running");
    window.setTimeout(() => {
      setPhase("done");
      toast(d.reprise.done);
    }, 2200);
  };

  /** L'étape « avancement » se termine une fois l'analyse simulée jouée. */
  const stepStatus = (key: string, seed: string) =>
    phase === "done" ? (key === "controle" ? "enCours" : "fait") : seed;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.reprise.title}</h1>
            <DemoTip text={d.tips.reprise.main} />
          </div>
          <p className="mt-0.5 max-w-[90ch] text-[13px] text-ink-soft">{d.reprise.subtitle}</p>
        </div>
        <Badge tone="viz" className="inline-flex items-center gap-1">
          <Bot className="h-2.5 w-2.5" /> {d.common.aiGenerated}
        </Badge>
      </div>

      <p className="max-w-[95ch] rounded-xl bg-blue-soft/50 px-4 py-3 text-[12.5px] leading-relaxed text-blue-deep">{d.reprise.intro}</p>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Dépôt et lecture des pièces existantes */}
        <SectionCard title={d.reprise.files} actions={<span className="font-mono text-[12px] text-ink-soft">{totalPages} {d.reprise.pages}</span>}>
          <div className="blueprint-grid flex flex-col items-center gap-2 rounded-xl border border-dashed border-blue/40 px-6 py-7 text-center">
            <UploadCloud className="h-8 w-8 text-blue" />
            <p className="text-[14px] font-semibold text-ink">{d.reprise.drop}</p>
            <p className="max-w-md text-[12px] leading-relaxed text-ink-soft">{d.reprise.dropHint}</p>
          </div>

          <ul className="mt-4 divide-y divide-line-soft">
            {repriseFiles.map((f) => (
              <li key={f.name} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
                <FileStack className="h-4 w-4 shrink-0 text-blue" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold text-ink">{f.name}</span>
                  <span className="block text-[11px] text-ink-soft">
                    {t(`documents.categories.${f.categoryKey}`)} · <span className="font-mono">{f.pages}</span> {d.reprise.pages}
                  </span>
                </span>
                {phase === "done" ? (
                  <StatusPill tone="ok" dot={false}>
                    <CheckCircle2 className="h-3 w-3" /> {t(`reprise.extracted.${f.extractedKey}`)}
                  </StatusPill>
                ) : (
                  <StatusPill tone="neutral" dot={false}>
                    {t(`reprise.extracted.${f.extractedKey}`)}
                  </StatusPill>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-end">
            {phase === "idle" && (
              <Button onClick={runAnalysis}>
                <PlayCircle className="h-4 w-4" /> {d.reprise.analyze}
              </Button>
            )}
            {phase === "running" && (
              <Button disabled>
                <Loader2 className="h-4 w-4 animate-spin" /> {d.reprise.analyzing}
              </Button>
            )}
            {phase === "done" && (
              <StatusPill tone="ok">
                <CheckCircle2 className="h-3 w-3" /> {d.reprise.done}
              </StatusPill>
            )}
          </div>
        </SectionCard>

        {/* Étapes de la reprise */}
        <SectionCard title={d.reprise.result} bodyClassName="space-y-3">
          <ol className="space-y-2.5">
            {repriseSteps.map((s) => {
              const status = stepStatus(s.key, s.status);
              return (
                <li key={s.key} className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      status === "fait" && "bg-ok-soft text-ok-deep",
                      status === "enCours" && "bg-safety-soft text-safety-deep",
                      status === "attente" && "bg-line-soft text-ink-faint"
                    )}
                  >
                    {status === "fait" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-semibold text-ink">{t(`reprise.steps.${s.key}`)}</span>
                    <span className="block text-[11px] text-ink-soft">{t(`reprise.stepStatus.${status}`)}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="flex items-start gap-2 rounded-xl bg-viz-soft px-3.5 py-2.5 text-[11.5px] leading-relaxed font-semibold text-viz">
            <Search className="mt-0.5 h-4 w-4 shrink-0" /> {d.reprise.prospectHint}
          </p>
        </SectionCard>
      </div>

      {phase === "done" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: d.reprise.progressLabel, value: `${repriseResult.progress}`, sub: "%", bar: repriseResult.progress, tone: "ok" as const },
              { label: d.reprise.invoicedLabel, value: `${repriseResult.invoicedPct}`, sub: "%", bar: repriseResult.invoicedPct, tone: "blue" as const },
              { label: d.reprise.monthsLeft, value: `${repriseResult.monthsLeft}`, sub: d.reprise.months, tone: "safety" as const },
            ].map((k) => (
              <div key={k.label} className="card p-4.5">
                <p className="text-[12.5px] font-semibold text-ink-soft">{k.label}</p>
                <p className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-[28px] leading-none font-bold tracking-tight text-ink">{k.value}</span>
                  <span className="text-[13px] font-semibold text-ink-soft">{k.sub}</span>
                </p>
                {typeof k.bar === "number" && <ProgressBar value={k.bar} tone={k.tone} className="mt-3.5" />}
              </div>
            ))}
          </div>

          <SectionCard title={d.reprise.result} bodyClassName="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                  <th className="py-2.5 pr-3">{d.reprise.lot}</th>
                  <th className="px-3 py-2.5">{d.reprise.market}</th>
                  <th className="px-3 py-2.5">{d.dashboard.kpi.progress}</th>
                  <th className="py-2.5 pl-3">{d.reprise.invoicedPct}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {repriseResult.lots.map((l) => (
                  <tr key={l.lotKey} className="text-[12.5px]">
                    <td className="py-2.5 pr-3 font-semibold text-ink">{t(`finances.lots.${l.lotKey}`)}</td>
                    <td className="px-3 py-2.5 font-mono text-ink-soft">{fmtEuro(l.marketAmount, lang, true)}</td>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-2.5">
                        <ProgressBar value={l.progress} tone="ok" className="w-28" />
                        <span className="font-mono text-[11.5px] font-bold text-ink">{l.progress}%</span>
                      </span>
                    </td>
                    <td className="py-2.5 pl-3 font-mono font-bold text-blue-deep">{l.invoiced}%</td>
                  </tr>
                ))}
                <tr className="text-[12.5px] font-bold">
                  <td className="py-2.5 pr-3 text-ink">{d.finances.budget}</td>
                  <td className="px-3 py-2.5 font-mono text-ink">{fmtEuro(marketTotal, lang, true)}</td>
                  <td className="px-3 py-2.5 font-mono text-ink">{repriseResult.progress}%</td>
                  <td className="py-2.5 pl-3 font-mono text-blue-deep">{repriseResult.invoicedPct}%</td>
                </tr>
              </tbody>
            </table>
          </SectionCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title={d.reprise.remaining} bodyClassName="space-y-2">
              {repriseResult.remaining.map((r) => (
                <p key={r} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink-soft">
                  <span className="text-blue">•</span>
                  {r}
                </p>
              ))}
            </SectionCard>

            <SectionCard title={d.reprise.gaps} bodyClassName="space-y-2">
              <p className="rounded-xl bg-safety-soft px-3.5 py-2.5 text-[11.5px] leading-relaxed font-semibold text-safety-deep">
                {d.reprise.gapsHint}
              </p>
              {repriseResult.gaps.map((g) => (
                <p key={g} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink-soft">
                  <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safety-deep" />
                  {g}
                </p>
              ))}
            </SectionCard>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => toast(d.reprise.activated)}>
              <Rocket className="h-4 w-4" /> {d.reprise.activate}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
