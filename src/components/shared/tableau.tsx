import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Carte } from "./carte";
import { EtatErreur } from "./etat-erreur";
import { cn } from "@/lib/utils";
import { Vignette } from "./vignette-marque";

/*
 * Tableau de liste, avec ses trois etats : plein, vide, chargement.
 *
 * Le chargement rend la meme structure que les donnees, aux memes
 * dimensions : meme entete, meme hauteur de ligne, memes largeurs de
 * colonne, portees par un unique colgroup. L'arrivee des donnees ne
 * deplace donc rien. Pas de rotateur centre : un rotateur ne dit ni
 * combien de lignes arrivent, ni a quoi elles ressemblent.
 */

export type Colonne<T> = {
  cle: string;
  entete: string;
  cellule: (ligne: T) => ReactNode;
  /** Les montants et les nombres s'alignent a droite. */
  alignement?: "gauche" | "droite";
  /** Largeur CSS. Fixer les largeurs evite tout deplacement au chargement. */
  largeur?: string;
  /**
   * Largeur du bloc de squelette dans cette colonne. Approche la longueur
   * reelle du contenu pour que le chargement ressemble au resultat.
   */
  squelette?: string;
};

type ProprietesTableau<T> = {
  colonnes: Colonne<T>[];
  lignes: T[] | undefined;
  cleLigne: (ligne: T) => string;
  /** Titre de la carte, par exemple "56 Opérateurs". */
  titre?: string;
  /** Phrase sous le titre, par exemple "18 réellement servies, 27 seulement connues". */
  sousTitre?: string;
  chargement?: boolean;
  erreur?: unknown;
  onReessayer?: () => void;
  /** Rendu quand la liste est chargee et vide. */
  etatVide?: ReactNode;
  /** Nombre de lignes de squelette. A calibrer sur la taille de page reelle. */
  lignesSquelette?: number;
  /**
   * Hauteur d'une ligne, en classe Tailwind. A relever quand les cellules
   * portent plusieurs lignes de texte : sans cela le squelette est plus
   * court que le tableau charge et la mise en page saute a l'arrivee des
   * donnees, ce que le squelette existe precisement pour eviter.
   */
  hauteurLigne?: string;
  /**
   * Barre d'outils, rendue dans la carte au dessus du tableau : recherche,
   * filtres, action de droite. Elle vit ici et non a cote de la carte,
   * pour que la recherche, le tableau et la pagination forment un seul
   * bloc borde plutot que trois blocs empiles.
   */
  outils?: ReactNode;
  /**
   * Largeur en dessous de laquelle le tableau defile plutot que de se
   * comprimer. Par defaut 160 px par colonne, avec un plancher a 640 :
   * une colonne de moins de 160 px n'affiche plus rien d'utile.
   */
  largeurMinimale?: number;
  /** Rendu sous le tableau, typiquement la pagination. */
  pied?: ReactNode;
};

