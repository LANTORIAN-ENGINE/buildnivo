"use client";

/**
 * Contexte du contrôle financier.
 *
 * Un profil « financier » ne voit pas l'application comme les autres : son
 * périmètre est celui de l'accès que le promoteur lui a ouvert (une opération,
 * des blocs optionnels, des documents nommés). Les profils du promoteur, eux,
 * voient l'opération active dans son intégralité — c'est eux qui décident.
 */

import type { AccessShare, FinancialAccess } from "@/types";
import { isFinancial } from "@/lib/permissions";
import { useDemo } from "@/lib/store";

const fullShare: AccessShare = { commercialisation: true, tresorerie: true, sequestre: true, photos: true };

export interface FinanceContext {
  /** Accès du profil connecté, s'il s'agit d'un intervenant financier. */
  access?: FinancialAccess;
  /** Le profil connecté est un intervenant financier (lecture seule). */
  financial: boolean;
  /** Opération consultée : celle de l'accès, sinon le chantier actif. */
  projectId: string;
  /** Blocs optionnels réellement ouverts. */
  share: AccessShare;
  /** L'accès a été révoqué ou suspendu par le promoteur. */
  closed: boolean;
  /** Nom affiché du signataire des actions (validation, révocation). */
  actor: string;
}

export function useFinance(): FinanceContext {
  const { persona, accesses, activeProjectId } = useDemo();
  const access = persona.accessId ? accesses.find((a) => a.id === persona.accessId) : undefined;
  const financial = isFinancial(persona.role);
  return {
    access,
    financial,
    projectId: financial && access ? access.projectId : activeProjectId,
    share: financial && access ? access.share : fullShare,
    closed: financial && (!access || access.status === "revoque" || access.status === "suspendu"),
    actor: `${persona.firstName} ${persona.lastName} — ${persona.company}`,
  };
}
