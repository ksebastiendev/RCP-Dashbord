import { z } from "zod";
import {
  CartesRadio,
  ChampFormulaire,
} from "@/components/shared/champ-formulaire";
import { CLASSES_CONTROLE } from "@/components/shared/classes-controle";
import {
  ChampSelection,
  ChampTexte,
  ModaleFormulaire,
} from "@/components/shared/formulaire";
import { EXPLICATION_MODE } from "./libelles";

/*
 * Modales de la section Marchand. Deux des treize captures.
 */

/* --- Nouvelle application, Container.png --- */

const schemaApplication = z.object({
  nom: z.string().trim().min(2, "Donnez un nom à l'application."),
  mode: z.enum(["demonstration", "reel"], "Choisissez le mode de l'application."),
});

type ValeursApplication = z.infer<typeof schemaApplication>;

export function ModaleNouvelleApplication({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  return (
    <ModaleFormulaire<ValeursApplication>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Nouvelle application"
      sousTitre="Une application est un point de branchement du marchand. Chacune a ses propres clés."
      schema={schemaApplication}
      valeursParDefaut={{ nom: "", mode: "demonstration" }}
      onSoumettre={onFermer}
      libelleAction="Créer l'application"
    >
      {(formulaire) => (
        <>
          <ChampTexte
            formulaire={formulaire}
            nom="nom"
            etiquette="Nom de l'application"
            requis
            indication="Site e-commerce"
          />

          {/* Le mode se choisit sur sa consequence, pas sur son nom : c'est
              la seule decision de ce formulaire qui engage de l'argent reel. */}
          <CartesRadio
            libelleGroupe="Mode"
            valeur={formulaire.watch("mode") ?? null}
            onChangement={(valeur) =>
              formulaire.setValue("mode", valeur, { shouldValidate: true })
            }
            erreur={formulaire.formState.errors.mode?.message}
            options={[
              {
                valeur: "demonstration",
                titre: "Démonstration",
                description: EXPLICATION_MODE.demonstration,
              },
              {
                valeur: "reel",
                titre: "Réel",
                description: EXPLICATION_MODE.reel,
              },
            ]}
          />
        </>
      )}
    </ModaleFormulaire>
  );
}

/* --- Enregistrer une adresse de notification, Container-1.png --- */

const schemaAdresse = z.object({
  application: z.string().min(1, "Choisissez l'application concernée."),
  evenement: z.string().min(1, "Choisissez l'événement qui déclenchera l'appel."),
  adresse: z
    .url("Indiquez une adresse complète, protocole compris.")
    .refine(
      (valeur) => valeur.startsWith("https://"),
      "L'adresse doit commencer par https. Un secret qui transite en clair est un secret qu'on peut intercepter.",
    ),
  secretPartage: z
    .string()
    .trim()
    .min(16, "Un secret partagé fait au moins seize caractères."),
});

type ValeursAdresse = z.infer<typeof schemaAdresse>;

const EVENEMENTS = [
  { valeur: "paiement-reussi", libelle: "Paiement réussi" },
  { valeur: "paiement-echoue", libelle: "Paiement échoué" },
  { valeur: "remboursement", libelle: "Remboursement effectué" },
  { valeur: "litige", libelle: "Litige ouvert" },
];

export function ModaleEnregistrerAdresse({
  ouverte,
  onFermer,
  applications,
}: {
  ouverte: boolean;
  onFermer: () => void;
  applications: Array<{ id: string; nom: string }>;
}) {
  return (
    <ModaleFormulaire<ValeursAdresse>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Enregistrer une adresse"
      sousTitre="Le secret partagé permet au marchand de vérifier que la notification vient bien de nous."
      schema={schemaAdresse}
      valeursParDefaut={{
        application: "",
        evenement: "",
        adresse: "",
        secretPartage: "",
      }}
      onSoumettre={onFermer}
      libelleAction="Enregistrer"
      dispositionPied="pleine-largeur"
    >
      {(formulaire) => (
        <>
          <ChampSelection
            formulaire={formulaire}
            nom="application"
            etiquette="Application"
            requis
            options={applications.map((a) => ({ valeur: a.id, libelle: a.nom }))}
          />
          <ChampSelection
            formulaire={formulaire}
            nom="evenement"
            etiquette="Événement"
            requis
            options={EVENEMENTS}
            aide="Le type de changement d'état qui déclenchera l'appel."
          />
          <ChampTexte
            formulaire={formulaire}
            nom="adresse"
            etiquette="Adresse"
            requis
            type="url"
            indication="https://marchand.exemple/webhooks/bestcash"
          />

          {/* Le secret est saisi masque et n'est plus jamais reaffiche : il
              n'a pas de champ de relecture ailleurs dans l'interface. */}
          <ChampFormulaire
            etiquette="Secret partagé"
            requis
            aide="Ne sera plus affiché après l'enregistrement."
            erreur={formulaire.formState.errors.secretPartage?.message}
          >
            {(attributs) => (
              <input
                {...attributs}
                {...formulaire.register("secretPartage")}
                type="password"
                autoComplete="new-password"
                className={CLASSES_CONTROLE}
              />
            )}
          </ChampFormulaire>
        </>
      )}
    </ModaleFormulaire>
  );
}
