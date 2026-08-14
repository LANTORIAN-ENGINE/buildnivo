"use client";

import {
  Bot,
  CalendarClock,
  CalendarPlus,
  CheckCheck,
  Download,
  Eye,
  EyeOff,
  Gavel,
  Lock,
  Send,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { AlertSeverity, SiteMeeting } from "@/types";
import { projectById } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import {
  Avatar,
  Badge,
  Button,
  cn,
  DemoTip,
  EmptyState,
  SectionCard,
  StatusPill,
  type Tone,
} from "@/components/ui";

const severityTones: Record<AlertSeverity, Tone> = { critique: "danger", elevee: "safety", info: "neutral" };

export default function ReunionsPage() {
  const { d, t, lang } = useI18n();
  const { persona, activeProjectId, meetings, avis, toggleAvisHidden, diffuseMeeting, toast } = useDemo();
  const project = projectById(activeProjectId)!;

  const projectMeetings = useMemo(
    () =>
      meetings
        .filter((m) => m.projectId === activeProjectId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [meetings, activeProjectId]
  );

  const draft = projectMeetings.find((m) => m.status === "brouillon");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected: SiteMeeting | undefined =
    projectMeetings.find((m) => m.id === selectedId) ?? draft ?? projectMeetings[0];
  const next = projectMeetings.find((m) => m.status === "planifiee");

  /** Seul le maître d'ouvrage arbitre ce qui reste dans le CR diffusé, et jamais sur un avis réglementaire. */
  const canHide = persona.role === "moa";
  const canDiffuse = persona.role === "moex" || persona.role === "conducteur";

  const meetingAvis = selected ? avis.filter((a) => selected.avisIds.includes(a.id)) : [];

  if (projectMeetings.length === 0) {
    return <EmptyState icon={<CalendarClock className="h-8 w-8" />} title={d.reunions.empty} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.reunions.title}</h1>
            <DemoTip text={d.tips.reunions.main} />
          </div>
          <p className="mt-0.5 max-w-[90ch] text-[13px] text-ink-soft">{d.reunions.subtitle}</p>
        </div>
        <Button variant="outline" onClick={() => toast(d.reunions.convoked)}>
          <CalendarPlus className="h-4 w-4" /> {d.reunions.convoke}
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        {/* Historique des réunions + prochaine échéance */}
        <div className="space-y-4">
          {next && (
            <SectionCard title={d.reunions.nextMeeting}>
              <p className="font-mono text-[20px] font-bold text-blue-deep">{fmtDate(next.date, lang, { weekday: "long", day: "numeric", month: "long" })}</p>
              <p className="mt-1 text-[12px] text-ink-soft">
                {next.attendees.length} {d.dashboard.meeting.attendees}
              </p>
              <p className="mt-3 text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.reunions.agenda}</p>
              <ul className="mt-1.5 space-y-1">
                {(["a1", "a2", "a3", "a4"] as const).map((a) => (
                  <li key={a} className="flex gap-2 text-[12px] leading-relaxed text-ink-soft">
                    <span className="text-blue">•</span>
                    {t(`reunions.agendaItems.${a}`)}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          <SectionCard title={d.nav.reunions} bodyClassName="space-y-1.5">
            {projectMeetings.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  selected?.id === m.id ? "bg-blue-soft" : "hover:bg-line-soft/70"
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-bold text-ink">
                    {d.reunions.meetingN}
                    {m.number}
                  </span>
                  <span className="block font-mono text-[11px] text-ink-soft">{fmtDate(m.date, lang)}</span>
                </span>
                <StatusPill tone={m.status === "diffuse" ? "ok" : m.status === "brouillon" ? "safety" : "blue"} dot={false}>
                  {t(`reunions.status.${m.status}`)}
                </StatusPill>
              </button>
            ))}
          </SectionCard>
        </div>

        {/* Compte rendu */}
        {selected && (
          <div className="space-y-4">
            <SectionCard
              title={
                <span className="flex flex-wrap items-center gap-2.5">
                  {d.reunions.meetingN}
                  {selected.number} — {project.name}
                  <Badge tone="viz" className="inline-flex items-center gap-1">
                    <Bot className="h-2.5 w-2.5" /> {d.common.aiGenerated}
                  </Badge>
                </span>
              }
              actions={
                <span className="font-mono text-[12px] text-ink-soft">
                  {fmtDate(selected.date, lang, { weekday: "long", day: "numeric", month: "long" })}
                </span>
              }
            >
              <p className="mb-5 rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] text-ink-soft">{d.reunions.generated}</p>

              {/* Présences */}
              <p className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.reunions.attendees}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {selected.attendees.map((a) => (
                  <li
                    key={a.name}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-2.5 py-1",
                      a.present ? "border-ok/30 bg-ok-soft/60" : a.excused ? "border-line bg-line-soft/60" : "border-danger/30 bg-danger-soft/60"
                    )}
                  >
                    <Avatar name={a.name} size="sm" />
                    <span className="text-[11.5px]">
                      <span className="block font-semibold text-ink">{a.name}</span>
                      <span className="block text-[10.5px] text-ink-soft">
                        {t(`roles.${a.role}`)} · {a.company}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "ml-1 text-[10px] font-bold uppercase",
                        a.present ? "text-ok-deep" : a.excused ? "text-ink-soft" : "text-danger"
                      )}
                    >
                      {a.present ? d.reunions.present : a.excused ? d.reunions.excused : d.reunions.absent}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Sections rédigées */}
              <div className="mt-5 space-y-4">
                {selected.sections.map((s) => (
                  <section key={s.key}>
                    <h3 className="text-[13px] font-bold text-ink">{t(`reunions.sections.${s.key}`)}</h3>
                    <p className="mt-1 max-w-[85ch] text-[12.5px] leading-relaxed text-ink-soft">{s.text}</p>
                  </section>
                ))}
              </div>

              {/* Relevé de décisions */}
              {selected.actions.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-[13px] font-bold text-ink">{d.reunions.actions}</h3>
                  <ul className="mt-2 divide-y divide-line-soft">
                    {selected.actions.map((a) => (
                      <li key={a.label} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                        <span className="min-w-0 flex-1 text-[12.5px] text-ink">{a.label}</span>
                        <span className="text-[11.5px] font-semibold text-blue-deep">
                          {d.reunions.owner} : {a.owner}
                        </span>
                        <span className="font-mono text-[11.5px] text-ink-soft">{fmtDate(a.due, lang)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-4">
                <Button variant="outline" onClick={() => toast(d.journal.pdfDone)}>
                  <Download className="h-4 w-4" /> {d.reunions.downloadPdf}
                </Button>
                {selected.status === "diffuse" ? (
                  <StatusPill tone="ok">
                    <CheckCheck className="h-3 w-3" /> {d.reunions.alreadyDiffused}
                  </StatusPill>
                ) : (
                  canDiffuse && (
                    <Button
                      onClick={() => {
                        diffuseMeeting(selected.id);
                        toast(d.reunions.diffused);
                      }}
                    >
                      <Send className="h-4 w-4" /> {d.reunions.diffuse}
                    </Button>
                  )
                )}
              </div>
            </SectionCard>

            {/* Avis des intervenants repris dans le CR */}
            <SectionCard
              title={d.reunions.avisSection}
              tip={d.tips.reunions.avis}
              actions={<span className="text-[11.5px] text-ink-soft">{d.reunions.moaOnly}</span>}
              bodyClassName="space-y-3"
            >
              {meetingAvis.length === 0 && <p className="text-[12.5px] text-ink-soft">{d.dashboard.avis.empty}</p>}
              {meetingAvis.map((a) => (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-xl border p-3.5",
                    a.hidden ? "border-dashed border-line bg-line-soft/40 opacity-70" : "border-line bg-card"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2">
                        <Gavel className="h-3.5 w-3.5 shrink-0 text-blue" />
                        <span className="text-[13px] font-bold text-ink">{a.subject}</span>
                        <StatusPill tone={a.nature === "reglementaire" ? "danger" : "neutral"} dot={false}>
                          {a.nature === "reglementaire" ? d.reunions.regulatory : d.reunions.observation}
                        </StatusPill>
                        <StatusPill tone={severityTones[a.severity]} dot={false}>
                          {t(`common.severity.${a.severity}`)}
                        </StatusPill>
                      </p>
                      <p className="mt-0.5 text-[11.5px] font-semibold text-ink-soft">
                        {a.author} · <span className="font-mono">{fmtDate(a.date, lang)}</span>
                        {a.docRef && <> · {a.docRef}</>}
                      </p>
                      <p className="mt-2 max-w-[85ch] text-[12.5px] leading-relaxed text-ink-soft">{a.body}</p>
                      {a.hidden && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-faint">
                          <EyeOff className="h-3.5 w-3.5" /> {d.reunions.hidden}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {a.nature === "reglementaire" ? (
                        <StatusPill tone="neutral" dot={false}>
                          <Lock className="h-3 w-3" /> {d.reunions.lockedRegulatory}
                        </StatusPill>
                      ) : (
                        canHide && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              toggleAvisHidden(a.id);
                              toast(a.hidden ? d.reunions.unhideDone : d.reunions.hideDone);
                            }}
                          >
                            {a.hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            {a.hidden ? d.reunions.unhide : d.reunions.hide}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <p className="flex items-center gap-2 rounded-xl bg-viz-soft px-3.5 py-2.5 text-[11.5px] font-semibold text-viz">
                <Users className="h-4 w-4 shrink-0" /> {d.reunions.moaOnly}
              </p>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
