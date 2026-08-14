import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloisonnement des données — BuildNivo",
  description: "Trois barrières indépendantes — nominative, commerciale, documentaire — et un accès d'urgence tracé en audit log.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
