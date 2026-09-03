import type {
  Borne,
  Devise,
  DestinationServie,
  FicheFournisseur,
  Fournisseur,
  IndicateursBornes,
  Operateur,
  PaysServi,
  Portefeuille,
  Presence,
} from "@/features/referentiels/types";

/*
 * Donnees de simulation du Referentiel.
 *
 * Aucun composant n'importe ce fichier. Il est lu uniquement par
 * features/referentiels/services/, qui l'echangera contre des appels Axios
 * sans qu'aucun hook ni ecran change.
 *
 * Volumes et contenus calques sur les maquettes : 56 operateurs,
 * 62 presences, 45 portefeuilles, 62 bornes. Les trois cas d'absence sont
 * representes dans chaque jeu, ainsi que tous les etats affichables.
 */

const PAYS_AFRIQUE_OUEST = [
  { code: "BJ", nom: "Bénin", indicatif: 229, devise: "XOF" },
  { code: "TG", nom: "Togo", indicatif: 228, devise: "XOF" },
  { code: "SN", nom: "Sénégal", indicatif: 221, devise: "XOF" },
  { code: "ML", nom: "Mali", indicatif: 223, devise: "XOF" },
  { code: "CI", nom: "Côte d'Ivoire", indicatif: 225, devise: "XOF" },
  { code: "BF", nom: "Burkina Faso", indicatif: 226, devise: "XOF" },
  { code: "NE", nom: "Niger", indicatif: 227, devise: "XOF" },
  { code: "GW", nom: "Guinée-Bissau", indicatif: 245, devise: "XOF" },
  { code: "GH", nom: "Ghana", indicatif: 233, devise: "GHS" },
  { code: "NG", nom: "Nigeria", indicatif: 234, devise: "NGN" },
  { code: "GN", nom: "Guinée", indicatif: 224, devise: "GNF" },
  { code: "LR", nom: "Libéria", indicatif: 231, devise: "USD" },
  { code: "SL", nom: "Sierra Leone", indicatif: 232, devise: "USD" },
  { code: "CM", nom: "Cameroun", indicatif: 237, devise: "XAF" },
  { code: "CG", nom: "Congo", indicatif: 242, devise: "XAF" },
  { code: "TD", nom: "Tchad", indicatif: 235, devise: "XAF" },
] as const;

/* --- Fournisseurs --- */

export const FOURNISSEURS: Fournisseur[] = [
  { id: "f-01", nom: "MTN", logoUrl: null, type: "direct", raccordement: "KKPAY", routesActives: 0, raccorde: true },
  { id: "f-02", nom: "MOOV", logoUrl: null, type: "direct", raccordement: "FEDAPAY", routesActives: 0, raccorde: true },
  { id: "f-03", nom: "BMO_COLLECT_DIRECT", logoUrl: null, type: "direct", raccordement: "FEDAPAY", routesActives: 23, raccorde: true },
  { id: "f-04", nom: "Fedapay", logoUrl: null, type: "agregateur", raccordement: "FEDAPAY", routesActives: 8, raccorde: true },
  { id: "f-05", nom: "Paywal", logoUrl: null, type: "agregateur", raccordement: "PAYWAL", routesActives: 8, raccorde: true },
  { id: "f-06", nom: "PawaPay", logoUrl: null, type: "agregateur", raccordement: "PAWAPAY", routesActives: 18, raccorde: true },
  { id: "f-07", nom: "KkiaPay", logoUrl: null, type: "agregateur", raccordement: "KKPAY", routesActives: 12, raccorde: true },
  { id: "f-08", nom: "PayDunya", logoUrl: null, type: "agregateur", raccordement: "PAYDUNYA", routesActives: 6, raccorde: true },
  { id: "f-09", nom: "Bizao", logoUrl: null, type: "agregateur", raccordement: "BIZAO", routesActives: 14, raccorde: true },
  { id: "f-10", nom: "Orange Direct", logoUrl: null, type: "direct", raccordement: "ORANGE_API", routesActives: 4, raccorde: true },
  { id: "f-11", nom: "Wave Direct", logoUrl: null, type: "direct", raccordement: "WAVE_API", routesActives: 3, raccorde: true },
  { id: "f-12", nom: "Airtel Direct", logoUrl: null, type: "direct", raccordement: "AIRTEL_API", routesActives: 0, raccorde: false },
  { id: "f-13", nom: "Hub2", logoUrl: null, type: "agregateur", raccordement: "HUB2", routesActives: 9, raccorde: true },
  { id: "f-14", nom: "CinetPay", logoUrl: null, type: "agregateur", raccordement: "CINETPAY", routesActives: 11, raccorde: true },
  { id: "f-15", nom: "Semoa", logoUrl: null, type: "agregateur", raccordement: "SEMOA", routesActives: 2, raccorde: true },
  { id: "f-16", nom: "Ecobank Collect", logoUrl: null, type: "direct", raccordement: "ECOBANK", routesActives: 5, raccorde: true },
  { id: "f-17", nom: "UBA Direct", logoUrl: null, type: "direct", raccordement: "UBA", routesActives: 0, raccorde: false },
  { id: "f-18", nom: "Flutterwave", logoUrl: null, type: "agregateur", raccordement: "FLUTTERWAVE", routesActives: 16, raccorde: true },
  { id: "f-19", nom: "Paystack", logoUrl: null, type: "agregateur", raccordement: "PAYSTACK", routesActives: 7, raccorde: true },
  { id: "f-20", nom: "MTN Collect CM", logoUrl: null, type: "direct", raccordement: "MTN_CM", routesActives: 3, raccorde: true },
  { id: "f-21", nom: "Yas Direct", logoUrl: null, type: "direct", raccordement: "YAS_API", routesActives: 0, raccorde: false },
  { id: "f-22", nom: "Djamo Connect", logoUrl: null, type: "agregateur", raccordement: "DJAMO", routesActives: 1, raccorde: true },
];

