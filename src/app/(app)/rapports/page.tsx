"use client";

import {
  AlertTriangle,
  Bot,
  CalendarClock,
  CheckCheck,
  Download,
  FileArchive,
  ListTodo,
  Megaphone,
  PenLine,
  Send,
  TrendingUp,
  Truck,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import type { ReminderKind } from "@/types";
import { dailyReport, inDays, projectById, weeklyReport } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Badge, Button, cn, DemoTip, SectionCard, StatusPill, Tabs, type Tone } from "@/components/ui";

const reminderTones: Record<ReminderKind, Tone> = {
  entreprise: "danger",
  document: "safety",
  fournisseur: "blue",
  livraison: "viz",
  tache: "neutral",
};

function ReportSection({ icon: Icon, title, text, tone = "blue" }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string; tone?: Tone }) {
  return (
    <section className="flex gap-3.5">
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]",
          tone === "blue" && "bg-blue-soft text-blue-deep",
          tone === "ok" && "bg-ok-soft text-ok-deep",
          tone === "safety" && "bg-safety-soft text-safety-deep",
          tone === "danger" && "bg-danger-soft text-danger",
          tone === "viz" && "bg-viz-soft text-viz"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <h3 className="text-[13px] font-bold text-ink">{title}</h3>
        <p className="mt-1 max-w-[75ch] text-[12.5px] leading-relaxed text-ink-soft">{text}</p>
      </div>
    </section>
  );
}

export default function RapportsPage() {
  const { d, t, lang } = useI18n();
  const { reminders, sendReminder, toast, activeProjectId } = useDemo();
  const [tab, setTab] = useState("daily");
  const project = projectById(activeProjectId)!;
  const pending = reminders.filter((r) => r.status === "aValider").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.rapports.title}</h1>
            <DemoTip text={d.tips.rapports.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.rapports.subtitle}</p>
        </div>
        <p className="flex items-center gap-2 rounded-xl bg-viz-soft px-3.5 py-2 text-[12px] font-semibold text-viz">
          <Bot className="h-4 w-4" /> {d.rapports.humanValidation}
        </p>
      </div>

      <Tabs
        items={[
          { id: "daily", label: d.rapports.tabs.daily },
          { id: "weekly", label: d.rapports.tabs.weekly },
          { id: "relances", label: d.rapports.tabs.relances, count: pending },
        ]}
        active={tab}
        onChange={setTab}
      />

      {(tab === "daily" || tab === "weekly") && (
        <SectionCard
          title={
            <span className="flex flex-wrap items-center gap-2.5">
              {tab === "daily" ? d.rapports.dailyTitle : d.rapports.weeklyTitle}
              <Badge tone="viz" className="inline-flex items-center gap-1">
                <Bot className="h-2.5 w-2.5" /> {d.common.aiGenerated}
              </Badge>
            </span>
          }
          actions={
            <span className="font-mono text-[12px] text-ink-soft">
              {project.name} · {fmtDate(inDays(0), lang, { weekday: "long", day: "numeric", month: "long" })}
            </span>
          }
        >
          <p className="mb-5 rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] text-ink-soft">{d.rapports.generatedFrom}</p>
          <div className="space-y-5">
            {tab === "daily" ? (
              <>
                <ReportSection icon={UsersRound} title={d.rapports.sections.effectifs} text={dailyReport.effectifs} tone="blue" />
                <ReportSection icon={TrendingUp} title={d.rapports.sections.avancement} text={dailyReport.avancement} tone="ok" />
                <ReportSection icon={AlertTriangle} title={d.rapports.sections.incidents} text={dailyReport.incidents} tone="danger" />
                <ReportSection icon={Truck} title={d.rapports.sections.livraisons} text={dailyReport.livraisons} tone="viz" />
                <ReportSection icon={ListTodo} title={d.rapports.sections.actions} text={dailyReport.actions} tone="safety" />
              </>
            ) : (
              <>
                <ReportSection icon={CalendarClock} title={d.rapports.sections.retards} text={weeklyReport.retards} tone="safety" />
                <ReportSection icon={UsersRound} title={d.rapports.sections.absences} text={weeklyReport.absences} tone="blue" />
                <ReportSection icon={FileArchive} title={d.rapports.sections.documentsManquants} text={weeklyReport.documentsManquants} tone="danger" />
                <ReportSection icon={TrendingUp} title={d.rapports.sections.avancement} text={weeklyReport.avancement} tone="ok" />
              </>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-4">
            <Button variant="outline" onClick={() => toast(d.journal.pdfDone)}>
              <Download className="h-4 w-4" /> {d.rapports.downloadPdf}
            </Button>
            <Button onClick={() => toast(d.rapports.sentTo)}>
              <Send className="h-4 w-4" /> {d.rapports.validateSend}
            </Button>
          </div>
        </SectionCard>
      )}

      {tab === "relances" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <DemoTip text={d.tips.rapports.relances} />
          </div>
          {reminders.map((r) => (
            <SectionCard key={r.id} className={cn(r.status === "envoyee" && "opacity-70")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[10px] bg-blue-soft text-blue-deep">
                    <Megaphone className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="text-[13.5px] font-bold text-ink">{r.subject}</span>
                      <StatusPill tone={reminderTones[r.kind]} dot={false}>
                        {t(`rapports.reminderKinds.${r.kind}`)}
                      </StatusPill>
                    </p>
                    <p className="mt-0.5 text-[11.5px] font-semibold text-ink-soft">→ {r.target}</p>
                    <p className="mt-2 max-w-[80ch] rounded-xl bg-line-soft/50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink-soft">{r.body}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {r.status === "envoyee" ? (
                    <StatusPill tone="ok">{d.common.sent}</StatusPill>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => toast(d.rapports.relanceEdit)}>
                        <PenLine className="h-3.5 w-3.5" /> {d.rapports.relanceEdit}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          sendReminder(r.id);
                          toast(d.rapports.relanceSent);
                        }}
                      >
                        <CheckCheck className="h-3.5 w-3.5" /> {d.rapports.relanceValidate}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
