import { Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { CoqueApplication } from "@/components/shared/coque-application";
import { NAVIGATION } from "./navigation";
import { EcranAVenir } from "./ecran-a-venir";
import { RouteProtegee } from "./route-protegee";
import {
  EcranAccueil,
  EcranApplications,
  EcranCode,
  EcranComptes,
  EcranConnexion,
  EcranCouts,
  EcranCouverture,
  EcranDevises,
  EcranDossiers,
  EcranFicheFournisseur,
  EcranFicheMarchand,
  EcranFichePaiement,
  EcranFournisseurs,
  EcranGrille,
  EcranListeMarchands,
  EcranMontants,
  EcranNotifications,
  EcranOperateurs,
  EcranPaiements,
  EcranPortefeuilles,
  EcranPresences,
  EcranRapprochement,
  EcranRoles,
  EcranRoutage,
  EcranSoldes,
  EcranWebhooks,
} from "./ecrans-differes";

/*
 * Table de routes.
 *
 * Les routes sont derivees de app/navigation.ts : un libelle de menu et son
 * chemin ne peuvent pas diverger. Les ecrans sont charges a la demande,
 * voir app/ecrans-differes.ts.
 */

/*
 * Ecrans reellement integres, par chemin. Un chemin absent de cette table
 * retombe sur EcranAVenir.
 */
const ECRANS_INTEGRES: Record<string, ReactNode> = {
  "/accueil": <EcranAccueil />,
  "/marchand/liste": <EcranListeMarchands />,
  "/marchand/webhooks": <EcranWebhooks />,
  "/marchand/dossiers": <EcranDossiers />,
  "/marchand/applications": <EcranApplications />,
  "/aiguillage/couverture": <EcranCouverture />,
  "/aiguillage/routage": <EcranRoutage />,
  "/referentiel/fournisseurs": <EcranFournisseurs />,
  "/referentiel/portefeuilles": <EcranPortefeuilles />,
  "/referentiel/operateurs": <EcranOperateurs />,
  "/referentiel/presences": <EcranPresences />,
  "/referentiel/montants": <EcranMontants />,
  "/referentiel/devises": <EcranDevises />,
  "/tarification/couts": <EcranCouts />,
  "/tarification/grille": <EcranGrille />,
  "/exploitation/paiement": <EcranPaiements />,
  "/exploitation/notifications": <EcranNotifications />,
  "/exploitation/soldes": <EcranSoldes />,
  "/exploitation/rapprochement": <EcranRapprochement />,
  "/administration/comptes": <EcranComptes />,
  "/administration/roles": <EcranRoles />,
};

const routesDesSections = NAVIGATION.flatMap((section) => {
  if (section.chemin) {
    return [
      {
        path: section.chemin,
        element: ECRANS_INTEGRES[section.chemin] ?? (
          <EcranAVenir titre={section.libelle} />
        ),
      },
    ];
  }
  return (section.enfants ?? []).map((enfant) => ({
    path: enfant.chemin,
    element: ECRANS_INTEGRES[enfant.chemin] ?? (
      <EcranAVenir titre={enfant.libelle} />
    ),
  }));
});

export const router = createBrowserRouter([
  /* Les ecrans d'authentification vivent hors de la coque : ils n'ont ni
     navigation laterale ni barre superieure. */
  {
    path: "/connexion",
    element: (
      <Suspense fallback={null}>
        <EcranConnexion />
      </Suspense>
    ),
  },
  {
    path: "/connexion/code",
    element: (
      <Suspense fallback={null}>
        <EcranCode />
      </Suspense>
    ),
  },
  {
    element: <RouteProtegee />,
    children: [
      {
        element: <CoqueApplication />,
        children: [
          { path: "/", element: <Navigate to="/accueil" replace /> },
          ...routesDesSections,
          {
            path: "/referentiel/fournisseurs/:id",
            element: <EcranFicheFournisseur />,
          },
          /* Second onglet des montants autorises. Meme regle que la fiche
             marchand : le chemin sans segment sert le premier onglet. */
          {
            path: "/referentiel/montants/:onglet",
            element: ECRANS_INTEGRES["/referentiel/montants"],
          },
          { path: "/marchand/liste/:id", element: <EcranFicheMarchand /> },
          /* Chaque onglet de la fiche est une adresse a part entiere : elle
             se partage, se recharge et se quitte au bouton de retour. Le
             chemin sans segment sert l'onglet Dossier. */
          {
            path: "/marchand/liste/:id/:onglet",
            element: <EcranFicheMarchand />,
          },
          {
            path: "/exploitation/paiement/:id",
            element: <EcranFichePaiement />,
          },
          { path: "*", element: <EcranAVenir titre="Écran introuvable" /> },
        ],
      },
    ],
  },
]);
