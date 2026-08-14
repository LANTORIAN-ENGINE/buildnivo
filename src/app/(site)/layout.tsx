import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

/**
 * Vitrine publique : en-tête collant transparent au sommet, contenu qui passe dessous
 * (marge négative) pour que chaque page démarre sur son aplat bleu sans bande blanche.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <SiteHeader />
      <main id="contenu" className="-mt-16 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
