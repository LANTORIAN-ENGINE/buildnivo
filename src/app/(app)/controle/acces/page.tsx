"use client";

/**
 * Écran du promoteur — paramétrage des accès de contrôle financier.
 *
 * L'accès est standardisé pour l'invité : avancement, budget, délai et risque
 * gardent toujours la même présentation. Ce que le promoteur règle ici, c'est
 * le périmètre optionnel (commercialisation, trésorerie, séquestre, photos),
 * les documents partagés, la durée, le rythme et les notifications — plus la
 * révocation, immédiate, et le journal des accès.
 */

import { useMemo, useState } from "react";
import {
  Ban,
  Building2,
  CalendarRange,
  Download,
  FileText,
  Landmark,
  LogIn,
  Lock,
  Mail,
  MonitorCheck,
  Play,
  Plus,
  Share2,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import type { AccessLogAction, FinancialAccess, FinancialOrgKind } from "@/types";
import { companyById, documents, inDays, projectById } from "@/data";
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
  SectionCard,
  StatusPill,
  Switch,
  type Tone,
} from "@/components/ui";

const statusTone: Record<FinancialAccess["status"], Tone> = {
  invite: "blue",
  actif: "ok",
  suspendu: "safety",
  revoque: "danger",
};

const logIcons: Record<AccessLogAction, React.ComponentType<{ className?: string }>> = {
  connexion: LogIn,
  synthese: MonitorCheck,
  rapport: FileText,
  document: Download,
  export: Share2,
  revocation: Lock,
};

const orgKinds: FinancialOrgKind[] = [
  "garant",
  "banque",
  "assureur",
  "courtier",
  "investisseur",
  "escrow",
  "sequestre",
  "institutionnel",
];