const PORTEFEUILLES_PAWAPAY = [
  { pays: "LR", portefeuille: "Afrimoney", sens: "encaissement", fiabilite: "hypothese-non-verifiee" },
  { pays: "SL", portefeuille: "PayCard", sens: "decaissement", fiabilite: "hypothese-non-verifiee" },
  { pays: "GW", portefeuille: "GTBank Mobile", sens: "encaissement", fiabilite: "releve-fournisseur" },
  { pays: "NG", portefeuille: "Afrimoney", sens: "encaissement", fiabilite: "releve-fournisseur" },
  { pays: "CM", portefeuille: "GCB Mobile", sens: "encaissement", fiabilite: "hypothese-non-verifiee" },
] as const;

export const FICHES_FOURNISSEUR: Record<string, FicheFournisseur> = Object.fromEntries(
  FOURNISSEURS.map((fournisseur) => {
    const destinations: DestinationServie[] =
      fournisseur.id === "f-06"
        ? PORTEFEUILLES_PAWAPAY.map((d, index) => ({
            id: `${fournisseur.id}-d-${index}`,
            pays: d.pays,
            nomPays: PAYS_AFRIQUE_OUEST.find((p) => p.code === d.pays)!.nom,
            portefeuille: d.portefeuille,
            sens: d.sens,
            fiabilite: d.fiabilite,
          }))
        : PAYS_AFRIQUE_OUEST.slice(0, Math.min(6, fournisseur.routesActives)).map(
            (pays, index) => ({
              id: `${fournisseur.id}-d-${index}`,
              pays: pays.code,
              nomPays: pays.nom,
              portefeuille: index % 2 === 0 ? "Mobile Money" : "Wallet bancaire",
              sens: index % 3 === 0 ? "decaissement" : "encaissement",
              fiabilite:
                index % 2 === 0 ? "releve-fournisseur" : "hypothese-non-verifiee",
            }),
          );

    return [fournisseur.id, { ...fournisseur, destinations }];
  }),
);

/* --- Portefeuilles --- */

const MARQUES_PORTEFEUILLE: Array<[string, Portefeuille["nature"], number, number | null]> = [
  ["MTN MoMo", "operateur-telecom", 3, null],
  ["Moov Money", "operateur-telecom", 2, null],
  ["BMO_COLLECT_DIRECT", "banque", 23, null],
  ["Fedapay", "agregateur", 8, null],
  ["Wave", "operateur-telecom", 2, null],
  ["Orange Money", "operateur-telecom", 2, null],
  ["Vodafone Cash", "operateur-telecom", 2, null],
  ["Airtel Money", "operateur-telecom", 4, 6],
  ["M-Pesa", "operateur-telecom", 3, 4],
  ["Yas Mix by Yass", "operateur-telecom", 1, 2],
  ["Free Money", "operateur-telecom", 1, 1],
  ["Wizall", "operateur-telecom", 2, null],
  ["Ecobank Mobile", "banque", 5, 3],
  ["UBA Mobile", "banque", 6, null],
  ["GTBank Mobile", "banque", 3, 2],
  ["Coris Money", "banque", 2, null],
  ["Djamo", "banque", 2, 1],
  ["Afrimoney", "operateur-telecom", 3, 2],
  ["PayCard", "banque", 1, null],
  ["GCB Mobile", "banque", 1, null],
  ["Zeepay", "agregateur", 4, 1],
  ["Hubtel", "agregateur", 1, null],
  ["Kowri", "agregateur", 1, null],
  ["Sank Money", "operateur-telecom", 1, null],
  ["Telecel Money", "operateur-telecom", 2, 1],
];

export const PORTEFEUILLES: Portefeuille[] = MARQUES_PORTEFEUILLE.map(
  ([nom, nature, nombrePays, routesActives], index) => ({
    id: `p-${String(index + 1).padStart(2, "0")}`,
    nom,
    logoUrl: null,
    nature,
    nombrePays,
    routesActives,
    /* Une marque qui porte des routes actives ne se retire pas : le retrait
       casserait les paiements en cours. */
    retirable: routesActives === null || routesActives === 0,
  }),
);

/* --- Operateurs et presences --- */

