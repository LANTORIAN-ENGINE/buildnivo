"use client";

/**
 * Signature de la page d'accueil : les outils dispersés d'une opération (WhatsApp,
 * tableurs, PDF, pointeuse, classeurs…) flottent, puis se rassemblent dans une seule
 * plateforme. C'est la tagline mise en mouvement — « Le BTP a des millions d'outils.
 * Il ne vous en faut qu'un. »
 */

import { useEffect, useState } from "react";
import {
  Calculator,
  CalendarRange,
  Camera,
  Clock,
  FileSignature,
  FileText,
  Folder,
  HardDrive,
  Mail,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  Receipt,
  Table2,
} from "lucide-react";
import { scatterTools } from "@/data";
import { useI18n } from "@/lib/i18n";
import { LogoMark, cn } from "@/components/ui";
import { useReducedMotion } from "../motion";

const toolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  whatsapp: MessageCircle,
  excel: Table2,
  mails: Mail,
  pdf: FileText,
  calls: PhoneCall,
  photos: Camera,
  paper: Folder,
  payroll: Receipt,
  planning: CalendarRange,
  accounting: Calculator,
  drive: HardDrive,
  minutes: FileSignature,
  clock: Clock,
  delivery: PackageCheck,
};

export function ToolConvergence({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const reduced = useReducedMotion();
  const [gathered, setGathered] = useState(false);

  // Séquence d'ouverture : les outils flottent quelques secondes, puis convergent.
  useEffect(() => {
    if (reduced) {
      setGathered(true);
      return;
    }
    const id = setTimeout(() => setGathered(true), 2800);
    return () => clearTimeout(id);
  }, [reduced]);

  return (
    <figure className={cn("relative", className)}>
      <div className="relative aspect-[4/3.4] w-full sm:aspect-[4/3]">
        {/* Liaisons tracées au moment du rassemblement */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-700",
            gathered ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        >
          {scatterTools.map((tool, i) => (
            <line
              key={tool.id}
              x1={tool.x}
              y1={tool.y}
              x2="50"
              y2="50"
              stroke="oklch(1 0 0 / 0.28)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className={gathered ? "draw-stroke" : undefined}
              style={{ ["--len" as string]: "120", ["--delay" as string]: `${i * 45}ms` }}
            />
          ))}
        </svg>

        {/* Les outils */}
        {scatterTools.map((tool, i) => {
          const Icon = toolIcons[tool.id] ?? FileText;
          return (
            <span
              key={tool.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-[left,top,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.6,0,0.2,1)]"
              style={{
                left: gathered ? "50%" : `${tool.x}%`,
                top: gathered ? "50%" : `${tool.y}%`,
                opacity: gathered ? 0 : 1,
                filter: gathered ? "blur(3px)" : "none",
                transitionDelay: `${i * 45}ms`,
              }}
            >
              <span
                className="tool-drift flex items-center gap-1.5 rounded-full border border-blue-ink/20 bg-blue-ink/10 px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-blue-ink/90 backdrop-blur-sm"
                style={{
                  ["--tilt" as string]: `${tool.tilt}deg`,
                  ["--dur" as string]: `${tool.dur}s`,
                  ["--delay" as string]: `${tool.delay}s`,
                }}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                {t(`site.tools.${tool.id}`)}
              </span>
            </span>
          );
        })}

        {/* La plateforme unique */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 z-20 w-[248px] max-w-[80%] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[280px]",
            gathered ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-0 blur-[2px]"
          )}
          style={{ transitionDelay: gathered ? "620ms" : "0ms" }}
        >
          <div className="rounded-2xl border border-blue-ink/25 bg-card p-4 shadow-[0_30px_70px_oklch(0.18_0.09_264/0.5)]">
            <div className="flex items-center gap-2">
              <LogoMark className="h-6 w-6 text-blue" />
              <span className="text-[15px] font-bold tracking-tight text-ink">BuildNivo</span>
              <span className="ml-auto rounded-md bg-ok-soft px-1.5 py-0.5 font-mono text-[10px] font-bold text-ok-deep">
                1
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
              {["pointage", "journal", "documents", "rapports"].map((id, i) => (
                <div
                  key={id}
                  className={cn("flex items-center gap-2 rounded-lg bg-line-soft/70 px-2.5 py-1.5", gathered && "pop-in")}
                  style={{ ["--delay" as string]: `${700 + i * 90}ms` }}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                  <span className="truncate text-[11.5px] font-semibold text-ink">
                    {t(`site.modules.items.${id}.name`)}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-ink-faint">OK</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-line pt-2.5 text-[11px] leading-snug text-ink-soft">
              {d.site.hero.figureLabel}
            </p>
          </div>
        </div>

        {/* Halo derrière la plateforme */}
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-ink/20 blur-3xl transition-opacity duration-1000",
            gathered ? "soft-glow opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[12px] tracking-[0.14em] text-blue-ink/60 uppercase">
          {scatterTools.length} <span className="mx-1">→</span> 1
        </span>
        <button
          type="button"
          onClick={() => setGathered((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-ink/25 px-3 py-1.5 text-[12px] font-semibold text-blue-ink/85 transition-colors duration-150 hover:border-blue-ink/60 hover:bg-blue-ink/10 hover:text-blue-ink"
        >
          {gathered ? d.site.hero.scatter : d.site.hero.converge}
        </button>
      </figcaption>
    </figure>
  );
}
