import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Carte } from "@/components/shared/carte";
import { CorpsEcran, EnTeteEcran } from "@/components/shared/coque-application";
import { EtatErreur } from "@/components/shared/etat-erreur";
import { PastilleEtat } from "@/components/shared/pastille-etat";
import { formatEntier } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import { LIBELLE_ROLE } from "@/lib/libelles";
import { useAdministration } from "../hooks/use-administration";
import type { DescriptionRole } from "../types";

/*
 * Roles.
 *
 * L'entree de menu existe mais aucune capture ne montre cet ecran. Il est
 * donc construit uniquement avec des blocs deja eprouves ailleurs : la
 * pastille de role, la liste de ce qu'il permet et le decompte de droits,
 * tous trois releves dans BCP/compte et role.png. Aucun element visuel
 * nouveau n'est invente, seule la mise en page l'est.
 */
export function EcranRoles() {
  const { data, isPending, error, refetch } = useAdministration();

  if (error) {
    return (
      <CorpsEcran>
        <EnTeteEcran titre="Rôles" description={DESCRIPTION} />
        <EtatErreur erreur={error} onReessayer={() => refetch()} />
      </CorpsEcran>
    );
  }

  return (
    <CorpsEcran>
      <EnTeteEcran
        titre="Rôles"
        description={
          data
            ? `${formatEntier(data.roles.length)} rôles se partagent ${formatEntier(data.droitsElementaires)} droits élémentaires.`
            : DESCRIPTION
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {isPending || !data
          ? Array.from({ length: 4 }, (_, index) => (
              <Carte key={index} className="px-6 py-6">
                <Skeleton className="h-6 w-32 rounded-sm" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
                <Skeleton className="mt-5 h-4 w-48" />
              </Carte>
            ))
          : data.roles.map((role) => <CarteRole key={role.role} role={role} />)}
      </div>
    </CorpsEcran>
  );
}

function CarteRole({ role }: { role: DescriptionRole }) {
  return (
    <Carte className="flex h-full flex-col px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PastilleEtat
          genre={role.role === "administrateur" ? "succes" : "neutre"}
          libelle={LIBELLE_ROLE[role.role]}
        />
        <span className="flex items-center gap-2 text-mention text-fg-secondary">
          <Users className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          {/* Zero compte se dit, il ne s'affiche pas en chiffre nu : un role
              que personne ne porte est une information, pas un vide. */}
          {role.nombreComptes === 0
            ? "Aucun compte"
            : `${formatEntier(role.nombreComptes)} ${role.nombreComptes === 1 ? "compte" : "comptes"}`}
        </span>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-2">
        {role.permissions.map((permission) => (
          <li
            key={permission}
            className="flex gap-2 text-mention leading-relaxed text-fg-secondary"
          >
            <span aria-hidden="true" className="text-fg-muted">
              ·
            </span>
            <span>{permission}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-table-row-separator pt-4 text-mention font-medium text-warning-text">
        {formatEntier(role.nombreDroits)} droits élémentaires
      </p>
    </Carte>
  );
}

const DESCRIPTION = "Ce que chaque rôle permet, en conséquences réelles.";
