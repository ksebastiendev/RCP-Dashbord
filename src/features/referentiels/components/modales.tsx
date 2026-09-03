import { z } from "zod";
import {
  ChampSelection,
  ChampTexte,
  ChampZoneTexte,
  ModaleFormulaire,
  Rangee,
  RangeeTriple,
} from "@/components/shared/formulaire";
import { useDevises, usePays, usePortefeuilles } from "../hooks/use-referentiels";

/*
 * Modales du Referentiel. Six des treize captures Container*.png.
 *
 * Chaque schema Zod dit une regle metier, pas seulement un type : un
 * identifiant court ne changera plus jamais une fois publie, un plafond
 * maximum ne peut pas etre inferieur a son minimum, un nom local est ce que
 * le client final lira.
 */

/* --- Declarer un fournisseur, Container-2.png --- */

const schemaFournisseur = z.object({
  nom: z.string().trim().min(2, "Donnez un nom au fournisseur."),
  identifiantCourt: z
    .string()
    .trim()
    .min(2, "Donnez un identifiant court.")
    .regex(
      /^[a-z0-9-]+$/,
      "Minuscules, chiffres et tirets uniquement : cet identifiant ne devrait plus jamais changer.",
    ),
  adresseApi: z.url("Indiquez une adresse complète, protocole compris."),
  type: z.enum(["direct", "agregateur"], "Choisissez un type."),
  description: z.string().trim().max(500).optional(),
});

type ValeursFournisseur = z.infer<typeof schemaFournisseur>;

