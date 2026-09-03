import { z } from "zod";
import { CartesRadio } from "@/components/shared/champ-formulaire";
import { ChampTexte, ModaleFormulaire } from "@/components/shared/formulaire";
import { DESCRIPTION_ROLE, LIBELLE_ROLE } from "@/lib/libelles";
import type { Role } from "@/stores/session";

/*
 * Creer un compte, Container-12.png. La derniere des treize captures.
 *
 * Les quatre roles sont choisis sur ce qu'ils permettent, pas sur leur nom :
 * la description vient de lib/libelles, la meme table que celle lue par
 * l'ecran des comptes. Un role ne peut donc pas etre decrit differemment
 * selon l'endroit ou on le lit.
 */

const ROLES: Role[] = ["administrateur", "exploitant", "support", "lecture-seule"];

const schemaCompte = z.object({
  nomComplet: z.string().trim().min(2, "Donnez le nom complet de la personne."),
  courriel: z
    .email("Indiquez une adresse électronique valide.")
    .refine(
      (valeur) => valeur.trim().length > 0,
      "L'invitation sera envoyée à cette adresse.",
    ),
  role: z.enum(
    ["administrateur", "exploitant", "support", "lecture-seule"],
    "Choisissez un rôle.",
  ),
});

type ValeursCompte = z.infer<typeof schemaCompte>;

export function ModaleCreerCompte({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  return (
    <ModaleFormulaire<ValeursCompte>
      ouverte={ouverte}
      onChangementOuverture={(o) => !o && onFermer()}
      titre="Créer un compte"
      sousTitre="La personne recevra une invitation par courriel."
      schema={schemaCompte}
      valeursParDefaut={{ nomComplet: "", courriel: "", role: "lecture-seule" }}
      onSoumettre={onFermer}
      libelleAction="Créer le compte"
    >
      {(formulaire) => (
        <>
          <ChampTexte
            formulaire={formulaire}
            nom="nomComplet"
            etiquette="Nom complet"
            requis
            indication="Prénom Nom"
          />
          <ChampTexte
            formulaire={formulaire}
            nom="courriel"
            etiquette="Adresse électronique"
            requis
            type="email"
            indication="prenom.nom@bestcashpay.com"
          />

          <CartesRadio
            libelleGroupe="Rôle"
            colonnes={1}
            valeur={formulaire.watch("role") ?? null}
            onChangement={(valeur) =>
              formulaire.setValue("role", valeur, { shouldValidate: true })
            }
            erreur={formulaire.formState.errors.role?.message}
            options={ROLES.map((role) => ({
              valeur: role,
              titre: LIBELLE_ROLE[role],
              description: DESCRIPTION_ROLE[role],
            }))}
          />
        </>
      )}
    </ModaleFormulaire>
  );
}
