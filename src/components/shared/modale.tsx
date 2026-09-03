import { TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bandeau } from "./bandeau";
import { TRAIT_ICONE } from "@/lib/icones";
import { cn } from "@/lib/utils";

/*
 * Modale generique.
 *
 * Les treize captures Container*.png sont autant de reglages du meme
 * gabarit, pas treize composants : un entete (titre, sous-titre, fermeture),
 * un corps libre, un pied dont seule la disposition varie. Les trois
 * dispositions relevees sont exposees par `dispositionPied`.
 */

export type DispositionPied =
  /* Actions collees a gauche sous le corps, relevee dans Container-10 et -11. */
  | "gauche"
  /* Actions a droite, relevee dans Container.png. */
  | "droite"
  /* Barre grise pleine largeur, action tierce a gauche, relevee dans Container-5. */
  | "barre"
  /* Action unique pleine largeur, relevee dans Container-1. */
  | "pleine-largeur";

const LARGEURS = {
  etroite: "sm:max-w-[480px]",
  standard: "sm:max-w-[560px]",
} as const;

export function Modale({
  ouverte,
  onChangementOuverture,
  titre,
  sousTitre,
  largeur = "standard",
  children,
  pied,
  dispositionPied = "droite",
  /** Message sous le pied, par exemple ce qui reste a renseigner. */
  messagePied,
}: {
  ouverte: boolean;
  onChangementOuverture: (ouverte: boolean) => void;
  titre: string;
  sousTitre?: string;
  largeur?: keyof typeof LARGEURS;
  children: React.ReactNode;
  pied?: React.ReactNode;
  dispositionPied?: DispositionPied;
  messagePied?: string;
}) {
  const enBarre = dispositionPied === "barre";

  return (
    <Dialog open={ouverte} onOpenChange={onChangementOuverture}>
      <DialogContent
        className={cn("gap-0 p-0", LARGEURS[largeur])}
        showCloseButton={false}
      >
        <DialogHeader className="px-8 pt-8 pr-16 pb-0 text-left">
          <DialogTitle className="text-titre font-semibold text-fg-primary">
            {titre}
          </DialogTitle>
          {sousTitre ? (
            <DialogDescription className="mt-1 text-mention text-fg-secondary">
              {sousTitre}
            </DialogDescription>
          ) : (
            /* Radix exige une description accessible. Quand la maquette n'en
               montre pas, le titre en tient lieu sans etre repete a l'ecran. */
            <DialogDescription className="sr-only">{titre}</DialogDescription>
          )}
        </DialogHeader>

        <div className="px-8 py-6">{children}</div>

        {pied && (
          <div
            className={cn(
              enBarre
                ? "flex items-center gap-4 rounded-b-lg border-t border-border bg-muted px-8 py-5"
                : "px-8 pb-8",
            )}
          >
            <div
              className={cn(
                "flex w-full flex-wrap items-center gap-3",
                dispositionPied === "droite" && "justify-end",
                dispositionPied === "barre" && "justify-end",
                dispositionPied === "pleine-largeur" && "flex-col",
              )}
            >
              {pied}
            </div>
          </div>
        )}

        {messagePied && (
          <p className="px-8 pb-6 text-right text-mention text-warning-text">
            {messagePied}
          </p>
        )}

        {/* Rendu en dernier dans le DOM, positionne visuellement en haut a
            droite : Radix donne le focus au premier element focalisable, et
            ce doit etre le premier champ du formulaire, pas la croix de
            fermeture. */}
        <BoutonFermeture />
      </DialogContent>
    </Dialog>
  );
}

function BoutonFermeture() {
  return (
    <DialogClose
      className="absolute top-7 right-7 grid size-8 shrink-0 place-items-center rounded-md text-fg-muted transition-colors hover:bg-muted hover:text-fg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      aria-label="Fermer"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={TRAIT_ICONE}
        strokeLinecap="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </DialogClose>
  );
}

/** Bouton d'annulation, identique dans toutes les modales. */
export function BoutonAnnuler({ libelle = "Annuler" }: { libelle?: string }) {
  return (
    <DialogClose asChild>
      <Button type="button" variant="outline">
        {libelle}
      </Button>
    </DialogClose>
  );
}

/*
 * Modale de confirmation d'une action irreversible.
 *
 * Le corps decrit ce qui va se passer en consequences reelles, cote
 * marchand, cote argent, cote route, et non en objets techniques. Le
 * libelle du bouton nomme l'acte, jamais "Confirmer" : on ne clique pas sur
 * un mot vide pour declencher quelque chose d'irreversible.
 */
export function ModaleConfirmation({
  ouverte,
  onChangementOuverture,
  titre,
  /** Ce que l'action produit reellement, en une ou deux phrases. */
  consequences,
  /** Ce qui ne pourra pas etre defait, s'il y a lieu. */
  avertissement,
  libelleAction,
  onConfirmer,
  enCours = false,
  destructif = true,
}: {
  ouverte: boolean;
  onChangementOuverture: (ouverte: boolean) => void;
  titre: string;
  consequences: string;
  avertissement?: string;
  libelleAction: string;
  onConfirmer: () => void;
  enCours?: boolean;
  destructif?: boolean;
}) {
  return (
    <Modale
      ouverte={ouverte}
      onChangementOuverture={onChangementOuverture}
      titre={titre}
      largeur="etroite"
      dispositionPied="gauche"
      pied={
        <>
          <Button
            type="button"
            variant={destructif ? "destructive" : "default"}
            onClick={onConfirmer}
            disabled={enCours}
          >
            {enCours ? "En cours..." : libelleAction}
          </Button>
          <BoutonAnnuler />
        </>
      }
    >
      <p className="text-corps leading-relaxed text-fg-secondary">{consequences}</p>

      {avertissement && (
        <Bandeau
          genre="attente"
          titre="Cette action ne se défait pas"
          description={avertissement}
          className="mt-5 px-5 py-4"
        />
      )}
    </Modale>
  );
}

/** Icone d'avertissement reutilisable dans un corps de modale. */
export function IconeAvertissement() {
  return (
    <TriangleAlert
      className="size-5 text-warning-fg"
      strokeWidth={TRAIT_ICONE}
      aria-hidden="true"
    />
  );
}
