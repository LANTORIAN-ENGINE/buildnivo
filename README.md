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

## Ce que couvre la démo (noyau opérationnel du CDC)

| Module | Contenu |
|---|---|
| **Connexion par persona** | 5 profils métier (direction, conducteur, chef de chantier, ouvrier, sous-traitant) — l'interface s'adapte au rôle |
| **Vue d'ensemble** | KPI (budget, avancement, retard, effectif), courbe planifié/réalisé, alertes IA prioritaires, présence par corps d'état, échéances, répartition budgétaire |
| **Pointage** | Simulateur NFC / QR dynamique / GPS, présents en temps réel, feuille de pointage, anomalies (retard, oubli, double chantier, hors zone), liste d'évacuation imprimable, export paie |
| **Tâches** | Kanban + liste, localisation bâtiment/zone/lot, affectation entreprise ou salarié, priorités, circuit de validation, tâches créées par l'IA |
| **Journal de chantier** | Timeline auto-composée (présences, tâches, livraisons, incidents, météo, photos) + dictée vocale simulée |
| **Photos & problèmes** | Galerie filtrable ; chaque photo devient problème, tâche ou réserve avec entreprise responsable et échéance |
| **Réserves** | Suivi des levées par entreprise, relances IA |
| **Achats & livraisons** | Commandes, retards, confirmations de réception, rapprochement planning |
| **Finances** | Budget / engagé / facturé / payé par lot, détection de dépassement |
| **Documents** | Plans, CCTP, contrats avec historique d'indices, classement automatique IA, recherche |
| **Rapports IA** | Rapport journalier, synthèse hebdo, relances préparées par l'IA avec validation humaine |
| **Copilote IA** | Q&A documentaire scriptée **citant ses sources** + dictée terrain transformée en actions structurées (CDC §6.1) |
| **Messages** | Messagerie type Messenger rattachée aux chantiers : conversations directes + canaux de chantier, présence en ligne, photos/documents/vocaux, accusés de lecture, indicateur de saisie, réponses simulées, « créer une tâche depuis un message » |
| **Support & aide** | FAQ recherchable, contact (téléphone/WhatsApp/email, fuseau Réunion), statut du service, tickets suivis avec création inline |
| **Équipes & sociétés** | Salariés, sous-traitants, fournisseurs, matrice rôles & permissions, documents administratifs surveillés |
| **Paramètres** | Langue FR/EN, mode découverte, réinitialisation de la démo |

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
  app/              # routes (login + groupe (app) avec les 14 écrans)
  components/
    ui.tsx          # kit UI (Button, StatusPill, DemoTip, Modal, PhotoScene…)
    shell/          # Sidebar bleue + Topbar (chantier actif, langue, persona)
  data/             # données mock ancrées à La Réunion (marché pilote du CDC)
  lib/
    i18n/           # dictionnaires fr/en typés + provider
    store.tsx       # état de démo en mémoire (pointages, tâches, alertes…)
  types/            # modèle de domaine BTP
```