const ANCIENS_NOMS: Record<string, string> = {
  "Moov Africa Bénin": "Areeba",
  "Moov Africa Togo": "Togocel",
  "Yas Togo": "Togocom",
  "Telecel Burkina Faso": "Onatel",
  "Airtel Tchad": "Tigo",
};

/*
 * Les operateurs sont construits pays par pays, chacun avec les marques qui
 * y exploitent reellement un portefeuille. Une construction marque par
 * marque produisait seize lignes MTN d'affilee, ce qui ne ressemble a aucune
 * liste reelle et empechait de voir si la colonne de logos fonctionne.
 */
const MARQUES_PAR_PAYS: Record<string, string[]> = {
  BJ: ["MTN", "Moov Africa", "Celtiis"],
  TG: ["Yas", "Moov Africa"],
  SN: ["Orange", "Free", "Expresso", "Wave"],
  ML: ["Orange", "Moov Africa"],
  CI: ["Orange", "MTN", "Moov Africa", "Wave"],
  BF: ["Orange", "Moov Africa", "Telecel"],
  NE: ["Airtel", "Moov Africa", "Zamani"],
  GW: ["MTN", "Orange"],
  GH: ["MTN", "Telecel", "AirtelTigo"],
  NG: ["MTN", "Airtel", "Glo", "9mobile"],
  GN: ["MTN", "Orange", "Cellcom"],
  LR: ["Orange", "MTN"],
  SL: ["Orange", "Africell"],
  CM: ["MTN", "Orange", "Camtel"],
  CG: ["MTN", "Airtel"],
  TD: ["Airtel", "Moov Africa"],
};

function construireOperateurs(): Operateur[] {
  const liste: Operateur[] = [];
  for (const pays of PAYS_AFRIQUE_OUEST) {
    for (const marque of MARQUES_PAR_PAYS[pays.code] ?? []) {
      const nom = `${marque} ${pays.nom}`;
      liste.push({
        id: `o-${liste.length + 1}`,
        nom,
        logoUrl: null,
        nomPays: pays.nom,
        pays: pays.code,
        ancienNom: ANCIENS_NOMS[nom] ?? null,
      });
      if (liste.length >= 56) return liste;
    }
  }
  return liste;
}

export const OPERATEURS: Operateur[] = construireOperateurs();

export const PRESENCES: Presence[] = OPERATEURS.slice(0, 48).map(
  (operateur, index) => ({
    id: `pr-${index + 1}`,
    libelleVu: operateur.nom,
    logoUrl: null,
    nomPays: operateur.nomPays,
    pays: operateur.pays,
    ancienNom: operateur.ancienNom,
    ouverte: index % 9 !== 0,
  }),
);

/* --- Bornes de montants --- */

const MONTANTS_MIN = [null, 50, 100, 500, 1_000, 0, null, 2_000];
const MONTANTS_MAX: Array<number | undefined> = [
  undefined, 500_000, 1_000_000, undefined, 2_500_000, undefined, 250_000, undefined,
];
const CHAMPS_EXIGES = [
  null, "Pièce d'identité", null, "Justificatif de domicile", null, null,
  "Numéro fiscal", null,
];

export const BORNES: Borne[] = Array.from({ length: 62 }, (_, index) => {
  const portefeuille = PORTEFEUILLES[index % PORTEFEUILLES.length];
  const pays = PAYS_AFRIQUE_OUEST[index % PAYS_AFRIQUE_OUEST.length];

  return {
    id: `b-${index + 1}`,
    destination: portefeuille.nom,
    logoUrl: null,
    sens: index % 3 === 0 ? "encaissement" : "decaissement",
    devise: pays.devise,
    minimum: MONTANTS_MIN[index % MONTANTS_MIN.length],
    maximum: MONTANTS_MAX[index % MONTANTS_MAX.length],
    champExige: CHAMPS_EXIGES[index % CHAMPS_EXIGES.length],
  };
});

export const INDICATEURS_BORNES: IndicateursBornes = {
  bornesEnregistrees: BORNES.length,
  bornesConnuesTotal: 172,
  destinationsCouvertes: 129,
  plafondsInconnus: BORNES.filter((b) => b.maximum === undefined).length,
};

/* --- Devises et pays --- */

export const DEVISES: Devise[] = [
  { code: "XOF", nom: "Franc CFA (UEMOA)", decimales: 0, nombrePays: 8 },
  { code: "XAF", nom: "Franc CFA (CEMAC)", decimales: 0, nombrePays: 3 },
  { code: "GHS", nom: "Cedi ghanéen", decimales: 2, nombrePays: 1 },
  { code: "NGN", nom: "Naira nigérian", decimales: 2, nombrePays: 1 },
  { code: "GNF", nom: "Franc guinéen", decimales: 0, nombrePays: 1 },
  { code: "USD", nom: "Dollar américain", decimales: 2, nombrePays: 2 },
  { code: "EUR", nom: "Euro", decimales: 2, nombrePays: 0 },
];

export const PAYS: PaysServi[] = PAYS_AFRIQUE_OUEST.map((pays, index) => ({
  code: pays.code,
  nom: pays.nom,
  deviseEncaissement: pays.devise,
  indicatif: pays.indicatif,
  ouvert: index % 7 !== 6,
}));
