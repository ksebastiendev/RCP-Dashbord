import { Bandeau } from "@/components/shared/bandeau";
import { CarteIndicateur } from "@/components/shared/carte-indicateur";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { formatEntier } from "@/lib/format";
import {
  useIndicateursTarification,
  useReglesTarifaires,
} from "../hooks/use-tarification";
import { SimulateurPrelevement } from "./simulateur-prelevement";

/*
 * Grille generale. Relevee dans BCP/tarification/Grille Generale.png.
 *
 * La capture s'arrete apres le simulateur : le tableau des regles n'est
 * visible sur aucune maquette et n'est donc pas integre.
 */
export function EcranGrille() {
  const indicateurs = useIndicateursTarification();
  const regles = useReglesTarifaires();

  if (indicateurs.error) {
    return (
      <CorpsEcran>
        <EnTeteEcran titre="Grille générale" description={DESCRIPTION} />
        <EtatErreur erreur={indicateurs.error} onReessayer={() => indicateurs.refetch()} />
      </CorpsEcran>
    );
  }

  return (
    <CorpsEcran>
      <EnTeteEcran titre="Grille générale" description={DESCRIPTION} />

      <Bandeau
        genre="attente"
        titre="Un plafond inconnu n'est pas un plafond absent"
        description="Une destination sans plafond connu refuse silencieusement les paiements au-delà du plafond par défaut. Tant qu'aucun fournisseur n'a communiqué la valeur, chaque dossier demande une décision humaine explicite, motif écrit à l'appui."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <CarteIndicateur
          etiquette="Règles générales"
          valeur={indicateurs.data?.reglesGenerales}
          precision={
            indicateurs.data
              ? `Règles connues sur ${formatEntier(indicateurs.data.bornesConnuesTotal)} destinations au total.`
              : "Règles connues sur l'ensemble des destinations."
          }
          chargement={indicateurs.isPending}
        />
        <CarteIndicateur
          etiquette="Destinations couvertes"
          valeur={indicateurs.data?.destinationsCouvertes}
          precision="Destinations pour lesquelles au moins une règle est posée."
          chargement={indicateurs.isPending}
        />
        <CarteIndicateur
          etiquette="Plafonds inconnus"
          valeur={indicateurs.data?.plafondsInconnus}
          precision="Ces destinations refusent silencieusement les paiements au-delà du plafond par défaut."
          alerte
          chargement={indicateurs.isPending}
        />
      </div>

      <SimulateurPrelevement regles={regles.data} chargement={regles.isPending} />
    </CorpsEcran>
  );
}

const DESCRIPTION =
  "Le tarif par défaut et toutes les exceptions en un seul endroit.";
