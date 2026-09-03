import {
  Building2,
  CreditCard,
  House,
  Layers,
  Scale,
  Tag,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

/*
 * Declaration unique de la navigation laterale.
 * Les libelles et l'ordre sont releves dans BCP-marquettes-ui/BCP/.
 * Les chemins de route sont derives de cette table, jamais ecrits en dur
 * ailleurs : ajouter un ecran se fait ici et nulle part d'autre.
 */

export type EntreeNavigation = {
  id: string;
  libelle: string;
  chemin: string;
};

export type SectionNavigation = {
  id: string;
  libelle: string;
  icone: LucideIcon;
  /** Section sans enfant : le chemin est celui de la section elle-meme. */
  chemin?: string;
  enfants?: EntreeNavigation[];
};

export const NAVIGATION: SectionNavigation[] = [
  {
    id: "accueil",
    libelle: "Accueil",
    icone: House,
    chemin: "/accueil",
  },
  {
    id: "marchand",
    libelle: "Marchand",
    icone: Building2,
    enfants: [
      { id: "marchands", libelle: "Liste des marchands", chemin: "/marchand/liste" },
      { id: "webhooks", libelle: "Webhooks", chemin: "/marchand/webhooks" },
      { id: "dossiers", libelle: "Dossiers", chemin: "/marchand/dossiers" },
      {
        id: "applications",
        libelle: "Applications et clés",
        chemin: "/marchand/applications",
      },
    ],
  },
  {
    id: "aiguillage",
    libelle: "Aiguillage",
    icone: Waypoints,
    enfants: [
      {
        id: "couverture",
        libelle: "Carte de couverture",
        chemin: "/aiguillage/couverture",
      },
      { id: "routage", libelle: "Tables de routage", chemin: "/aiguillage/routage" },
    ],
  },
  {
    id: "referentiel",
    libelle: "Référentiel",
    icone: Layers,
    enfants: [
      { id: "fournisseurs", libelle: "Fournisseurs", chemin: "/referentiel/fournisseurs" },
      { id: "portefeuilles", libelle: "Portefeuilles", chemin: "/referentiel/portefeuilles" },
      { id: "operateurs", libelle: "Opérateurs", chemin: "/referentiel/operateurs" },
      { id: "presences", libelle: "Présences", chemin: "/referentiel/presences" },
      { id: "montants", libelle: "Montants autorisés", chemin: "/referentiel/montants" },
      {
        id: "justificatifs",
        libelle: "Justificatifs demandés",
        chemin: "/referentiel/justificatifs",
      },
      { id: "devises", libelle: "Devises et pays", chemin: "/referentiel/devises" },
    ],
  },
  {
    id: "tarification",
    libelle: "Tarification",
    icone: Tag,
    enfants: [
      { id: "couts", libelle: "Coûts et marge", chemin: "/tarification/couts" },
      { id: "grille", libelle: "Grille générale", chemin: "/tarification/grille" },
      { id: "plafonds", libelle: "Plafonds de fonds", chemin: "/tarification/plafonds" },
    ],
  },
  {
    id: "exploitation",
    libelle: "Exploitation",
    icone: CreditCard,
    enfants: [
      { id: "paiement", libelle: "Paiement", chemin: "/exploitation/paiement" },
      { id: "notifications", libelle: "Notifications", chemin: "/exploitation/notifications" },
      { id: "soldes", libelle: "Soldes", chemin: "/exploitation/soldes" },
      { id: "rapprochement", libelle: "Rapprochement", chemin: "/exploitation/rapprochement" },
    ],
  },
  {
    id: "administration",
    libelle: "Administration",
    icone: Scale,
    enfants: [
      { id: "comptes", libelle: "Comptes et droits", chemin: "/administration/comptes" },
      { id: "roles", libelle: "Rôles", chemin: "/administration/roles" },
    ],
  },
];

/** Section contenant le chemin courant, pour ouvrir le bon sous-menu. */
export function sectionDuChemin(chemin: string): SectionNavigation | undefined {
  return NAVIGATION.find(
    (section) =>
      section.chemin === chemin ||
      section.enfants?.some((enfant) => chemin.startsWith(enfant.chemin)),
  );
}
