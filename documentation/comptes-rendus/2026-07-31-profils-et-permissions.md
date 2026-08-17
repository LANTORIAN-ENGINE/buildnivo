# Compte rendu — Profils, rôles et permissions

> Implémentation issue de la réunion du **31 juillet 2026** (notes Gemini).
> Portée : ajout de six profils d'intervenants externes, matrice de permissions
> effective, indicateurs par profil, et les trois modules qui portent leur travail.
> Tout reste en données de démonstration, sans backend.

**Sommaire**

1. [Contexte et demandes de la réunion](#1-contexte-et-demandes-de-la-réunion)
2. [Les onze profils](#2-les-onze-profils)
3. [Fiches détaillées par profil](#3-fiches-détaillées-par-profil)
4. [Matrice complète des permissions](#4-matrice-complète-des-permissions)
5. [Catalogue des indicateurs](#5-catalogue-des-indicateurs)
6. [Rubriques de la vue d'ensemble par profil](#6-rubriques-de-la-vue-densemble-par-profil)
7. [Modules créés pour ces profils](#7-modules-créés-pour-ces-profils)
8. [Données de démonstration ajoutées](#8-données-de-démonstration-ajoutées)
9. [Implémentation technique](#9-implémentation-technique)
10. [Ce qui n'est pas implémenté](#10-ce-qui-nest-pas-implémenté)

---

## 1. Contexte et demandes de la réunion

Cinq demandes explicites ont été formulées, toutes traitées :

| # | Demande | Traitement |
|---|---|---|
| 1 | Ajouter le **maître d'œuvre d'exécution** : piloter, vérifier les conformités, viser les plans, organiser les réunions, produire un CR hebdomadaire, centraliser la communication | Profil `moex` + modules Visas et Réunions |
| 2 | Ajouter les **bureaux d'études** (VRD, fluides, électricité, gros œuvre, charpente/couverture) : déposer les plans d'exécution, consulter les avis, fournir les notes de calcul | Profil `bet` avec cinq disciplines, dépôt et suivi des visas restreints à leur société |
| 3 | Ajouter **contrôleur technique et contrôleur de sécurité** : vérifier les plans visés, émettre des avis, déposer des comptes rendus, demander des documents, **sans accès complet aux données internes** | Profils `controleur` et `csps`, contre-visa, avis, demande de pièces, périmètre fermé sur achats/finances/paie |
| 4 | Ouvrir un accès **architecte** (esquisses, avis) et **automatiser le compte rendu** en y intégrant avis et mises en garde, le maître d'ouvrage pouvant **masquer certains avis non réglementaires** | Profils `architecte` et `moa`, CR auto-composé, masquage réservé au MOA et interdit sur les avis réglementaires |
| 5 | Gérer les **rôles et permissions de manière spécifique pour chaque profil** | Matrice 19 modules × 11 rôles qui pilote réellement la navigation et les indicateurs |

Deux demandes annexes, également traitées : la génération assistée de CCTP,
documents contractuels et estimatifs à partir des plans (module Rapports), et
l'intégration d'un chantier déjà démarré à partir des documents fournis (module
Reprise de chantier).

---

## 2. Les onze profils

### Entreprise de travaux (5, existants)

| Clé | Rôle | Persona de démo | Société |
|---|---|---|---|
| `direction` | Direction | Nathalie Rivière | Bâtir Océan Indien |
| `conducteur` | Conducteur de travaux | Marc Dorseuil | Bâtir Océan Indien |
| `chef` | Chef de chantier | Sofia Bègue | Bâtir Océan Indien |
| `ouvrier` | Salarié / Ouvrier | Jimmy Hoarau | Bâtir Océan Indien |
| `soustraitant` | Sous-traitant | Éric Payet | Charpentes Payet |

### Intervenants de l'opération (6, nouveaux)

| Clé | Rôle | Persona de démo | Société | Matricule |
|---|---|---|---|---|
| `moa` | Maître d'ouvrage | Hélène Vitry | Foncière Bourbon Promotion | EXT-9001 |
| `moex` | Maître d'œuvre d'exécution | Cédric Hoareau | Cap Sud Maîtrise d'Œuvre | EXT-9002 |
| `architecte` | Architecte | Léa Fontaine | Atelier Archipel | EXT-9003 |
| `bet` | Bureau d'études | Rémi Lauret | Ohm Ingénierie (électricité) | EXT-9004 |
| `controleur` | Contrôleur technique | Jean-Marc Perrin | Veritas Océan Indien | EXT-9009 |
| `csps` | Coordonnateur SPS | Karine Payet | Prévencia SPS | EXT-9010 |

### Les cinq bureaux d'études

Chaque discipline demandée en réunion a sa société et son contact ; seul Ohm
Ingénierie est proposé comme persona de connexion, les autres apparaissent
comme émetteurs de dépôts et participants aux réunions.

| Discipline | Société | Contact | Matricule |
|---|---|---|---|
| Structure / gros œuvre | BET Structura | Pascal Nativel | EXT-9006 |
| Fluides | BET Fluides OI | Sandrine Hoarau | EXT-9005 |
| Électricité | Ohm Ingénierie | Rémi Lauret | EXT-9004 |
| VRD | Géo VRD Austral | Manuel Sinama | EXT-9007 |
| Charpente & couverture | Trame Bois Ingénierie | Olivier Bénard | EXT-9008 |

> **Continuité voulue** : BET Structura, BET Fluides OI et Atelier Archipel
> étaient déjà cités comme auteurs de documents dans la démo d'origine. Ils
> deviennent des intervenants connectés plutôt que de simples noms sur un PDF.

### Où les profils apparaissent dans l'interface

- **Écran de connexion** : deux blocs séparés, « Entreprise de travaux » et
  « Intervenants de l'opération », ce dernier introduit par une phrase sur le
  périmètre limité. Chaque carte porte le nom, le rôle, la société et une phrase
  d'accroche métier.
- **Sélecteur de profil (barre du haut)** : même séparation en deux groupes, liste
  défilante.
- **Équipes & sociétés** : onglet « Intervenants de l'opération » avec la mission
  contractuelle de chacun, sa discipline, son contact et la mention « accès invité
  inclus ».

---

## 3. Fiches détaillées par profil

Chaque fiche indique : la mission, les quatre indicateurs affichés à l'ouverture,
les rubriques de la vue d'ensemble, les modules accessibles, ce qui reste fermé,
et les données de démonstration rattachées.

### 3.1 Direction — `direction`

- **Mission** : piloter l'entreprise, arbitrer sur les coûts et les risques.
- **Indicateurs** : budget consommé · avancement global · retard prévisionnel · équipe du jour.
- **Rubriques** : courbe planifié/réalisé, alertes prioritaires, présence par corps d'état, échéances, répartition budgétaire.
- **Accès complet** : vue d'ensemble, chantiers, pointage, tâches, photos, achats, finances, documents, reprise, rapports, copilote, messages, équipes, paramètres.
- **Lecture seule** : journal, visas, réunions, réserves.

### 3.2 Conducteur de travaux — `conducteur`

- **Mission** : piloter le chantier au quotidien côté entreprise.
- **Indicateurs** : identiques à la direction.
- **Rubriques** : identiques à la direction.
- **Spécificités** : écriture sur les visas et les réunions (il peut préparer et diffuser un CR), écriture sur les finances, accès complet au journal, aux photos et aux réserves.
- **Rôle dans la démo** : profil par défaut au démarrage, utilisé pour la démonstration principale (48 logements, 5,55 M€ / 7,4 M€, 68 % pour 75 % planifié, 12 jours de retard, 42 présents sur 48).

### 3.3 Chef de chantier — `chef`

- **Mission** : conduire les équipes sur site, saisir la réalité du terrain.
- **Indicateurs** : équipe du jour · avancement · mes tâches en cours · retard.
  L'ordre est inversé volontairement : le terrain regarde d'abord l'effectif.
- **Rubriques** : courbe, alertes, présence, échéances. Pas de répartition budgétaire.
- **Actions rapides** : boutons directs vers le pointage, la dictée du journal et l'ajout de photo, affichés en haut de la vue d'ensemble.
- **Fermé** : finances, visas, reprise de chantier.

### 3.4 Salarié / ouvrier — `ouvrier`

- **Mission** : pointer, exécuter, remonter l'information par photo.
- **Indicateurs** : mes heures cette semaine · mes tâches en cours · équipe du jour (trois seulement).
- **Rubriques** : échéances et présence uniquement.
- **Accès** : pointage (son périmètre), tâches en lecture, photos en écriture, documents en lecture, messages, support, paramètres.
- **Fermé** : budget, finances, achats, visas, réunions, rapports, copilote, équipes.

### 3.5 Sous-traitant — `soustraitant`

- **Mission** : exécuter ses lots, répondre aux réserves.
- **Indicateurs** : mes tâches · réserves ouvertes · avancement · retard.
- **Rubriques** : courbe, échéances, avis des intervenants.
- **Accès « son périmètre »** : chantiers, pointage, tâches, photos, réserves, documents — filtrés sur ses lots.
- **Argument commercial** : accès gratuit. Plus il y a d'entreprises connectées, plus la donnée d'avancement est fiable.

### 3.6 Maître d'ouvrage — `moa`

- **Mission** : porter l'opération, arbitrer, valider ce qui est diffusé officiellement.
- **Indicateurs** : avancement · marchés facturés (montant et pourcentage) · retard · avis en cours avec la part d'avis réglementaires.
- **Rubriques** : courbe, alertes, avis des intervenants, réunion de chantier, répartition budgétaire.
- **Pouvoir spécifique** : **retirer du compte rendu diffusé un avis non réglementaire**. Interface : bouton « Masquer du CR » sur les avis d'observation ; les avis réglementaires portent une pastille verrouillée « Avis réglementaire : non masquable ». Un avis masqué reste tracé, visible par son auteur, et grisé dans la liste.
- **Accès complet** : réunions et comptes rendus.
- **Fermé** : achats, pointage, tâches, finances détaillées de l'entreprise (lecture seule des situations), équipes en lecture.

### 3.7 Maître d'œuvre d'exécution — `moex`

Profil pivot de toute l'organisation décrite en réunion.

- **Mission** : piloter le chantier, vérifier les conformités, viser les plans d'exécution, animer les réunions, produire le CR hebdomadaire, centraliser la communication pour éviter la déperdition par courriel.
- **Indicateurs** : visas en attente (avec signalement d'échéance dépassée) · avis en cours · avancement · retard.
- **Rubriques** : courbe, alertes, **plans en attente de visa**, avis des intervenants, réunion de chantier, échéances.
- **Accès complet** : vue d'ensemble, chantiers, journal, photos, visas, réunions, réserves, documents, reprise, rapports, copilote, messages.
- **Écriture** : tâches.
- **Lecture** : pointage, finances (validation des situations), équipes.
- **Fermé** : achats de l'entreprise de travaux.

### 3.8 Architecte — `architecte`

- **Mission** : déposer esquisses et pièces de conception, émettre des avis sur la mise en œuvre et le respect du projet.
- **Indicateurs** : mes plans déposés (avec taux d'avis favorables au premier dépôt) · observations à lever · avancement · prochaine réunion (compte à rebours).
- **Rubriques** : courbe, visas, avis, réunion.
- **Écriture** : visas (dépôt d'esquisses), réunions, documents.
- **Lecture** : chantiers, journal, photos, réserves, copilote.
- **Fermé** : pointage, tâches, achats, finances, rapports, équipes, reprise.
- **Données de démo** : esquisse modificative du hall d'entrée Bât. A (favorable avec observation : incidence de 18 400 € à valider par le MOA) ; avis sur la teinte d'enduit hors palette ; suggestion d'implantation des luminaires (avis d'observation, déjà masqué du CR pour illustrer l'état).

### 3.9 Bureau d'études — `bet`

- **Mission** : études, dépôt des plans d'exécution et notes de calcul de sa spécialité, lecture des avis, levée des observations.
- **Indicateurs** : mes plans déposés · délai moyen de visa · observations à lever · prochaine réunion.
- **Rubriques** : visas, avis, réunion, courbe (les visas passent devant la courbe).
- **Accès « son périmètre »** : visas (seulement ses dépôts), chantiers, documents, copilote, vue d'ensemble.
- **Restriction visible** : un bandeau « Votre profil ne voit que les dépôts de votre société et les avis qui vous concernent » s'affiche en haut du module Visas.
- **Fermé** : pointage, tâches, journal, photos, réserves, achats, finances, rapports, équipes, reprise.

### 3.10 Contrôleur technique — `controleur`

- **Mission** : vérifier les plans déjà visés par la maîtrise d'œuvre, s'assurer du bon déroulement des travaux, émettre des avis, déposer des rapports de visite, demander des pièces.
- **Indicateurs** : conformité des visas (pourcentage d'avis favorables) · avis en cours · plans en attente · avis sécurité.
- **Rubriques** : visas, avis, réunion, courbe.
- **Écriture** : visas (contre-visa favorable ou avec réserve), réunions.
- **Lecture** : vue d'ensemble, chantiers, journal, photos, réserves, copilote.
- **Fermé** : pointage, tâches, achats, finances, rapports, équipes, reprise — conformément au « accès limité sans accès complet aux données internes du projet ».
- **Action dédiée** : bouton « Demander un document », qui envoie la demande à la maîtrise d'œuvre.
- **Données de démo** : avis suspensif sur la trémie ascenseur R+2 (rapport RAP-VT-2026-118) ; demande des PV d'essais béton à 7 jours ; contre-visas rendus sur la dalle R+2 et les fluides.

### 3.11 Coordonnateur SPS — `csps`

- **Mission** : veiller au déroulement sécuritaire des travaux, tenir le PPSPS à jour, émettre des observations.
- **Indicateurs** : avis sécurité ouverts · avis en cours · équipe du jour · avancement.
  L'effectif figure ici parce que la co-activité crée le risque.
- **Rubriques** : avis, présence par corps d'état, réunion, courbe.
- **Écriture** : photos, documents, réunions.
- **Lecture** : pointage (effectifs présents), journal, copilote.
- **Fermé** : tâches, visas, réserves, achats, finances, rapports, équipes, reprise.
- **Données de démo** : mise à jour du PPSPS exigée avant lundi du fait de la co-activité sur la grue n°1 ; observation sur le stockage de palettes devant une issue de secours.

---

## 4. Matrice complète des permissions

### Niveaux d'accès

| Niveau | Signification |
|---|---|
| **Complet** | Lecture, écriture et validation sur l'ensemble du module |
| **Écriture** | Contribution possible, sans droit de validation global |
| **Lecture** | Consultation seule |
| **Son périmètre** | Restreint à ses lots, ses dépôts ou ses propres données |
| **—** | Module absent du menu de navigation |

### Matrice 19 modules × 11 rôles

Abréviations : **C** complet · **É** écriture · **L** lecture · **P** son périmètre · **—** aucun accès.

| Module | Direction | Conduc. | Chef | Salarié | Sous-trait. | MOA | MOE exé | Archi. | BET | Contrôle | SPS |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Vue d'ensemble | C | C | L | P | P | L | C | L | P | L | L |
| Chantiers | C | C | L | — | P | L | C | L | P | L | L |
| Pointage | C | C | É | P | P | — | L | — | — | — | L |
| Tâches | C | C | É | L | P | — | É | — | — | — | — |
| Journal de chantier | L | C | É | — | L | L | C | L | — | L | L |
| Photos & problèmes | L | C | É | É | P | L | C | L | — | L | É |
| **Visas & plans** | L | É | — | — | — | L | C | É | P | É | — |
| **Réunions & CR** | L | É | L | — | L | C | C | É | L | É | É |
| Réserves | L | C | É | — | P | L | C | L | — | L | — |
| Achats & livraisons | C | C | L | — | — | — | — | — | — | — | — |
| Finances | C | É | — | — | — | L | L | — | — | — | — |
| Documents | C | C | L | L | P | L | C | É | P | L | É |
| **Reprise de chantier** | C | É | — | — | — | L | C | — | — | — | — |
| Rapports IA | C | C | L | — | — | L | C | — | — | — | — |
| Copilote IA | C | C | É | — | — | L | C | L | P | L | L |
| Messages | C | C | C | É | É | É | C | É | É | É | É |
| Support & aide | C | C | É | É | É | É | É | É | É | É | É |
| Équipes & sociétés | C | C | L | — | — | L | L | — | — | — | — |
| Paramètres | C | C | É | É | É | É | É | É | É | É | É |

### Lecture de la matrice

- **Aucun intervenant externe n'accède aux achats.** C'est la donnée commerciale la plus sensible de l'entreprise de travaux.
- **Les finances sont fermées** à tous les externes sauf le maître d'ouvrage et la maîtrise d'œuvre, en lecture seule, pour la validation des situations.
- **La messagerie et le support sont ouverts à tous** : c'est le point de la réunion sur la centralisation de la communication. Fermer la messagerie à un intervenant reviendrait à le renvoyer vers le courriel.
- **Le pointage est fermé aux externes**, sauf le coordonnateur SPS en lecture : les effectifs présents relèvent de sa mission.
- Cette matrice **pilote réellement l'application** : le menu latéral filtre ses groupes et ses entrées selon le rôle connecté, et les groupes vides disparaissent.

---

## 5. Catalogue des indicateurs

Seize indicateurs sont définis ; chaque profil en affiche trois ou quatre.

| Clé | Libellé | Source de la valeur | Profils concernés |
|---|---|---|---|
| `budget` | Budget consommé | Consommé / total du chantier actif | Direction, conducteur |
| `progress` | Avancement global | Avancement réalisé vs planifié | 8 profils sur 11 |
| `delay` | Retard prévisionnel | Jours vs planning initial | Direction, conducteur, chef, sous-traitant, MOA, MOE exé |
| `team` | Équipe aujourd'hui | Présents / prévus, pastille pulsée | Direction, conducteur, chef, salarié, SPS |
| `myHours` | Mes heures cette semaine | Cumul du salarié | Salarié |
| `myTasks` | Mes tâches en cours | Tâches non terminées de son périmètre | Chef, salarié, sous-traitant |
| `visasPending` | Visas en attente | Dépôts sans avis, avec alerte si échéance dépassée | MOE exé, contrôleur |
| `visaDelay` | Délai moyen de visa | Moyenne sur la semaine | BET |
| `myPlans` | Mes plans déposés | Dépôts de sa société + taux d'acceptation | Architecte, BET |
| `obsToLift` | Observations à lever | Dépôts « favorable avec observations » ou « défavorable » | Architecte, BET |
| `avisOpen` | Avis en cours | Avis du chantier + part de réglementaires | MOA, MOE exé, contrôleur, SPS |
| `conformity` | Conformité des visas | Part d'avis favorables sur les dépôts instruits | Contrôleur |
| `safetyAvis` | Avis sécurité ouverts | Avis émis par le contrôleur et le SPS | Contrôleur, SPS |
| `nextMeeting` | Prochaine réunion | Jours restants + date en clair | Architecte, BET |
| `openReserves` | Réserves ouvertes | Réserves non levées du chantier | Sous-traitant |
| `marketInvoiced` | Marchés facturés | Montant facturé / montant des marchés | MOA |

Le ton de chaque indicateur (bleu, vert, ambre, rouge, violet) s'ajuste à la
valeur : les visas en attente passent au rouge dès qu'une échéance est dépassée,
les observations à lever passent au vert quand la liste est vide.

Un bandeau « *rôle* · Vue adaptée à votre profil » s'affiche en haut de la vue
d'ensemble, accompagné d'un repère du mode découverte expliquant la logique.

---

## 6. Rubriques de la vue d'ensemble par profil

| Profil | Rubriques affichées, dans l'ordre |
|---|---|
| Direction | courbe · alertes · présence · échéances · budget |
| Conducteur | courbe · alertes · présence · échéances · budget |
| Chef de chantier | courbe · alertes · présence · échéances |
| Salarié | échéances · présence |
| Sous-traitant | courbe · échéances · avis |
| Maître d'ouvrage | courbe · alertes · avis · réunion · budget |
| Maître d'œuvre d'exécution | courbe · alertes · **visas** · avis · réunion · échéances |
| Architecte | courbe · visas · avis · réunion |
| Bureau d'études | **visas** · avis · réunion · courbe |
| Contrôleur technique | **visas** · avis · réunion · courbe |
| Coordonnateur SPS | **avis** · présence · réunion · courbe |

Trois rubriques sont nouvelles :

- **Plans en attente de visa** — liste des dépôts non instruits avec référence,
  intitulé, société émettrice, indice et échéance ; cadre rouge si l'échéance est
  dépassée.
- **Avis des intervenants** — les avis du chantier, avec priorité aux avis dont
  le profil connecté est l'auteur, chacun marqué réglementaire ou observation.
- **Réunion de chantier** — date de la prochaine réunion, nombre d'intervenants
  convoqués, et encart ambre lorsqu'un compte rendu est en attente de validation.

---

## 7. Modules créés pour ces profils

### 7.1 Visas & plans d'exécution — `/visas`

Circuit en quatre étapes, affiché en tête de module :

```
Dépôt bureau d'études → Visa maître d'œuvre d'exécution → Contrôle technique → Diffusion chantier
```

**Quatre indicateurs de module** : visas en attente · échéances dépassées · délai
moyen de visa · contre-visas rendus.

**Trois onglets** : « À viser », « Tous les dépôts », « Contrôle technique ».

**Actions par rôle**

| Rôle | Actions disponibles |
|---|---|
| MOE exé | Viser favorable (immédiat) · Favorable avec observations (motivation obligatoire) · Défavorable (motivation obligatoire) |
| Contrôleur technique | Contre-viser favorable · Contre-viser avec réserve · Demander un document |
| BET et architecte | Déposer un plan (intitulé, discipline, indice, note de calcul optionnelle) |
| Coordonnateur SPS | Demander un document |

**Règles appliquées**

- Un avis avec observations ou défavorable ne peut pas être enregistré sans texte : le bouton reste désactivé tant que la motivation est vide.
- Le contre-visa du contrôleur technique n'apparaît qu'après le visa de la maîtrise d'œuvre.
- Chaque dépôt peut porter une mention « Conditionne : … » (bandeau ambre) et une échéance de visa qui bascule en rouge une fois dépassée.
- Un bureau d'études ne voit que les dépôts de sa société.

**Les cinq dépôts de démonstration (Résidence SUNSET)**

| Référence | Objet | Discipline | Émetteur | Statut |
|---|---|---|---|---|
| EXE-ELE-204 | Courants forts R+2/R+3 Bât. A, ind. B | Électricité | Ohm Ingénierie | **En attente**, échéance demain, conditionne la fermeture des cloisons R+2 |
| EXE-CHA-042 | Charpente Bât. B, descente de charges, ind. A | Charpente | Trame Bois Ingénierie | **Défavorable** : surcharge cyclonique absente, fixations non cotées files 4 à 7, redépôt sous 5 jours, commande bloquée |
| EXE-FLU-118 | Colonnes EU/EV Bât. A, ind. C | Fluides | BET Fluides OI | Favorable avec 2 observations, contre-visa favorable |
| EXE-STR-090 | Coffrage + note de calcul dalle haute R+2, ind. D | Structure | BET Structura | Favorable, contre-visa favorable (EC2 + zone cyclonique) |
| EXE-VRD-011 | Profil en long réseaux EP, ind. B | VRD | Géo VRD Austral | En attente, échéance à J+4 |

Deux dépôts complémentaires : l'esquisse modificative du hall (EXE-ARC-007,
architecte) et les courants faibles VDI (EXE-ELE-198, favorable avec réserve du
contrôle technique). Un dépôt existe aussi sur le Collège Albany (EXE-STR-101).

### 7.2 Réunions & comptes rendus — `/reunions`

**Structure de l'écran** : colonne de gauche avec la prochaine réunion, son ordre
du jour proposé en quatre points et l'historique des réunions ; colonne de droite
avec le compte rendu sélectionné et les avis.

**Le compte rendu** est composé automatiquement à partir des pointages, tâches,
visas, avis, livraisons et photos de la semaine. Il comporte :

- la liste des intervenants convoqués avec leur statut (présent, excusé, absent) et leur société ;
- cinq sections rédigées : avancement des travaux, effectifs et entreprises, visas & plans d'exécution, sécurité, administratif et financier ;
- le relevé de décisions, chaque action portant un pilote et une échéance ;
- les avis des intervenants, chacun marqué réglementaire ou observation, avec sa gravité.

**Le masquage des avis** répond directement à la demande de la réunion :

| Nature de l'avis | Masquable | Comportement |
|---|---|---|
| Réglementaire (contrôleur technique, SPS, avis défavorable MOE) | Non | Pastille verrouillée « Avis réglementaire : non masquable » |
| Observation (architecte, remarques d'usage) | Oui, **par le maître d'ouvrage seul** | Bouton « Masquer du CR » ; l'avis passe en cadre pointillé grisé, reste tracé et visible par son auteur |

**Les quatre réunions de démonstration** : CR n°35 en brouillon sur SUNSET (avec
9 intervenants et 6 avis repris), CR n°34 déjà diffusé, réunion n°36 planifiée à
J+7, et CR n°8 diffusé sur le Collège Albany.

### 7.3 Reprise de chantier — `/reprise`

Réponse à la question « peut-on entrer sur une opération déjà avancée, et à
partir de quand est-ce rentable ? ».

**Déroulé** : dépôt des documents → analyse (animation de 2 secondes) → résultat
reconstruit → mise en service après contrôle humain.

**Cinq lots de documents fournis**, 864 pages au total : plans DCE et EXE (214 p.),
comptes rendus n°1 à 22 (176 p.), marchés et avenants sur 8 lots (340 p.),
situations et factures (128 p.), planning TCE (6 p.). Chaque lot indique ce que
l'analyse en a tiré.

**Cinq étapes** suivies visuellement : dépôt, lecture et classement, structuration
des lots et zones, reconstruction de l'avancement, contrôle humain et mise en
service — cette dernière restant volontairement « en cours » après l'analyse.

**Résultat reconstruit** : 54 % d'avancement, 49 % des marchés facturés, 9 mois de
durée de vie restante, un tableau de six lots (montant du marché, avancement,
pourcentage facturé), quatre familles de travaux restants.

**Points à confirmer** — l'argument de confiance : 3 avenants cités dans les
comptes rendus mais absents du dossier, aucun PV de réception de supports pour
l'étanchéité du bâtiment B, planning non mis à jour depuis 2 mois. L'outil signale
ce qu'il n'a pas trouvé au lieu de l'inventer.

Un encart rappelle l'usage commercial évoqué en réunion : repérer les chantiers
déjà démarrés à partir d'informations publiques et proposer cette reprise assistée.

### 7.4 Documents générés — onglet du module Rapports

Quatre brouillons produits à partir des plans et pièces du marché, chacun
indiquant les documents analysés et le temps de rédaction économisé :

| Document | Contenu | Temps gagné |
|---|---|---|
| CCTP Lot 09 — Cloisons/Doublages Bât. B | Consistance (1 240 m² relevés depuis le plan), prescriptions, tenue au feu, limites de prestation, contrôles | 6 h |
| Estimatif quantitatif Lot 09 | 5 lignes chiffrées avec quantités et montants, aléas 5 % | 4 h |
| Contrat de sous-traitance Lot 09 | Clauses du marché type, pièces contractuelles, points à compléter | 3 h |
| Ordre de service n°12 — reprise hall | Objet, incidence financière (18 400 €), incidence délai | 1 h |

Un total cumulé (14 h) est affiché en tête d'onglet. Chaque document porte le
statut « À relire » puis « Validé », et un avertissement rappelle que la relecture
de la maîtrise d'œuvre reste obligatoire.

### 7.5 Compléments dans les modules existants

- **Rapports — synthèse hebdo** : deux sections ajoutées, « Visas & plans d'exécution » (comptage en direct des dépôts en attente, refusés, avec observations) et « Avis des intervenants » (les trois derniers avis non masqués).
- **Documents** : quatre catégories ajoutées (plans d'exécution, notes de calcul, esquisses, avis & rapports de visite), avec leurs filtres et icônes.
- **Équipes** : onglet « Intervenants de l'opération » et matrice de permissions passée de 5 à 11 colonnes, regroupées en « Entreprise de travaux » et « Intervenants de l'opération », avec légende.
- **Copilote** : deux questions suggérées supplémentaires sur les visas et les avis réglementaires, avec réponses sourcées.
- **Paramètres** : section « Formules & modules » présentant les quatre paliers (Terrain, Pilotage, Coordination, Offre promoteur).
- **Messagerie** : canal « SUNSET · Maîtrise d'œuvre & bureaux d'études » (9 membres) et discussion directe avec la maîtrise d'œuvre.

---

## 8. Données de démonstration ajoutées

| Catégorie | Volume | Détail |
|---|---|---|
| Sociétés | +10 | 1 MOA, 1 MOE exé, 1 architecte, 5 BET, 2 organismes de contrôle |
| Contacts | +10 | Matricules EXT-9001 à EXT-9010, exclus des listes « salariés » |
| Personas de connexion | +6 | Un par rôle externe |
| Dépôts de plans | 8 | 7 sur SUNSET, 1 sur Albany |
| Avis d'intervenants | 8 | 5 réglementaires, 3 observations dont 1 déjà masquée |
| Réunions | 4 | 1 brouillon, 2 diffusées, 1 planifiée |
| Documents générés | 4 | CCTP, estimatif, contrat, ordre de service |
| Documents du chantier | +6 | 2 plans EXE, 1 note de calcul, 1 esquisse, 1 rapport de visite, 1 PPSPS |
| Alertes IA | +3 | Visa en attente bloquant, avis défavorable non levé, avis suspensif |
| Relances IA | +3 | Vers la MOE, vers le BET charpente, pour les pièces demandées par le contrôle |
| Réponses du copilote | +2 | État des visas, avis réglementaires ouverts |
| Conversations | +2 | Canal MOE/BET, discussion directe MOE exé |
| Reprise de chantier | 1 jeu complet | 5 lots de documents, 5 étapes, 6 lots reconstruits, 4 travaux restants, 3 manques |

### Cohérence narrative

Les nouvelles données prolongent les histoires déjà présentes pour qu'un même
récit tienne d'un écran à l'autre :

- la **grue n°2 en panne** justifie la co-activité sur la grue n°1, donc la demande de mise à jour du PPSPS par le coordonnateur SPS ;
- le **garde-corps de la trémie ascenseur** mentionné dans le rapport journalier devient l'avis suspensif du contrôleur technique ;
- les **cloisons R+2** sont conditionnées par le visa des courants forts en attente ;
- le **plan PLN-A-201 ind. C** reste la référence citée dans les observations sur les fluides ;
- l'**absence de PLOMB'ÉO** apparaît dans les présences du compte rendu n°35 ;
- la **situation n°8 en attente de validation MOE** relie les finances à la nouvelle discussion avec la maîtrise d'œuvre.

Toutes les dates restent relatives au jour de la démonstration.

---

## 9. Implémentation technique

### Fichiers créés

| Fichier | Rôle |
|---|---|
| `src/lib/permissions.ts` | Matrice rôles × modules, niveaux d'accès, indicateurs et rubriques par profil |
| `src/data/acteurs.ts` | Dépôts de plans, avis, réunions, documents générés, jeu de reprise de chantier |
| `src/app/(app)/visas/page.tsx` | Module Visas |
| `src/app/(app)/reunions/page.tsx` | Module Réunions & comptes rendus |
| `src/app/(app)/reprise/page.tsx` | Module Reprise de chantier |

### Types ajoutés (`src/types/index.ts`)

- `Role` étendu de 5 à 11 valeurs ; constante `internalRoles` pour distinguer l'interne de l'externe.
- `Discipline` : `vrd | fluides | electricite | structure | charpente`.
- `CompanyKind` étendu (`moa`, `moex`, `architecte`, `bet`, `controle`) ; `Company` gagne `discipline`, `role`, `missionKey`.
- `Persona` gagne `companyId` et `discipline` ; `Employee` gagne `discipline`.
- `VisaStatus`, `PlanSubmission`, `AvisNature`, `Avis`, `MeetingStatus`, `MeetingAttendee`, `SiteMeeting`, `DraftKind`, `AiDocDraft`, `RepriseFile`, `RepriseStep`, `RepriseResult`.
- `DocCategory` étendu (`planExe`, `noteCalcul`, `esquisse`, `avis`) ; `AlertKind` étendu (`visa`, `securite`) ; `ReminderKind` étendu (`visa`).

### État et actions (`src/lib/store.tsx`)

Quatre collections ajoutées — `submissions`, `avis`, `meetings`, `drafts` — et
sept actions, toutes intégrées à la réinitialisation de la démo :

`setVisa` · `setCtVisa` · `addSubmission` · `addAvis` · `toggleAvisHidden` ·
`diffuseMeeting` · `validateDraft`

### Internationalisation

Trois dictionnaires de modules créés (`visas`, `reunions`, `reprise`) et une
dizaine de sections enrichies, en français **et** en anglais : rôles, disciplines,
métiers, navigation, indicateurs, catégories de documents, permissions, missions,
formules et repères du mode découverte. Le typage impose la parité FR/EN.

### Navigation

Un groupe « Coordination » a été ajouté au menu (Visas, Réunions, Reprise). Le
menu filtre désormais ses entrées selon le rôle et masque les groupes devenus
vides.

### Vérification

`npm run build` passe : 22 routes, dont les trois nouvelles, en rendu statique.
TypeScript strict sans erreur. Le contrôle s'arrête au rendu statique — la
navigation profil par profil dans un navigateur n'a pas été rejouée.

---

## 10. Ce qui n'est pas implémenté

- **Les quatre modes de connexion** (mot de passe, reconnaissance faciale, empreinte, badge sans contact) restent une animation : ils ne conditionnent pas l'accès.
- **L'analyse documentaire réelle** : la reprise de chantier, la génération de CCTP et les réponses du copilote sont scriptées, pas produites par un traitement de fichiers.
- **La protection des routes par URL** : le menu filtre les modules selon le rôle, mais saisir directement l'adresse d'un module hors périmètre affiche encore la page. Sans backend, il s'agirait d'un garde-fou d'affichage, pas d'une sécurité.
- **Le filtrage fin des contenus** pour certains profils externes : les listes de tâches, photos ou documents ne sont pas encore restreintes lot par lot au sein d'un module autorisé.
- **Le retour d'expérience attendu** de la réunion (remarques de navigation et d'accessibilité des onglets) n'a pas encore été intégré, et le prochain point de suivi reste à planifier.
