"use client";

import { Bot, Camera, CheckCheck, LayoutGrid, List, Lock, MapPin, MessageSquare, Play, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { SiteTask, TaskStatus } from "@/types";
import { companies, companyById, employeeById, fullName, inDays, projectById, zoneLabel } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Avatar, Badge, Button, cn, DemoTip, Modal, SectionCard, StatusPill, type Tone } from "@/components/ui";

const statusOrder: TaskStatus[] = ["aFaire", "enCours", "aValider", "bloquee", "terminee"];

const statusTones: Record<TaskStatus, Tone> = {
  aFaire: "neutral",
  enCours: "blue",
  aValider: "safety",
  bloquee: "danger",
  terminee: "ok",
};

function TaskCard({ task }: { task: SiteTask }) {
  const { d, t, lang } = useI18n();
  const { setTaskStatus, toast } = useDemo();
  const assignee = task.assigneeEmployeeId ? employeeById(task.assigneeEmployeeId) : undefined;
  const company = task.assigneeCompanyId ? companyById(task.assigneeCompanyId) : undefined;
  const late = task.due < inDays(0) && task.status !== "terminee";

  return (
    <article className="card space-y-2.5 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] leading-snug font-bold text-ink">{task.title}</p>
        {task.priority === "haute" && (
          <Badge tone={task.status === "bloquee" ? "danger" : "safety"}>{t(`common.priority.${task.priority}`)}</Badge>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-[11.5px] text-ink-soft">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-blue" />
        {zoneLabel(task.projectId, task.zoneId)} · {t(`trades.${task.trade}`)}
      </p>

      {task.createdBy === "ia" && (
        <p className="flex items-center gap-1.5 rounded-lg bg-viz-soft px-2 py-1 text-[10.5px] font-bold text-viz">
          <Bot className="h-3 w-3" /> {d.taches.aiFlag}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-line-soft pt-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          {assignee ? (
            <>
              <Avatar name={fullName(assignee)} size="sm" />
              <span className="truncate text-[11.5px] font-medium text-ink-soft">{fullName(assignee)}</span>
            </>
          ) : company ? (
            <span className="truncate rounded-md bg-line-soft px-2 py-1 text-[11px] font-semibold text-ink-soft">{company.name}</span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[11px] text-ink-faint">
          {task.photos > 0 && (
            <span className="flex items-center gap-0.5">
              <Camera className="h-3.5 w-3.5" /> {task.photos}
            </span>
          )}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-3.5 w-3.5" /> {task.comments.length}
            </span>
          )}
          <span className={cn("font-mono font-semibold", late ? "text-danger" : "text-ink-soft")}>{fmtDate(task.due, lang)}</span>
        </div>
      </div>

      {task.status === "aFaire" && (
        <Button size="sm" variant="soft" className="w-full" onClick={() => setTaskStatus(task.id, "enCours")}>
          <Play className="h-3.5 w-3.5" /> {t("taches.status.enCours")}
        </Button>
      )}
      {task.status === "enCours" && (
        <Button size="sm" variant="soft" className="w-full" onClick={() => setTaskStatus(task.id, "aValider")}>
          {d.taches.markDone}
        </Button>
      )}
      {task.status === "aValider" && (
        <Button
          size="sm"
          variant="ok"
          className="w-full"
          onClick={() => {
            setTaskStatus(task.id, "terminee");
            toast(d.taches.taskValidated);
          }}
        >
          <CheckCheck className="h-3.5 w-3.5" /> {d.taches.validateTask}
        </Button>
      )}
      {task.status === "bloquee" && task.comments.length > 0 && (
        <p className="flex items-start gap-1.5 rounded-lg bg-danger-soft px-2.5 py-1.5 text-[11px] leading-snug font-medium text-danger-deep">
          <Lock className="mt-0.5 h-3 w-3 shrink-0" /> {task.comments[task.comments.length - 1].text}
        </p>
      )}
    </article>
  );
}

export default function TachesPage() {
  const { d, t, lang } = useI18n();
  const { tasks, addTask, toast, activeProjectId } = useDemo();
  const project = projectById(activeProjectId)!;

  const [view, setView] = useState<"board" | "list">("board");
  const [tradeFilter, setTradeFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ title: "", zoneId: "", trade: "secondOeuvre", companyId: "", due: inDays(7), priority: "normale" });

  const filtered = useMemo(
    () =>
      tasks.filter(
        (tk) =>
          tk.projectId === activeProjectId &&
          (tradeFilter === "all" || tk.trade === tradeFilter) &&
          (zoneFilter === "all" || tk.zoneId === zoneFilter)
      ),
    [tasks, activeProjectId, tradeFilter, zoneFilter]
  );

  const trades = [...new Set(tasks.filter((tk) => tk.projectId === activeProjectId).map((tk) => tk.trade))];

  const submit = () => {
    if (!form.title.trim()) return;
    addTask({
      id: `t-demo-${Date.now()}`,
      title: form.title.trim(),
      projectId: activeProjectId,
      zoneId: form.zoneId || project.zones[0].id,
      trade: form.trade as SiteTask["trade"],
      assigneeCompanyId: form.companyId || undefined,
      due: form.due,
      priority: form.priority as SiteTask["priority"],
      status: "aFaire",
      photos: 0,
      comments: [],
      createdBy: "humain",
    });
    setFormOpen(false);
    setForm((f) => ({ ...f, title: "" }));
    toast(d.taches.form.created);
  };

  const selectCls =
    "h-9 rounded-[9px] border border-line bg-card px-2.5 text-[12.5px] font-medium text-ink focus:border-blue focus:outline-none";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.taches.title}</h1>
            <DemoTip text={d.tips.taches.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.taches.subtitle}</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> {d.taches.newTask}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-[10px] border border-line p-0.5">
          <button
            onClick={() => setView("board")}
            aria-pressed={view === "board"}
            className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold", view === "board" ? "bg-blue-soft text-blue-deep" : "text-ink-soft")}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> {d.taches.board}
          </button>
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold", view === "list" ? "bg-blue-soft text-blue-deep" : "text-ink-soft")}
          >
            <List className="h-3.5 w-3.5" /> {d.taches.list}
          </button>
        </div>
        <select value={tradeFilter} onChange={(e) => setTradeFilter(e.target.value)} className={selectCls} aria-label={d.taches.filters.trade}>
          <option value="all">
            {d.taches.filters.trade} : {d.common.all}
          </option>
          {trades.map((tr) => (
            <option key={tr} value={tr}>
              {t(`trades.${tr}`)}
            </option>
          ))}
        </select>
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className={selectCls} aria-label={d.taches.filters.zone}>
          <option value="all">
            {d.common.zone} : {d.common.all}
          </option>
          {project.zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.label}
            </option>
          ))}
        </select>
      </div>

      {view === "board" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {statusOrder.map((st) => {
            const col = filtered.filter((tk) => tk.status === st);
            return (
              <div key={st} className="rounded-(--radius-card) bg-line-soft/45 p-2.5">
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <StatusPill tone={statusTones[st]}>{t(`taches.status.${st}`)}</StatusPill>
                  <span className="font-mono text-[11.5px] font-bold text-ink-faint">{col.length}</span>
                </div>
                <div className="space-y-2.5">
                  {col.map((tk) => (
                    <TaskCard key={tk.id} task={tk} />
                  ))}
                  {col.length === 0 && <p className="px-1 py-4 text-center text-[11.5px] text-ink-faint">—</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <SectionCard bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                <th className="py-2.5 pr-3">{d.taches.form.label}</th>
                <th className="px-3 py-2.5">{d.common.zone}</th>
                <th className="px-3 py-2.5">{d.taches.filters.trade}</th>
                <th className="px-3 py-2.5">{d.taches.assignee}</th>
                <th className="px-3 py-2.5">{d.taches.due}</th>
                <th className="px-3 py-2.5">{d.taches.form.priority}</th>
                <th className="py-2.5 pl-3">{d.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filtered.map((tk) => {
                const assignee = tk.assigneeEmployeeId ? employeeById(tk.assigneeEmployeeId) : undefined;
                const company = tk.assigneeCompanyId ? companyById(tk.assigneeCompanyId) : undefined;
                return (
                  <tr key={tk.id} className="text-[12.5px]">
                    <td className="max-w-72 py-2.5 pr-3 font-semibold text-ink">{tk.title}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{zoneLabel(tk.projectId, tk.zoneId)}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{t(`trades.${tk.trade}`)}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{assignee ? fullName(assignee) : (company?.name ?? "—")}</td>
                    <td className="px-3 py-2.5 font-mono">{fmtDate(tk.due, lang)}</td>
                    <td className="px-3 py-2.5">{t(`common.priority.${tk.priority}`)}</td>
                    <td className="py-2.5 pl-3">
                      <StatusPill tone={statusTones[tk.status]}>{t(`taches.status.${tk.status}`)}</StatusPill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionCard>
      )}

      {/* Nouvelle tâche */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={d.taches.form.title}>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.taches.form.label}</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={d.taches.form.placeholder}
              className="h-10 w-full rounded-[9px] border border-line bg-paper px-3 text-[13px] focus:border-blue focus:outline-none"
              autoFocus
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.taches.form.zone}</span>
              <select value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: e.target.value })} className={cn(selectCls, "w-full")}>
                {project.zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.taches.form.trade}</span>
              <select value={form.trade} onChange={(e) => setForm({ ...form, trade: e.target.value })} className={cn(selectCls, "w-full")}>
                {(["grosOeuvre", "secondOeuvre", "electricite", "plomberie", "etancheite", "menuiserie", "peinture", "vrd"] as const).map((tr) => (
                  <option key={tr} value={tr}>
                    {t(`trades.${tr}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.taches.form.company}</span>
              <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} className={cn(selectCls, "w-full")}>
                <option value="">Bâtir Océan Indien</option>
                {companies
                  .filter((c) => c.kind === "soustraitant")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.taches.form.due}</span>
              <input
                type="date"
                value={form.due}
                onChange={(e) => setForm({ ...form, due: e.target.value })}
                className={cn(selectCls, "w-full")}
              />
            </label>
          </div>
          <fieldset>
            <legend className="mb-1.5 text-[12px] font-bold text-ink">{d.taches.form.priority}</legend>
            <div className="flex gap-2">
              {(["haute", "normale", "basse"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, priority: p })}
                  aria-pressed={form.priority === p}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                    form.priority === p ? "border-blue bg-blue-soft text-blue-deep" : "border-line text-ink-soft hover:border-ink-faint"
                  )}
                >
                  {t(`common.priority.${p}`)}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              {d.common.cancel}
            </Button>
            <Button onClick={submit} disabled={!form.title.trim()}>
              <Plus className="h-4 w-4" /> {d.taches.newTask}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
