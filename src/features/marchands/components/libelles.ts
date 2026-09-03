import type { GenreEtat } from "@/components/shared/pastille-etat";
import type {
  ModeApplication,
  NiveauTarif,
  QuiPaieLesFrais,
  StatutDossier,
  StatutPiece,
} from "../types";

/*
 * Libelles et genres d'etat de la section Marchand.
 *
 * Un statut s'ecrit partout avec le meme mot et prend partout la meme
 * couleur. La liste, la fiche et les filtres lisent cette table.
 */

export const LIBELLE_STATUT: Record<StatutDossier, string> = {
  brouillon: "Brouillon",
  depose: "Déposé",
  "en-examen": "En examen",
  approuve: "Approuvé",
  refuse: "Refusé",
  suspendu: "Suspendu",
};

export const GENRE_STATUT: Record<StatutDossier, GenreEtat> = {
  brouillon: "neutre",
  depose: "neutre",
  "en-examen": "attente",
  approuve: "succes",
  refuse: "danger",
  suspendu: "danger",
};

/** Ce qu'un statut autorise reellement, phrase dans la fiche et les filtres. */
export const CONSEQUENCE_STATUT: Record<StatutDossier, string> = {
  brouillon: "Le dossier n'est pas encore soumis, rien ne peut être encaissé.",
  depose: "Le dossier attend d'être pris en charge, rien ne peut être encaissé.",
  "en-examen": "Le dossier est en cours d'examen, rien ne peut être encaissé.",
  approuve: "Le marchand peut encaisser de l'argent réel.",
  refuse: "Le dossier a été refusé, rien ne peut être encaissé.",
  suspendu: "Les encaissements sont suspendus, les paiements en cours échouent.",
};

export const LIBELLE_PIECE: Record<StatutPiece, string> = {
  verifiee: "Vérifiée",
  expiree: "Expirée",
  manquante: "Manquante",
  "en-attente": "En attente",
};

export const GENRE_PIECE: Record<StatutPiece, GenreEtat> = {
  verifiee: "succes",
  expiree: "danger",
  manquante: "danger",
  "en-attente": "attente",
};

export const LIBELLE_MODE: Record<ModeApplication, string> = {
  reel: "Réel",
  demonstration: "Démo",
};

export const GENRE_MODE: Record<ModeApplication, GenreEtat> = {
  reel: "succes",
  demonstration: "attente",
};

export const EXPLICATION_MODE: Record<ModeApplication, string> = {
  reel: "Argent réel. Chaque paiement est encaissé et reversé pour de vrai.",
  demonstration: "Argent fictif. Aucun paiement réel n'est encaissé sur cette application.",
};

export const LIBELLE_NIVEAU_TARIF: Record<NiveauTarif, string> = {
  general: "Général",
  marchand: "Marchand",
  application: "Application",
};

export const ORIGINE_TARIF: Record<NiveauTarif, string> = {
  general: "hérité du tarif général",
  marchand: "propre au marchand",
  application: "propre à l'application",
};

export const LIBELLE_FRAIS: Record<QuiPaieLesFrais, string> = {
  "client-final": "Client final",
  marchand: "Marchand",
};
