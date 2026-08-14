import type { Metadata } from "next";
import "@fontsource-variable/archivo";
import "@fontsource-variable/jetbrains-mono";
import { I18nProvider } from "@/lib/i18n";
import { DemoProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BuildNivo — Le BTP a des millions d'outils. Il ne vous en faut qu'un.",
    template: "%s",
  },
  description:
    "Plateforme collaborative intelligente pour la construction : pointage, tâches, journal de chantier, documents, achats, finances et IA, autour d'une source unique de vérité. Démo commerciale (données factices).",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <I18nProvider>
          <DemoProvider>{children}</DemoProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
