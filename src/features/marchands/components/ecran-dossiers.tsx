import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { Bandeau } from "@/components/shared/bandeau";
import { GroupeBascule } from "@/components/shared/barre-filtres";
import { Carte } from "@/components/shared/carte";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { EtatVide } from "@/components/shared/etat-vide";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarchands } from "../hooks/use-marchands";
import type { StatutDossier } from "../types";

/*
 * Dossiers marchands. Releve dans BCP/Marchand/Dossiers.png.
 *
 * La seule capture de cet ecran montre l'etat vide : la file d'instruction
 * est vide et aucun tableau n'apparait. Les colonnes de la vue pleine ne
 * sont visibles nulle part, elle n'est donc pas integree. L'ecran rend ce
 * que la maquette montre : le bandeau, les filtres, et le compte de dossiers
 * dans chaque file, qui lui se deduit de la liste des marchands.
 */

type FiltreDossier = "file" | StatutDossier;

const FILTRES: Array<{ valeur: FiltreDossier; libelle: string; nombre?: number }> = [
  { valeur: "file", libelle: "File d'instruction" },
  { valeur: "brouillon", libelle: "Brouillons" },
  { valeur: "depose", libelle: "Déposés" },
  { valeur: "en-examen", libelle: "En examen" },
  { valeur: "approuve", libelle: "Approuvés" },
  { valeur: "refuse", libelle: "Refusés" },
];

/** La file d'instruction regroupe ce qui attend une decision humaine. */
const STATUTS_EN_FILE: StatutDossier[] = ["depose", "en-examen"];

export function EcranDossiers() {
  const { data, isPending, error, refetch } = useMarchands();
  const [filtre, setFiltre] = useState<FiltreDossier>("file");

  const options = useMemo(() => {
    if (!data) return FILTRES;
    return FILTRES.map((f) => ({
      ...f,
      nombre:
        f.valeur === "file"
          ? data.filter((m) => STATUTS_EN_FILE.includes(m.statut)).length
          : data.filter((m) => m.statut === f.valeur).length,
    }));
  }, [data]);

  const nombre = options.find((o) => o.valeur === filtre)?.nombre ?? 0;

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Dossiers marchands"
        description="Examiner les entreprises qui demandent à utiliser la plateforme. Tant qu'un dossier n'est pas approuvé, le marchand ne peut rien encaisser."
      />

      <Bandeau
        genre="attente"
        titre="Aucun fournisseur de criblage n'est raccordé"
        description="La vérification des listes de sanctions répond « non disponible » plutôt que « aucune correspondance ». Un faux négatif silencieux serait pire. Tant qu'aucun fournisseur n'est branché, chaque dossier demande une décision humaine explicite, motif écrit à l'appui."
      />

      <GroupeBascule
        libelleGroupe="Filtrer les dossiers par file"
        valeur={filtre}
        onChangement={setFiltre}
        options={options}
      />

      <Carte avecBordure={false}>
        {error ? (
          <EtatErreur erreur={error} onReessayer={() => refetch()} compact />
        ) : isPending ? (
          <div className="flex flex-col items-center gap-4 px-6 py-20">
            <Skeleton className="size-12 rounded-lg" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        ) : nombre === 0 ? (
          <EtatVide
            raison="aucune-donnee"
            titre={filtre === "file" ? "Aucun dossier" : "Aucun dossier dans cette file"}
            description={
              filtre === "file"
                ? "Aucun examen en instance. Rien n'attend de décision humaine."
                : "Aucun dossier ne se trouve dans cette file pour le moment."
            }
            /* La maquette met une vignette verte ici : une file vide est une
               bonne nouvelle, il n'y a rien a instruire. */
            ton={filtre === "file" ? "succes" : "neutre"}
            icone={Inbox}
          />
        ) : (
          <EtatVide
            raison="aucune-donnee"
            titre="Vue non intégrée, faute de maquette"
            description={`Cette file contient ${nombre} dossier${nombre > 1 ? "s" : ""}, mais la seule capture de cet écran montre la file vide. Les colonnes du tableau ne sont visibles sur aucune maquette, il n'est donc pas intégré.`}
          />
        )}
      </Carte>
    </CorpsEcran>
  );
}
