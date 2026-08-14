import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BuildNivo Supply — BuildNivo",
  description: "Du quantitatif à la demande de prix fournisseurs, avec plusieurs scénarios d'approvisionnement comparés.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
