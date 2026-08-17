"use client";

/**
 * Écran 3 du module — Justificatifs et historique.
 *
 * Ce que l'organisme peut réellement emporter : les pièces expressément
 * partagées, les photographies sélectionnées par le promoteur, l'historique
 * des rapports publiés — et le miroir de ses propres consultations, parce que
 * la traçabilité vaut dans les deux sens.
 */

import Link from "next/link";
import {
  Camera,
  Download,
  FileText,
  History,
  ImageOff,
  Lock,
  LogIn,
  MonitorCheck,
  FolderOpen,
  Share2,
} from "lucide-react";
import type { AccessLogAction } from "@/types";
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
  PhotoScene,
  SectionCard,
  StatusPill,
} from "@/components/ui";
import { Freshness, ReportSeal } from "@/components/finance";

const logIcons: Record<AccessLogAction, React.ComponentType<{ className?: string }>> = {
  connexion: LogIn,
  synthese: MonitorCheck,
  rapport: FileText,
  document: Download,
  export: Share2,
  revocation: Lock,
};

export default function ControleJustificatifsPage() {
  const { d, t, lang } = useI18n();
  const { persona, reports, accesses, logs, logAccess, toast } = useDemo();
  const { access, financial, projectId, share, closed } = useFinance();

  if (closed) {
    return <EmptyState icon={<Lock className="h-8 w-8" />} title={d.controle.revokedTitle} hint={d.controle.revokedHint} />;
  }

  /* Les documents partagés : ceux de l'accès pour un invité, l'union des
     partages pour le promoteur (il voit ce que chacun peut atteindre). */
  const projectAccesses = accesses.filter((a) => a.projectId === projectId);
  const sharedIds = access
    ? access.sharedDocIds
    : [...new Set(projectAccesses.flatMap((a) => a.sharedDocIds))];
  const sharedDocs = sharedIds.map((id) => documents.find((doc) => doc.id === id)).filter(Boolean);

  const published = reports
    .filter((r) => r.projectId === projectId && r.status === "publie")
    .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd));

  /* Photographies : uniquement celles qu'un rapport publié a retenues. */
  const photoIds = [...new Set(published.flatMap((r) => r.photoIds))];
  const photos = share.photos ? photoIds.map((id) => sitePhotos.find((p) => p.id === id)).filter(Boolean) : [];

  const myLogs = access
    ? logs.filter((l) => l.accessId === access.id).slice(0, 12)
    : logs.filter((l) => projectAccesses.some((a) => a.id === l.accessId)).slice(0, 12);

  const download = (target: string) => {
    if (financial && access) logAccess(access.id, `${persona.firstName} ${persona.lastName}`, "document", target);
    toast(d.controle.justificatifs.downloaded);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.controle.justificatifs.title}</h1>
          <Badge tone="viz">{d.controle.brand}</Badge>
          <DemoTip text={d.tips.controle.logs} />
        </div>
        <p className="mt-0.5 max-w-[80ch] text-[13px] text-ink-soft">{d.controle.justificatifs.subtitle}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* --------------------------- Documents --------------------------- */}
        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue" />
              {d.controle.justificatifs.docsTitle}
            </span>
          }
          actions={<StatusPill tone="blue" dot={false}>{sharedDocs.length}</StatusPill>}
        >
          <p className="mb-3 rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] leading-relaxed text-ink-soft">
            {d.controle.justificatifs.docsHint}
          </p>
          {sharedDocs.length === 0 ? (
            <EmptyState icon={<FileText className="h-7 w-7" />} title={d.controle.justificatifs.docsEmpty} />
          ) : (
            <ul className="divide-y divide-line-soft">
              {sharedDocs.map((doc) => (
                <li key={doc!.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-blue-soft text-blue-deep">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-semibold text-ink">{doc!.name}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-[10.5px] text-ink-faint">
                      <span>{doc!.version}</span>
                      <span>·</span>
                      <span>
                        {d.controle.justificatifs.updatedAt} {fmtDate(doc!.updatedAt, lang)}
                      </span>
                    </span>
                  </span>
                  <Freshness at={doc!.updatedAt} className="hidden sm:inline-flex" />
                  <Button size="sm" variant="ghost" onClick={() => download(doc!.name)}>
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{d.controle.justificatifs.download}</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* -------------------------- Photographies ------------------------- */}
        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-blue" />
              {d.controle.justificatifs.photosTitle}
            </span>
          }
          actions={<StatusPill tone="blue" dot={false}>{photos.length}</StatusPill>}
        >
          <p className="mb-3 rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] leading-relaxed text-ink-soft">
            {d.controle.justificatifs.photosHint}
          </p>
          {!share.photos ? (
            <EmptyState icon={<ImageOff className="h-7 w-7" />} title={d.controle.notShared} hint={d.controle.notSharedHint} />
          ) : photos.length === 0 ? (
            <EmptyState icon={<ImageOff className="h-7 w-7" />} title={d.controle.justificatifs.photosEmpty} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {photos.map((p) => (
                <figure key={p!.id} className="overflow-hidden rounded-xl border border-line">
                  <div className="h-32">
                    <PhotoScene hue={p!.hue} />
                  </div>
                  <figcaption className="px-3 py-2.5">
                    <span className="block text-[11.5px] leading-snug font-semibold text-ink">{p!.caption}</span>
                    <span className="mt-1 block font-mono text-[10.5px] text-ink-faint">
                      {d.controle.justificatifs.takenOn} {fmtDate(p!.date, lang)} · {p!.time}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ------------------------ Historique des rapports -------------------- */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <History className="h-4 w-4 text-blue" />
            {d.controle.justificatifs.historyTitle}
          </span>
        }
      >
        {published.length === 0 ? (
          <EmptyState icon={<History className="h-7 w-7" />} title={d.controle.justificatifs.historyEmpty} />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {published.map((r) => (
              <li key={r.id}>
                <Link
                  href="/controle/rapports"
                  className="card flex h-full flex-col items-start gap-3 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-blue/45 hover:shadow-(--shadow-pop)"
                >
                  <ReportSeal
                    reference={r.id}
                    version={r.version}
                    date={r.publishedAt ? fmtDate(r.publishedAt, lang, { day: "2-digit", month: "2-digit", year: "2-digit" }) : ""}
                  />
                  <span className="mt-1 block text-[13px] font-bold text-ink">{t(`controle.rapports.months.${r.periodKey}`)}</span>
                  <span className="block font-mono text-[10.5px] text-ink-faint">
                    {d.controle.rapports.publishedOn}{" "}
                    {r.publishedAt ? fmtDate(r.publishedAt, lang, { day: "numeric", month: "long" }) : "—"}
                  </span>
                  <span className="block text-[11.5px] leading-snug text-ink-soft">{r.validatedBy}</span>
                  {r.version > 1 && (
                    <StatusPill tone="safety" dot={false} className="mt-auto">
                      {d.controle.rapports.version} {r.version}
                    </StatusPill>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* ---------------------------- Journal miroir ------------------------- */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <MonitorCheck className="h-4 w-4 text-blue" />
            {financial ? d.controle.justificatifs.myLogTitle : d.controle.acces.logTitle}
          </span>
        }
        actions={
          !financial ? (
            <Link href="/controle/acces" className="text-[12px] font-bold text-blue hover:text-blue-deep">
              {d.common.seeAll}
            </Link>
          ) : undefined
        }
      >
        <p className="mb-3 rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] leading-relaxed text-ink-soft">
          {financial ? d.controle.justificatifs.myLogHint : d.controle.acces.logHint}
        </p>
        {myLogs.length === 0 ? (
          <p className="text-[12.5px] text-ink-faint">{d.controle.acces.logEmpty}</p>
        ) : (
          <ol className="divide-y divide-line-soft">
            {myLogs.map((l) => {
              const Icon = logIcons[l.action];
              const org = companyById(accesses.find((a) => a.id === l.accessId)?.orgId ?? "");
              return (
                <li key={l.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      l.action === "revocation" ? "bg-danger-soft text-danger" : "bg-line-soft text-ink-soft"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold text-ink">
                      {t(`controle.acces.logActions.${l.action}`)}
                      {l.target && <span className="font-normal text-ink-soft"> — {l.target}</span>}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-ink-faint">
                      {l.user}
                      {!financial && org && ` · ${org.name}`}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-ink-faint">{l.at.replace(/^\d{4}-/, "")}</span>
                </li>
              );
            })}
          </ol>
        )}
      </SectionCard>
    </div>
  );
}
