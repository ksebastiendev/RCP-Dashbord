import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";

/*
 * Ecran d'attente d'integration. Il ne represente aucune maquette : il tient
 * la route le temps que la section soit integree, et disparait au fur et a
 * mesure des lots.
 */
export function EcranAVenir({ titre }: { titre: string }) {
  return (
    <CorpsEcran>
      <EnTeteEcran
        titre={titre}
        description="Cet écran n'est pas encore intégré. La route existe pour que la navigation soit vérifiable dès maintenant."
      />
    </CorpsEcran>
  );
}
