import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

/*
 * Groupe d'onglets, chaque onglet etant une vraie adresse.
 *
 * Un onglet garde dans un useState ou dans un magasin n'est pas
 * partageable : envoyer "la tarification de ce marchand" a un collegue
 * ouvre le dossier, revenir en arriere quitte la fiche entiere, et
 * recharger la page perd la vue. Avec une adresse par onglet, les trois
 * cas se comportent comme l'utilisateur les attend, sans code
 * supplementaire.
 *
 * L'apparence est celle du groupe de bascule des barres de filtres :
 * meme hauteur, meme rayon, meme couple actif. Ce sont deux composants
 * parce que ce sont deux mecaniques, un lien et un bouton, mais une seule
 * lecture pour qui regarde l'ecran.
 */

export type Onglet = {
  /** Adresse complete de l'onglet. */
  chemin: string;
  libelle: string;
  /** Vrai pour l'onglet servi par le chemin parent, sans segment propre. */
  exact?: boolean;
};

export function GroupeOnglets({
  libelleGroupe,
  onglets,
  className,
}: {
  /** Lu par les technologies d'assistance, pas affiche. */
  libelleGroupe: string;
  onglets: Onglet[];
  className?: string;
}) {
  return (
    <nav
      aria-label={libelleGroupe}
      className={cn("flex flex-wrap items-center gap-3", className)}
    >
      {onglets.map((onglet) => (
        <NavLink
          key={onglet.chemin}
          to={onglet.chemin}
          end={onglet.exact}
          className={({ isActive }) =>
            cn(
              "flex h-11 items-center rounded-md px-4 text-corps transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              isActive
                ? "bg-primary font-medium text-primary-foreground"
                : "border border-border bg-card text-fg-primary hover:bg-muted",
            )
          }
        >
          {onglet.libelle}
        </NavLink>
      ))}
    </nav>
  );
}
