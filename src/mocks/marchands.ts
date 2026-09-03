import type { CodePays } from "@/features/referentiels/types";
import type {
  Application,
  FicheMarchand,
  Marchand,
  StatutDossier,
  WebhooksApplication,
} from "@/features/marchands/types";

/*
 * Donnees de simulation de la section Marchand.
 *
 * Aucun composant n'importe ce fichier : seule la couche service le lit.
 * Les six statuts de dossier sont representes, ainsi que les cas d'absence
 * qui comptent : un volume non consolide, un taux d'echec incalculable faute
 * d'envois, une application qui n'a jamais servi.
 */

/*
 * Chaque entreprise porte le pays que son nom laisse attendre, et une date
 * d'inscription qui lui est propre : une colonne de dates en suite
 * arithmetique se repere immediatement comme du remplissage et cesse
 * d'eprouver l'affichage.
 */
const ENTREPRISES: Array<{
  nom: string;
  pays: CodePays;
  nomPays: string;
  statut: StatutDossier;
  applications: number;
  inscription: string;
}> = [
  { nom: "Faso Énergie", pays: "BF", nomPays: "Burkina Faso", statut: "approuve", applications: 1, inscription: "2025-06-19" },
  { nom: "MTN MoMo Boutique", pays: "BJ", nomPays: "Bénin", statut: "refuse", applications: 0, inscription: "2026-02-11" },
  { nom: "Ivoire Express", pays: "CI", nomPays: "Côte d'Ivoire", statut: "approuve", applications: 2, inscription: "2025-03-04" },
  { nom: "Kinshasa Stream", pays: "CM", nomPays: "Cameroun", statut: "en-examen", applications: 1, inscription: "2026-08-14" },
  { nom: "Cotonou Ride", pays: "BJ", nomPays: "Bénin", statut: "approuve", applications: 3, inscription: "2025-01-27" },
  { nom: "Dakar Fresh", pays: "SN", nomPays: "Sénégal", statut: "en-examen", applications: 0, inscription: "2026-07-02" },
  { nom: "Lomé Logistics", pays: "TG", nomPays: "Togo", statut: "suspendu", applications: 1, inscription: "2025-09-30" },
  { nom: "Ouaga Market", pays: "BF", nomPays: "Burkina Faso", statut: "approuve", applications: 2, inscription: "2025-11-08" },
  { nom: "Abidjan Telecom", pays: "CI", nomPays: "Côte d'Ivoire", statut: "approuve", applications: 4, inscription: "2024-12-03" },
  { nom: "Douala Cargo", pays: "CM", nomPays: "Cameroun", statut: "depose", applications: 0, inscription: "2026-08-21" },
  { nom: "Bamako Santé", pays: "ML", nomPays: "Mali", statut: "brouillon", applications: 0, inscription: "2026-08-28" },
  { nom: "Accra Books", pays: "GH", nomPays: "Ghana", statut: "approuve", applications: 1, inscription: "2025-05-16" },
  { nom: "Sikasso Agro", pays: "ML", nomPays: "Mali", statut: "refuse", applications: 0, inscription: "2025-10-22" },
  { nom: "Porto-Novo Taxi", pays: "BJ", nomPays: "Bénin", statut: "approuve", applications: 1, inscription: "2025-02-14" },
  { nom: "Thiès Éducation", pays: "SN", nomPays: "Sénégal", statut: "en-examen", applications: 0, inscription: "2026-06-09" },
  { nom: "Korhogo Coton", pays: "CI", nomPays: "Côte d'Ivoire", statut: "approuve", applications: 2, inscription: "2025-04-01" },
  { nom: "Yamoussoukro Hôtel", pays: "CI", nomPays: "Côte d'Ivoire", statut: "suspendu", applications: 1, inscription: "2025-07-25" },
  { nom: "Parakou Transit", pays: "BJ", nomPays: "Bénin", statut: "approuve", applications: 1, inscription: "2026-01-19" },
  { nom: "Kumasi Textile", pays: "GH", nomPays: "Ghana", statut: "depose", applications: 0, inscription: "2026-08-30" },
  { nom: "Ségou Énergie", pays: "ML", nomPays: "Mali", statut: "approuve", applications: 3, inscription: "2024-11-12" },
  { nom: "Bobo Distribution", pays: "BF", nomPays: "Burkina Faso", statut: "en-examen", applications: 1, inscription: "2026-05-23" },
  { nom: "Saint-Louis Pêche", pays: "SN", nomPays: "Sénégal", statut: "approuve", applications: 1, inscription: "2025-08-07" },
  { nom: "Garoua Élevage", pays: "CM", nomPays: "Cameroun", statut: "brouillon", applications: 0, inscription: "2026-09-01" },
  { nom: "Tamale Agro", pays: "GH", nomPays: "Ghana", statut: "approuve", applications: 2, inscription: "2025-12-15" },
];

