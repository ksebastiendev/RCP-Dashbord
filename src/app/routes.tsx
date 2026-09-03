import { createBrowserRouter, Navigate } from "react-router-dom";

/*
 * Table de routes du back-office.
 * Les sections sont declarees ici au fur et a mesure des lots. Le decoupage
 * suit les sections de la navigation laterale des maquettes, pas les fichiers.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/accueil" replace />,
  },
  {
    path: "/accueil",
    element: <SocleProvisoire titre="Accueil" />,
  },
  {
    path: "*",
    element: <SocleProvisoire titre="Ecran introuvable" />,
  },
]);

/* Placeholder du lot 1 : la coque applicative arrive au lot 2 et remplacera
   ce composant. Il n'existe que pour verifier que les tokens sont branches. */
function SocleProvisoire({ titre }: { titre: string }) {
  return (
    <main className="min-h-screen bg-background p-10">
      <h1 className="text-3xl font-semibold text-fg-primary">{titre}</h1>
      <p className="mt-2 text-sm text-fg-secondary">
        Coque applicative en attente du lot 2.
      </p>
    </main>
  );
}
