import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/stores/session";

/*
 * Garde de route.
 *
 * Elle masque le back-office a qui n'a pas de session ouverte. Elle ne le
 * protege pas : c'est le serveur qui refuse les appels, et lui seul. Une
 * garde cote client evite d'afficher des ecrans vides, rien de plus.
 */
export function RouteProtegee() {
  const utilisateur = useSession((e) => e.utilisateur);
  const emplacement = useLocation();

  if (!utilisateur) {
    /* L'emplacement demande est conserve pour y revenir apres connexion. */
    return <Navigate to="/connexion" replace state={{ depuis: emplacement }} />;
  }

  return <Outlet />;
}
