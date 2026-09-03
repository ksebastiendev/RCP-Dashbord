import { z } from "zod";
import {
  ChampSelection,
  ChampTexte,
  ModaleFormulaire,
  Rangee,
  RangeeTriple,
} from "@/components/shared/formulaire";

/*
 * Modales de la Tarification. Deux des treize captures, Container-8.png et
 * Container-9.png, qui portent le meme titre "Ajouter une regle" mais ne
 * decrivent pas la meme chose : la premiere ajoute une regle de prelevement
 * facturee au marchand, la seconde un cout facture par un fournisseur. Leurs
 * titres sont donc distingues ici, sans quoi les deux seraient impossibles a
 * differencier depuis le menu.
 */

const DEVISES = [
  { valeur: "XOF", libelle: "XOF" },
  { valeur: "XAF", libelle: "XAF" },
  { valeur: "GHS", libelle: "GHS" },
  { valeur: "NGN", libelle: "NGN" },
  { valeur: "GNF", libelle: "GNF" },
];

const SENS = [
  { valeur: "encaissement", libelle: "Encaissement" },
  { valeur: "decaissement", libelle: "Décaissement" },
];

/* Une commission plancher superieure au plafond rendrait la regle
   inapplicable : le prelevement ne pourrait satisfaire les deux bornes. */
const bornesCoherentes = <T extends { plancher?: string; plafond?: string }>(
  valeurs: T,
) => {
  if (!valeurs.plancher || !valeurs.plafond) return true;
  const min = Number(valeurs.plancher);
  const max = Number(valeurs.plafond);
  return !Number.isFinite(min) || !Number.isFinite(max) || max >= min;
};

/* --- Ajouter une regle de prelevement, Container-8.png --- */

const schemaRegle = z
  .object({
    portee: z.enum(["general", "marchand", "application"], "Choisissez une portée."),
    sens: z.string().min(1, "Choisissez un sens."),
    portefeuille: z.string().optional(),
    pays: z.string().optional(),
    devise: z.string().optional(),
    typePrelevement: z.enum(
      ["proportionnel", "fixe", "mixte"],
      "Choisissez un type de prélèvement.",
    ),
    taux: z.string().trim().min(1, "Indiquez le taux."),
    plancher: z.string().trim().optional(),
    plafond: z.string().trim().optional(),
    supporte: z.enum(["client-final", "marchand"], "Dites qui supporte la commission."),
  })
  .refine(bornesCoherentes, {
    message: "Le plafond ne peut pas être inférieur au plancher.",
    path: ["plafond"],
  });

type ValeursRegle = z.infer<typeof schemaRegle>;

