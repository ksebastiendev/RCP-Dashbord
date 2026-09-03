import { useId } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import type { Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Bandeau } from "./bandeau";
import { BoutonAnnuler, Modale, type DispositionPied } from "./modale";
import { ChampFormulaire } from "./champ-formulaire";
import { CLASSES_CONTROLE, CLASSES_CONTROLE_MONTANT } from "./classes-controle";
import { estErreurApi } from "@/lib/erreurs";
import { cn } from "@/lib/utils";

/*
 * Modale de formulaire.
 *
 * Les treize captures Container*.png sont treize formulaires dans le meme
 * gabarit. Ce composant assemble une fois pour toutes la modale, React Hook
 * Form, le resolver Zod et le report des erreurs renvoyees par le serveur :
 * chaque formulaire n'a plus qu'a declarer son schema et ses champs.
 *
 * Le schema Zod sert deux fois : il valide la saisie et il type les valeurs.
 * Une regle metier ne s'ecrit donc qu'a un seul endroit.
 */

export function ModaleFormulaire<T extends FieldValues>({
  ouverte,
  onChangementOuverture,
  titre,
  sousTitre,
  schema,
  valeursParDefaut,
  onSoumettre,
  libelleAction,
  dispositionPied = "droite",
  largeur = "standard",
  enCours = false,
  erreurSoumission,
  children,
}: {
  ouverte: boolean;
  onChangementOuverture: (ouverte: boolean) => void;
  titre: string;
  sousTitre?: string;
  schema: ZodType<T>;
  valeursParDefaut: DefaultValues<T>;
  onSoumettre: (valeurs: T) => void;
  libelleAction: string;
  dispositionPied?: DispositionPied;
  largeur?: "etroite" | "standard";
  enCours?: boolean;
  /** Erreur renvoyee par la mutation, affichee en tete du corps. */
  erreurSoumission?: unknown;
  children: (formulaire: UseFormReturn<T>) => React.ReactNode;
}) {
  const formulaire = useForm<T>({
    /*
     * zodResolver ne sait pas relier un ZodType generique au type de
     * formulaire : la relation est garantie par la signature du composant,
     * ou schema et valeursParDefaut portent le meme T. La conversion est
     * donc limitee a cette ligne, et aucun appelant n'a a la refaire.
     */
    resolver: zodResolver(schema as never) as Resolver<T>,
    defaultValues: valeursParDefaut,
    /* La validation ne se declenche qu'a la sortie du champ : signaler une
       adresse invalide des le premier caractere tape est du bruit. */
    mode: "onBlur",
  });

  const identifiant = useId();

  const messageServeur = estErreurApi(erreurSoumission)
    ? erreurSoumission.message
    : erreurSoumission
      ? "La demande a été refusée."
      : null;

  return (
    <Modale
      ouverte={ouverte}
      onChangementOuverture={(prochain) => {
        if (!prochain) formulaire.reset();
        onChangementOuverture(prochain);
      }}
      titre={titre}
      sousTitre={sousTitre}
      largeur={largeur}
      dispositionPied={dispositionPied}
      pied={
        <>
          {dispositionPied === "pleine-largeur" ? (
            <Button
              type="submit"
              form={identifiant}
              className="w-full"
              disabled={enCours}
            >
              {enCours ? "Enregistrement..." : libelleAction}
            </Button>
          ) : (
            <>
              <BoutonAnnuler />
              <Button type="submit" form={identifiant} disabled={enCours}>
                {enCours ? "Enregistrement..." : libelleAction}
              </Button>
            </>
          )}
        </>
      }
    >
      {messageServeur && (
        <Bandeau
          genre="danger"
          titre="La demande a été refusée"
          description={messageServeur}
          className="mb-5 px-5 py-4"
        />
      )}

      <form
        id={identifiant}
        onSubmit={formulaire.handleSubmit(onSoumettre)}
        noValidate
        className="flex flex-col gap-5"
      >
        {children(formulaire)}
      </form>
    </Modale>
  );
}

/** Deux champs cote a cote, disposition la plus frequente des maquettes. */
export function Rangee({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

/** Trois champs cote a cote, relevee dans Container-7.png. */
export function RangeeTriple({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-3">{children}</div>;
}

type ProprietesChampCommunes<T extends FieldValues> = {
  formulaire: UseFormReturn<T>;
  nom: Path<T>;
  etiquette: string;
  requis?: boolean;
  aide?: string;
};

export function ChampTexte<T extends FieldValues>({
  formulaire,
  nom,
  etiquette,
  requis,
  aide,
  indication,
  type = "text",
  montant = false,
}: ProprietesChampCommunes<T> & {
  indication?: string;
  type?: "text" | "url" | "email" | "password";
  /** Un montant se saisit en chiffres tabulaires, aligne comme il s'affiche. */
  montant?: boolean;
}) {
  const erreur = formulaire.formState.errors[nom]?.message as string | undefined;

  return (
    <ChampFormulaire etiquette={etiquette} requis={requis} aide={aide} erreur={erreur}>
      {(attributs) => (
        <input
          {...attributs}
          {...formulaire.register(nom)}
          type={type}
          inputMode={montant ? "numeric" : undefined}
          placeholder={indication}
          autoComplete="off"
          className={montant ? CLASSES_CONTROLE_MONTANT : CLASSES_CONTROLE}
        />
      )}
    </ChampFormulaire>
  );
}

export function ChampZoneTexte<T extends FieldValues>({
  formulaire,
  nom,
  etiquette,
  requis,
  aide,
  indication,
  lignes = 3,
}: ProprietesChampCommunes<T> & { indication?: string; lignes?: number }) {
  const erreur = formulaire.formState.errors[nom]?.message as string | undefined;

  return (
    <ChampFormulaire etiquette={etiquette} requis={requis} aide={aide} erreur={erreur}>
      {(attributs) => (
        <textarea
          {...attributs}
          {...formulaire.register(nom)}
          rows={lignes}
          placeholder={indication}
          className={cn(CLASSES_CONTROLE, "h-auto py-3")}
        />
      )}
    </ChampFormulaire>
  );
}

export function ChampSelection<T extends FieldValues>({
  formulaire,
  nom,
  etiquette,
  requis,
  aide,
  options,
  indication = "Choisir...",
}: ProprietesChampCommunes<T> & {
  options: Array<{ valeur: string; libelle: string }>;
  indication?: string;
}) {
  const erreur = formulaire.formState.errors[nom]?.message as string | undefined;

  return (
    <ChampFormulaire etiquette={etiquette} requis={requis} aide={aide} erreur={erreur}>
      {(attributs) => (
        <select
          {...attributs}
          {...formulaire.register(nom)}
          className={CLASSES_CONTROLE}
        >
          <option value="">{indication}</option>
          {options.map((option) => (
            <option key={option.valeur} value={option.valeur}>
              {option.libelle}
            </option>
          ))}
        </select>
      )}
    </ChampFormulaire>
  );
}
