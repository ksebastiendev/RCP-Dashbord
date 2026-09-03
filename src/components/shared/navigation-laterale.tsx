import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, LogOut, PanelLeft } from "lucide-react";
import { NAVIGATION, sectionDuChemin, type SectionNavigation } from "@/app/navigation";
import { usePreferences } from "@/stores/preferences";
import { useSession } from "@/stores/session";
import { cn } from "@/lib/utils";
import { LIBELLE_ROLE } from "@/lib/libelles";
import { TRAIT_ICONE } from "@/lib/icones";

/*
 * Navigation laterale. Composant partage de la coque, pas element d'ecran :
 * aucun ecran ne la rend lui-meme, elle est montee une fois par la coque.
 */

export function NavigationLaterale() {
  const { pathname } = useLocation();
  const repliee = usePreferences((e) => e.navigationRepliee);
  const basculerNavigation = usePreferences((e) => e.basculerNavigation);
  const ouvrirSection = usePreferences((e) => e.ouvrirSection);

  /* Arriver sur un ecran par URL directe ouvre le sous-menu qui le contient,
     sinon l'element actif est invisible dans une section repliee. */
  useEffect(() => {
    const section = sectionDuChemin(pathname);
    if (section?.enfants) ouvrirSection(section.id);
  }, [pathname, ouvrirSection]);

  return (
    <nav
      aria-label="Navigation principale"
      className={cn(
        "flex h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground",
        repliee ? "w-[72px]" : "w-[277px]",
      )}
    >
      <div
        className={cn(
          "flex h-[72px] items-center gap-3 px-4",
          repliee && "justify-center px-0",
        )}
      >
        <img
          src="/marque/bcp-marque.png"
          alt=""
          className="h-8 w-9 shrink-0 object-contain"
        />
        {!repliee && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] leading-tight font-semibold">
              BestCash Pay
            </div>
            <div className="truncate text-xs text-sidebar-muted-foreground">
              back-office
            </div>
          </div>
        )}
        {!repliee && (
          <BoutonIcone
            libelle="Replier la navigation"
            onClick={basculerNavigation}
          >
            <PanelLeft className="size-5" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          </BoutonIcone>
        )}
      </div>

      {repliee && (
        <div className="flex justify-center pb-2">
          <BoutonIcone libelle="Déplier la navigation" onClick={basculerNavigation}>
            <PanelLeft className="size-5" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
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

      <BlocUtilisateur />
    </nav>
  );
}

function BoutonIcone({
  libelle,
  onClick,
  children,
}: {
  libelle: string;
  onClick: () => void;
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
  const repliee = usePreferences((e) => e.navigationRepliee);
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
          cn(classesSection, repliee && "justify-center px-0", isActive && classesActif)
        }
      >
        <Icone className="size-5 shrink-0" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
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
        <Icone className="size-5 shrink-0" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
        {!repliee && (
          <>
            <span className="flex-1 truncate text-left">{section.libelle}</span>
            {estOuverte ? (
              <ChevronDown className="size-4 shrink-0" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
            ) : (
              <ChevronRight className="size-4 shrink-0" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
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
                    "mx-4 flex h-10 items-center rounded-md pr-3 pl-11 text-sm text-sidebar-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
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
  "mx-4 flex h-10 items-center gap-3 rounded-md px-3 text-[15px] text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none";

const classesActif =
  "bg-sidebar-primary text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary";

function BlocUtilisateur() {
  const repliee = usePreferences((e) => e.navigationRepliee);
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
            <div className="truncate text-sm font-medium">{utilisateur.nom}</div>
            <div className="truncate text-xs text-sidebar-muted-foreground">
              {LIBELLE_ROLE[utilisateur.role]}
            </div>
          </div>
          <BoutonIcone libelle="Se déconnecter" onClick={fermerSession}>
            <LogOut className="size-5" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
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
  const classes = taille === "sm" ? "size-8 text-xs" : "size-9 text-xs";

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
