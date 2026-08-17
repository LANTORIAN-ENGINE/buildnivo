# CLAUDE.md — Buildnivo (référence projet)

Démo commerciale **100 % frontend** d'une plateforme SaaS de pilotage BTP, générée depuis le
CDC PDF présent dans ce dossier. Aucun backend, aucune base : toutes les données sont mock,
tout l'état vit en mémoire navigateur. Public : rendez-vous commerciaux avec des PME du BTP
(marché pilote La Réunion). Lire aussi `PRODUCT.md` (produit/ton) et `DESIGN.md` (design system) —
ils font foi pour toute décision UI.

## Commandes

```bash
npm run dev      # dev (turbopack), http://localhost:3000
npm run build    # build prod — DOIT passer avant de livrer
npm start        # serveur prod
```

Pas d'ESLint configuré (retiré volontairement). Vérification = `npm run build` (TypeScript strict).

## Stack

Next.js 15.3 (App Router, `src/`, alias `@/*`) · React 19 · TypeScript strict · Tailwind CSS **v4**
(pas de tailwind.config : tokens dans `@theme inline` de `globals.css`) · Recharts 3 · lucide-react ·
date-fns · clsx · polices auto-hébergées `@fontsource-variable/archivo` + `jetbrains-mono`
(**ne pas utiliser `next/font/google`** : Google Fonts inaccessible sur cette machine, le build casse).

## Arborescence

```
src/
  app/
    layout.tsx                # Racine : fonts + I18nProvider + DemoProvider
    globals.css               # TOUS les tokens design (@theme inline, OKLCH) + keyframes
    connexion/page.tsx        # Connexion par persona (14 profils), fond blueprint-grid
    (site)/                   # Vitrine publique : SiteHeader + SiteFooter
      page.tsx                # Accueil (hero animé, 13 sections issues du doc de référence)
      produit/ studios/ tarifs/ ia/ securite/ finance/ supply/ comparatif/ contact/
    (app)/                    # Groupe authentifié : AppLayout (sidebar + topbar + Toaster)
      layout.tsx
      dashboard/  chantiers/  chantiers/[id]/  pointage/  taches/  journal/  photos/
      visas/  reunions/  reprise/
      reserves/  achats/  finances/  documents/  rapports/  copilote/
      controle/                 # Contrôle financier : synthèse
      controle/rapports/  controle/justificatifs/  controle/acces/
      messages/  support/  equipes/  parametres/
  components/
    ui.tsx                    # Kit UI unique : cn, Logo, Button, StatusPill, Badge, ProgressBar,
                              # Avatar, Tabs, Tooltip, DemoTip, Modal, SectionCard, EmptyState,
                              # PhotoScene (photo chantier SVG), Switch, FlagFR/FlagEN,
                              # LanguageSelect, Toaster
    finance.tsx               # Contrôle financier : FigureTile/FigureRow/FigureTable (donnée
                              # certifiée), Provenance, Freshness, NotSharedBlock,
                              # ReadOnlyBanner, ReportSeal
    site/                     # Vitrine : SiteHeader/SiteFooter, kit.tsx (SiteSection,
                              # SectionHeading, Eyebrow, CtaLink, PageHero, FinalCta),
                              # motion.tsx (Reveal, Stagger, CountUp, Marquee, useInView…),
                              # figures/ (ToolConvergence, LevelStack, NetworkEffect,
                              # TrialTimeline, DictationDemo, BarrierMatrix, SupplyFlow,
                              # CompareGrid, PricingCards, ModuleGrid, StudioCards, FAQ,
                              # AccessWall, ReportCycle)
    shell/Sidebar.tsx         # Nav bleue groupée (badge non-lus sur Messages) — config `groups[]`
    shell/Topbar.tsx          # Chantier actif, recherche, mode découverte, langue, notifs, persona
  lib/
    permissions.ts            # matrice rôle × module, KPI et rubriques par rôle, homeFor, moduleForPath
    finance.ts                # useFinance() : accès du profil, opération, blocs partagés
    i18n/fr.ts                # Dictionnaire source (type Dict = typeof fr — SANS `as const`)
    i18n/en.ts                # Miroir typé `en: Dict` (toute clé FR doit exister en EN)
    i18n/index.tsx            # I18nProvider, useI18n() → { lang, setLang, d, t }, fmtEuro, fmtDate
    store.tsx                 # DemoProvider/useDemo : TOUT l'état interactif + toasts + resetDemo
  data/
    core.ts                   # TODAY/iso/inDays/daysAgo (dates RELATIVES à aujourd'hui),
                              # companies, projects (4), employees, personas + helpers *ById, fullName
    activity.ts               # timeEntries, weekHours, siteTasks, journalEntries, sitePhotos
    gestion.ts                # documents, reserves, purchaseOrders, financeRows
    ai.ts                     # aiAlerts, aiReminders, dictée Copilote + Q&A scriptée, rapports générés
    acteurs.ts                # visas, avis, réunions de chantier, brouillons IA, reprise
    finance.ts                # BuildNivo Finance : snapshots d'opération (données tracées),
                              # jalons, risques matériels, rapports périodiques versionnés,
                              # accès financiers, journal des accès, rappels
    comms.ts                  # conversations messagerie, supportTickets, faqItems
    marketing.ts              # vitrine : offres, studios, matrices RBAC, concurrents,
                              # Supply, chiffres clés — structure pure, libellés dans `site.*`
    index.ts                  # ré-exporte tout : importer depuis "@/data"
  types/index.ts              # Modèle de domaine complet (Project, TimeEntry, SiteTask, Conversation…)
```

