import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparatif — BuildNivo",
  description: "Procore, Autodesk Construction Cloud, CMiC, solutions spécialisées : ce que chacun couvre, et l'angle mort qui reste ouvert.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