export const MARCHANDS: Marchand[] = ENTREPRISES.map((entreprise, index) => ({
  id: `m-${String(index + 1).padStart(2, "0")}`,
  nom: entreprise.nom,
  logoUrl: null,
  pays: entreprise.pays,
  nomPays: entreprise.nomPays,
  statut: entreprise.statut,
  inscription: entreprise.inscription,
  nombreApplications: entreprise.applications,
}));

/*
 * Empreintes des identifiants legaux.
 *
 * Le service ne connait que des empreintes, jamais les valeurs en clair.
 * Ici l'empreinte est simulee par la valeur normalisee elle-meme ; cote
 * serveur ce sera un condensat a cle. Ce qui compte pour l'interface est
 * que la recherche soit exacte et ne puisse pas etre approximative.
 */
export const EMPREINTES_LEGALES: Record<string, string> = {
  "RB/COT/24B12345": "m-01",
  "RB/COT/24B67890": "m-05",
  "CI-ABJ-2025-B-0042": "m-03",
  "SN-DKR-2026-A-0117": "m-06",
  "BF-OUA-2025-C-0083": "m-08",
};

const APPLICATIONS_FASO: Application[] = [
  {
    id: "a-01",
    nom: "Portail abonnés",
    mode: "reel",
    derniereActivite: "2026-09-03T17:39:00",
    taux: 1.8,
    niveauTarif: "general",
    clePublique: "pk_live_faso_Lm81Qw",
  },
];

const APPLICATIONS_IVOIRE: Application[] = [
  {
    id: "a-02",
    nom: "Site e-commerce",
    mode: "reel",
    derniereActivite: "2026-09-03T17:52:00",
    taux: 1.2,
    niveauTarif: "marchand",
    clePublique: "pk_live_ivx_7Kd92JfLm3",
  },
  {
    id: "a-03",
    nom: "Caisse en boutique",
    mode: "demonstration",
    derniereActivite: "2026-08-29T09:14:00",
    taux: 1.2,
    niveauTarif: "marchand",
    clePublique: "pk_test_ivx_9wMc2Vb",
  },
];

const APPLICATIONS_COTONOU: Application[] = [
  {
    id: "a-04",
    nom: "Application mobile",
    mode: "reel",
    derniereActivite: "2026-09-02T11:20:00",
    taux: 2.1,
    niveauTarif: "application",
    clePublique: "pk_live_ctr_4Xb77Ns1",
  },
  {
    id: "a-05",
    nom: "Application chauffeurs",
    mode: "reel",
    derniereActivite: null,
    taux: undefined,
    niveauTarif: "general",
    clePublique: "pk_live_ctr_2Qm18Zt6",
  },
  {
    id: "a-06",
    nom: "Bac à sable",
    mode: "demonstration",
    derniereActivite: "2026-07-14T16:03:00",
    taux: 1.8,
    niveauTarif: "general",
    clePublique: "pk_test_ctr_8Rd44Kp0",
  },
];

const WEBHOOKS_FASO: WebhooksApplication[] = [
  {
    application: { id: "a-01", nom: "Portail abonnés", mode: "reel" },
    webhooks: [
      {
        id: "w-01",
        evenement: "Paiement réussi",
        adresse: "https://api.exemple.com/webhooks/paiement-reussi",
        dernierEnvoi: "2026-09-01T08:12:00",
        tauxEchecsRecents: 47,
      },
      {
        id: "w-02",
        evenement: "Paiement échoué",
        adresse: "https://api.exemple.com/webhooks/paiement-echoue",
        dernierEnvoi: "2026-09-01T08:12:00",
        tauxEchecsRecents: 8,
      },
      {
        id: "w-03",
        evenement: "Remboursement effectué",
        adresse: "https://api.exemple.com/webhooks/remboursement",
        dernierEnvoi: "2026-09-01T08:12:00",
        tauxEchecsRecents: 1,
      },
      {
        id: "w-04",
        evenement: "Litige ouvert",
        adresse: "https://api.exemple.com/webhooks/litige",
        dernierEnvoi: null,
        /* Deux envois seulement : un taux calcule dessus ne serait pas une
           sante, il ne se calcule pas. */
        tauxEchecsRecents: undefined,
      },
    ],
  },
];