export function ModaleAjouterRegle({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  return (
    <ModaleFormulaire<ValeursRegle>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Ajouter une règle de prélèvement"
      sousTitre="Le niveau le plus précis l'emporte : une règle d'application prime sur une règle de marchand, qui prime sur la règle générale."
      schema={schemaRegle}
      valeursParDefaut={{
        portee: "general",
        sens: "",
        portefeuille: "",
        pays: "",
        devise: "",
        typePrelevement: "proportionnel",
        taux: "",
        plancher: "",
        plafond: "",
        supporte: "client-final",
      }}
      onSoumettre={onFermer}
      libelleAction="Ajouter"
    >
      {(formulaire) => (
        <>
          <Rangee>
            <ChampSelection
              formulaire={formulaire}
              nom="portee"
              etiquette="Portée"
              requis
              options={[
                { valeur: "general", libelle: "Générale" },
                { valeur: "marchand", libelle: "Un marchand" },
                { valeur: "application", libelle: "Une application" },
              ]}
            />
            <ChampSelection
              formulaire={formulaire}
              nom="sens"
              etiquette="Sens"
              requis
              options={SENS}
            />
          </Rangee>

          <RangeeTriple>
            <ChampTexte
              formulaire={formulaire}
              nom="portefeuille"
              etiquette="Portefeuille"
              indication="Tous"
            />
            <ChampTexte formulaire={formulaire} nom="pays" etiquette="Pays" indication="Tous" />
            <ChampSelection
              formulaire={formulaire}
              nom="devise"
              etiquette="Devise"
              indication="Toutes"
              options={DEVISES}
            />
          </RangeeTriple>

          <Rangee>
            <ChampSelection
              formulaire={formulaire}
              nom="typePrelevement"
              etiquette="Type de prélèvement"
              requis
              options={[
                { valeur: "proportionnel", libelle: "Proportionnel" },
                { valeur: "fixe", libelle: "Part fixe" },
                { valeur: "mixte", libelle: "Proportionnel et part fixe" },
              ]}
            />
            <ChampTexte
              formulaire={formulaire}
              nom="taux"
              etiquette="Taux, en pour-cent"
              requis
              montant
              indication="1,8"
            />
          </Rangee>

          <Rangee>
            <ChampTexte
              formulaire={formulaire}
              nom="plancher"
              etiquette="Commission plancher"
              montant
            />
            <ChampTexte
              formulaire={formulaire}
              nom="plafond"
              etiquette="Commission plafond"
              montant
            />
          </Rangee>

          <ChampSelection
            formulaire={formulaire}
            nom="supporte"
            etiquette="Qui supporte la commission"
            requis
            options={[
              { valeur: "client-final", libelle: "Le client final" },
              { valeur: "marchand", libelle: "Le marchand" },
            ]}
            aide="Le client final la voit s'ajouter au montant. Le marchand la voit se retrancher de son reversement."
          />
        </>
      )}
    </ModaleFormulaire>
  );
}

/* --- Declarer un cout fournisseur, Container-9.png --- */

const schemaCout = z
  .object({
    fournisseur: z.string().min(1, "Choisissez un fournisseur."),
    sens: z.string().min(1, "Choisissez un sens."),
    forme: z.enum(["proportionnel", "fixe", "mixte"], "Choisissez une forme."),
    plancher: z.string().trim().optional(),
    plafond: z.string().trim().optional(),
    cout: z.string().trim().min(1, "Indiquez le coût facturé par le fournisseur."),
    pays: z.string().optional(),
    devise: z.string().optional(),
  })
  .refine(bornesCoherentes, {
    message: "Le plafond ne peut pas être inférieur au plancher.",
    path: ["plafond"],
  });

type ValeursCout = z.infer<typeof schemaCout>;

export function ModaleDeclarerCout({
  ouverte,
  onFermer,
  fournisseurs,
}: {
  ouverte: boolean;
  onFermer: () => void;
  fournisseurs: Array<{ id: string; nom: string }>;
}) {
  return (
    <ModaleFormulaire<ValeursCout>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Déclarer un coût fournisseur"
      sousTitre="Ce que le fournisseur nous facture. Sans lui, la marge de la plateforme reste incalculable."
      schema={schemaCout}
      valeursParDefaut={{
        fournisseur: "",
        sens: "",
        forme: "proportionnel",
        plancher: "",
        plafond: "",
        cout: "",
        pays: "",
        devise: "",
      }}
      onSoumettre={onFermer}
      libelleAction="Ajouter"
    >
      {(formulaire) => (
        <>
          <ChampSelection
            formulaire={formulaire}
            nom="fournisseur"
            etiquette="Fournisseur"
            requis
            options={fournisseurs.map((f) => ({ valeur: f.id, libelle: f.nom }))}
          />

          <Rangee>
            <ChampSelection
              formulaire={formulaire}
              nom="sens"
              etiquette="Sens"
              requis
              options={SENS}
            />
            <ChampSelection
              formulaire={formulaire}
              nom="forme"
              etiquette="Forme"
              requis
              options={[
                { valeur: "proportionnel", libelle: "Proportionnel" },
                { valeur: "fixe", libelle: "Part fixe" },
                { valeur: "mixte", libelle: "Proportionnel et part fixe" },
              ]}
            />
          </Rangee>

          <Rangee>
            <ChampTexte
              formulaire={formulaire}
              nom="plancher"
              etiquette="Commission plancher"
              montant
            />
            <ChampTexte
              formulaire={formulaire}
              nom="plafond"
              etiquette="Commission plafond"
              montant
            />
          </Rangee>

          <ChampTexte
            formulaire={formulaire}
            nom="cout"
            etiquette="Coût"
            requis
            montant
            indication="1,2"
            aide="Exprimé selon la forme choisie : en pour-cent, ou dans la devise de la règle."
          />

          <Rangee>
            <ChampTexte formulaire={formulaire} nom="pays" etiquette="Pays" indication="Tous" />
            <ChampSelection
              formulaire={formulaire}
              nom="devise"
              etiquette="Devise"
              indication="Toutes"
              options={DEVISES}
            />
          </Rangee>
        </>
      )}
    </ModaleFormulaire>
  );
}