## Flux de données (règle d'or)

- `src/data/*` = **seed immuable** ; `src/lib/store.tsx` clone au montage et porte l'état mutable.
- Un écran lit via `useDemo()` (état) + `useI18n()` (textes) ; il n'importe de `@/data` que les
  helpers/référentiels statiques (employés, projets, documents, FAQ).
- Toute interaction visible passe par une action du store (`sendMessage`, `setTaskStatus`,
  `fixAnomaly`, `addTicket`…) + un `toast(...)`. Nouvel état ⇒ l'ajouter aussi à `resetDemo`.
- Le chantier actif (`activeProjectId`, sélecteur en topbar) filtre la plupart des écrans.
- Dates mock : toujours relatives (`inDays(n)` / `daysAgo(n)`), jamais de dates en dur.

## Conventions

- **i18n** : aucun libellé UI en dur. Accès typé `d.module.cle` ou dynamique `t("trades.grosOeuvre")`.
  Ajouter une clé = fr.ts **et** en.ts (le type `Dict` casse le build sinon — c'est voulu).
  Les données métier (messages, rapports, FAQ) restent en français : réalisme terrain assumé.
- **Tokens couleur** (globals.css, OKLCH) : `paper/card/ink/ink-soft/ink-faint/line/line-soft`,
  `blue/blue-deep/blue-soft/blue-ink` (marque), et états SEULEMENT pour : `safety` (ambre alerte),
  `ok` (vert présent/validé), `danger` (rouge incident), `viz` (violet IA/data). Jamais décoratifs.
- **Typo** : Archivo partout ; `font-mono` (JetBrains) réservé aux données terrain : heures,
  matricules, montants, versions, compteurs, réfs (`SAV-2026-041`).
- **Kit UI** : ne rien recréer, réutiliser `components/ui.tsx` (même vocabulaire d'écran en écran).
  Nouvelles photos « chantier » = `PhotoScene hue={n}` (SVG, jamais d'images externes — démo hors ligne).
- **Mode découverte** : chaque nouveau module reçoit un `DemoTip` avec argumentaire commercial
  dans `tips.*` (fr+en) — c'est un différenciateur de la démo.
- **Contrôle financier** (`/controle/*`) : accès en lecture seule des garants et financeurs.
  Règle du module — **aucun chiffre ne circule seul** : toute valeur passe par `TracedFigure`
  (date de mise à jour, origine, mode de calcul, statut de validation, pièces) et se rend avec
  `FigureTile` / `FigureRow`. Au-delà de 30 jours → hachure `stale-hatch` ; valeur `null` →
  gabarit `figure-void` « non communiquée », **jamais un zéro**. Un rapport publié est figé :
  une correction ajoute une version (`correctReport`), elle n'écrase jamais la précédente.
- **IA** : toute action IA est simulée de façon crédible et **validée par un humain** ; les réponses
  du Copilote citent leurs sources (ids de `documents`). Cohérence narrative des mocks : absence
  PLOMB'ÉO, cloisons R+2, rails manquants (CMD-2026-118), grue n°2 HS, menuiseries en retard
  (CMD-2026-114), plan PLN-A-201 ind. C. Réutiliser ces histoires entre modules.
- Pages = client components (`"use client"`) ; graphiques = Recharts avec couleurs OKLCH en dur
  (mêmes valeurs que les tokens).

## Ajouter un module (checklist)

1. Types dans `src/types/index.ts` ; données mock dans `src/data/<fichier>.ts` + export dans `data/index.ts`.
2. Clés i18n dans `fr.ts` puis `en.ts` (section module + `nav.*` + `tips.*`).
3. État/actions dans `store.tsx` si interactif (+ `resetDemo`).
4. Page sous `src/app/(app)/<route>/page.tsx` avec le kit UI ; entrée dans `groups[]` de `Sidebar.tsx`.
5. `npm run build` + mise à jour du tableau modules du `README.md`.

## Pièges connus (machine & stack)

- **Disque quasi plein (~99 %)** : `npm install` peut échouer en ENOSPC et **corrompre node_modules**
  (symptôme : `Bus error` au build). Remède : `rm -rf ~/.npm/_cacache node_modules && npm install`.
- Réseau : npm OK, Google Fonts bloqué → rester sur @fontsource.
- lucide-react 0.545 : certains noms n'existent pas (ex. `CircleEuro` → utiliser `Euro`).
  En cas de doute, vérifier l'export avant d'importer.
- Chemins avec groupe de route : penser à quoter `"src/app/(app)/..."` dans le shell (parenthèses).
- `fr.ts` sans `as const` : ne pas le remettre, sinon `en: Dict` ne compile plus.
- Recharts : importer `Tooltip as ChartTooltip` (collision avec le Tooltip du kit).
