import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, LogOut, PanelLeft, X } from "lucide-react";
import {
  NAVIGATION,
  sectionDuChemin,
  type SectionNavigation,
} from "@/app/navigation";
import { usePreferences } from "@/stores/preferences";
import { useSession } from "@/stores/session";
import { cn } from "@/lib/utils";
import { LIBELLE_ROLE } from "@/lib/libelles";
import { TRAIT_ICONE } from "@/lib/icones";
import { useEstBureau } from "@/lib/media";

/*
 * Navigation laterale. Composant partage de la coque, pas element d'ecran :
 * aucun ecran ne la rend lui-meme, elle est montee une fois par la coque.
 *
 * Deux comportements, pas deux composants :
 *   au dela de 1024 px, elle occupe sa colonne et peut se replier en bande
 *   d'icones de 72 px ;
 *   en dessous, elle sort du flux, glisse par dessus le contenu sous un
 *   voile sombre, et s'affiche toujours en entier, libelles compris. Une
 *   bande d'icones n'aurait aucun sens sur un tiroir qu'on referme.
 *
 * Le repli est donc une notion de bureau seulement. Le calculer ici, et non
 * par des classes, evite de rendre un arbre replie qu'aucune media query ne
 * pourrait deplier.
 */

export function NavigationLaterale({
  tiroirOuvert = false,
  onFermerTiroir,
}: {
  /** Sous 1024 px seulement : le tiroir est-il ouvert. */
  tiroirOuvert?: boolean;
  onFermerTiroir?: () => void;
}) {
  const { pathname } = useLocation();
  const estBureau = useEstBureau();
  const replieePreferee = usePreferences((e) => e.navigationRepliee);
  const repliee = estBureau && replieePreferee;
  const basculerNavigation = usePreferences((e) => e.basculerNavigation);
  const ouvrirSection = usePreferences((e) => e.ouvrirSection);

  /* Arriver sur un ecran par URL directe ouvre le sous-menu qui le contient,
     sinon l'element actif est invisible dans une section repliee. */
  useEffect(() => {
    const section = sectionDuChemin(pathname);
    if (section?.enfants) ouvrirSection(section.id);
  }, [pathname, ouvrirSection]);

  return (
    <>
      {/* Voile. Un aplat sombre, pas un flou : c'est lui qui desature le
          fond et designe le tiroir comme le seul endroit actif. */}
      {!estBureau && tiroirOuvert && (
        <div
          onClick={onFermerTiroir}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <nav
        aria-label="Navigation principale"
        aria-hidden={!estBureau && !tiroirOuvert}
        className={cn(
          "flex h-full flex-col bg-sidebar text-sidebar-foreground",
          estBureau
            ? cn("shrink-0", repliee ? "w-[72px]" : "w-[277px]")
            : cn(
                "fixed inset-y-0 left-0 z-50 w-[277px] max-w-[85vw] shadow-xl transition-transform duration-200",
                tiroirOuvert ? "translate-x-0" : "-translate-x-full",
              ),
        )}
      >
        <div
          className={cn(
            "flex h-[72px] items-center gap-3 px-4",
            repliee && "justify-center px-0",
          )}
        >
          <img
            src="/marque/Logo-bestcashpay.png"
            alt=""
            className="h-8 w-9 shrink-0 object-contain"
          />
          {!repliee && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-section font-semibold">
                BestCash Pay
              </div>
              <div className="truncate text-mention text-sidebar-muted-foreground">
                back-office
              </div>
            </div>
          )}
          {estBureau ? (
            !repliee && (
              <BoutonIcone
                libelle="Replier la navigation"
                onClick={basculerNavigation}
              >
                <PanelLeft
                  className="size-5"
                  strokeWidth={TRAIT_ICONE}
                  aria-hidden="true"
                />
              </BoutonIcone>
            )
          ) : (
            <BoutonIcone
              libelle="Fermer la navigation"
              onClick={onFermerTiroir}
            >
              <X
                className="size-5"
                strokeWidth={TRAIT_ICONE}
                aria-hidden="true"
              />
            </BoutonIcone>
          )}
        </div>

        {repliee && (
          <div className="flex justify-center pb-2">
            <BoutonIcone
              libelle="Déplier la navigation"
              onClick={basculerNavigation}
            >
              <PanelLeft
                className="size-5"
                strokeWidth={TRAIT_ICONE}
                aria-hidden="true"
              />
            </BoutonIcone>
          </div>
        )}

        <ul className="flex-1 overflow-y-auto pt-[14px] pb-4">
          {NAVIGATION.map((section) => (
            <li key={section.id} className="mb-[14px]">
              <Section section={section} />
            </li>
          ))}
        </ul>

        <BlocUtilisateur repliee={repliee} />
      </nav>
    </>
  );
}

function BoutonIcone({
  libelle,
  onClick,
  children,
}: {
  libelle: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={libelle}
      aria-label={libelle}
      className="grid size-9 shrink-0 place-items-center rounded-md text-sidebar-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
    >
      {children}
    </button>
  );
}

function Section({ section }: { section: SectionNavigation }) {
  const { pathname } = useLocation();
  const estBureau = useEstBureau();
  const replieePreferee = usePreferences((e) => e.navigationRepliee);
  const repliee = estBureau && replieePreferee;
  const ouvertes = usePreferences((e) => e.sectionsOuvertes);
  const basculerSection = usePreferences((e) => e.basculerSection);
  const basculerNavigation = usePreferences((e) => e.basculerNavigation);
  const ouvrirSection = usePreferences((e) => e.ouvrirSection);

  const Icone = section.icone;

  /* Section sans enfant : c'est un lien, pas un depliant. */
  if (section.chemin) {
    return (
      <NavLink
        to={section.chemin}
        title={repliee ? section.libelle : undefined}
        className={({ isActive }) =>
          cn(
            classesSection,
            repliee && "justify-center px-0",
            isActive && classesActif,
          )
        }
      >
        <Icone
          className="size-5 shrink-0"
          strokeWidth={TRAIT_ICONE}
          aria-hidden="true"
        />
        {!repliee && <span className="truncate">{section.libelle}</span>}
      </NavLink>
    );
  }

  const estOuverte = ouvertes.includes(section.id);
  const contientLeChemin = Boolean(
    section.enfants?.some((enfant) => pathname.startsWith(enfant.chemin)),
  );

  return (
    <>
      <button
        type="button"
        aria-expanded={repliee ? undefined : estOuverte}
        title={repliee ? section.libelle : undefined}
        onClick={() => {
          /* Repliee, la liste des enfants n'a nulle part ou s'afficher :
             cliquer une section deplie la navigation et ouvre la section.
             Comportement non couvert par les maquettes. */
          if (repliee) {
            basculerNavigation();
            ouvrirSection(section.id);
            return;
          }
          basculerSection(section.id);
        }}
        className={cn(
          classesSection,
          "w-[calc(100%-32px)]",
          repliee && "w-[calc(100%-16px)] justify-center px-0",
          /* Une section qui contient l'ecran courant reste signalee meme
             sous-menu ferme, sans prendre le fond orange reserve a
             l'element reellement actif. */
          contientLeChemin && !estOuverte && "text-sidebar-foreground",
        )}
      >
        <Icone
          className="size-5 shrink-0"
          strokeWidth={TRAIT_ICONE}
          aria-hidden="true"
        />
        {!repliee && (
          <>
            <span className="flex-1 truncate text-left">{section.libelle}</span>
            {estOuverte ? (
              <ChevronDown
                className="size-4 shrink-0"
                strokeWidth={TRAIT_ICONE}
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                className="size-4 shrink-0"
                strokeWidth={TRAIT_ICONE}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </button>

      {!repliee && estOuverte && (
        <ul className="mt-[2px]">
          {section.enfants?.map((enfant) => (
            <li key={enfant.id}>
              <NavLink
                to={enfant.chemin}
                className={({ isActive }) =>
                  cn(
                    "mx-4 flex h-10 items-center rounded-md pr-3 pl-11 text-mention text-sidebar-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
                    isActive && classesActif,
                  )
                }
              >
                <span className="truncate">{enfant.libelle}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const classesSection =
  "mx-4 flex h-10 items-center gap-3 rounded-md px-3 text-corps text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none";

const classesActif =
  "bg-sidebar-primary text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary";

function BlocUtilisateur({ repliee }: { repliee: boolean }) {
  const utilisateur = useSession((e) => e.utilisateur);
  const fermerSession = useSession((e) => e.fermerSession);

  if (!utilisateur) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-t border-sidebar-border px-4 py-4",
        repliee && "justify-center px-0",
      )}
    >
      <Avatar utilisateur={utilisateur} />
      {!repliee && (
        <>
          <div className="min-w-0 flex-1">
            <div className="truncate text-mention font-medium">
              {utilisateur.nom}
            </div>
            <div className="truncate text-mention text-sidebar-muted-foreground">
              {LIBELLE_ROLE[utilisateur.role]}
            </div>
          </div>
          <BoutonIcone libelle="Se déconnecter" onClick={fermerSession}>
            <LogOut
              className="size-5"
              strokeWidth={TRAIT_ICONE}
              aria-hidden="true"
            />
          </BoutonIcone>
        </>
      )}
    </div>
  );
}

export function Avatar({
  utilisateur,
  taille = "md",
}: {
  utilisateur: { nom: string; urlAvatar: string | null };
  taille?: "sm" | "md";
}) {
  const classes =
    taille === "sm" ? "size-8 text-mention" : "size-9 text-mention";

  if (utilisateur.urlAvatar) {
    return (
      <img
        src={utilisateur.urlAvatar}
        alt=""
        className={cn(classes, "shrink-0 rounded-full object-cover")}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        classes,
        "grid shrink-0 place-items-center rounded-full bg-primary font-medium text-primary-foreground",
      )}
    >
      {initiales(utilisateur.nom)}
    </span>
  );
}

function initiales(nom: string) {
  return nom
    .split(/\s+/)
    .slice(0, 2)
    .map((mot) => mot.charAt(0).toUpperCase())
    .join("");
}
