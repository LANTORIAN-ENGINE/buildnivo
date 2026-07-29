"use client";

import { CheckCheck, Megaphone, PackageCheck, Plus, Truck } from "lucide-react";
import type { OrderStatus } from "@/types";
import { companyById, projectById } from "@/data";
import { fmtDate, fmtEuro, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Button, DemoTip, SectionCard, StatusPill, type Tone } from "@/components/ui";

const statusTones: Record<OrderStatus, Tone> = {
  brouillon: "neutral",
  envoyee: "blue",
  confirmee: "viz",
  livraisonPartielle: "safety",
  livree: "ok",
  retard: "danger",
};

export default function AchatsPage() {
  const { d, t, lang } = useI18n();
  const { orders, confirmDelivery, toast } = useDemo();

  const late = orders.filter((o) => o.status === "retard").length;
  const inTransit = orders.filter((o) => o.status === "confirmee" || o.status === "livraisonPartielle").length;
  const totalEngaged = orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.achats.title}</h1>
            <DemoTip text={d.tips.achats.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.achats.subtitle}</p>
        </div>
        <Button onClick={() => toast(d.taches.form.created)}>
          <Plus className="h-4 w-4" /> {d.achats.newOrder}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="card flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-blue-soft text-blue-deep">
            <Truck className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="font-mono text-[20px] leading-none font-bold text-ink">{inTransit}</p>
            <p className="mt-1 text-[11.5px] font-medium text-ink-soft">{t("achats.status.confirmee")} / {t("achats.status.livraisonPartielle")}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-danger-soft text-danger">
            <Megaphone className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="font-mono text-[20px] leading-none font-bold text-danger">{late}</p>
            <p className="mt-1 text-[11.5px] font-medium text-ink-soft">{t("achats.status.retard")}</p>
          </div>
        </div>
        <div className="card col-span-2 flex items-center gap-3 px-4 py-3 lg:col-span-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ok-soft text-ok-deep">
            <PackageCheck className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="font-mono text-[20px] leading-none font-bold text-ink">{fmtEuro(totalEngaged, lang, true)}</p>
            <p className="mt-1 text-[11.5px] font-medium text-ink-soft">{d.finances.engaged}</p>
          </div>
        </div>
      </div>

      <SectionCard bodyClassName="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-line text-[11px] font-bold tracking-wider text-ink-faint uppercase">
              <th className="py-2.5 pr-3">N°</th>
              <th className="px-3 py-2.5">{d.taches.form.label}</th>
              <th className="px-3 py-2.5">{d.achats.supplier}</th>
              <th className="px-3 py-2.5">{d.common.project}</th>
              <th className="px-3 py-2.5 text-right">{d.common.amount}</th>
              <th className="px-3 py-2.5">{d.achats.expected}</th>
              <th className="px-3 py-2.5">{d.common.status}</th>
              <th className="py-2.5 pl-3 text-right">{d.common.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {orders.map((o) => (
              <tr key={o.id} className="text-[12.5px]">
                <td className="py-3 pr-3 font-mono text-[11.5px] font-bold text-blue-deep">{o.id}</td>
                <td className="max-w-80 px-3 py-3 font-semibold text-ink">{o.label}</td>
                <td className="px-3 py-3 text-ink-soft">{companyById(o.supplierId)?.name}</td>
                <td className="px-3 py-3 text-ink-soft">{projectById(o.projectId)?.name}</td>
                <td className="px-3 py-3 text-right font-mono font-bold text-ink">{fmtEuro(o.amount, lang)}</td>
                <td className="px-3 py-3 font-mono text-ink-soft">{fmtDate(o.expected, lang)}</td>
                <td className="px-3 py-3">
                  <StatusPill tone={statusTones[o.status]}>{t(`achats.status.${o.status}`)}</StatusPill>
                </td>
                <td className="py-3 pl-3">
                  <div className="flex justify-end gap-1.5">
                    {o.status === "retard" && (
                      <Button size="sm" variant="soft" onClick={() => toast(d.achats.relancePrepared)}>
                        <Megaphone className="h-3.5 w-3.5" /> {d.achats.relance}
                      </Button>
                    )}
                    {(o.status === "confirmee" || o.status === "livraisonPartielle") && (
                      <Button
                        size="sm"
                        variant="ok"
                        onClick={() => {
                          confirmDelivery(o.id);
                          toast(d.achats.deliveryConfirmed);
                        }}
                      >
                        <CheckCheck className="h-3.5 w-3.5" /> {d.achats.confirmDelivery}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
