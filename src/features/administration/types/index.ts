import type { Role } from "@/stores/session";

/* Contrats de donnees de l'Administration. */

export type Compte = {
  id: string;
  nom: string;
  courriel: string;
  role: Role;
  /** null quand le compte ne s'est jamais connecte. */
  derniereConnexion: string | null;
  actif: boolean;
};

export type DescriptionRole = {
  role: Role;
  /** Ce que le role permet, en consequences reelles. */
  permissions: string[];
  /** Nombre de droits elementaires que le role accorde. */
  nombreDroits: number;
  /** Nombre de comptes qui le portent. */
  nombreComptes: number;
};

export type Administration = {
  comptes: Compte[];
  roles: DescriptionRole[];
  /** Nombre total de droits elementaires declares par la plateforme. */
  droitsElementaires: number;
};
