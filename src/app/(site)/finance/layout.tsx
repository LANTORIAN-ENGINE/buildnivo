import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BuildNivo Finance — accès contrôle financier",
  description:
    "Un accès de contrôle simple, standardisé et documenté pour les garants, banques, assureurs, courtiers, investisseurs et escrow teams qui financent une opération immobilière.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
