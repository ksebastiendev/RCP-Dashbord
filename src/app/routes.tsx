import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { CoqueApplication } from "@/components/shared/coque-application";
import { NAVIGATION } from "./navigation";
import { EcranAVenir } from "./ecran-a-venir";

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
        element: <EcranAVenir titre={section.libelle} />,
      },
    ];
  }
  return (section.enfants ?? []).map((enfant) => ({
    path: enfant.chemin,
    element: <EcranAVenir titre={enfant.libelle} />,
  }));
});

export const router = createBrowserRouter([
  {
    element: <CoqueApplication />,
    children: [
      { path: "/", element: <Navigate to="/accueil" replace /> },
      ...routesDesSections,
      { path: "*", element: <EcranAVenir titre="Écran introuvable" /> },
    ],
  },
]);
