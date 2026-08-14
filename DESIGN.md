# DESIGN.md — Buildnivo

Direction alignée sur la maquette de référence (`reference.png`) : **sidebar bleu vif
« drenched »** portant l'identité Buildnivo, contenu clair « papier » pour la lecture en
plein jour (bungalow de chantier, tablette au soleil), cartes blanches nettes, couleurs de
signalétique chantier réservées aux états. Registre **product** : familiarité gagnée,
densité maîtrisée.

## Scène physique (choix du thème)

Un conducteur de travaux consulte présences et alertes sur laptop dans le bungalow de
chantier à 10h, lumière tropicale forte ; le chef de chantier utilise la même interface
sur tablette en extérieur. → thème clair, contrastes élevés ; la sidebar bleue reste le
seul aplat saturé (stratégie Committed portée par la navigation).

## Couleurs (OKLCH)

| Rôle | Token | Valeur |
|---|---|---|
| Fond contenu | `--color-paper` | `oklch(0.975 0.004 255)` |
| Carte | `--color-card` | `oklch(0.995 0.002 255)` |
| Encre (texte) | `--color-ink` | `oklch(0.25 0.02 260)` |
| Texte secondaire | `--color-ink-soft` | `oklch(0.50 0.02 258)` |
| Filets / bordures | `--color-line` | `oklch(0.915 0.008 255)` |
| **Bleu Buildnivo** (sidebar, actions, sélection) | `--color-blue` | `oklch(0.51 0.20 264)` |
| Bleu profond (hover/actif, dégradé sidebar) | `--color-blue-deep` | `oklch(0.43 0.19 264)` |
| Bleu pâle (fonds sélection, chips) | `--color-blue-soft` | `oklch(0.945 0.028 262)` |
| Alerte / anomalie (ambre signalétique) | `--color-safety` | `oklch(0.70 0.16 55)` |
| Fond ambre | `--color-safety-soft` | `oklch(0.965 0.030 70)` |
| Validé / présent | `--color-ok` | `oklch(0.58 0.13 152)` |
| Fond vert | `--color-ok-soft` | `oklch(0.962 0.032 152)` |
| Incident / critique | `--color-danger` | `oklch(0.55 0.19 27)` |
| Fond rouge | `--color-danger-soft` | `oklch(0.960 0.026 27)` |
| Violet data-viz (répartitions) | `--color-viz` | `oklch(0.55 0.18 295)` |

Règles : ambre/vert/rouge jamais décoratifs, uniquement porteurs d'état (présence,
anomalie, retard, validation, criticité). Pas de `#000`/`#fff` purs hors sidebar (texte
blanc cassé `oklch(0.985 0.005 262)`).

## Typographie

- **Archivo** (variable) : unique famille UI — labels, corps, titres (600/700).
- **JetBrains Mono** : données terrain uniquement — heures pointées, matricules, montants,
  versions de plans, compteurs KPI. La donnée se reconnaît au premier regard.
- Échelle rem fixe : 12 / 13 / 14 (base) / 16 / 20 / 24 / 30. KPI : 30 mono 600.

## Layout (fidèle à la référence)

- Sidebar 248px bleu vif, logo BuildNivo, groupes :
  PILOTAGE (Vue d'ensemble, Chantiers) / TERRAIN (Pointage, Tâches, Journal, Photos &
  problèmes) / GESTION (Réserves, Achats & livraisons, Finances, Documents) /
  INTELLIGENCE (Rapports IA, Copilote) / COMMUNICATION (Messages avec badge de non-lus,
  Support & aide) / ENTREPRISE (Équipes, Paramètres).
  Item actif : pastille blanche, texte bleu. Réduction possible.
- Topbar blanche : chantier actif (sélecteur global), recherche, mode découverte,
  langue FR/EN, notifications, persona.
- Cartes blanches radius 14px, bordure `--color-line`, ombre `0 1px 2px oklch(0 0 0/0.05)`.
- KPI conformes à la référence : chip icône teintée, label, grande valeur mono, barre de
  progression.

