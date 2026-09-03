import type { Role } from "@/stores/session";

/*
 * Libelles d'interface partages. Un role s'affiche partout avec le meme mot :
 * la navigation, la barre superieure et l'ecran des comptes lisent cette
 * table, aucune ne reecrit le libelle.
 */
export const LIBELLE_ROLE: Record<Role, string> = {
  administrateur: "Administrateur",
  exploitant: "Exploitant",
  lecteur: "Lecteur",
};