export function Tableau<T>({
  colonnes,
  lignes,
  cleLigne,
  titre,
  sousTitre,
  chargement = false,
  erreur,
  onReessayer,
  etatVide,
  lignesSquelette = 8,
  hauteurLigne = "h-14",
  outils,
  largeurMinimale,
  pied,
}: ProprietesTableau<T>) {
  const vide = !chargement && !erreur && (lignes?.length ?? 0) === 0;
  const plancher = largeurMinimale ?? Math.max(640, colonnes.length * 160);

  return (
    <Carte avecBordure={false} className="overflow-hidden">
      {outils && (
        <div className="border-b border-table-row-separator px-6 py-4">
          {outils}
        </div>
      )}

      {titre !== undefined && (
        <div className="flex min-h-[42px] flex-col justify-center px-6 py-3">
          {chargement ? (
            <>
              {/* Le titre porte un decompte. Tant qu'il n'est pas connu, il
                  ne s'invente pas : un squelette, jamais un zero. */}
              <Skeleton className="h-5 w-32" />
              {sousTitre !== undefined && (
                <Skeleton className="mt-1.5 h-3.5 w-72" />
              )}
            </>
          ) : (
            <>
              <h2 className="text-section font-semibold text-fg-primary">
                {titre}
              </h2>
              {sousTitre && (
                <p className="mt-0.5 text-mention text-fg-secondary">
                  {sousTitre}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {erreur ? (
        <EtatErreur erreur={erreur} onReessayer={onReessayer} compact />
      ) : (
        /*
         * Le tableau ne se laisse pas ecraser sous sa largeur lisible : en
         * dessous, il defile horizontalement dans son propre conteneur.
         * Sans ce plancher, sur un ecran de 390 px, les cinq colonnes se
         * partageaient la place et il ne restait de chacune que deux
         * caracteres. La page entiere, elle, ne defile jamais de cote.
         *
         * Le conteneur porte tabIndex : une zone qui defile doit pouvoir
         * etre atteinte et parcourue au clavier, pas seulement au doigt.
         */
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={titre ? `Tableau : ${titre}` : "Tableau"}
        >
          <table
            className="w-full table-fixed border-collapse text-left"
            style={{ minWidth: plancher }}
          >
            <colgroup>
              {colonnes.map((colonne) => (
                <col key={colonne.cle} style={{ width: colonne.largeur }} />
              ))}
            </colgroup>

            <thead>
              <tr className="border-b border-table-row-separator bg-table-header-bg">
                {colonnes.map((colonne) => (
                  <th
                    key={colonne.cle}
                    scope="col"
                    className={cn(
                      "h-[46px] overflow-hidden px-6 text-mention font-medium text-table-header-fg",
                      colonne.alignement === "droite" && "text-right",
                    )}
                  >
                    {colonne.entete}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {chargement &&
                Array.from({ length: lignesSquelette }, (_, index) => (
                  <tr
                    key={`squelette-${index}`}
                    className="border-b border-table-row-separator last:border-b-0"
                  >
                    {colonnes.map((colonne) => (
                      <td
                        key={colonne.cle}
                        className={cn("overflow-hidden px-6", hauteurLigne)}
                      >
                        <Skeleton
                          className={cn(
                            "h-4",
                            colonne.alignement === "droite" && "ml-auto",
                          )}
                          style={{ width: colonne.squelette ?? "70%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

              {!chargement &&
                lignes?.map((ligne) => (
                  <tr
                    key={cleLigne(ligne)}
                    className="border-b border-table-row-separator last:border-b-0"
                  >
                    {colonnes.map((colonne) => (
                      <td
                        key={colonne.cle}
                        className={cn(
                          /* table-fixed ne clippe pas seul : sans overflow
                             une cellule longue deborde sur la colonne
                             voisine au lieu d'etre tronquee. */
                          "overflow-hidden px-6 text-corps text-table-row-fg",
                          hauteurLigne,
                          colonne.alignement === "droite" && "text-right",
                        )}
                      >
                        {colonne.cellule(ligne)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>

          {vide && etatVide}
        </div>
      )}

      {pied && !erreur && (
        <div className="border-t border-table-row-separator">{pied}</div>
      )}
    </Carte>
  );
}

/**
 * Cellule de nom avec sa vignette.
 *
 * Le logo est resolu par le nom de la marque, faute d'URL fournie par le
 * serveur. Il reste decoratif : le nom ecrit a cote porte l'information.
 */
export function CelluleAvecVignette({
  urlVignette,
  libelle,
}: {
  urlVignette: string | null;
  libelle: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      {urlVignette ? (
        <img
          src={urlVignette}
          alt=""
          aria-hidden="true"
          className="size-7 shrink-0 rounded-full object-contain"
        />
      ) : (
        <Vignette nom={libelle} taille={28} />
      )}
      <span className="truncate text-fg-primary">{libelle}</span>
    </span>
  );
}
