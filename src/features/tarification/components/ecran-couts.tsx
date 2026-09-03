import { Coins, Receipt } from "lucide-react";
import { Carte } from "@/components/shared/carte";
import { CarteIndicateur } from "@/components/shared/carte-indicateur";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { EtatVide } from "@/components/shared/etat-vide";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import {
  useCoutsFournisseurs,
  useIndicateursTarification,
} from "../hooks/use-tarification";

/*
 * Couts et marge. Releve dans BCP/tarification/Cout et marge.png.
 *
 * La seule capture montre les deux cartes vides. Les colonnes de leurs
 * tableaux ne sont visibles nulle part : quand des couts existeront, la vue
 * pleine devra etre maquettee. La marge, elle, ne se calcule pas tant
 * qu'aucun cout n'est declare, et l'ecran le dit plutot que d'afficher zero.
 */
export function EcranCouts() {
  const indicateurs = useIndicateursTarification();
  const couts = useCoutsFournisseurs();

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Coûts et marge"
        description="Ce que les fournisseurs nous facturent, face à ce que nous facturons aux marchands. Sans coût déclaré, la marge est inconnue, pas nulle."
        action={
          <Button type="button">
            <Plus className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
            Déclarer un coût
          </Button>
        }
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

      <Carte avecBordure={false}>
        {couts.error ? (
          <EtatErreur erreur={couts.error} onReessayer={() => couts.refetch()} compact />
        ) : couts.isPending ? (
          <SqueletteCarteVide />
        ) : couts.data && couts.data.length > 0 ? (
          <EtatVide
            raison="aucune-donnee"
            titre="Vue non intégrée, faute de maquette"
            description={`${formatEntier(couts.data.length)} coûts sont déclarés, mais la seule capture de cet écran montre la carte vide. Les colonnes du tableau ne sont visibles sur aucune maquette.`}
          />
        ) : (
          <EtatVide
            raison="aucune-donnee"
            titre="Aucun coût déclaré"
            description="Tant qu'aucun coût fournisseur n'est déclaré, la marge de la plateforme reste inconnue. Elle ne vaut pas zéro : elle n'est pas calculable."
            icone={Coins}
            action={<Button type="button">Déclarer un coût</Button>}
          />
        )}
      </Carte>

      <Carte avecBordure={false}>
        {couts.isPending ? (
          <SqueletteCarteVide />
        ) : (
          <EtatVide
            raison="aucune-donnee"
            titre="Aucun paiement abouti sur la période"
            description="Aucune marge ne peut être constatée sur une période sans paiement abouti. Le calcul reprendra dès le premier encaissement."
            icone={Receipt}
          />
        )}
      </Carte>
    </CorpsEcran>
  );
}

function SqueletteCarteVide() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20">
      <Skeleton className="size-12 rounded-lg" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-80" />
    </div>
  );
}