function ficheDe(
  marchand: Marchand,
  extras: Partial<FicheMarchand> = {},
): FicheMarchand {
  return {
    ...marchand,
    raisonSociale: `${marchand.nom} SARL`,
    dirigeants: [{ id: "d-1", nom: "Issa Ouédraogo", fonction: "Gérant" }],

    volumeCeMois: 12_300_000,
    devise: "XOF",
    tauxEffectif: 1.8,
    fraisALaChargeDe: "client-final",

    constat: {
      genre: "succes",
      titre: "Dossier validé, ce marchand peut encaisser",
      description:
        "Ghana MTN MoMo et Nigeria MTN MoMo n'ont pas de fournisseur de remplacement. Tout échec sur ces destinations est définitif.",
    },

    pieces: [
      { id: "p-1", libelle: "Registre de commerce", statut: "verifiee" },
      { id: "p-2", libelle: "Attestation fiscale", statut: "expiree" },
      { id: "p-3", libelle: "Pièce d'identité du gérant", statut: "verifiee" },
      { id: "p-4", libelle: "Relevé d'identité bancaire", statut: "verifiee" },
    ],

    historique: [
      { id: "h-1", date: "2025-06-19", evenement: "Dossier soumis", auteur: "Marchand" },
      { id: "h-2", date: "2025-06-24", evenement: "Dossier validé", auteur: "O. Diallo" },
      {
        id: "h-3",
        date: "2026-08-01",
        evenement: "Attestation fiscale expirée",
        auteur: "Système",
      },
    ],

    cascadeTarif: [
      {
        niveau: "general",
        libelle: "Tarif par défaut de la plateforme",
        taux: 1.8,
        applique: true,
      },
      {
        niveau: "marchand",
        libelle: `Tarif propre à ${marchand.nom}`,
        taux: undefined,
        applique: false,
      },
      {
        niveau: "application",
        libelle: "Tarif propre à une application",
        taux: undefined,
        applique: false,
      },
    ],

    applications: APPLICATIONS_FASO,
    webhooksParApplication: WEBHOOKS_FASO,
    ...extras,
  };
}

export const FICHES_MARCHAND: Record<string, FicheMarchand> = {
  "m-01": ficheDe(MARCHANDS[0]),

  "m-03": ficheDe(MARCHANDS[2], {
    raisonSociale: "Ivoire Express SA",
    dirigeants: [
      { id: "d-1", nom: "Aya Koffi", fonction: "Directrice générale" },
      { id: "d-2", nom: "Sékou Traoré", fonction: "Directeur financier" },
    ],
    volumeCeMois: 48_920_000,
    tauxEffectif: 1.2,
    fraisALaChargeDe: "marchand",
    applications: APPLICATIONS_IVOIRE,
    cascadeTarif: [
      {
        niveau: "general",
        libelle: "Tarif par défaut de la plateforme",
        taux: 1.8,
        applique: false,
      },
      {
        niveau: "marchand",
        libelle: "Tarif propre à Ivoire Express",
        taux: 1.2,
        applique: true,
      },
      {
        niveau: "application",
        libelle: "Tarif propre à une application",
        taux: undefined,
        applique: false,
      },
    ],
    webhooksParApplication: [],
  }),

  "m-05": ficheDe(MARCHANDS[4], {
    raisonSociale: "Cotonou Ride SARL",
    dirigeants: [{ id: "d-1", nom: "Rachidatou Adam", fonction: "Gérante" }],
    /* Volume non consolide : la valeur n'est pas connue, elle ne vaut pas zero. */
    volumeCeMois: undefined,
    tauxEffectif: 2.1,
    applications: APPLICATIONS_COTONOU,
    constat: {
      genre: "attente",
      titre: "Une pièce justificative a expiré",
      description:
        "L'attestation fiscale a expiré le 1er août 2026. Le marchand encaisse toujours, mais le dossier ne pourra pas être renouvelé en l'état.",
    },
    webhooksParApplication: [],
  }),

  "m-04": ficheDe(MARCHANDS[3], {
    raisonSociale: "Kinshasa Stream SARL",
    volumeCeMois: null,
    tauxEffectif: undefined,
    applications: [],
    webhooksParApplication: [],
    constat: {
      genre: "danger",
      titre: "Dossier en examen, ce marchand ne peut rien encaisser",
      description:
        "Tant que le dossier n'est pas approuvé, aucune application ne peut passer en mode réel et aucun paiement n'aboutit.",
    },
    pieces: [
      { id: "p-1", libelle: "Registre de commerce", statut: "en-attente" },
      { id: "p-2", libelle: "Attestation fiscale", statut: "manquante" },
    ],
    historique: [
      { id: "h-1", date: "2026-08-14", evenement: "Dossier soumis", auteur: "Marchand" },
    ],
  }),
};
