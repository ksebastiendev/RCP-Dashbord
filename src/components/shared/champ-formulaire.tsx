import { useId } from "react";
import { cn } from "@/lib/utils";

/*
 * Champ de formulaire.
 *
 * Le composant porte l'etiquette, la marque d'obligation, le texte d'aide et
 * le message d'erreur, et cable les liens d'accessibilite entre les quatre.
 * Le controle lui-meme est fourni par l'appelant, ce qui evite un composant
 * different par type de saisie.
 *
 * L'obligation n'est pas portee par la seule asterisque rouge : le mot
 * "obligatoire" est lu par les technologies d'assistance.
 */

type ProprietesChamp = {
  etiquette: string;
  requis?: boolean;
  /** Precision affichee sous le controle, visible en permanence. */
  aide?: string;
  /** Message d'erreur, typiquement `formState.errors.champ?.message`. */
  erreur?: string;
  className?: string;
  /**
   * Rendu du controle. Recoit les attributs a poser sur l'element de saisie
   * pour que l'etiquette, l'aide et l'erreur y soient reellement rattachees.
   */
  children: (attributs: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean;
    "aria-required": boolean;
  }) => React.ReactNode;
};

export function ChampFormulaire({
  etiquette,
  requis = false,
  aide,
  erreur,
  className,
  children,
}: ProprietesChamp) {
  const identifiant = useId();
  const idControle = `${identifiant}-controle`;
  const idAide = `${identifiant}-aide`;
  const idErreur = `${identifiant}-erreur`;

  const description =
    [erreur ? idErreur : null, aide ? idAide : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={idControle}
        className="text-sm font-medium text-fg-primary"
      >
        {etiquette}
        {requis && (
          <>
            <span aria-hidden="true" className="ml-1 text-danger-fg">
              *
            </span>
            <span className="sr-only"> (obligatoire)</span>
          </>
        )}
      </label>

      {children({
        id: idControle,
        "aria-describedby": description,
        "aria-invalid": Boolean(erreur),
        "aria-required": requis,
      })}

      {erreur && (
        <p id={idErreur} className="text-sm text-danger-fg">
          {erreur}
        </p>
      )}

      {aide && (
        <p id={idAide} className="text-sm text-fg-secondary">
          {aide}
        </p>
      )}
    </div>
  );
}

/*
 * Groupe de cartes a choix unique, releve dans Container.png pour le mode
 * d'une application et dans Container-12.png pour le role d'un compte.
 *
 * Chaque option porte son explication : le choix se fait sur la consequence
 * reelle, pas sur le nom technique de l'option.
 */
export type OptionCarte<V extends string> = {
  valeur: V;
  titre: string;
  description: string;
};

export function CartesRadio<V extends string>({
  libelleGroupe,
  options,
  valeur,
  onChangement,
  colonnes = 2,
  erreur,
}: {
  libelleGroupe: string;
  options: OptionCarte<V>[];
  valeur: V | null;
  onChangement: (valeur: V) => void;
  colonnes?: 1 | 2;
  erreur?: string;
}) {
  const nomGroupe = useId();
  const idErreur = `${nomGroupe}-erreur`;

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium text-fg-primary">
        {libelleGroupe}
      </legend>

      <div
        className={cn("grid gap-3", colonnes === 2 ? "sm:grid-cols-2" : "grid-cols-1")}
        aria-describedby={erreur ? idErreur : undefined}
      >
        {options.map((option) => {
          const choisi = option.valeur === valeur;
          return (
            <label
              key={option.valeur}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-lg border bg-card px-5 py-4 transition-colors",
                "focus-within:ring-2 focus-within:ring-ring",
                choisi ? "border-primary" : "border-border hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name={nomGroupe}
                value={option.valeur}
                checked={choisi}
                onChange={() => onChangement(option.valeur)}
                className="sr-only"
              />
              <span className="flex items-start justify-between gap-3">
                <span className="text-[15px] font-medium text-fg-primary">
                  {option.titre}
                </span>
                {/* Marque de selection ajoutee aux maquettes, qui ne
                    signalent le choix que par la couleur de bordure. Le
                    changement de forme reste lisible sans percevoir la
                    couleur. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border-2",
                    choisi ? "border-primary" : "border-border",
                  )}
                >
                  {choisi && <span className="size-2 rounded-full bg-primary" />}
                </span>
              </span>
              <span className="text-sm leading-relaxed text-fg-secondary">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>

      {erreur && (
        <p id={idErreur} className="text-sm text-danger-fg">
          {erreur}
        </p>
      )}
    </fieldset>
  );
}
