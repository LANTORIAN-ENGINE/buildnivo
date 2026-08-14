import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studios métier — BuildNivo",
  description: "Promoteur, Architecte, Maîtrise d'œuvre, Entreprise Travaux : quatre extensions métier posées sur le socle Company.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
