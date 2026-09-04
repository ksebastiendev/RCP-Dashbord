import type { ReactNode } from "react";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";

/*
 * Gabarit des ecrans de liste du Referentiel.
 *
 * Les six ecrans de la section partagent la meme suite : entete, bandeau
 * facultatif, indicateurs facultatifs, tableau. Poser cet ordre et ces
 * espacements une seule fois est ce qui empeche deux ecrans du meme gabarit
 * de diverger de quelques pixels.
 *
 * Il n'y a plus d'emplacement de filtres ici : la barre de filtres est
 * entree dans la carte du tableau, au dessus de l'entete de colonnes, pour
 * que recherche, tableau et pagination forment un seul bloc.
 */
export function GabaritListe({
  titre,
  description,
  action,
  onglets,
  bandeau,
  indicateurs,
  children,
}: {
  titre: string;
  description: string;
  action?: ReactNode;
  onglets?: ReactNode;
  bandeau?: ReactNode;
  indicateurs?: ReactNode;
  children: ReactNode;
}) {
  return (
    <CorpsEcran>
      <EnTeteEcran titre={titre} description={description} action={action} />
      {onglets}
      {bandeau}
      {indicateurs}
      {children}
    </CorpsEcran>
  );
}

/** Rangee d'indicateurs. Trois colonnes dans les maquettes. */
export function RangeeIndicateurs({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-3">{children}</div>;
}
