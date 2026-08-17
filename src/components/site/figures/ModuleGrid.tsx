"use client";

/**
 * Les modules de la plateforme, filtrables par pôle. Chaque carte ouvre l'écran
 * correspondant dans la démo : la vitrine et le produit ne sont pas deux mondes.
 */

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Boxes,
  Camera,
  ClipboardCheck,
  ClipboardList,
  FileStack,
  FolderOpen,
  History,
  Landmark,
  LifeBuoy,
  MessageSquare,
  NotebookPen,
  QrCode,
  Stamp,
  Users,
  Wallet,
  Building2,
} from "lucide-react";
import { type ModulePole, modulePoles, siteModules } from "@/data";
import { useI18n } from "@/lib/i18n";
import { Tabs, cn } from "@/components/ui";
import { Reveal } from "../motion";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  pointage: QrCode,
  taches: ClipboardList,
  journal: NotebookPen,
  photos: Camera,
  reserves: ClipboardCheck,
  chantiers: Building2,
  documents: FolderOpen,
  achats: Boxes,
  finances: Wallet,
  equipes: Users,
  visas: Stamp,
  reprise: History,
  controle: Landmark,
  rapports: FileStack,
  copilote: Bot,
  dashboard: BarChart3,
  messages: MessageSquare,
  reunions: ClipboardCheck,
  support: LifeBuoy,
};

export function ModuleGrid({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const [pole, setPole] = useState<ModulePole | "all">("all");

  const shown = siteModules.filter((m) => pole === "all" || m.pole === pole);

  return (
    <div className={className}>
      <Tabs
        active={pole}
        onChange={(id) => setPole(id as ModulePole | "all")}
        items={[
          { id: "all", label: d.common.all, count: siteModules.length },
          ...modulePoles.map((p) => ({
            id: p,
            label: t(`site.modules.poles.${p}`),
            count: siteModules.filter((m) => m.pole === p).length,
          })),
        ]}
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m, i) => {
          const Icon = icons[m.id] ?? ClipboardList;
          return (
            <Reveal key={m.id} delay={Math.min(i, 8) * 45} className="h-full">
              <Link
                href={m.href}
                className="group card flex h-full flex-col gap-2.5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue/50 hover:shadow-(--shadow-pop)"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-soft text-blue transition-colors duration-200 group-hover:bg-blue group-hover:text-blue-ink">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-[13.5px] font-bold text-ink">{t(`site.modules.items.${m.id}.name`)}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-ink-faint opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue group-hover:opacity-100" />
                </span>
                <span className="text-[12px] leading-relaxed text-ink-soft">{t(`site.modules.items.${m.id}.text`)}</span>
                <span className={cn("mt-auto font-mono text-[10px] tracking-[0.14em] text-ink-faint uppercase")}>
                  {t(`site.modules.poles.${m.pole}`)}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
