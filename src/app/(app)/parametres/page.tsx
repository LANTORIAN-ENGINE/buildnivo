"use client";

import { Check, Info, Languages, Layers, Lock, RotateCcw, Sparkles, Workflow } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Badge, Button, cn, LanguageSelect, SectionCard, StatusPill } from "@/components/ui";

const integrations = ["Silae (paie)", "Sage", "Quadratus", "MS Project / Gantt", "BIM / IFC", "DocuSign"];

export default function ParametresPage() {
  const { d, t } = useI18n();
  const { discovery, setDiscovery, resetDemo, toast } = useDemo();

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.parametres.title}</h1>
        <p className="mt-0.5 text-[13px] text-ink-soft">{d.parametres.subtitle}</p>
      </div>

      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-blue" /> {d.parametres.language}
          </span>
        }
      >
        <div className="flex items-center justify-between gap-4">
          <p className="max-w-[60ch] text-[12.5px] text-ink-soft">{d.parametres.languageHint}</p>
          <LanguageSelect />
        </div>
      </SectionCard>

      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue" /> {d.parametres.discovery}
          </span>
        }
      >
        <div className="flex items-center justify-between gap-4">
          <p className="max-w-[60ch] text-[12.5px] leading-relaxed text-ink-soft">{d.parametres.discoveryHint}</p>
          <button
            role="switch"
            aria-checked={discovery}
            onClick={() => setDiscovery(!discovery)}
            className={cn(
              "relative h-6.5 w-11.5 shrink-0 rounded-full transition-colors duration-150",
              discovery ? "bg-blue" : "bg-line"
            )}
          >
            <span
              className={cn(
                "absolute top-0.75 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-150",
                discovery ? "left-6" : "left-0.75"
              )}
            />
          </button>
        </div>
      </SectionCard>

      {/* Progressivité des fonctionnalités : des paliers à débloquer selon le besoin. */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue" /> {d.parametres.formules.title}
          </span>
        }
      >
        <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-ink-soft">{d.parametres.formules.hint}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(["terrain", "pilotage", "coordination", "promoteur"] as const).map((key, i) => (
            <div
              key={key}
              className={cn(
                "rounded-(--radius-card) border p-4",
                i === 0 ? "border-blue/45 bg-blue-soft/40" : "border-line bg-card"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[13.5px] font-bold text-ink">{t(`parametres.formules.plans.${key}.name`)}</h3>
                <Badge tone={i === 0 ? "blue" : "neutral"}>{t(`parametres.formules.plans.${key}.tag`)}</Badge>
                {i === 0 && (
                  <StatusPill tone="ok" dot={false} className="ml-auto">
                    <Check className="h-3 w-3" /> {d.parametres.formules.active}
                  </StatusPill>
                )}
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">{t(`parametres.formules.plans.${key}.desc`)}</p>
              {i > 0 && (
                <button
                  onClick={() => toast(d.parametres.formules.unlock)}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold text-blue hover:text-blue-deep"
                >
                  <Lock className="h-3.5 w-3.5" /> {i === 3 ? d.parametres.formules.option : d.parametres.formules.unlock}
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-blue" /> {d.parametres.integrations}
          </span>
        }
      >
        <p className="text-[12.5px] text-ink-soft">{d.parametres.integrationsHint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {integrations.map((i) => (
            <span key={i} className="rounded-full border border-line bg-line-soft/50 px-3 py-1.5 text-[12px] font-semibold text-ink-soft">
              {i}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-blue" /> {d.parametres.resetDemo}
          </span>
        }
      >
        <div className="flex items-center justify-between gap-4">
          <p className="max-w-[60ch] text-[12.5px] text-ink-soft">{d.parametres.resetHint}</p>
          <Button
            variant="outline"
            onClick={() => {
              resetDemo();
              toast(d.parametres.resetDone);
            }}
          >
            <RotateCcw className="h-4 w-4" /> {d.parametres.resetDemo}
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue" /> {d.parametres.about}
          </span>
        }
      >
        <p className="max-w-[70ch] text-[12.5px] leading-relaxed text-ink-soft">{d.parametres.aboutText}</p>
      </SectionCard>
    </div>
  );
}
