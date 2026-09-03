import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { CoqueApplication } from "@/components/shared/coque-application";
import { NAVIGATION } from "./navigation";
import { EcranAVenir } from "./ecran-a-venir";
import { GalerieComposants } from "./galerie-composants";
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
      /* Echafaudage de verification, a retirer avec la derniere section. */
      { path: "/composants", element: <GalerieComposants /> },
      { path: "*", element: <EcranAVenir titre="Écran introuvable" /> },
    ],
  },
]);
