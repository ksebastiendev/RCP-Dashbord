import { Link } from "react-router-dom";
import { Search, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carte } from "@/components/shared/carte";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { CLASSES_CONTROLE } from "@/components/shared/classes-controle";
import { Skeleton } from "@/components/ui/skeleton";
import { TRAIT_ICONE } from "@/lib/icones";
import { useRechercheLegale } from "../hooks/use-marchands";
import { useMarchandsStore } from "../store";
import type { TypeIdentifiantLegal } from "../types";
import { GENRE_STATUT, LIBELLE_STATUT } from "./libelles";

/*
 * Recherche par identifiant legal.
 *
 * Les identifiants sont chiffres au repos : le serveur compare des
 * empreintes, jamais des valeurs en clair. Deux consequences que
 * l'interface doit assumer plutot que masquer.
 *
 * D'abord la recherche est exacte, et il faut le dire : un utilisateur qui
 * croit chercher par prefixe conclura a tort que le marchand n'existe pas.
 *
 * Ensuite elle ne part pas a la frappe. Une recherche a chaque caractere
 * enverrait au serveur, une par une, toutes les valeurs partielles d'un
 * identifiant qu'on prend justement soin de ne jamais exposer.
 */

const TYPES: Array<{ valeur: TypeIdentifiantLegal; libelle: string; exemple: string }> = [
  {
    valeur: "immatriculation",
    libelle: "N° d'immatriculation",
    exemple: "RB/COT/24 B 12345",
  },
  {
    valeur: "identifiant-fiscal",
    libelle: "Identifiant fiscal",
    exemple: "IFU-3300123456789",
  },
  { valeur: "numero-tva", libelle: "Numéro de TVA", exemple: "BJ0123456789" },
];

export function RechercheLegale() {
  const type = useMarchandsStore((e) => e.typeIdentifiant);
  const definirType = useMarchandsStore((e) => e.definirTypeIdentifiant);
  const saisie = useMarchandsStore((e) => e.saisieIdentifiant);
  const definirSaisie = useMarchandsStore((e) => e.definirSaisieIdentifiant);
  const soumis = useMarchandsStore((e) => e.identifiantSoumis);
  const soumettre = useMarchandsStore((e) => e.soumettreIdentifiant);
  const effacer = useMarchandsStore((e) => e.effacerRechercheLegale);

  const recherche = useRechercheLegale(type, soumis, soumis.length > 0);
  const typeCourant = TYPES.find((t) => t.valeur === type) ?? TYPES[0];

  return (
    <Carte avecBordure={false} className="px-6 py-6">
      <div className="flex items-start gap-3">
        <ShieldCheck
          className="mt-0.5 size-5 shrink-0 text-fg-muted"
          strokeWidth={TRAIT_ICONE}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h2 className="text-titre font-semibold text-fg-primary">
            Retrouver par identifiant légal
          </h2>
          <p className="mt-1 max-w-[720px] text-mention leading-relaxed text-fg-secondary">
            Recherche exacte. Les identifiants sont chiffrés au repos : c'est leur
            empreinte à clé qui permet de les retrouver, sans jamais exposer la
            valeur cherchée. Un identifiant incomplet ne renvoie donc rien.
          </p>
        </div>
      </div>

      <form
        className="mt-5 flex flex-wrap items-end gap-3"
        onSubmit={(evenement) => {
          evenement.preventDefault();
          soumettre();
        }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="type-identifiant" className="sr-only">
            Type d'identifiant légal
          </label>
          <select
            id="type-identifiant"
            value={type}
            onChange={(evenement) =>
              definirType(evenement.target.value as TypeIdentifiantLegal)
            }
            className={`${CLASSES_CONTROLE} w-[220px] pr-8`}
          >
            {TYPES.map((option) => (
              <option key={option.valeur} value={option.valeur}>
                {option.libelle}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-[280px] flex-1 flex-col gap-2">
          <label htmlFor="valeur-identifiant" className="sr-only">
            {typeCourant.libelle}, valeur exacte
          </label>
          <input
            id="valeur-identifiant"
            type="text"
            value={saisie}
            onChange={(evenement) => definirSaisie(evenement.target.value)}
            placeholder={typeCourant.exemple}
            autoComplete="off"
            spellCheck={false}
            className={CLASSES_CONTROLE}
          />
        </div>

        <Button type="submit" className="h-12 px-6" disabled={saisie.trim().length === 0}>
          <Search className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          Rechercher
        </Button>

        {soumis && (
          <Button type="button" variant="outline" className="h-12" onClick={effacer}>
            <X className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
            Effacer
          </Button>
        )}
      </form>

      {soumis.length > 0 && (
        <div className="mt-5 border-t border-table-row-separator pt-5">
          {recherche.isPending ? (
            <div className="flex items-center gap-4">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="mt-2 h-3.5 w-32" />
              </div>
              <Skeleton className="h-6 w-24 rounded-sm" />
            </div>
          ) : recherche.error ? (
            <EtatErreur
              erreur={recherche.error}
              onReessayer={() => recherche.refetch()}
              compact
            />
          ) : recherche.data?.marchand ? (
            <Resultat marchand={recherche.data.marchand} />
          ) : (
            /* Une correspondance vide n'autorise aucune conclusion large :
               elle dit que cet identifiant exact n'est pas connu, pas que
               l'entreprise est absente de la plateforme. */
            <p className="text-mention leading-relaxed text-fg-secondary">
              <span className="font-medium text-fg-primary">
                Aucun marchand ne porte cet identifiant exact.
              </span>{" "}
              La recherche ne peut pas être partielle. Vérifiez la valeur
              caractère par caractère avant de conclure que l'entreprise est
              absente de la plateforme.
            </p>
          )}
        </div>
      )}
    </Carte>
  );
}

function Resultat({
  marchand,
}: {
  marchand: { id: string; nom: string; nomPays: string; statut: keyof typeof LIBELLE_STATUT };
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="min-w-0 flex-1">
        <Link
          to={`/marchand/liste/${marchand.id}`}
          className="rounded-sm text-corps font-medium text-fg-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {marchand.nom}
        </Link>
        <p className="mt-0.5 text-mention text-fg-secondary">{marchand.nomPays}</p>
      </div>
      <PastilleEtat
        genre={GENRE_STATUT[marchand.statut]}
        libelle={LIBELLE_STATUT[marchand.statut]}
      />
      <Button type="button" variant="outline" asChild>
        <Link to={`/marchand/liste/${marchand.id}`}>Ouvrir la fiche</Link>
      </Button>
    </div>
  );
}
