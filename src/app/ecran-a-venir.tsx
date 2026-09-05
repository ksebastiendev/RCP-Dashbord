import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";

/*
 * Ecran d'attente d'integration. Il tient la route le temps que la section
 * soit integree, et disparait au fur et a mesure des lots.
 *
 * Sa phrase parle a qui utilise le produit, pas a qui le construit : ce
 * qu'on peut faire et ce qu'on ne peut pas encore, jamais l'etat des
 * maquettes ni l'avancement des lots. La liste de ce qui reste a integrer
 * vit dans le README, la ou elle sert.
 */
export function EcranAVenir({
  titre,
  description = "Cette vue n'est pas encore disponible. Les autres entrées de la section sont accessibles depuis la navigation.",
}: {
  titre: string;
  description?: string;
}) {
  return (
    <CorpsEcran>
      <EnTeteEcran titre={titre} description={description} />
    </CorpsEcran>
  );
}
