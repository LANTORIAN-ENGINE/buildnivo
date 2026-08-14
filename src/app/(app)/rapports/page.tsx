"use client";

import {
  AlertTriangle,
  Bot,
  Calculator,
  CalendarClock,
  CheckCheck,
  Download,
  FileArchive,
  FileSignature,
  FileText,
  Gavel,
  ListTodo,
  Megaphone,
  PenLine,
  Send,
  Sparkles,
  Stamp,
  TrendingUp,
  Truck,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import type { DraftKind, ReminderKind } from "@/types";
import { dailyReport, documents, inDays, projectById, weeklyReport } from "@/data";
import { fmtDate, fmtEuro, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Badge, Button, cn, DemoTip, SectionCard, StatusPill, Tabs, type Tone } from "@/components/ui";

const reminderTones: Record<ReminderKind, Tone> = {
  entreprise: "danger",
  document: "safety",
  fournisseur: "blue",
  livraison: "viz",
  tache: "neutral",
  visa: "blue",
};

const draftIcons: Record<DraftKind, React.ComponentType<{ className?: string }>> = {
  cctp: FileText,
  estimatif: Calculator,
  contrat: FileSignature,
  ordreService: Gavel,
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
  const { reminders, sendReminder, toast, activeProjectId, drafts, validateDraft, submissions, avis } = useDemo();
  const [tab, setTab] = useState("daily");
  const project = projectById(activeProjectId)!;
  const pending = reminders.filter((r) => r.status === "aValider").length;

  const projectDrafts = drafts.filter((dr) => dr.projectId === activeProjectId);
  const savedHours = projectDrafts.reduce((s, dr) => s + dr.savedHours, 0);

  /* Le rapport hebdo reprend désormais l'état des visas et les avis des intervenants. */
  const projectSubs = submissions.filter((s) => s.projectId === activeProjectId);
  const visaSummary = `${projectSubs.filter((s) => s.status === "enAttente").length} ${d.visas.pending}, ${projectSubs.filter((s) => s.status === "defavorable").length} ${d.visas.shortStatus.defavorable.toLowerCase()}, ${projectSubs.filter((s) => s.status === "favorableObs").length} ${d.visas.shortStatus.favorableObs.toLowerCase()}.`;
  const visibleAvis = avis.filter((a) => a.projectId === activeProjectId && !a.hidden);
  const avisSummary = visibleAvis
    .slice(0, 3)
    .map((a) => `${a.author} : ${a.subject}`)
    .join(" · ");

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
          { id: "docsIA", label: d.rapports.tabs.docsIA, count: projectDrafts.length },
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
                <ReportSection icon={Stamp} title={d.rapports.sections.visas} text={visaSummary} tone="blue" />
                <ReportSection icon={Gavel} title={d.rapports.sections.avis} text={avisSummary} tone="viz" />
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

      {tab === "docsIA" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[15px] font-bold text-ink">{d.rapports.docsIA.title}</h2>
              <DemoTip text={d.tips.docsIA.main} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="viz" dot={false}>
                {d.rapports.docsIA.totalSaved} : <span className="font-mono font-bold">{savedHours} {d.rapports.docsIA.hours}</span>
              </StatusPill>
              <Button variant="outline" onClick={() => toast(d.rapports.docsIA.generated)}>
                <Sparkles className="h-4 w-4" /> {d.rapports.docsIA.generate}
              </Button>
            </div>
          </div>
          <p className="max-w-[95ch] rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] leading-relaxed text-ink-soft">
            {d.rapports.docsIA.disclaimer}
          </p>

          {projectDrafts.map((dr) => {
            const Icon = draftIcons[dr.kind];
            const total = dr.lines.reduce((s, l) => s + (l.amount ?? 0), 0);
            return (
              <SectionCard key={dr.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[10px] bg-viz-soft text-viz">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="text-[13.5px] font-bold text-ink">{dr.title}</span>
                        <StatusPill tone="blue" dot={false}>
                          {t(`rapports.docsIA.kinds.${dr.kind}`)}
                        </StatusPill>
                        <StatusPill tone={dr.status === "valide" ? "ok" : "safety"} dot={false}>
                          {t(`rapports.docsIA.status.${dr.status}`)}
                        </StatusPill>
                      </p>
                      <p className="mt-1 text-[11.5px] text-ink-soft">
                        {d.rapports.docsIA.sources} :{" "}
                        <span className="font-semibold text-ink-soft">
                          {dr.sourceDocIds
                            .map((id) => documents.find((doc) => doc.id === id)?.name ?? id)
                            .join(" · ")}
                        </span>
                      </p>
                    </div>
                  </div>
                  <StatusPill tone="viz" dot={false}>
                    {d.rapports.docsIA.savedTime} : <span className="font-mono font-bold">{dr.savedHours} {d.rapports.docsIA.hours}</span>
                  </StatusPill>
                </div>

                <ul className="mt-3 divide-y divide-line-soft rounded-xl bg-line-soft/40 px-3.5">
                  {dr.lines.map((l) => (
                    <li key={l.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5">
                      <span className="text-[12.5px] font-bold text-ink">{l.label}</span>
                      <span className="min-w-0 flex-1 text-[12px] leading-relaxed text-ink-soft">{l.detail}</span>
                      {l.qty && <span className="font-mono text-[11.5px] font-semibold text-ink-soft">{l.qty}</span>}
                      {typeof l.amount === "number" && (
                        <span className="font-mono text-[12px] font-bold text-blue-deep">{fmtEuro(l.amount, lang)}</span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                  {total > 0 && (
                    <span className="text-[12.5px] font-semibold text-ink">
                      {d.rapports.docsIA.total} :{" "}
                      <span className="font-mono text-[14px] font-bold text-blue-deep">{fmtEuro(total, lang)}</span>
                    </span>
                  )}
                  <Button variant="outline" onClick={() => toast(d.journal.pdfDone)}>
                    <Download className="h-4 w-4" /> {d.rapports.downloadPdf}
                  </Button>
                  {dr.status === "valide" ? (
                    <StatusPill tone="ok">
                      <CheckCheck className="h-3 w-3" /> {d.rapports.docsIA.status.valide}
                    </StatusPill>
                  ) : (
                    <Button
                      onClick={() => {
                        validateDraft(dr.id);
                        toast(d.rapports.docsIA.validated);
                      }}
                    >
                      <CheckCheck className="h-4 w-4" /> {d.rapports.docsIA.validate}
                    </Button>
                  )}
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
