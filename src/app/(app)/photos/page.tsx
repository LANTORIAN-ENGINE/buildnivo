"use client";

import { AlertTriangle, Camera, ClipboardList, LinkIcon, ListChecks, MapPin, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { PhotoTag, SitePhoto } from "@/types";
import { companies, inDays, projectById, zoneLabel } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Badge, Button, cn, DemoTip, Modal, PhotoScene, StatusPill, type Tone } from "@/components/ui";

const tagTones: Record<PhotoTag, Tone> = {
  probleme: "danger",
  avancement: "ok",
  reserve: "safety",
  livraison: "viz",
  securite: "danger",
};

export default function PhotosPage() {
  const { d, t, lang } = useI18n();
  const { photos, tasks, addTask, toast, activeProjectId } = useDemo();
  const project = projectById(activeProjectId)!;

  const [tagFilter, setTagFilter] = useState<PhotoTag | "all">("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [selected, setSelected] = useState<SitePhoto | null>(null);
  const [dueDate, setDueDate] = useState(inDays(7));
  const [companyId, setCompanyId] = useState("");

  const filtered = useMemo(
    () =>
      photos.filter(
        (p) =>
          p.projectId === activeProjectId &&
          (tagFilter === "all" || p.tag === tagFilter) &&
          (zoneFilter === "all" || p.zoneId === zoneFilter)
      ),
    [photos, activeProjectId, tagFilter, zoneFilter]
  );

  const act = (kind: "probleme" | "tache" | "reserve") => {
    if (!selected) return;
    if (kind === "reserve") {
      toast(d.photos.reserveCreated);
    } else {
      addTask({
        id: `t-photo-${Date.now()}`,
        title: `${kind === "probleme" ? "⚠ " : ""}${selected.caption}`,
        projectId: activeProjectId,
        zoneId: selected.zoneId,
        trade: "secondOeuvre",
        assigneeCompanyId: companyId || undefined,
        due: dueDate,
        priority: kind === "probleme" ? "haute" : "normale",
        status: "aFaire",
        photos: 1,
        comments: [],
        createdBy: "humain",
      });
      toast(kind === "probleme" ? d.photos.problemCreated : d.taches.form.created);
    }
    setSelected(null);
  };

  const tags: (PhotoTag | "all")[] = ["all", "probleme", "avancement", "reserve", "livraison", "securite"];
  const linkedTask = selected?.linkedTaskId ? tasks.find((tk) => tk.id === selected.linkedTaskId) : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.photos.title}</h1>
            <DemoTip text={d.tips.photos.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.photos.subtitle}</p>
        </div>
        <Button onClick={() => toast(d.photos.photoAdded)}>
          <Camera className="h-4 w-4" /> {d.photos.addPhoto}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setTagFilter(tag)}
            aria-pressed={tagFilter === tag}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors duration-150",
              tagFilter === tag ? "border-blue bg-blue-soft text-blue-deep" : "border-line bg-card text-ink-soft hover:border-ink-faint"
            )}
          >
            {tag === "all" ? d.common.all : t(`photos.tags.${tag}`)}
          </button>
        ))}
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          aria-label={d.common.zone}
          className="ml-auto h-9 rounded-[9px] border border-line bg-card px-2.5 text-[12.5px] font-medium text-ink focus:border-blue focus:outline-none"
        >
          <option value="all">{d.photos.filterZone}</option>
          {project.zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelected(p);
              setCompanyId("");
            }}
            className="group card overflow-hidden text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-(--shadow-pop)"
          >
            <div className="relative h-40">
              <PhotoScene hue={p.hue} />
              <span className="absolute top-2.5 left-2.5">
                <StatusPill tone={tagTones[p.tag]} dot={false} className="shadow-sm">
                  {t(`photos.tags.${p.tag}`)}
                </StatusPill>
              </span>
              {p.linkedTaskId && (
                <span className="absolute right-2.5 bottom-2.5 rounded-md bg-ink/70 p-1 text-white">
                  <LinkIcon className="h-3 w-3" />
                </span>
              )}
            </div>
            <div className="p-3.5">
              <p className="line-clamp-2 min-h-9 text-[12.5px] leading-snug font-semibold text-ink">{p.caption}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-soft">
                <MapPin className="h-3 w-3 text-blue" /> {zoneLabel(p.projectId, p.zoneId)}
              </p>
              <p className="mt-1 text-[10.5px] text-ink-faint">
                {p.author} · {fmtDate(p.date, lang)} {p.time}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Détail photo → actions */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.caption ?? ""} wide>
        {selected && (
          <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="h-64 overflow-hidden rounded-xl border border-line">
                <PhotoScene hue={selected.hue} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-ink-soft">
                <StatusPill tone={tagTones[selected.tag]} dot={false}>
                  {t(`photos.tags.${selected.tag}`)}
                </StatusPill>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-blue" /> {zoneLabel(selected.projectId, selected.zoneId)}
                </span>
                <span>
                  {selected.author} · {fmtDate(selected.date, lang)} {selected.time}
                </span>
              </div>
              {linkedTask && (
                <p className="mt-3 flex items-center gap-2 rounded-lg bg-blue-soft/60 px-3 py-2 text-[12px] font-semibold text-blue-deep">
                  <LinkIcon className="h-3.5 w-3.5" /> {d.photos.linkedTask} : {linkedTask.title}
                </p>
              )}
            </div>

            <div>
              <p className="text-[12px] font-bold tracking-wider text-ink-faint uppercase">{d.photos.fromPhoto}</p>
              <div className="mt-3 space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.photos.assignCompany}</span>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="h-9.5 w-full rounded-[9px] border border-line bg-paper px-2.5 text-[12.5px] focus:border-blue focus:outline-none"
                  >
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
                  <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.photos.setDue}</span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-9.5 w-full rounded-[9px] border border-line bg-paper px-2.5 text-[12.5px] focus:border-blue focus:outline-none"
                  />
                </label>
                <div className="space-y-2 pt-1">
                  <Button variant="danger" className="w-full" onClick={() => act("probleme")}>
                    <AlertTriangle className="h-4 w-4" /> {d.photos.declareProblem}
                  </Button>
                  <Button variant="soft" className="w-full" onClick={() => act("tache")}>
                    <ListChecks className="h-4 w-4" /> {d.photos.createTask}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => act("reserve")}>
                    <ClipboardList className="h-4 w-4" /> {d.photos.createReserve}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
