"use client";

import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  CircleDashed,
  FileWarning,
  Layers,
  MessageSquareWarning,
  Send,
  Stamp,
  Upload,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Discipline, PlanSubmission, VisaStatus } from "@/types";
import { companyById, inDays } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { levelFor } from "@/lib/permissions";
import { useDemo } from "@/lib/store";
import {
  Badge,
  Button,
  cn,
  DemoTip,
  EmptyState,
  Modal,
  SectionCard,
  StatusPill,
  Tabs,
  type Tone,
} from "@/components/ui";

const statusTones: Record<VisaStatus, Tone> = {
  enAttente: "safety",
  favorable: "ok",
  favorableObs: "blue",
  defavorable: "danger",
};

const statusIcons: Record<VisaStatus, React.ComponentType<{ className?: string }>> = {
  enAttente: CircleDashed,
  favorable: CheckCircle2,
  favorableObs: MessageSquareWarning,
  defavorable: XCircle,
};

const disciplines: Discipline[] = ["structure", "fluides", "electricite", "charpente", "vrd"];

export default function VisasPage() {
  const { d, t, lang } = useI18n();
  const { persona, activeProjectId, submissions, setVisa, setCtVisa, addSubmission, toast } = useDemo();
  const [tab, setTab] = useState("aViser");
  const [obsFor, setObsFor] = useState<PlanSubmission | null>(null);
  const [obsText, setObsText] = useState("");
  const [depotOpen, setDepotOpen] = useState(false);
  const [form, setForm] = useState({ name: "", discipline: "electricite" as Discipline, indice: "ind. A", calcNote: false });

  const level = levelFor(persona.role, "visas");
  const isMoex = persona.role === "moex";
  const isCt = persona.role === "controleur";
  /** Un bureau d'études ou l'architecte ne voit que ses propres dépôts. */
  const ownScope = level === "own";
  const canDeposit = ownScope || persona.role === "architecte";

  const projectSubs = useMemo(
    () =>
      submissions.filter(
        (s) => s.projectId === activeProjectId && (!ownScope || s.submittedBy === persona.companyId)
      ),
    [submissions, activeProjectId, ownScope, persona.companyId]
  );

  const pending = projectSubs.filter((s) => s.status === "enAttente");
  const ctQueue = projectSubs.filter((s) => s.status !== "enAttente" && s.status !== "defavorable");
  const shown = tab === "aViser" ? pending : tab === "controle" ? ctQueue : projectSubs;

  const overdue = pending.filter((s) => s.dueAt && s.dueAt < inDays(0));

  const submitVisa = (sub: PlanSubmission, status: VisaStatus, observations?: string[]) => {
    setVisa(sub.id, status, observations);
    toast(d.visas.visaDone);
    setObsFor(null);
    setObsText("");
  };

  const StatusPillFor = ({ status }: { status: VisaStatus }) => {
    const Icon = statusIcons[status];
    return (
      <StatusPill tone={statusTones[status]} dot={false}>
        <Icon className="h-3 w-3" /> {t(`visas.shortStatus.${status}`)}
      </StatusPill>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.visas.title}</h1>
            <DemoTip text={d.tips.visas.main} />
          </div>
          <p className="mt-0.5 max-w-[90ch] text-[13px] text-ink-soft">{d.visas.subtitle}</p>
        </div>
        {canDeposit && (
          <Button onClick={() => setDepotOpen(true)}>
            <Upload className="h-4 w-4" /> {d.visas.submit}
          </Button>
        )}
      </div>

      {/* Circuit de validation : le remplacement des échanges par mail */}
      <SectionCard title={d.visas.circuit} tip={d.tips.visas.blocking} bodyClassName="overflow-x-auto">
        <ol className="flex min-w-[620px] items-center gap-2">
          {(["depot", "moex", "ct", "diffusion"] as const).map((step, i) => (
            <li key={step} className="flex flex-1 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-soft font-mono text-[12px] font-bold text-blue-deep">
                {i + 1}
              </span>
              <span className="text-[12.5px] font-semibold text-ink">{t(`visas.circuitSteps.${step}`)}</span>
              {i < 3 && <span className="h-px flex-1 bg-line" />}
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Indicateurs du module */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { key: "pending", value: `${pending.length}`, label: d.dashboard.kpi.visasPending, tone: "safety" as Tone, icon: CircleDashed },
          { key: "overdue", value: `${overdue.length}`, label: d.visas.overdue, tone: "danger" as Tone, icon: AlertTriangle },
          { key: "delay", value: "2,4", label: d.visas.avgDelay, sub: d.dashboard.kpi.daysUnit, tone: "blue" as Tone, icon: Layers },
          {
            key: "ct",
            value: `${projectSubs.filter((s) => s.ctStatus && s.ctStatus !== "enAttente").length}`,
            label: d.visas.ctVisa,
            tone: "viz" as Tone,
            icon: Stamp,
          },
        ].map((k) => (
          <div key={k.key} className="card p-4.5">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-8.5 w-8.5 items-center justify-center rounded-[10px]",
                  k.tone === "blue" && "bg-blue-soft text-blue-deep",
                  k.tone === "safety" && "bg-safety-soft text-safety-deep",
                  k.tone === "danger" && "bg-danger-soft text-danger",
                  k.tone === "viz" && "bg-viz-soft text-viz"
                )}
              >
                <k.icon className="h-4.5 w-4.5" />
              </span>
              <p className="text-[12.5px] font-semibold text-ink-soft">{k.label}</p>
            </div>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="font-mono text-[28px] leading-none font-bold tracking-tight text-ink">{k.value}</span>
              {k.sub && <span className="text-[13px] font-semibold text-ink-soft">{k.sub}</span>}
            </p>
          </div>
        ))}
      </div>

      {ownScope && (
        <p className="flex items-center gap-2 rounded-xl bg-blue-soft/60 px-3.5 py-2.5 text-[12px] font-semibold text-blue-deep">
          <FileWarning className="h-4 w-4 shrink-0" /> {d.visas.restricted}
        </p>
      )}

      <Tabs
        items={[
          { id: "aViser", label: d.visas.tabs.aViser, count: pending.length },
          { id: "tous", label: d.visas.tabs.tous, count: projectSubs.length },
          { id: "controle", label: d.visas.tabs.controle, count: ctQueue.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {shown.length === 0 && (
        <EmptyState icon={<Stamp className="h-8 w-8" />} title={d.visas.empty} hint={ownScope ? d.visas.restricted : undefined} />
      )}

      <div className="space-y-3">
        {shown.map((s) => {
          const company = companyById(s.submittedBy);
          const late = s.status === "enAttente" && s.dueAt && s.dueAt < inDays(0);
          return (
            <SectionCard key={s.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11.5px] font-bold text-blue-deep">{s.id}</span>
                    <span className="text-[14px] font-bold text-ink">{s.name}</span>
                    <StatusPillFor status={s.status} />
                    {s.calcNote && (
                      <Badge tone="viz" className="inline-flex items-center gap-1">
                        <Calculator className="h-2.5 w-2.5" /> {d.visas.calcNote}
                      </Badge>
                    )}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-soft">
                    <span>
                      {d.visas.discipline} : <span className="font-semibold text-ink">{t(`disciplines.${s.discipline}`)}</span>
                    </span>
                    <span>
                      {d.visas.submittedBy} : <span className="font-semibold text-ink">{company?.name ?? s.submittedBy}</span>
                    </span>
                    <span>
                      {d.visas.indice} : <span className="font-mono font-semibold text-ink">{s.version}</span>
                    </span>
                    <span>
                      {d.visas.submittedAt} : <span className="font-mono">{fmtDate(s.submittedAt, lang)}</span>
                    </span>
                    {s.reviewedAt && (
                      <span>
                        {d.visas.reviewedAt} : <span className="font-mono">{fmtDate(s.reviewedAt, lang)}</span>
                      </span>
                    )}
                  </p>
                </div>
                {s.dueAt && s.status === "enAttente" && (
                  <StatusPill tone={late ? "danger" : "safety"}>
                    {late ? d.visas.overdue : `${d.visas.due} ${fmtDate(s.dueAt, lang)}`}
                  </StatusPill>
                )}
              </div>

              {s.blocksKey && (
                <p className="mt-3 flex items-center gap-2 rounded-lg bg-safety-soft px-3 py-2 text-[11.5px] font-semibold text-safety-deep">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {d.visas.blocks} : {t(`visas.blocksKeys.${s.blocksKey}`)}
                </p>
              )}

              {s.observations.length > 0 && (
                <div className="mt-3 rounded-xl bg-line-soft/50 px-3.5 py-3">
                  <p className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.visas.observations}</p>
                  <ul className="mt-1.5 space-y-1">
                    {s.observations.map((o, i) => (
                      <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-soft">
                        <span className="font-mono text-ink-faint">{i + 1}.</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {s.status !== "enAttente" && (
                <div className="mt-3 flex flex-wrap items-start gap-2.5 border-t border-line-soft pt-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                    <Stamp className="h-3.5 w-3.5" /> {d.visas.ctVisa}
                  </span>
                  {s.ctStatus && s.ctStatus !== "enAttente" ? (
                    <>
                      <StatusPillFor status={s.ctStatus} />
                      {s.ctNote && <p className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-ink-soft">{s.ctNote}</p>}
                    </>
                  ) : (
                    <StatusPill tone="neutral">{d.visas.ctPending}</StatusPill>
                  )}
                </div>
              )}

              {/* Actions selon le rôle : visa MOEX, contre-visa contrôleur, demande de pièces */}
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                {isMoex && s.status === "enAttente" && (
                  <>
                    <Button size="sm" variant="ok" onClick={() => submitVisa(s, "favorable", [])}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> {d.visas.visaFavorable}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setObsFor(s)}>
                      <MessageSquareWarning className="h-3.5 w-3.5" /> {d.visas.visaObs}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setObsFor(s)}>
                      <XCircle className="h-3.5 w-3.5" /> {d.visas.visaDefavorable}
                    </Button>
                  </>
                )}
                {isCt && s.status !== "enAttente" && (!s.ctStatus || s.ctStatus === "enAttente") && (
                  <>
                    <Button
                      size="sm"
                      variant="ok"
                      onClick={() => {
                        setCtVisa(s.id, "favorable", d.visas.ctFavorable);
                        toast(d.visas.ctDone);
                      }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> {d.visas.ctFavorable}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCtVisa(s.id, "favorableObs", d.visas.ctReserve);
                        toast(d.visas.ctDone);
                      }}
                    >
                      <MessageSquareWarning className="h-3.5 w-3.5" /> {d.visas.ctReserve}
                    </Button>
                  </>
                )}
                {(isCt || persona.role === "csps") && (
                  <Button size="sm" variant="ghost" onClick={() => toast(d.visas.askDocDone)}>
                    <Send className="h-3.5 w-3.5" /> {d.visas.askDoc}
                  </Button>
                )}
              </div>
            </SectionCard>
          );
        })}
      </div>

      {/* Avis motivé (observations ou refus) */}
      <Modal open={obsFor !== null} onClose={() => setObsFor(null)} title={d.visas.form.obsTitle}>
        <p className="text-[12.5px] font-semibold text-ink">{obsFor?.name}</p>
        <textarea
          value={obsText}
          onChange={(e) => setObsText(e.target.value)}
          rows={5}
          placeholder={d.visas.form.obsPlaceholder}
          className="mt-3 w-full rounded-xl border border-line bg-paper p-3 text-[12.5px] text-ink placeholder:text-ink-faint focus:border-blue focus:outline-none"
        />
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => setObsFor(null)}>
            {d.common.cancel}
          </Button>
          <Button
            variant="outline"
            disabled={obsText.trim() === ""}
            onClick={() => obsFor && submitVisa(obsFor, "favorableObs", [obsText.trim()])}
          >
            {d.visas.visaObs}
          </Button>
          <Button
            variant="danger"
            disabled={obsText.trim() === ""}
            onClick={() => obsFor && submitVisa(obsFor, "defavorable", [obsText.trim()])}
          >
            {d.visas.visaDefavorable}
          </Button>
        </div>
      </Modal>

      {/* Dépôt d'un plan d'exécution par un bureau d'études */}
      <Modal open={depotOpen} onClose={() => setDepotOpen(false)} title={d.visas.form.title}>
        <label className="block text-[12px] font-semibold text-ink">{d.visas.form.name}</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={d.visas.form.placeholder}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-[12.5px] text-ink placeholder:text-ink-faint focus:border-blue focus:outline-none"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[12px] font-semibold text-ink">{d.visas.form.discipline}</label>
            <select
              value={form.discipline}
              onChange={(e) => setForm({ ...form, discipline: e.target.value as Discipline })}
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-[12.5px] text-ink focus:border-blue focus:outline-none"
            >
              {disciplines.map((dd) => (
                <option key={dd} value={dd}>
                  {t(`disciplines.${dd}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-ink">{d.visas.form.indice}</label>
            <input
              value={form.indice}
              onChange={(e) => setForm({ ...form, indice: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 font-mono text-[12.5px] text-ink focus:border-blue focus:outline-none"
            />
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-[12.5px] text-ink">
          <input
            type="checkbox"
            checked={form.calcNote}
            onChange={(e) => setForm({ ...form, calcNote: e.target.checked })}
            className="h-4 w-4 rounded border-line accent-[oklch(0.51_0.2_264)]"
          />
          {d.visas.form.calcNote}
        </label>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDepotOpen(false)}>
            {d.common.cancel}
          </Button>
          <Button
            disabled={form.name.trim() === ""}
            onClick={() => {
              addSubmission({
                id: `EXE-${form.discipline.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 800)}`,
                projectId: activeProjectId,
                name: form.name.trim(),
                discipline: form.discipline,
                version: form.indice,
                submittedBy: persona.companyId ?? "c-ohm",
                submittedAt: inDays(0),
                status: "enAttente",
                observations: [],
                calcNote: form.calcNote,
                dueAt: inDays(5),
              });
              setDepotOpen(false);
              setForm({ name: "", discipline: "electricite", indice: "ind. A", calcNote: false });
              setTab("tous");
              toast(d.visas.submitted);
            }}
          >
            <Upload className="h-4 w-4" /> {d.visas.submit}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
