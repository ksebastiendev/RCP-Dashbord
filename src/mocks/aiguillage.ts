import type {
  CaseCouverture,
  Destination,
  IndicateursCouverture,
  Route,
} from "@/features/aiguillage/types";
import type { CodePays } from "@/features/referentiels/types";

/*
 * Donnees de simulation de l'Aiguillage.
 *
 * Les trois etats de couverture sont representes en proportions plausibles :
 * la grande majorite des croisements est fermee, une minorite est ouvrable,
 * et le servi reste minoritaire. C'est ce desequilibre qui donne son sens a
 * l'ecran, un jeu ou tout serait vert ne montrerait rien.
 */

const MARQUES: Array<{
  portefeuille: string;
  pays: CodePays;
  precision: string;
}> = [
  { portefeuille: "BMO", pays: "BJ", precision: "Bénin, sans opérateur" },
  { portefeuille: "MTN MoMo", pays: "BJ", precision: "Bénin, MTN Bénin" },
  { portefeuille: "Wave", pays: "BF", precision: "Burkina Faso, sans opérateur" },
  { portefeuille: "Orange Money", pays: "CI", precision: "Côte d'Ivoire, Orange CI" },
  { portefeuille: "Moov Money", pays: "TG", precision: "Togo, Moov Africa Togo" },
  { portefeuille: "Free Money", pays: "SN", precision: "Sénégal, Free Sénégal" },
  { portefeuille: "Wave", pays: "SN", precision: "Sénégal, sans opérateur" },
  { portefeuille: "MTN MoMo", pays: "GH", precision: "Ghana, MTN Ghana" },
  { portefeuille: "Vodafone Cash", pays: "GH", precision: "Ghana, Telecel Ghana" },
  { portefeuille: "Airtel Money", pays: "TD", precision: "Tchad, Airtel Tchad" },
  { portefeuille: "Orange Money", pays: "CM", precision: "Cameroun, Orange Cameroun" },
  { portefeuille: "MTN MoMo", pays: "CM", precision: "Cameroun, MTN Cameroun" },
  { portefeuille: "Moov Money", pays: "BJ", precision: "Bénin, Moov Africa Bénin" },
  { portefeuille: "Coris Money", pays: "ML", precision: "Mali, sans opérateur" },
  { portefeuille: "Orange Money", pays: "ML", precision: "Mali, Orange Mali" },
  { portefeuille: "Telecel Money", pays: "BF", precision: "Burkina Faso, Telecel" },
  { portefeuille: "MTN MoMo", pays: "GN", precision: "Guinée, MTN Guinée" },
  { portefeuille: "Afrimoney", pays: "LR", precision: "Libéria, sans opérateur" },
  { portefeuille: "PayCard", pays: "SL", precision: "Sierra Leone, sans opérateur" },
  { portefeuille: "GTBank Mobile", pays: "GW", precision: "Guinée-Bissau, sans opérateur" },
  { portefeuille: "Zeepay", pays: "GH", precision: "Ghana, sans opérateur" },
  { portefeuille: "Wizall", pays: "SN", precision: "Sénégal, sans opérateur" },
];

/* Table de couverture, ecrite a la main pour que chaque ligne raconte un cas
   distinct plutot qu'un motif calcule. */
