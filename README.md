# Buildnivo — Démo commerciale

Plateforme SaaS de pilotage intelligente pour la construction (BTP), issue du cahier des
charges « Développement d'une plateforme SaaS intelligente pour la construction » (PDF dans
ce dépôt). Cette application est une **démo 100 % frontend** : toutes les données sont
factices (mock), aucun backend ni base de données — idéale pour les rendez-vous commerciaux.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
# ou en production
npm run build && npm start
```

## Vitrine commerciale (avant connexion)

Le site public occupe `/` ; la démo applicative démarre sur `/connexion` (choix du persona).
Contenu issu du **document de référence produit** (`documentation/BuildNivo_Document_Reference_Produit.pdf`,
Blue Valoris FZCO v2.0), entièrement bilingue FR/EN.

| Page | Contenu |
|---|---|
| **`/` Accueil** | Hero « les outils du chantier se rassemblent », coût de la dispersion, vision et marché, les 18 modules, empilement Project/Company/Studios, effet réseau et essai 30 jours, dictée IA, cloisonnement par rôle, Supply, comparatif, tarifs, mises en situation, FAQ |
| **`/produit`** | Les deux produits, frontière Project ↔ Company cas par cas, mécanique d'acquisition, essai 30 jours, trois états d'une entreprise, continuité de service en cas d'impayé (J0 / J15), noyau MVP et principes techniques |
| **`/studios`** | Les quatre Studios métier (Promoteur, Architecte, Maîtrise d'œuvre, Entreprise Travaux) et leur dépendance à Company |
| **`/tarifs`** | Project 790 €, Company Essential 99 € / Business 299 €, Studios 99 €, opération supplémentaire, socle gratuit permanent détaillé |
| **`/ia`** | Dictée terrain → actions structurées, six capacités, gouvernance (périmètre, validation humaine, sources, audit), architecture |
| **`/securite`** | Explorateur interactif des trois barrières (nominative, commerciale, documentaire), tableaux complets par rôle, bris de glace tracé, alertes incident manuelles |
| **`/supply`** | Du quantitatif à la demande de prix, scénarios d'approvisionnement comparés, rôle de BlueFulfill, neutralité de la plateforme |
| **`/comparatif`** | Procore, Autodesk, CMiC, solutions françaises, outils terrain — matrice de couverture, angle mort, leviers de différenciation |
| **`/contact`** | Demande de démonstration (formulaire simulé), canaux, déroulé de l'accompagnement |

Animations : convergence des outils au chargement, révélations au défilement, compteurs,
bandeau défilant, croissance du réseau d'entreprises invitées, curseur temporel de l'essai
Company, dictée transcrite en direct, volets des barrières RBAC, flux Supply auto-joué.
`prefers-reduced-motion` est respecté partout (les états finaux restent atteints).

## Ce que couvre la démo (noyau opérationnel du CDC)

| Module | Contenu |
|---|---|
| **Connexion par persona** | 11 profils : 5 côté entreprise (direction, conducteur, chef de chantier, ouvrier, sous-traitant) et 6 intervenants de l'opération (maître d'ouvrage, maître d'œuvre d'exécution, architecte, bureau d'études, contrôleur technique, coordonnateur SPS) — navigation, indicateurs et droits s'adaptent au rôle |
| **Vue d'ensemble** | Indicateurs et rubriques choisis selon le profil (budget/avancement/retard/effectif, visas en attente, avis en cours, conformité, prochaine réunion, marchés facturés…), courbe planifié/réalisé, alertes IA prioritaires, présence par corps d'état, échéances, répartition budgétaire |
| **Pointage** | Simulateur NFC / QR dynamique / GPS, présents en temps réel, feuille de pointage, anomalies (retard, oubli, double chantier, hors zone), liste d'évacuation imprimable, export paie |
| **Tâches** | Kanban + liste, localisation bâtiment/zone/lot, affectation entreprise ou salarié, priorités, circuit de validation, tâches créées par l'IA |
| **Journal de chantier** | Timeline auto-composée (présences, tâches, livraisons, incidents, météo, photos) + dictée vocale simulée |
| **Photos & problèmes** | Galerie filtrable ; chaque photo devient problème, tâche ou réserve avec entreprise responsable et échéance |
| **Visas & plans d'exécution** | Dépôt des plans par les bureaux d'études, avis du maître d'œuvre d'exécution (favorable / avec observations / défavorable), contre-visa du contrôleur technique, travaux conditionnés par un visa |
| **Réunions & comptes rendus** | Convocation, présences, CR hebdomadaire composé automatiquement, avis des intervenants intégrés — le maître d'ouvrage peut retirer du CR les avis non réglementaires (jamais les réglementaires) |
| **Reprise de chantier** | Onboarding assisté par l'IA d'une opération déjà démarrée : dépôt des plans, CR, marchés et situations, reconstruction de l'avancement, de la facturation et du reste à faire |
| **Réserves** | Suivi des levées par entreprise, relances IA |
| **Achats & livraisons** | Commandes, retards, confirmations de réception, rapprochement planning |
| **Finances** | Budget / engagé / facturé / payé par lot, détection de dépassement |
| **Documents** | Plans, CCTP, contrats avec historique d'indices, classement automatique IA, recherche |
| **Rapports IA** | Rapport journalier, synthèse hebdo (visas et avis inclus), relances préparées par l'IA, génération de CCTP / estimatifs / contrats / ordres de service à partir des plans — validation humaine obligatoire |
| **Copilote IA** | Q&A documentaire scriptée **citant ses sources** + dictée terrain transformée en actions structurées (CDC §6.1) |
| **Messages** | Messagerie type Messenger rattachée aux chantiers : conversations directes + canaux de chantier, présence en ligne, photos/documents/vocaux, accusés de lecture, indicateur de saisie, réponses simulées, « créer une tâche depuis un message » |
| **Support & aide** | FAQ recherchable, contact (téléphone/WhatsApp/email, fuseau Réunion), statut du service, tickets suivis avec création inline |
| **Équipes & sociétés** | Salariés, sous-traitants, fournisseurs, intervenants de l'opération (mission et périmètre), matrice rôles & permissions sur 11 profils, documents administratifs surveillés |
| **Paramètres** | Langue FR/EN, mode découverte, paliers de fonctionnalités (Terrain / Pilotage / Coordination / offre promoteur), réinitialisation de la démo |

## Fonctions transverses

- **i18n FR/EN** complète (bascule dans la topbar, persistée) ; les données métier restent en français (réalisme terrain).
- **Mode découverte** : repères « Découverte » sur chaque module expliquant la valeur commerciale de la fonctionnalité — activable depuis la topbar ou les paramètres.
- **État de démo interactif** : pointer, valider une tâche, lever une réserve, envoyer une relance… tout réagit en mémoire (réinitialisable dans Paramètres).
- **Fonctions complexes simulées** de façon crédible : NFC/QR/géoloc, transcription vocale, RAG documentaire, classement IA (conformément à la demande : pas de biométrie, mock de démonstration).
- Photos de chantier générées en SVG : la démo fonctionne entièrement hors ligne.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 (tokens OKLCH dans
`globals.css`) · Recharts · lucide-react · polices auto-hébergées (@fontsource : Archivo
Variable + JetBrains Mono Variable).

Design system documenté dans `DESIGN.md`, contexte produit dans `PRODUCT.md`.
Direction visuelle alignée sur `reference.png` : sidebar bleu Buildnivo, contenu clair
« papier », couleurs de signalétique chantier réservées aux états.

## Structure

```
src/
  app/
    (site)/         # vitrine publique : accueil + 8 rubriques (en-tête/pied de page communs)
    connexion/      # choix du persona (entrée de la démo)
    (app)/          # les écrans applicatifs
  components/
    ui.tsx          # kit UI (Button, StatusPill, DemoTip, Modal, PhotoScene…)
    site/           # shell vitrine, kit de sections, boîte à outils motion, figures animées
    shell/          # Sidebar bleue + Topbar (chantier actif, langue, persona)
  data/             # données mock ancrées à La Réunion (marché pilote du CDC)
  lib/
    i18n/           # dictionnaires fr/en typés + provider
    store.tsx       # état de démo en mémoire (pointages, tâches, alertes…)
  types/            # modèle de domaine BTP
```