export function ModaleDeclarerFournisseur({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  return (
    <ModaleFormulaire<ValeursFournisseur>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Déclarer un fournisseur"
      sousTitre="Aucun identifiant ne se saisit ici. Les secrets des fournisseurs sont installés sur le serveur."
      schema={schemaFournisseur}
      valeursParDefaut={{
        nom: "",
        identifiantCourt: "",
        adresseApi: "",
        type: "direct",
        description: "",
      }}
      onSoumettre={onFermer}
      libelleAction="Enregistrer"
      dispositionPied="pleine-largeur"
    >
      {(formulaire) => (
        <>
          <Rangee>
            <ChampTexte
              formulaire={formulaire}
              nom="nom"
              etiquette="Nom"
              requis
              indication="PawaPay"
            />
            <ChampTexte
              formulaire={formulaire}
              nom="identifiantCourt"
              etiquette="Identifiant court"
              requis
              indication="pawapay"
              aide="Minuscules, chiffres et tirets. Il ne devrait plus jamais changer."
            />
          </Rangee>

          <ChampTexte
            formulaire={formulaire}
            nom="adresseApi"
            etiquette="Adresse de l'API"
            requis
            type="url"
            indication="https://api.fournisseur.exemple"
          />

          <ChampSelection
            formulaire={formulaire}
            nom="type"
            etiquette="Type"
            requis
            options={[
              { valeur: "direct", libelle: "Connecteur direct" },
              { valeur: "agregateur", libelle: "Agrégateur" },
            ]}
            aide="Un agrégateur sert beaucoup de destinations par une intégration unique, un connecteur direct une seule."
          />

          <ChampZoneTexte
            formulaire={formulaire}
            nom="description"
            etiquette="Description"
            indication="Ce que ce fournisseur sert, et à quelles conditions."
          />
        </>
      )}
    </ModaleFormulaire>
  );
}

/* --- Declarer une marque de portefeuille, Container-3.png --- */

const schemaMarque = z.object({
  nomCommercial: z.string().trim().min(2, "Donnez le nom commercial de la marque."),
  identifiantCourt: z
    .string()
    .trim()
    .min(2, "Donnez un identifiant court.")
    .regex(
      /^[a-z0-9-]+$/,
      "Minuscules, chiffres et tirets uniquement : il ne devrait plus jamais changer.",
    ),
  type: z.enum(["mobile", "banque", "carte"], "Choisissez un type."),
  emetteur: z.enum(["operateur", "banque", "fintech"], "Choisissez un émetteur."),
});

type ValeursMarque = z.infer<typeof schemaMarque>;

export function ModaleDeclarerMarque({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  return (
    <ModaleFormulaire<ValeursMarque>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Déclarer une marque"
      sousTitre="L'identifiant court est public : le catalogue l'expose aux intégrateurs, qui le codent en dur."
      schema={schemaMarque}
      valeursParDefaut={{
        nomCommercial: "",
        identifiantCourt: "",
        type: "mobile",
        emetteur: "operateur",
      }}
      onSoumettre={onFermer}
      libelleAction="Enregistrer"
      dispositionPied="pleine-largeur"
    >
      {(formulaire) => (
        <>
          <ChampTexte
            formulaire={formulaire}
            nom="nomCommercial"
            etiquette="Nom commercial"
            requis
            indication="MTN MoMo"
          />
          <ChampTexte
            formulaire={formulaire}
            nom="identifiantCourt"
            etiquette="Identifiant court"
            requis
            indication="mtn-momo"
            aide="Public et définitif : les intégrateurs le codent en dur."
          />
          <Rangee>
            <ChampSelection
              formulaire={formulaire}
              nom="type"
              etiquette="Type"
              requis
              options={[
                { valeur: "mobile", libelle: "Portefeuille mobile" },
                { valeur: "banque", libelle: "Compte bancaire" },
                { valeur: "carte", libelle: "Carte" },
              ]}
              aide="Moyen de paiement du client."
            />
            <ChampSelection
              formulaire={formulaire}
              nom="emetteur"
              etiquette="Émetteur"
              requis
              options={[
                { valeur: "operateur", libelle: "Portefeuille d'opérateur" },
                { valeur: "banque", libelle: "Banque" },
                { valeur: "fintech", libelle: "Fintech" },
              ]}
              aide="Un portefeuille d'opérateur exige un réseau à chaque présence, une fintech s'en passe."
            />
          </Rangee>
        </>
      )}
    </ModaleFormulaire>
  );
}

/* --- Declarer un operateur, Container-4.png --- */

const schemaOperateur = z.object({
  identifiant: z.string().trim().min(2, "Donnez un identifiant."),
  nom: z.string().trim().min(2, "Donnez le nom de l'opérateur."),
  pays: z.string().min(1, "Choisissez un pays."),
  anciensNoms: z.string().trim().optional(),
});

type ValeursOperateur = z.infer<typeof schemaOperateur>;

export function ModaleDeclarerOperateur({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  const pays = usePays();

  return (
    <ModaleFormulaire<ValeursOperateur>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Déclarer un opérateur"
      sousTitre="Les entreprises qui exploitent les portefeuilles, à ne pas confondre avec les marques. Yas Togo exploite Mix by Yass."
      schema={schemaOperateur}
      valeursParDefaut={{ identifiant: "", nom: "", pays: "", anciensNoms: "" }}
      onSoumettre={onFermer}
      libelleAction="Déclarer"
    >
      {(formulaire) => (
        <>
          <ChampTexte
            formulaire={formulaire}
            nom="identifiant"
            etiquette="Identifiant"
            requis
            indication="mtn-bj"
          />
          <ChampTexte
            formulaire={formulaire}
            nom="nom"
            etiquette="Nom"
            requis
            indication="MTN Bénin"
          />
          <ChampSelection
            formulaire={formulaire}
            nom="pays"
            etiquette="Pays"
            requis
            options={(pays.data ?? []).map((p) => ({
              valeur: p.code,
              libelle: p.nom,
            }))}
          />
          <ChampTexte
            formulaire={formulaire}
            nom="anciensNoms"
            etiquette="Anciens noms"
            indication="Areeba, Telecel"
            aide="Séparez par des virgules. Nos fournisseurs les emploient longtemps après le renommage."
          />
        </>
      )}
    </ModaleFormulaire>
  );
}

/* --- Ouvrir une presence, Container-6.png --- */

const schemaPresence = z.object({
  portefeuille: z.string().min(1, "Choisissez un portefeuille."),
  pays: z.string().min(1, "Choisissez un pays."),
  nomLocal: z.string().trim().min(2, "Donnez le nom sous lequel le client le reconnaît."),
  anciensNoms: z.string().trim().optional(),
});

type ValeursPresence = z.infer<typeof schemaPresence>;

export function ModaleOuvrirPresence({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  const portefeuilles = usePortefeuilles();
  const pays = usePays();

  return (
    <ModaleFormulaire<ValeursPresence>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Ouvrir une présence"
      sousTitre="Rendre un portefeuille disponible dans un pays, sous le nom que le client final y reconnaît."
      schema={schemaPresence}
      valeursParDefaut={{ portefeuille: "", pays: "", nomLocal: "", anciensNoms: "" }}
      onSoumettre={onFermer}
      libelleAction="Déclarer"
    >
      {(formulaire) => (
        <>
          <Rangee>
            <ChampSelection
              formulaire={formulaire}
              nom="portefeuille"
              etiquette="Portefeuille"
              requis
              options={(portefeuilles.data ?? []).map((p) => ({
                valeur: p.id,
                libelle: p.nom,
              }))}
            />
            <ChampSelection
              formulaire={formulaire}
              nom="pays"
              etiquette="Pays"
              requis
              options={(pays.data ?? []).map((p) => ({
                valeur: p.code,
                libelle: p.nom,
              }))}
            />
          </Rangee>
          <ChampTexte
            formulaire={formulaire}
            nom="nomLocal"
            etiquette="Nom local"
            requis
            indication="MoMo"
            aide="C'est ce nom que le client final verra au moment de payer."
          />
          <ChampTexte
            formulaire={formulaire}
            nom="anciensNoms"
            etiquette="Anciens noms"
            indication="Areeba"
            aide="Séparez par des virgules. Nos fournisseurs les emploient longtemps après le renommage."
          />
        </>
      )}
    </ModaleFormulaire>
  );
}

/* --- Renseigner un plafond, Container-5.png --- */

const schemaPlafond = z
  .object({
    minimum: z.string().trim().optional(),
    maximum: z.string().trim().optional(),
  })
  .refine(
    (valeurs) => {
      const min = Number(valeurs.minimum);
      const max = Number(valeurs.maximum);
      if (!valeurs.minimum || !valeurs.maximum) return true;
      return Number.isFinite(min) && Number.isFinite(max) && max >= min;
    },
    {
      message: "Le maximum ne peut pas être inférieur au minimum.",
      path: ["maximum"],
    },
  );

type ValeursPlafond = z.infer<typeof schemaPlafond>;

export function ModaleRenseignerPlafond({
  ouverte,
  onFermer,
  destination,
  devise,
  onMarquerInconnu,
}: {
  ouverte: boolean;
  onFermer: () => void;
  destination: string;
  devise: string;
  onMarquerInconnu: () => void;
}) {
  return (
    <ModaleFormulaire<ValeursPlafond>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Renseigner un plafond"
      sousTitre={destination}
      schema={schemaPlafond}
      valeursParDefaut={{ minimum: "", maximum: "" }}
      onSoumettre={onFermer}
      libelleAction="Enregistrer le plafond"
      largeur="etroite"
    >
      {(formulaire) => (
        <>
          <Rangee>
            <ChampTexte
              formulaire={formulaire}
              nom="minimum"
              etiquette={`Minimum (${devise})`}
              montant
              indication="1000"
            />
            <ChampTexte
              formulaire={formulaire}
              nom="maximum"
              etiquette={`Maximum (${devise})`}
              montant
              indication="500000"
            />
          </Rangee>

          {/* Marquer inconnu n'est pas un abandon : c'est une declaration.
              Elle dit que la valeur n'a pas ete communiquee, ce qui n'est pas
              la meme chose qu'un plafond absent. */}
          <button
            type="button"
            onClick={onMarquerInconnu}
            className="w-fit rounded-sm text-corps font-medium text-warning-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Marquer le plafond comme inconnu
          </button>
          <p className="-mt-3 text-mention text-fg-secondary">
            Une borne à plafond inconnu refuse silencieusement au-delà du plafond
            par défaut. Le déclarer inconnu la fait apparaître dans le décompte.
          </p>
        </>
      )}
    </ModaleFormulaire>
  );
}

/* --- Exiger un champ, Container-7.png --- */

const schemaChampExige = z.object({
  portefeuille: z.string().min(1, "Choisissez un portefeuille."),
  pays: z.string().optional(),
  sens: z.string().optional(),
  type: z.string().min(1, "Choisissez un type."),
  cleTechnique: z.string().trim().optional(),
  libelle: z.string().trim().min(2, "Donnez le libellé lu par le client."),
  expression: z.string().trim().min(1, "Donnez l'expression à valider."),
  longueurMin: z.string().trim().optional(),
  longueurMax: z.string().trim().optional(),
  ordre: z.string().trim().optional(),
});

type ValeursChampExige = z.infer<typeof schemaChampExige>;

export function ModaleExigerChamp({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  const portefeuilles = usePortefeuilles();
  const pays = usePays();
  const devises = useDevises();

  void devises;

  return (
    <ModaleFormulaire<ValeursChampExige>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Exiger un champ"
      sousTitre="Il sera publié au catalogue et vérifié à chaque paiement : les deux lisent la même ligne."
      schema={schemaChampExige}
      valeursParDefaut={{
        portefeuille: "",
        pays: "",
        sens: "",
        type: "",
        cleTechnique: "",
        libelle: "",
        expression: "",
        longueurMin: "",
        longueurMax: "",
        ordre: "",
      }}
      onSoumettre={onFermer}
      libelleAction="Exiger"
    >
      {(formulaire) => (
        <>
          <Rangee>
            <ChampSelection
              formulaire={formulaire}
              nom="portefeuille"
              etiquette="Portefeuille"
              requis
              options={(portefeuilles.data ?? []).map((p) => ({
                valeur: p.id,
                libelle: p.nom,
              }))}
            />
            <ChampSelection
              formulaire={formulaire}
              nom="pays"
              etiquette="Pays"
              indication="Tous les pays"
              options={(pays.data ?? []).map((p) => ({
                valeur: p.code,
                libelle: p.nom,
              }))}
            />
          </Rangee>

          <Rangee>
            <ChampSelection
              formulaire={formulaire}
              nom="sens"
              etiquette="Sens"
              indication="Les deux sens"
              options={[
                { valeur: "encaissement", libelle: "Encaissement" },
                { valeur: "decaissement", libelle: "Décaissement" },
              ]}
            />
            <ChampSelection
              formulaire={formulaire}
              nom="type"
              etiquette="Type"
              requis
              options={[
                { valeur: "texte", libelle: "Texte" },
                { valeur: "nombre", libelle: "Nombre" },
                { valeur: "telephone", libelle: "Numéro de téléphone" },
                { valeur: "piece", libelle: "Pièce d'identité" },
              ]}
            />
          </Rangee>

          <Rangee>
            <ChampTexte
              formulaire={formulaire}
              nom="cleTechnique"
              etiquette="Clé technique"
              indication="numero_piece"
            />
            <ChampTexte
              formulaire={formulaire}
              nom="libelle"
              etiquette="Libellé"
              requis
              indication="Numéro de pièce d'identité"
              aide="C'est ce que le client final lira."
            />
          </Rangee>

          <ChampTexte
            formulaire={formulaire}
            nom="expression"
            etiquette="Expression à valider"
            requis
            indication="^[0-9]{10}$"
          />

          <RangeeTriple>
            <ChampTexte
              formulaire={formulaire}
              nom="longueurMin"
              etiquette="Longueur minimale"
              montant
            />
            <ChampTexte
              formulaire={formulaire}
              nom="longueurMax"
              etiquette="Longueur maximale"
              montant
            />
            <ChampTexte formulaire={formulaire} nom="ordre" etiquette="Ordre" montant />
          </RangeeTriple>
        </>
      )}
    </ModaleFormulaire>
  );
}
