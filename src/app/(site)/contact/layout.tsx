import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — BuildNivo",
  description: "Demandez une démonstration commentée de BuildNivo avec vos types de chantier et vos rôles.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
