import { lazy } from "react";

/*
 * Ecrans charges a la demande.
 *
 * Regroupes ici plutot que dans routes.tsx pour que la table de routes ne
 * melange pas des declarations de composants et son export de routeur.
 *
 * Sans ce decoupage, tout le back-office tenait dans un seul fichier de plus
 * de 500 Ko, et ouvrir l'accueil telechargeait le rapprochement des releves.
 */

export const EcranConnexion = lazy(() =>
  import("@/features/authentification/components/ecran-connexion").then((m) => ({
    default: m.EcranConnexion,
  })),
);
export const EcranCode = lazy(() =>
  import("@/features/authentification/components/ecran-code").then((m) => ({
    default: m.EcranCode,
  })),
);
export const EcranAccueil = lazy(() =>
  import("@/features/accueil/components/ecran-accueil").then((m) => ({
    default: m.EcranAccueil,
  })),
);
export const EcranListeMarchands = lazy(() =>
  import("@/features/marchands/components/ecran-liste-marchands").then((m) => ({
    default: m.EcranListeMarchands,
  })),
);
export const EcranFicheMarchand = lazy(() =>
  import("@/features/marchands/components/ecran-fiche-marchand").then((m) => ({
    default: m.EcranFicheMarchand,
  })),
);
export const EcranWebhooks = lazy(() =>
  import("@/features/marchands/components/ecran-webhooks").then((m) => ({
    default: m.EcranWebhooks,
  })),
);
export const EcranDossiers = lazy(() =>
  import("@/features/marchands/components/ecran-dossiers").then((m) => ({
    default: m.EcranDossiers,
  })),
);
export const EcranApplications = lazy(() =>
  import("@/features/marchands/components/ecran-applications").then((m) => ({
    default: m.EcranApplications,
  })),
);
export const EcranCouverture = lazy(() =>
  import("@/features/aiguillage/components/ecran-couverture").then((m) => ({
    default: m.EcranCouverture,
  })),
);
export const EcranRoutage = lazy(() =>
  import("@/features/aiguillage/components/ecran-routage").then((m) => ({
    default: m.EcranRoutage,
  })),
);
export const EcranFournisseurs = lazy(() =>
  import("@/features/referentiels/components/ecran-fournisseurs").then((m) => ({
    default: m.EcranFournisseurs,
  })),
);
export const EcranFicheFournisseur = lazy(() =>
  import("@/features/referentiels/components/ecran-fiche-fournisseur").then((m) => ({
    default: m.EcranFicheFournisseur,
  })),
);
export const EcranPortefeuilles = lazy(() =>
  import("@/features/referentiels/components/ecran-portefeuilles").then((m) => ({
    default: m.EcranPortefeuilles,
  })),
);
export const EcranOperateurs = lazy(() =>
  import("@/features/referentiels/components/ecran-operateurs").then((m) => ({
    default: m.EcranOperateurs,
  })),
);
export const EcranPresences = lazy(() =>
  import("@/features/referentiels/components/ecran-presences").then((m) => ({
    default: m.EcranPresences,
  })),
);
export const EcranMontants = lazy(() =>
  import("@/features/referentiels/components/ecran-montants").then((m) => ({
    default: m.EcranMontants,
  })),
);
export const EcranDevises = lazy(() =>
  import("@/features/referentiels/components/ecran-devises").then((m) => ({
    default: m.EcranDevises,
  })),
);
export const EcranCouts = lazy(() =>
  import("@/features/tarification/components/ecran-couts").then((m) => ({
    default: m.EcranCouts,
  })),
);
export const EcranGrille = lazy(() =>
  import("@/features/tarification/components/ecran-grille").then((m) => ({
    default: m.EcranGrille,
  })),
);
export const EcranPaiements = lazy(() =>
  import("@/features/exploitation/components/ecran-paiements").then((m) => ({
    default: m.EcranPaiements,
  })),
);
export const EcranFichePaiement = lazy(() =>
  import("@/features/exploitation/components/ecran-fiche-paiement").then((m) => ({
    default: m.EcranFichePaiement,
  })),
);
export const EcranNotifications = lazy(() =>
  import("@/features/exploitation/components/ecran-notifications").then((m) => ({
    default: m.EcranNotifications,
  })),
);
export const EcranSoldes = lazy(() =>
  import("@/features/exploitation/components/ecran-soldes").then((m) => ({
    default: m.EcranSoldes,
  })),
);
export const EcranRapprochement = lazy(() =>
  import("@/features/exploitation/components/ecran-rapprochement").then((m) => ({
    default: m.EcranRapprochement,
  })),
);
export const EcranComptes = lazy(() =>
  import("@/features/administration/components/ecran-comptes").then((m) => ({
    default: m.EcranComptes,
  })),
);
export const EcranRoles = lazy(() =>
  import("@/features/administration/components/ecran-roles").then((m) => ({
    default: m.EcranRoles,
  })),
);

