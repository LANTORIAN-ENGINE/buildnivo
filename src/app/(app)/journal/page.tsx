"use client";

import {
  AlertTriangle,
  Bot,
  Camera,
  CloudRain,
  CloudSun,
  FileText,
  ListChecks,
  Mic,
  PenLine,
  Sun,
  Truck,
  UsersRound,
  Wind,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { JournalItemKind } from "@/types";
import { dictationText, inDays, daysAgo, projectById } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Badge, Button, cn, DemoTip, SectionCard, type Tone } from "@/components/ui";

const kindMeta: Record<JournalItemKind, { icon: React.ComponentType<{ className?: string }>; tone: Tone }> = {
  presence: { icon: UsersRound, tone: "blue" },
  tache: { icon: ListChecks, tone: "ok" },
  livraison: { icon: Truck, tone: "viz" },
  incident: { icon: AlertTriangle, tone: "danger" },
  photo: { icon: Camera, tone: "neutral" },
  meteo: { icon: CloudSun, tone: "safety" },
  note: { icon: PenLine, tone: "neutral" },
};

const weatherIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: Sun,
  cloud: CloudSun,
  rain: CloudRain,
  wind: Wind,
};

export default function JournalPage() {
  const { d, t, lang } = useI18n();
  const { journal, addJournalEntry, toast, activeProjectId } = useDemo();
  const project = projectById(activeProjectId)!;
  const [dictating, setDictating] = useState(false);
  const [dictated, setDictated] = useState(false);

  const today = inDays(0);
  const yesterday = daysAgo(1);
  const entries = journal.filter((j) => j.projectId === activeProjectId);
  const days = [today, yesterday].filter((day) => entries.some((e) => e.date === day));
  const WIcon = weatherIcons[project.weather.key] ?? Sun;

  const dictate = () => {
    if (dictating) return;
    setDictating(true);
    window.setTimeout(() => {
      const now = new Date();
      addJournalEntry({
        id: `j-demo-${Date.now()}`,
        projectId: activeProjectId,
        date: today,
        time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        kind: "note",
        text: dictationText,
        author: "Sofia Bègue",
        viaVoice: true,
      });
      setDictating(false);
      setDictated(true);
      toast(d.journal.voiceResult);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.journal.title}</h1>
            <DemoTip text={d.tips.journal.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.journal.subtitle}</p>
        </div>
        <Button onClick={() => toast(d.journal.pdfDone)}>
          <FileText className="h-4 w-4" /> {d.journal.generatePdf}
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        {/* Timeline */}
        <div className="space-y-5">
          {days.map((day) => (
            <SectionCard
              key={day}
              title={
                <span className="flex items-center gap-2.5">
                  {day === today ? d.common.today : d.common.yesterday}
                  <span className="font-mono text-[12px] font-medium text-ink-faint">{fmtDate(day, lang, { weekday: "long", day: "numeric", month: "long" })}</span>
                </span>
              }
              actions={
                day === today ? (
                  <span className="flex items-center gap-2 text-[12px] font-semibold text-ink-soft">
                    <WIcon className="h-4 w-4 text-safety-deep" />
                    {t(`journal.weather.${project.weather.key}`)} · {project.weather.tempC} °C · {project.weather.windKmh} km/h
                  </span>
                ) : undefined
              }
            >
              <ol className="relative ml-2 space-y-4 border-l border-line pl-5">
                {entries
                  .filter((e) => e.date === day)
                  .sort((a, b) => b.time.localeCompare(a.time))
                  .map((e) => {
                    const meta = kindMeta[e.kind];
                    const Icon = meta.icon;
                    return (
                      <li key={e.id} className="relative">
                        <span
                          className={cn(
                            "absolute top-0 -left-[29px] flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-card",
                            meta.tone === "blue" && "bg-blue text-white",
                            meta.tone === "ok" && "bg-ok text-white",
                            meta.tone === "viz" && "bg-viz text-white",
                            meta.tone === "danger" && "bg-danger text-white",
                            meta.tone === "safety" && "bg-safety text-white",
                            meta.tone === "neutral" && "bg-ink-faint text-white"
                          )}
                        >
                          <Icon className="h-2.5 w-2.5" />
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[12px] font-bold text-ink">{e.time}</span>
                          <Badge tone={meta.tone}>{t(`journal.kinds.${e.kind}`)}</Badge>
                          {e.author === "Auto" ? (
                            <Badge tone="viz" className="inline-flex items-center gap-1">
                              <Bot className="h-2.5 w-2.5" /> {d.journal.auto}
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-ink-faint">
                              {d.common.by} {e.author}
                            </span>
                          )}
                          {e.viaVoice && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue">
                              <Mic className="h-3 w-3" /> {d.journal.voice}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-ink">{e.text}</p>
                      </li>
                    );
                  })}
              </ol>
            </SectionCard>
          ))}
        </div>

        {/* Dictée vocale */}
        <div className="space-y-4">
          <SectionCard
            title={
              <span className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-blue" /> {d.journal.dictate}
              </span>
            }
            tip={d.tips.journal.voice}
            className="h-fit"
          >
            <p className="text-[12.5px] leading-relaxed text-ink-soft">{d.journal.voiceHint}</p>
            <blockquote className="mt-3 rounded-xl border border-blue/25 bg-blue-soft/50 p-3.5 text-[12.5px] leading-relaxed text-blue-deep italic">
              {d.journal.voiceSample}
            </blockquote>
            <Button className="mt-4 w-full" onClick={dictate} disabled={dictating}>
              <Mic className={cn("h-4 w-4", dictating && "animate-pulse")} />
              {dictating ? d.journal.dictating : d.journal.dictate}
            </Button>
            {dictated && (
              <Link href="/copilote" className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-blue hover:text-blue-deep">
                <Bot className="h-4 w-4" /> {d.journal.seeCopilot} →
              </Link>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
