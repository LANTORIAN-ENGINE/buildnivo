"use client";

import { Info, Languages, RotateCcw, Sparkles, Workflow } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Button, cn, LanguageSelect, SectionCard } from "@/components/ui";

const integrations = ["Silae (paie)", "Sage", "Quadratus", "MS Project / Gantt", "BIM / IFC", "DocuSign"];

export default function ParametresPage() {
  const { d } = useI18n();
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