## Logo

Marque relevée au pixel sur `reference.png`, portée par `LogoMark` (`components/ui.tsx`) :
trois barres à côtés verticaux, bords haut et bas obliques (5 unités de montée pour 10 de
large, soit −26,6°), base commune, toutes pleines en `currentColor`. Rythme court / haute /
moyenne — **la plus haute au centre**. viewBox `0 0 34 38`, largeur 10, écart 2, hauteurs
21 / 33 / 25. Pas d'opacités dégradées, pas d'angles arrondis.

Mot-symbole : **BuildNivo** (N majuscule), Archivo bold `tracking-tight`. Hauteur de marque
≈ 1,65 × la taille du mot (h-7 pour text-lg, h-7 pour le 17px de la sidebar).

## Signature

**Le Copilote qui crée des actions** : la dictée terrain simulée se transforme en objets
structurés (anomalie, tâche, demande d'achat, risque planning, entrée de journal) avec
validation humaine (CDC §6.1). Rappelée par les alertes IA du tableau de bord et le
« mode découverte » (tooltips commerciaux sur chaque module).

## Motion

**Dans l'application** : 150–220 ms, ease-out exponentiel. Changements d'état uniquement.
`prefers-reduced-motion` respecté. Pas de séquence de chargement orchestrée.

**Sur la vitrine** (`/` et rubriques), le registre change : le mouvement y explique le
produit. Il reste tenu par trois règles.

1. *Une animation = une idée.* Les outils qui convergent disent la tagline ; les nœuds qui
   apparaissent disent l'effet réseau ; le volet qui coulisse dit la barrière de
   confidentialité. Rien ne bouge pour décorer.
2. *Les révélations passent par des transitions*, jamais par des animations : quand
   `prefers-reduced-motion` écrase les durées, l'état final est quand même atteint (une
   animation `both` cachée resterait invisible sur certains moteurs).
3. *Une seule séquence orchestrée par page* : le hero. Le reste se déclenche à l'entrée
   dans le viewport (`useInView`), avec des cascades de 40–120 ms.

Boîte à outils : `components/site/motion.tsx` (`Reveal`, `Stagger`, `CountUp`, `Marquee`,
`useInView`, `useScrollProgress`, `useTypewriter`, `useReducedMotion`) et les keyframes
`tool-drift`, `marquee`, `draw-stroke`, `dash-flow`, `node-ring`, `pop-in`, `sheen`,
`wave-bar`, `soft-glow`, `scroll-hint` dans `globals.css`.

## Vitrine : direction visuelle

Même palette, même typographie, même kit — le site public ne doit pas ressembler à un autre
produit que l'application.

- **Alternance bleu/papier** : chaque page ouvre sur un aplat `site-drench` (trame blanche
  + halos radiaux sur le bleu de marque, prolongement du panneau de connexion), puis
  alterne sections `paper` et `card`. Les moments forts (IA, appel à l'action, pied de
  page) reviennent au bleu drenché.
- **Repère de niveau** (`LevelMark` + `Eyebrow`) : un filet et un triangle, comme la cote
  d'altitude d'un plan d'architecte — et les sections de l'accueil sont numérotées
  `N+00 … N+11`. La marque est elle-même faite de trois barres montantes, et l'offre
  s'empile en trois niveaux : le vocabulaire est cohérent de bout en bout.
- **Signature** : le mur d'outils du hero qui se rassemble en une plateforme unique.
  C'est le seul endroit où l'on dépense de l'effet ; tout le reste est discipliné.
- **Données en mono** : prix, délais, indices, compteurs, cotes de niveau — même règle que
  dans l'application.

## Composants

Kit unique : Button (primary/ghost/danger/soft, états complets), StatusPill, Badge, KpiCard,
Tooltip, DemoTip (mode découverte), ProgressBar, Tabs, Avatar initiales, Modal standard,
EmptyState pédagogique, PhotoTile (photo chantier simulée en SVG annoté). Vocabulaire
constant d'écran en écran.
