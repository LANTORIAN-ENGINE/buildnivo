"use client";

import {
  Bot,
  Calculator,
  ChevronDown,
  CloudDownload,
  FileArchive,
  FileCheck2,
  FileClock,
  FileText,
  FolderOpen,
  Map,
  PenTool,
  Ruler,
  Search,
  Stamp,
  Truck,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DocCategory } from "@/types";
import { documents } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Badge, Button, cn, DemoTip, EmptyState, SectionCard, Tooltip } from "@/components/ui";

const catIcons: Record<DocCategory, React.ComponentType<{ className?: string }>> = {
  plan: Map,
  cctp: FileText,
  contrat: FileCheck2,
  administratif: FileArchive,
  livraison: Truck,
  compteRendu: FileClock,
  planExe: Ruler,
  noteCalcul: Calculator,
  esquisse: PenTool,
  avis: Stamp,
};

export default function DocumentsPage() {
  const { d, t, lang } = useI18n();
  const { toast, activeProjectId } = useDemo();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<DocCategory | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      documents.filter(
        (doc) =>
          doc.projectId === activeProjectId &&
          (cat === "all" || doc.category === cat) &&
          (query.trim() === "" || doc.name.toLowerCase().includes(query.trim().toLowerCase()))
      ),
    [activeProjectId, cat, query]
  );

  const cats: (DocCategory | "all")[] = [
    "all",
    "plan",
    "planExe",
    "noteCalcul",
    "esquisse",
    "cctp",
    "contrat",
    "avis",
    "administratif",
    "livraison",
    "compteRendu",
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.documents.title}</h1>
            <DemoTip text={d.tips.documents.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.documents.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoTip text={d.tips.documents.ai} />
          <Button onClick={() => toast(d.documents.uploaded)}>
            <Upload className="h-4 w-4" /> {d.documents.upload}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={d.documents.searchDocs}
            className="h-9.5 w-72 rounded-[10px] border border-line bg-card pl-9 text-[12.5px] focus:border-blue focus:outline-none"
          />
        </div>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
              cat === c ? "border-blue bg-blue-soft text-blue-deep" : "border-line bg-card text-ink-soft hover:border-ink-faint"
            )}
          >
            {c === "all" ? d.common.all : t(`documents.categories.${c}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FolderOpen className="h-8 w-8" />} title={d.documents.title} hint={d.tips.documents.main} />
      ) : (
        <SectionCard bodyClassName="divide-y divide-line-soft">
          {filtered.map((doc) => {
            const Icon = catIcons[doc.category];
            const isOpen = expanded === doc.id;
            const expired = doc.version === "expirée";
            return (
              <div key={doc.id} className="py-1">
                <div className="flex flex-wrap items-center gap-3 py-2">
                  <span
                    className={cn(
                      "flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px]",
                      expired ? "bg-danger-soft text-danger" : "bg-blue-soft text-blue-deep"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-[13px] font-bold text-ink">{doc.name}</span>
                      <Badge tone={expired ? "danger" : "blue"}>{doc.version}</Badge>
                      {doc.aiClassified && (
                        <Badge tone="viz" className="inline-flex items-center gap-1">
                          <Bot className="h-2.5 w-2.5" /> IA
                        </Badge>
                      )}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-ink-soft">
                      {t(`documents.categories.${doc.category}`)} · {(doc.sizeKb / 1024).toFixed(1)} Mo · {fmtDate(doc.updatedAt, lang)} ·{" "}
                      {d.documents.updatedBy} {doc.author}
                    </p>
                  </div>
                  <Tooltip label={d.documents.offline}>
                    <span className="rounded-lg p-1.5 text-ok-deep">
                      <CloudDownload className="h-4 w-4" />
                    </span>
                  </Tooltip>
                  <Link href="/copilote">
                    <Button size="sm" variant="soft">
                      <Bot className="h-3.5 w-3.5" /> {d.documents.askAi}
                    </Button>
                  </Link>
                  <button
                    onClick={() => setExpanded(isOpen ? null : doc.id)}
                    aria-expanded={isOpen}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-ink-soft hover:bg-line-soft"
                  >
                    {d.documents.versions}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", isOpen && "rotate-180")} />
                  </button>
                </div>
                {isOpen && (
                  <ol className="rise-in mb-3 ml-12 space-y-1.5 rounded-xl bg-line-soft/50 p-3.5">
                    {doc.history.map((h, i) => (
                      <li key={h.version} className="flex items-center gap-3 text-[12px]">
                        <span className={cn("font-mono font-bold", i === 0 ? "text-blue-deep" : "text-ink-faint")}>{h.version}</span>
                        <span className="font-mono text-ink-soft">{fmtDate(h.date, lang)}</span>
                        <span className="text-ink-soft">{h.author}</span>
                        {i === 0 && <Badge tone="ok">{d.documents.currentVersion}</Badge>}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </SectionCard>
      )}
    </div>
  );
}