export default function ControleAccesPage() {
  const { d, t, lang } = useI18n();
  const { accesses, logs, inviteAccess, updateAccess, setAccessStatus, toast } = useDemo();
  const { projectId, actor } = useFinance();
  const project = projectById(projectId);

  const projectAccesses = accesses.filter((a) => a.projectId === projectId);
  const projectDocs = documents.filter((doc) => doc.projectId === projectId);
  const projectLogs = useMemo(
    () => logs.filter((l) => projectAccesses.some((a) => a.id === l.accessId)),
    [logs, projectAccesses]
  );

  /* ------------------------------ Invitation ----------------------------- */
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    kind: "garant" as FinancialOrgKind,
    reference: "",
    user: "",
    email: "",
    endDate: inDays(365),
    frequency: "mensuelle" as FinancialAccess["frequency"],
    commercialisation: true,
    tresorerie: false,
    sequestre: false,
    photos: true,
    docIds: [] as string[],
  });

  const resetForm = () =>
    setForm({
      name: "",
      kind: "garant",
      reference: "",
      user: "",
      email: "",
      endDate: inDays(365),
      frequency: "mensuelle",
      commercialisation: true,
      tresorerie: false,
      sequestre: false,
      photos: true,
      docIds: [],
    });

  const submitInvite = () => {
    const id = `fa-${Date.now()}`;
    inviteAccess({
      id,
      projectId,
      /* Organisme saisi à la volée : absent du référentiel des sociétés. */
      orgId: id,
      orgName: form.name.trim() || t(`controle.acces.orgKinds.${form.kind}`),
      kind: form.kind,
      reference: form.reference || t(`controle.acces.orgKinds.${form.kind}`),
      users: [{ name: form.user, jobKey: "directriceEngagements", email: form.email }],
      startDate: inDays(0),
      endDate: form.endDate,
      status: "invite",
      invitedAt: inDays(0),
      sharedDocIds: form.docIds,
      share: {
        commercialisation: form.commercialisation,
        tresorerie: form.tresorerie,
        sequestre: form.sequestre,
        photos: form.photos,
      },
      frequency: form.frequency,
      notify: { publication: true, rappel: true, risque: true },
    });
    setInviting(false);
    resetForm();
    toast(d.controle.acces.invited);
  };

  const orgName = (a: FinancialAccess) => companyById(a.orgId)?.name ?? a.orgName ?? a.reference;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.controle.acces.title}</h1>
            <Badge tone="viz">{d.controle.brand}</Badge>
            <DemoTip text={d.tips.controle.acces} />
          </div>
          <p className="mt-0.5 max-w-[80ch] text-[13px] text-ink-soft">{d.controle.acces.subtitle}</p>
        </div>
        <Button onClick={() => setInviting(true)}>
          <UserPlus className="h-4 w-4" /> {d.controle.acces.invite}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-(--radius-card) border border-line bg-card px-4 py-3">
        <span className="flex items-center gap-2 text-[12.5px] font-bold text-ink">
          <Building2 className="h-4 w-4 text-blue" />
          {project?.name}
        </span>
        <span className="h-4 w-px bg-line" />
        <span className="max-w-[70ch] text-[11.5px] leading-relaxed text-ink-soft">{d.controle.acces.shareHint}</span>
      </div>

      {/* ------------------------------ Les accès ----------------------------- */}
      {projectAccesses.length === 0 ? (
        <EmptyState
          icon={<Landmark className="h-8 w-8" />}
          title={d.controle.acces.empty}
          hint={d.controle.acces.emptyHint}
          action={
            <Button className="mt-2" onClick={() => setInviting(true)}>
              <Plus className="h-4 w-4" /> {d.controle.acces.invite}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {projectAccesses.map((a) => {
            const closed = a.status === "revoque";
            return (
              <SectionCard
                key={a.id}
                className={cn(closed && "opacity-70")}
                title={
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-bold text-ink">{orgName(a)}</span>
                    <Badge tone="blue">{t(`controle.acces.orgKinds.${a.kind}`)}</Badge>
                  </span>
                }
                actions={<StatusPill tone={statusTone[a.status]}>{t(`controle.acces.statuses.${a.status}`)}</StatusPill>}
              >
                <p className="font-mono text-[11.5px] text-ink-soft">{a.reference}</p>

                <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-soft">
                  <CalendarRange className="h-3.5 w-3.5 shrink-0 text-blue" />
                  <span className="font-mono">
                    {d.controle.acces.from} {fmtDate(a.startDate, lang, { day: "numeric", month: "short", year: "numeric" })}{" "}
                    {d.controle.acces.to} {fmtDate(a.endDate, lang, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {a.revokedAt && (
                    <span className="font-mono font-bold text-danger">
                      · {d.controle.acces.revokedOn} {fmtDate(a.revokedAt, lang)}
                    </span>
                  )}
                </p>

                {/* Utilisateurs autorisés */}
                <p className="mt-4 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                  <Users className="mr-1 inline h-3 w-3" />
                  {d.controle.acces.users}
                </p>
                <ul className="mt-1.5 divide-y divide-line-soft">
                  {a.users.map((u) => (
                    <li key={u.email} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 py-1.5">
                      <span className="text-[12.5px] font-semibold text-ink">{u.name}</span>
                      <span className="text-[11.5px] text-ink-soft">{t(`jobs.${u.jobKey}`)}</span>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-faint">
                        <Mail className="h-3 w-3" />
                        {u.email}
                      </span>
                      <span className="ml-auto font-mono text-[10.5px] text-ink-faint">
                        {u.lastSeen
                          ? `${d.controle.acces.lastSeen} ${fmtDate(u.lastSeen, lang)}`
                          : d.controle.acces.neverSeen}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Blocs optionnels */}
                <p className="mt-4 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                  {d.controle.acces.shareTitle}
                </p>
                <div className="mt-2 space-y-2.5 rounded-xl border border-line bg-line-soft/30 p-3.5">
                  {(["commercialisation", "tresorerie", "sequestre", "photos"] as const).map((k) => (
                    <Switch
                      key={k}
                      checked={a.share[k]}
                      disabled={closed}
                      label={t(`controle.acces.share.${k}`)}
                      onChange={(v) => {
                        updateAccess(a.id, { share: { ...a.share, [k]: v } });
                        toast(d.controle.acces.updated);
                      }}
                    />
                  ))}
                </div>

                {/* Documents partagés */}
                <p className="mt-4 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                  {d.controle.acces.sharedDocs}
                </p>
                <p className="mt-0.5 text-[11.5px] text-ink-soft">{d.controle.acces.sharedDocsHint}</p>
                <ul className="mt-2 max-h-44 space-y-1 overflow-y-auto pr-1">
                  {projectDocs.map((doc) => {
                    const on = a.sharedDocIds.includes(doc.id);
                    return (
                      <li key={doc.id}>
                        <label
                          className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors duration-150",
                            on ? "bg-blue-soft/60 text-ink" : "text-ink-soft hover:bg-line-soft/60"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={on}
                            disabled={closed}
                            onChange={() => {
                              updateAccess(a.id, {
                                sharedDocIds: on
                                  ? a.sharedDocIds.filter((x) => x !== doc.id)
                                  : [...a.sharedDocIds, doc.id],
                              });
                              toast(d.controle.acces.updated);
                            }}
                            className="h-3.5 w-3.5 shrink-0 accent-[oklch(0.51_0.2_264)]"
                          />
                          <span className="truncate">{doc.name}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>

                {/* Rythme et notifications */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                      {d.controle.acces.frequency}
                    </p>
                    <div className="mt-1.5 flex gap-1 rounded-[10px] border border-line bg-line-soft/50 p-1">
                      {(["mensuelle", "trimestrielle"] as const).map((f) => (
                        <button
                          key={f}
                          disabled={closed}
                          onClick={() => {
                            updateAccess(a.id, { frequency: f });
                            toast(d.controle.acces.updated);
                          }}
                          className={cn(
                            "flex-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors duration-150",
                            a.frequency === f ? "bg-card text-blue-deep shadow-[0_1px_2px_oklch(0_0_0/0.07)]" : "text-ink-soft hover:text-ink"
                          )}
                        >
                          {t(`controle.acces.frequencies.${f}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                      {d.controle.acces.notifyTitle}
                    </p>
                    <div className="mt-1.5 space-y-2">
                      {(["publication", "rappel", "risque"] as const).map((k) => (
                        <Switch
                          key={k}
                          checked={a.notify[k]}
                          disabled={closed}
                          label={t(`controle.acces.notify.${k}`)}
                          onChange={(v) => {
                            updateAccess(a.id, { notify: { ...a.notify, [k]: v } });
                            toast(d.controle.acces.updated);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-line pt-3.5">
                  {a.status === "revoque" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAccessStatus(a.id, "actif", actor);
                        toast(d.controle.acces.reactivated);
                      }}
                    >
                      <Play className="h-3.5 w-3.5" /> {d.controle.acces.reactivate}
                    </Button>
                  ) : (
                    <>
                      {a.status === "suspendu" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAccessStatus(a.id, "actif", actor);
                            toast(d.controle.acces.reactivated);
                          }}
                        >
                          <Play className="h-3.5 w-3.5" /> {d.controle.acces.reactivate}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setAccessStatus(a.id, "suspendu", actor);
                            toast(d.controle.acces.suspended);
                          }}
                        >
                          {d.controle.acces.suspend}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setAccessStatus(a.id, "revoque", actor);
                          toast(d.controle.acces.revoked);
                        }}
                      >
                        <Ban className="h-3.5 w-3.5" /> {d.controle.acces.revoke}
                      </Button>
                    </>
                  )}
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}

      {/* --------------------------- Journal des accès ------------------------ */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue" />
            {d.controle.acces.logTitle}
          </span>
        }
        tip={d.tips.controle.logs}
        actions={
          <Button size="sm" variant="outline" onClick={() => toast(d.controle.acces.exported)}>
            <Download className="h-3.5 w-3.5" /> {d.controle.acces.exportLog}
          </Button>
        }
        bodyClassName="overflow-x-auto"
      >
        <p className="mb-3 max-w-[95ch] rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] leading-relaxed text-ink-soft">
          {d.controle.acces.logHint}
        </p>
        {projectLogs.length === 0 ? (
          <p className="text-[12.5px] text-ink-faint">{d.controle.acces.logEmpty}</p>
        ) : (
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-line text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                <th className="py-2 pr-3">{d.common.date}</th>
                <th className="px-3 py-2">{d.controle.acces.logUser}</th>
                <th className="px-3 py-2">{d.controle.acces.logAction}</th>
                <th className="px-3 py-2">{d.controle.acces.logTarget}</th>
                <th className="py-2 pl-3 text-right">{d.controle.acces.logIp}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {projectLogs.map((l) => {
                const Icon = logIcons[l.action];
                const org = companyById(accesses.find((a) => a.id === l.accessId)?.orgId ?? "");
                return (
                  <tr key={l.id} className="text-[12.5px]">
                    <td className="py-2.5 pr-3 font-mono text-[11.5px] whitespace-nowrap text-ink-soft">{l.at}</td>
                    <td className="px-3 py-2.5">
                      <span className="block font-semibold text-ink">{l.user}</span>
                      {org && <span className="block text-[11px] text-ink-faint">{org.name}</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
                          l.action === "revocation" ? "bg-danger-soft text-danger-deep" : "bg-line-soft text-ink-soft"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {t(`controle.acces.logActions.${l.action}`)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft">{l.target ?? "—"}</td>
                    <td className="py-2.5 pl-3 text-right font-mono text-[11.5px] text-ink-faint">{l.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </SectionCard>

      {/* ------------------------------ Invitation ---------------------------- */}
      <Modal open={inviting} onClose={() => setInviting(false)} title={d.controle.acces.inviteTitle} wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.orgName}</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 h-9.5 w-full rounded-[10px] border border-line bg-paper px-3 text-[12.5px] text-ink focus:border-blue focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.orgKind}</span>
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value as FinancialOrgKind })}
              className="mt-1 h-9.5 w-full cursor-pointer rounded-[10px] border border-line bg-paper px-3 text-[12.5px] text-ink focus:border-blue focus:outline-none"
            >
              {orgKinds.map((k) => (
                <option key={k} value={k}>
                  {t(`controle.acces.orgKinds.${k}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.orgReference}</span>
            <input
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="mt-1 h-9.5 w-full rounded-[10px] border border-line bg-paper px-3 text-[12.5px] text-ink focus:border-blue focus:outline-none"
            />
            <span className="mt-1 block text-[11.5px] text-ink-soft">{d.controle.acces.orgReferenceHint}</span>
          </label>
          <label className="block">
            <span className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.userName}</span>
            <input
              value={form.user}
              onChange={(e) => setForm({ ...form, user: e.target.value })}
              className="mt-1 h-9.5 w-full rounded-[10px] border border-line bg-paper px-3 text-[12.5px] text-ink focus:border-blue focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.userEmail}</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 h-9.5 w-full rounded-[10px] border border-line bg-paper px-3 text-[12.5px] text-ink focus:border-blue focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.period}</span>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="mt-1 h-9.5 w-full rounded-[10px] border border-line bg-paper px-3 font-mono text-[12.5px] text-ink focus:border-blue focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.frequency}</span>
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value as FinancialAccess["frequency"] })}
              className="mt-1 h-9.5 w-full cursor-pointer rounded-[10px] border border-line bg-paper px-3 text-[12.5px] text-ink focus:border-blue focus:outline-none"
            >
              {(["mensuelle", "trimestrielle"] as const).map((f) => (
                <option key={f} value={f}>
                  {t(`controle.acces.frequencies.${f}`)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-5 text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.shareTitle}</p>
        <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-soft">{d.controle.acces.shareHint}</p>
        <div className="mt-2.5 space-y-2.5 rounded-xl border border-line bg-line-soft/30 p-3.5">
          {(["commercialisation", "tresorerie", "sequestre", "photos"] as const).map((k) => (
            <Switch
              key={k}
              checked={form[k]}
              label={t(`controle.acces.share.${k}`)}
              onChange={(v) => setForm({ ...form, [k]: v })}
            />
          ))}
        </div>

        <p className="mt-5 text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.acces.sharedDocs}</p>
        <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
          {projectDocs.map((doc) => {
            const on = form.docIds.includes(doc.id);
            return (
              <li key={doc.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors duration-150",
                    on ? "bg-blue-soft/60 text-ink" : "text-ink-soft hover:bg-line-soft/60"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      setForm({
                        ...form,
                        docIds: on ? form.docIds.filter((x) => x !== doc.id) : [...form.docIds, doc.id],
                      })
                    }
                    className="h-3.5 w-3.5 shrink-0 accent-[oklch(0.51_0.2_264)]"
                  />
                  <span className="truncate">{doc.name}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
          <Button variant="ghost" onClick={() => setInviting(false)}>
            {d.common.cancel}
          </Button>
          <Button disabled={form.name.trim().length === 0 || form.user.trim().length === 0} onClick={submitInvite}>
            <UserPlus className="h-4 w-4" /> {d.controle.acces.inviteAction}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
