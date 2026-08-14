import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les deux produits — BuildNivo",
  description: "BuildNivo Project gratuit pour tous les intervenants, BuildNivo Company pour la gestion de l'entreprise : frontière fonctionnelle, essai de 30 jours et continuité de service.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
