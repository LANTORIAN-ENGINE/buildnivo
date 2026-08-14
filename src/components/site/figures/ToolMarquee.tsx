"use client";

/** Ce que la plateforme remplace, en défilement continu. Deux rangs, sens opposés. */

import { X } from "lucide-react";
import { replacedTools } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { Marquee } from "../motion";

function ToolRow({ ids }: { ids: string[] }) {
  const { t } = useI18n();
  return (
    <>
      {ids.map((id) => (
        <span
          key={id}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-[12.5px] font-semibold whitespace-nowrap text-ink-soft"
        >
          <X className="h-3.5 w-3.5 shrink-0 text-danger/70" />
          {t(`site.tools.${id}`)}
        </span>
      ))}
    </>
  );
}

export function ToolMarquee({ className }: { className?: string }) {
  const half = Math.ceil(replacedTools.length / 2);
  return (
    <div className={cn("space-y-3", className)}>
      <Marquee duration={52}>
        <ToolRow ids={replacedTools.slice(0, half)} />
      </Marquee>
      <Marquee duration={62} reverse>
        <ToolRow ids={replacedTools.slice(half)} />
      </Marquee>
    </div>
  );
}
