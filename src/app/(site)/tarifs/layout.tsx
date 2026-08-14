import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs — BuildNivo",
  description: "Project 790 € HT/mois, Company Essential et Business, Studios métier, et le socle gratuit permanent des intervenants.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
