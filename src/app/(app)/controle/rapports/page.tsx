"use client";

/**
 * Écran 2 du module — Rapport périodique.
 *
 * L'IA compose les treize rubriques à partir des données déjà présentes dans
 * l'opération ; le promoteur vérifie et publie. Publié, le rapport est daté,
 * figé et archivé : une correction crée une version supplémentaire au lieu de
 * réécrire la précédente. Un invité ne voit jamais un brouillon.
 */

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Bot,
  CheckCheck,
  Download,
  FileClock,
  FileText,
  History,
  Lock,
  Send,
  Sparkles,
} from "lucide-react";
import type { FinanceReport } from "@/types";
import { companyById, documents, sitePhotos } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useFinance } from "@/lib/finance";
import { useDemo } from "@/lib/store";
import {
  Badge,
  Button,
  cn,
  DemoTip,
  EmptyState,
  Modal,
  PhotoScene,
  SectionCard,
  StatusPill,
  type Tone,
} from "@/components/ui";
import { ReportSeal } from "@/components/finance";

const statusTone: Record<FinanceReport["status"], Tone> = {
  brouillon: "neutral",
  aValider: "safety",
  publie: "ok",
};

export default function ControleRapportsPage() {
  const { d, t, lang } = useI18n();
  const {
    persona,
    reports,
    accesses,
    financeReminders,
    publishReport,
    correctReport,
    prepareReport,
    sendFinanceReminder,
    logAccess,
    toast,
  } = useDemo();
  const { access, financial, projectId, closed, actor } = useFinance();

  const projectReports = useMemo(
    () =>
      reports
        .filter((r) => r.projectId === projectId && (!financial || r.status === "publie"))
        .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd)),
    [reports, projectId, financial]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");
  const [justSealed, setJustSealed] = useState<string | null>(null);

  const selected = projectReports.find((r) => r.id === selectedId) ?? projectReports[0];

  /* Ouvrir un rapport laisse une trace côté promoteur comme côté invité. */
  useEffect(() => {
    if (financial && access && selected && access.status === "actif") {
      logAccess(access.id, `${persona.firstName} ${persona.lastName}`, "rapport", `${selected.id} v${selected.version}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const pendingReminders = financeReminders.filter((r) => r.projectId === projectId && r.status === "aValider");
  /* Organismes qui seront notifiés à la publication. */
  const recipients = useMemo(() => {
    if (access) return [companyById(access.orgId)?.name].filter(Boolean) as string[];
    return accesses
      .filter((a) => a.projectId === projectId && a.status === "actif" && a.notify.publication)
      .map((a) => companyById(a.orgId)?.name)
      .filter(Boolean) as string[];
  }, [access, accesses, projectId]);

  if (closed) {
    return <EmptyState icon={<Lock className="h-8 w-8" />} title={d.controle.revokedTitle} hint={d.controle.revokedHint} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.controle.rapports.title}</h1>
            <Badge tone="viz">{d.controle.brand}</Badge>
            <DemoTip text={d.tips.controle.rapports} />
          </div>
          <p className="mt-0.5 max-w-[80ch] text-[13px] text-ink-soft">{d.controle.rapports.subtitle}</p>
        </div>
        {!financial && (
          <Button
            variant="outline"
            onClick={() => {
              prepareReport(projectId);
              toast(d.controle.rapports.generated);
            }}
          >
            <Sparkles className="h-4 w-4" /> {d.controle.rapports.generate}
          </Button>
        )}
      </div>

      {/* ------------------- Rappels automatiques (promoteur) ------------------ */}
      {!financial && pendingReminders.length > 0 && (
        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-blue" />
              {d.controle.rapports.remindersTitle}
            </span>
          }
          tip={d.tips.controle.rapports}
          bodyClassName="space-y-2.5"
        >
          <p className="max-w-[95ch] rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] leading-relaxed text-ink-soft">
            {d.controle.rapports.remindersHint}
          </p>
          {pendingReminders.map((r) => (
            <div key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line bg-line-soft/30 p-3.5">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold text-ink">{r.subject}</span>
                  <StatusPill tone={r.kind === "donneesAnciennes" ? "safety" : "blue"} dot={false}>
                    {t(`controle.rapports.reminderKinds.${r.kind}`)}
                  </StatusPill>
                </p>
                <p className="mt-0.5 text-[11.5px] font-semibold text-ink-soft">→ {r.target}</p>
                <p className="mt-2 max-w-[85ch] text-[12.5px] leading-relaxed text-ink-soft">{r.body}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="font-mono text-[11px] font-semibold text-safety-deep">
                  {d.controle.rapports.dueOn} {fmtDate(r.dueAt, lang)}
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    sendFinanceReminder(r.id);
                    toast(d.controle.rapports.reminderSent);
                  }}
                >
                  <Send className="h-3.5 w-3.5" /> {d.controle.rapports.sendReminder}
                </Button>
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {projectReports.length === 0 ? (
        <EmptyState
          icon={<FileClock className="h-8 w-8" />}
          title={d.controle.justificatifs.historyEmpty}
          hint={d.controle.rapports.subtitle}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[300px_1fr] xl:items-start">
          {/* ---------------------- Pile des rapports ------------------------ */}
          <nav className="card divide-y divide-line-soft overflow-hidden" aria-label={d.controle.rapports.published}>
            {projectReports.map((r) => {
              const active = selected?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150",
                    active ? "bg-blue-soft/60" : "hover:bg-line-soft/60"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]",
                      r.status === "publie" ? "bg-ok-soft text-ok-deep" : "bg-safety-soft text-safety-deep"
                    )}
                  >
                    {r.status === "publie" ? <Lock className="h-4 w-4" /> : <FileClock className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold text-ink">{t(`controle.rapports.months.${r.periodKey}`)}</span>
                    <span className="mt-0.5 block font-mono text-[10.5px] text-ink-soft">
                      {r.id} · v{r.version}
                    </span>
                    <span className="mt-1.5 inline-flex">
                      <StatusPill tone={statusTone[r.status]} dot={false}>
                        {t(`controle.rapports.statuses.${r.status}`)}
                      </StatusPill>
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* --------------------------- Le rapport -------------------------- */}
          {selected && (
            <div className="space-y-4">
              <SectionCard
                title={
                  <span className="flex flex-wrap items-center gap-2.5">
                    {t(`controle.rapports.months.${selected.periodKey}`)}
                    <span className="font-mono text-[12px] font-semibold text-ink-soft">{selected.id}</span>
                    <Badge tone="viz" className="inline-flex items-center gap-1">
                      <Bot className="h-2.5 w-2.5" /> {d.common.aiGenerated}
                    </Badge>
                  </span>
                }
                actions={
                  selected.status === "publie" && selected.publishedAt ? (
                    <ReportSeal
                      reference={selected.id}
                      version={selected.version}
                      date={fmtDate(selected.publishedAt, lang, { day: "2-digit", month: "2-digit", year: "2-digit" })}
                      animate={justSealed === selected.id}
                    />
                  ) : (
                    <StatusPill tone="safety">{t(`controle.rapports.statuses.${selected.status}`)}</StatusPill>
                  )
                }
              >
                {/* Cartouche : les métadonnées qui rendent le rapport opposable */}
                <dl className="grid gap-x-6 gap-y-2.5 border-b border-line pb-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    [
                      [d.controle.rapports.generatedOn, fmtDate(selected.generatedAt, lang, { day: "numeric", month: "long", year: "numeric" })],
                      [
                        d.controle.rapports.publishedOn,
                        selected.publishedAt
                          ? fmtDate(selected.publishedAt, lang, { day: "numeric", month: "long", year: "numeric" })
                          : "—",
                      ],
                      [d.controle.rapports.validatedBy, selected.validatedBy ?? d.controle.rapports.humanCheck],
                      [d.controle.rapports.nextUpdate, fmtDate(selected.nextUpdate, lang, { day: "numeric", month: "long", year: "numeric" })],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">{label}</dt>
                      <dd className="mt-0.5 text-[12.5px] leading-snug font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Données incomplètes ou anciennes. Signalées au promoteur avant
                    publication, elles restent affichées après : le destinataire doit
                    savoir ce qui n'était pas à jour au moment du gel du rapport. */}
                {(selected.gaps.length > 0 || !financial) && (
                  <div className="mt-4">
                    <p className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                      {selected.status === "publie" ? d.controle.rapports.gapsPublished : d.controle.rapports.gapsTitle}
                    </p>
                    {selected.gaps.length === 0 ? (
                      <p className="mt-1.5 flex items-center gap-2 rounded-lg bg-ok-soft px-3 py-2 text-[12px] font-semibold text-ok-deep">
                        <CheckCheck className="h-4 w-4" /> {d.controle.rapports.noGaps}
                      </p>
                    ) : (
                      <ul className="mt-1.5 space-y-1.5">
                        {selected.gaps.map((g) => (
                          <li key={g} className="flex items-start gap-2 rounded-lg bg-safety-soft px-3 py-2 text-[12px] leading-relaxed text-safety-deep">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            {g}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-1.5 text-[11.5px] text-ink-faint">{d.controle.rapports.gapsHint}</p>
                  </div>
                )}

                {/* Les treize rubriques */}
                <ol className="mt-5 space-y-4">
                  {selected.sections.map((s, i) => (
                    <li key={s.key} className="flex gap-3.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-soft font-mono text-[10.5px] font-bold text-blue-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-bold text-ink">{t(`controle.rapports.sections.${s.key}`)}</h3>
                        <p className="mt-1 max-w-[85ch] text-[12.5px] leading-relaxed text-ink-soft">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Photographies sélectionnées */}
                {selected.photoIds.length > 0 && (
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                      {t("controle.rapports.sections.photos")}
                    </p>
                    <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
                      {selected.photoIds.map((id) => {
                        const photo = sitePhotos.find((p) => p.id === id);
                        if (!photo) return null;
                        return (
                          <figure key={id} className="overflow-hidden rounded-xl border border-line">
                            <div className="h-28">
                              <PhotoScene hue={photo.hue} />
                            </div>
                            <figcaption className="px-3 py-2">
                              <span className="block text-[11.5px] leading-snug font-semibold text-ink">{photo.caption}</span>
                              <span className="mt-0.5 block font-mono text-[10.5px] text-ink-faint">
                                {fmtDate(photo.date, lang)} · {photo.time}
                              </span>
                            </figcaption>
                          </figure>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pièces jointes */}
                {selected.docIds.length > 0 && (
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                      {t("controle.rapports.sections.documents")}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {selected.docIds.map((id) => {
                        const doc = documents.find((x) => x.id === id);
                        if (!doc) return null;
                        return (
                          <li key={id}>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-line-soft/50 px-3 py-1.5 text-[11.5px] font-semibold text-ink-soft">
                              <FileText className="h-3.5 w-3.5 text-blue" />
                              {doc.name}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (financial && access) logAccess(access.id, `${persona.firstName} ${persona.lastName}`, "document", selected.id);
                      toast(d.controle.rapports.downloaded);
                    }}
                  >
                    <Download className="h-4 w-4" /> {d.controle.rapports.download}
                  </Button>

                  {!financial && selected.status !== "publie" && (
                    <Button onClick={() => setConfirmPublish(true)}>
                      <CheckCheck className="h-4 w-4" /> {d.controle.rapports.publish}
                    </Button>
                  )}
                  {!financial && selected.status === "publie" && (
                    <Button variant="outline" onClick={() => setCorrecting(true)}>
                      <History className="h-4 w-4" /> {d.controle.rapports.correct}
                    </Button>
                  )}
                </div>
              </SectionCard>

              {/* ----------------------- Historique des versions ---------------- */}
              <SectionCard
                title={
                  <span className="flex items-center gap-2">
                    <History className="h-4 w-4 text-blue" />
                    {d.controle.rapports.historyTitle}
                  </span>
                }
              >
                <p className="mb-3 max-w-[90ch] rounded-xl bg-blue-soft/40 px-4 py-2.5 text-[12px] leading-relaxed text-blue-deep">
                  {d.controle.rapports.frozenHint}
                </p>
                <ol className="relative space-y-3 border-l border-line pl-5">
                  {[...selected.history].reverse().map((h) => (
                    <li key={h.version} className="relative">
                      <span className="absolute top-1.5 -left-[26px] h-2.5 w-2.5 rounded-full border-2 border-card bg-blue" aria-hidden="true" />
                      <p className="flex flex-wrap items-baseline gap-2">
                        <span className="font-mono text-[12px] font-bold text-blue-deep">
                          {d.controle.rapports.version} {h.version}
                        </span>
                        <span className="font-mono text-[11px] text-ink-faint">
                          {fmtDate(h.at, lang, { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        <span className="text-[11.5px] font-semibold text-ink-soft">{h.author}</span>
                      </p>
                      <p className="mt-0.5 max-w-[85ch] text-[12px] leading-relaxed text-ink-soft">{h.note}</p>
                    </li>
                  ))}
                </ol>
                {recipients.filter(Boolean).length > 0 && (
                  <p className="mt-4 border-t border-line pt-3 text-[11.5px] text-ink-faint">
                    {d.controle.rapports.recipients} : <span className="font-semibold text-ink-soft">{recipients.join(" · ")}</span>
                  </p>
                )}
              </SectionCard>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------- Publication ---------------------------- */}
      <Modal open={confirmPublish} onClose={() => setConfirmPublish(false)} title={d.controle.rapports.publishConfirmTitle}>
        <p className="text-[13px] leading-relaxed text-ink-soft">{d.controle.rapports.publishConfirm}</p>
        {selected && selected.gaps.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {selected.gaps.map((g) => (
              <li key={g} className="flex items-start gap-2 rounded-lg bg-safety-soft px-3 py-2 text-[12px] leading-relaxed text-safety-deep">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmPublish(false)}>
            {d.common.cancel}
          </Button>
          <Button
            onClick={() => {
              if (selected) {
                publishReport(selected.id, actor);
                setJustSealed(selected.id);
              }
              setConfirmPublish(false);
              toast(d.controle.rapports.publishedToast);
            }}
          >
            <Send className="h-4 w-4" /> {d.controle.rapports.publishAction}
          </Button>
        </div>
      </Modal>

      {/* ------------------------------ Correction ---------------------------- */}
      <Modal open={correcting} onClose={() => setCorrecting(false)} title={d.controle.rapports.correctTitle}>
        <p className="text-[13px] leading-relaxed text-ink-soft">{d.controle.rapports.correctHint}</p>
        <textarea
          value={correctionNote}
          onChange={(e) => setCorrectionNote(e.target.value)}
          rows={4}
          placeholder={d.controle.rapports.correctPlaceholder}
          className="mt-3 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink placeholder:text-ink-faint focus:border-blue focus:outline-none"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setCorrecting(false)}>
            {d.common.cancel}
          </Button>
          <Button
            disabled={correctionNote.trim().length === 0}
            onClick={() => {
              if (selected) {
                correctReport(selected.id, correctionNote.trim(), actor);
                setJustSealed(selected.id);
              }
              setCorrecting(false);
              setCorrectionNote("");
              toast(d.controle.rapports.corrected);
            }}
          >
            <History className="h-4 w-4" /> {d.controle.rapports.correctAction}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