const COUVERTURE: Array<[CaseCouverture, CaseCouverture]> = [
  [{ etat: "servi", fournisseur: "BMO" }, { etat: "servi", fournisseur: "BMO" }],
  [
    { etat: "servi", fournisseur: "BMO_COLLECT_DIRECT" },
    { etat: "servi", fournisseur: "KKPAY" },
  ],
  [{ etat: "ferme" }, { etat: "ouvrable", candidats: 1 }],
  [
    { etat: "servi", fournisseur: "FEDAPAY" },
    { etat: "ouvrable", candidats: 2 },
  ],
  [{ etat: "servi", fournisseur: "PAYWAL" }, { etat: "ferme" }],
  [{ etat: "ouvrable", candidats: 1 }, { etat: "ferme" }],
  [{ etat: "ferme" }, { etat: "ferme" }],
  [
    { etat: "servi", fournisseur: "PAWAPAY" },
    { etat: "servi", fournisseur: "PAWAPAY" },
  ],
  [{ etat: "ouvrable", candidats: 3 }, { etat: "ferme" }],
  [{ etat: "ferme" }, { etat: "ferme" }],
  [{ etat: "servi", fournisseur: "BIZAO" }, { etat: "ouvrable", candidats: 1 }],
  [{ etat: "servi", fournisseur: "BIZAO" }, { etat: "servi", fournisseur: "BIZAO" }],
  [{ etat: "ouvrable", candidats: 2 }, { etat: "ouvrable", candidats: 2 }],
  [{ etat: "ferme" }, { etat: "ferme" }],
  [{ etat: "servi", fournisseur: "HUB2" }, { etat: "ferme" }],
  [{ etat: "ouvrable", candidats: 1 }, { etat: "ferme" }],
  [{ etat: "servi", fournisseur: "PAWAPAY" }, { etat: "ferme" }],
  [{ etat: "ouvrable", candidats: 1 }, { etat: "ferme" }],
  [{ etat: "ferme" }, { etat: "ferme" }],
  [{ etat: "servi", fournisseur: "PAWAPAY" }, { etat: "ferme" }],
  [{ etat: "ouvrable", candidats: 2 }, { etat: "ouvrable", candidats: 1 }],
  [{ etat: "ferme" }, { etat: "ferme" }],
];

export const DESTINATIONS: Destination[] = MARQUES.map((marque, index) => ({
  id: `d-${String(index + 1).padStart(2, "0")}`,
  portefeuille: marque.portefeuille,
  logoUrl: null,
  pays: marque.pays,
  precision: marque.precision,
  encaissement: COUVERTURE[index][0],
  decaissement: COUVERTURE[index][1],
}));

/*
 * Les indicateurs se comptent sur la table, ils ne sont pas ecrits en dur :
 * un decompte qui contredit le tableau qu'il surplombe est pire que pas de
 * decompte du tout. Le total ferme ajoute les croisements hors perimetre
 * affiche, que le serveur connait et que la liste ne montre pas.
 */
const CASES = DESTINATIONS.flatMap((d) => [d.encaissement, d.decaissement]);
const CROISEMENTS_HORS_LISTE = 1_680;

export const INDICATEURS_COUVERTURE: IndicateursCouverture = {
  videOuvrable: CASES.filter((c) => c.etat === "ouvrable").length,
  videFerme: CASES.filter((c) => c.etat === "ferme").length + CROISEMENTS_HORS_LISTE,
  croisementsServis: CASES.filter((c) => c.etat === "servi").length,
};

/* --- Tables de routage --- */

export const ROUTES: Route[] = DESTINATIONS.flatMap((destination) => {
  const lignes: Route[] = [];

  if (destination.encaissement.etat === "servi") {
    lignes.push({
      id: `r-${destination.id}-e`,
      destination: destination.portefeuille,
      logoUrl: null,
      sens: "encaissement",
      fournisseur: destination.encaissement.fournisseur,
      /* Une route sans repli : tout echec y est definitif. */
      acheminement: null,
      enVigueurDepuis: "2025-01-20",
      active: true,
    });
  }

  if (destination.decaissement.etat === "servi") {
    lignes.push({
      id: `r-${destination.id}-d`,
      destination: destination.portefeuille,
      logoUrl: null,
      sens: "decaissement",
      fournisseur: destination.decaissement.fournisseur,
      acheminement: lignes.length > 0 ? "PAWAPAY" : null,
      enVigueurDepuis: "2025-03-11",
      active: true,
    });
  }

  return lignes;
});
