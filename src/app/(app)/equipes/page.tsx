"use client";

import { Bot, Building2, Phone, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { companies, employees, fullName, projectById } from "@/data";
import { useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Avatar, Button, cn, DemoTip, SectionCard, StatusPill, Tabs } from "@/components/ui";

const matrix: { moduleKey: string; access: [string, string, string, string, string] }[] = [
  { moduleKey: "dashboard", access: ["full", "full", "read", "none", "none"] },
  { moduleKey: "pointage", access: ["full", "full", "write", "own", "own"] },
  { moduleKey: "taches", access: ["full", "full", "write", "read", "own"] },
  { moduleKey: "journal", access: ["read", "full", "write", "none", "read"] },
  { moduleKey: "photos", access: ["read", "full", "write", "write", "own"] },
  { moduleKey: "documents", access: ["full", "full", "read", "read", "own"] },
  { moduleKey: "finances", access: ["full", "write", "none", "none", "none"] },
  { moduleKey: "rapports", access: ["full", "full", "read", "none", "none"] },
];

export default function EquipesPage() {
  const { d, t } = useI18n();
  const { toast } = useDemo();
  const [tab, setTab] = useState("salaries");

  const salaries = employees.filter((e) => e.role !== "soustraitant");
  const soustraitants = companies.filter((c) => c.kind === "soustraitant");
  const fournisseurs = companies.filter((c) => c.kind === "fournisseur");

  const accessLabel = (a: string) =>
    a === "full" ? d.equipes.permissions.full : a === "write" ? d.equipes.permissions.write : a === "read" ? d.equipes.permissions.read : a === "own" ? d.equipes.permissions.own : d.equipes.permissions.none;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.equipes.title}</h1>
            <DemoTip text={d.tips.equipes.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.equipes.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast(d.equipes.added)}>
            <Building2 className="h-4 w-4" /> {d.equipes.addCompany}
          </Button>
          <Button onClick={() => toast(d.equipes.added)}>
            <Plus className="h-4 w-4" /> {d.equipes.addEmployee}
          </Button>
        </div>
      </div>

      <Tabs
        items={[
          { id: "salaries", label: d.equipes.tabs.salaries, count: salaries.length },
          { id: "soustraitants", label: d.equipes.tabs.soustraitants, count: soustraitants.length },
          { id: "fournisseurs", label: d.equipes.tabs.fournisseurs, count: fournisseurs.length },
          { id: "roles", label: d.equipes.tabs.roles },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "salaries" && (
        <SectionCard bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                <th className="py-2.5 pr-3">{d.pointage.sheet.employee}</th>
                <th className="px-3 py-2.5">{d.equipes.matricule}</th>
                <th className="px-3 py-2.5">{d.taches.filters.trade}</th>
                <th className="px-3 py-2.5">{d.equipes.assignedTo}</th>
                <th className="py-2.5 pl-3">{d.equipes.contact}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {salaries.map((e) => (
                <tr key={e.id} className="text-[12.5px]">
                  <td className="py-2.5 pr-3">
                    <span className="flex items-center gap-2.5">
                      <Avatar name={fullName(e)} size="sm" />
                      <span>
                        <span className="block font-bold text-ink">{fullName(e)}</span>
                        <span className="block text-[11px] text-ink-soft">{t(`jobs.${e.jobKey}`)}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11.5px] font-bold text-blue-deep">{e.id}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{t(`trades.${e.trade}`)}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{projectById(e.projectId)?.name}</td>
                  <td className="py-2.5 pl-3 font-mono text-[11.5px] text-ink-soft">{e.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {(tab === "soustraitants" || tab === "fournisseurs") && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(tab === "soustraitants" ? soustraitants : fournisseurs).map((c) => (
            <SectionCard key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[14.5px] font-bold text-ink">{c.name}</h2>
                  <p className="mt-0.5 text-[12px] text-ink-soft">
                    {c.trade ? `${t(`trades.${c.trade}`)} · ` : ""}
                    {c.city}
                  </p>
                </div>
                {c.docsOk ? (
                  <StatusPill tone="ok" dot={false}>
                    <ShieldCheck className="h-3 w-3" /> {d.equipes.docsOk}
                  </StatusPill>
                ) : (
                  <StatusPill tone="danger" dot={false}>{d.equipes.docsMissing}</StatusPill>
                )}
              </div>
              {c.expiringDoc && (
                <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-safety-soft px-3 py-2 text-[11.5px] font-semibold text-safety-deep">
                  <Bot className="h-3.5 w-3.5" /> {d.equipes.docsExpiring} : {c.expiringDoc}
                </p>
              )}
              <p className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3 text-[12px] text-ink-soft">
                <Avatar name={c.contact} size="sm" />
                <span className="font-semibold text-ink">{c.contact}</span>
                <span className="ml-auto flex items-center gap-1 font-mono text-[11.5px]">
                  <Phone className="h-3 w-3" /> {c.phone}
                </span>
              </p>
            </SectionCard>
          ))}
        </div>
      )}

      {tab === "roles" && (
        <SectionCard bodyClassName="overflow-x-auto">
          <p className="mb-4 max-w-[80ch] text-[12.5px] leading-relaxed text-ink-soft">{d.equipes.permissions.intro}</p>
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                <th className="py-2.5 pr-3">{d.equipes.permissions.module}</th>
                <th className="px-3 py-2.5">{d.equipes.permissions.direction}</th>
                <th className="px-3 py-2.5">{d.equipes.permissions.conducteur}</th>
                <th className="px-3 py-2.5">{d.equipes.permissions.chef}</th>
                <th className="px-3 py-2.5">{d.equipes.permissions.ouvrier}</th>
                <th className="py-2.5 pl-3">{d.equipes.permissions.soustraitant}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {matrix.map((row) => (
                <tr key={row.moduleKey} className="text-[12.5px]">
                  <td className="py-2.5 pr-3 font-bold text-ink">{t(`nav.${row.moduleKey}`)}</td>
                  {row.access.map((a, i) => (
                    <td key={i} className={cn("px-3 py-2.5", i === 4 && "pl-3")}>
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold",
                          a === "full" && "bg-blue-soft text-blue-deep",
                          a === "write" && "bg-ok-soft text-ok-deep",
                          a === "read" && "bg-line-soft text-ink-soft",
                          a === "own" && "bg-viz-soft text-viz",
                          a === "none" && "text-ink-faint"
                        )}
                      >
                        {accessLabel(a)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </div>
  );
}
