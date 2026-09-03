import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { CoqueApplication } from "@/components/shared/coque-application";
import { NAVIGATION } from "./navigation";
import { EcranAVenir } from "./ecran-a-venir";
import { GalerieComposants } from "./galerie-composants";
import { EcranAccueil } from "@/features/accueil/components/ecran-accueil";
import { EcranCouverture } from "@/features/aiguillage/components/ecran-couverture";
import { EcranComptes } from "@/features/administration/components/ecran-comptes";
import { EcranRoles } from "@/features/administration/components/ecran-roles";
import { EcranFichePaiement } from "@/features/exploitation/components/ecran-fiche-paiement";
import { EcranNotifications } from "@/features/exploitation/components/ecran-notifications";
import { EcranPaiements } from "@/features/exploitation/components/ecran-paiements";
import { EcranRapprochement } from "@/features/exploitation/components/ecran-rapprochement";
import { EcranSoldes } from "@/features/exploitation/components/ecran-soldes";
import { EcranCouts } from "@/features/tarification/components/ecran-couts";
import { EcranGrille } from "@/features/tarification/components/ecran-grille";
import { EcranRoutage } from "@/features/aiguillage/components/ecran-routage";
import { EcranApplications } from "@/features/marchands/components/ecran-applications";
import { EcranDossiers } from "@/features/marchands/components/ecran-dossiers";
import { EcranFicheMarchand } from "@/features/marchands/components/ecran-fiche-marchand";
import { EcranListeMarchands } from "@/features/marchands/components/ecran-liste-marchands";
import { EcranWebhooks } from "@/features/marchands/components/ecran-webhooks";
import { EcranDevises } from "@/features/referentiels/components/ecran-devises";
import { EcranFicheFournisseur } from "@/features/referentiels/components/ecran-fiche-fournisseur";
import { EcranFournisseurs } from "@/features/referentiels/components/ecran-fournisseurs";
import { EcranMontants } from "@/features/referentiels/components/ecran-montants";
import { EcranOperateurs } from "@/features/referentiels/components/ecran-operateurs";
import { EcranPortefeuilles } from "@/features/referentiels/components/ecran-portefeuilles";
import { EcranPresences } from "@/features/referentiels/components/ecran-presences";

/*
 * Ecrans reellement integres, par chemin.
 * Un chemin absent de cette table retombe sur EcranAVenir : le menu et les
 * routes restent derives de app/navigation.ts, et un ecran integre se
 * declare ici en une ligne.
 */
const ECRANS_INTEGRES: Record<string, React.ReactNode> = {
  "/accueil": <EcranAccueil />,
  "/marchand/liste": <EcranListeMarchands />,
  "/marchand/webhooks": <EcranWebhooks />,
  "/marchand/dossiers": <EcranDossiers />,
  "/marchand/applications": <EcranApplications />,
  "/aiguillage/couverture": <EcranCouverture />,
  "/aiguillage/routage": <EcranRoutage />,
  "/tarification/couts": <EcranCouts />,
  "/tarification/grille": <EcranGrille />,
  "/exploitation/paiement": <EcranPaiements />,
  "/exploitation/notifications": <EcranNotifications />,
  "/exploitation/soldes": <EcranSoldes />,
  "/exploitation/rapprochement": <EcranRapprochement />,
  "/administration/comptes": <EcranComptes />,
  "/administration/roles": <EcranRoles />,
  "/referentiel/fournisseurs": <EcranFournisseurs />,
  "/referentiel/portefeuilles": <EcranPortefeuilles />,
  "/referentiel/operateurs": <EcranOperateurs />,
  "/referentiel/presences": <EcranPresences />,
  "/referentiel/montants": <EcranMontants />,
  "/referentiel/devises": <EcranDevises />,
};

/*
 * Table de routes, derivee de la declaration de navigation : une entree de
 * menu et sa route ne peuvent pas diverger.
 * Chaque lot remplace un EcranAVenir par l'ecran reellement integre.
 */

const routesDesSections: RouteObject[] = NAVIGATION.flatMap((section) => {
  if (section.chemin) {
    return [
      {
        path: section.chemin,
        element:
          ECRANS_INTEGRES[section.chemin] ?? <EcranAVenir titre={section.libelle} />,
      },
    ];
  }
  return (section.enfants ?? []).map((enfant) => ({
    path: enfant.chemin,
    element: ECRANS_INTEGRES[enfant.chemin] ?? <EcranAVenir titre={enfant.libelle} />,
  }));
});

export const router = createBrowserRouter([
  {
    element: <CoqueApplication />,
    children: [
      { path: "/", element: <Navigate to="/accueil" replace /> },
      ...routesDesSections,
      {
        path: "/referentiel/fournisseurs/:id",
        element: <EcranFicheFournisseur />,
      },
      {
        path: "/marchand/liste/:id",
        element: <EcranFicheMarchand />,
      },
      {
        path: "/exploitation/paiement/:id",
        element: <EcranFichePaiement />,
      },
      /* Echafaudage de verification, a retirer avec la derniere section. */
      { path: "/composants", element: <GalerieComposants /> },
      { path: "*", element: <EcranAVenir titre="Écran introuvable" /> },
    ],
  },
]);
