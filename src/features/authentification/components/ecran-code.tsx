import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bandeau } from "@/components/shared/bandeau";
import { estErreurApi } from "@/lib/erreurs";
import { TRAIT_ICONE } from "@/lib/icones";
import { useSession } from "@/stores/session";
import { cn } from "@/lib/utils";
import { useRenvoiCode, useVerificationCode } from "../hooks/use-authentification";
import { useAuthentification } from "../store";
import { CoqueConnexion, EnTeteConnexion } from "./coque-connexion";

/*
 * Second facteur, code a six chiffres.
 *
 * Aucune maquette ne decrit cet ecran : il reprend la coque de connexion et
 * les composants du projet, rien de neuf n'est dessine.
 *
 * Le champ est decoupe en six cases parce que c'est ainsi qu'un code se lit
 * et se dicte. Le decoupage reste un artifice d'affichage : le collage d'un
 * code entier remplit les six cases d'un coup, et chaque case accepte la
 * navigation au clavier. Un champ unique de six chiffres serait plus simple
 * a coder mais plus penible a verifier a l'oeil.
 */

const LONGUEUR = 6;

export function EcranCode() {
  const navigate = useNavigate();
  const defi = useAuthentification((e) => e.defi);
  const courriel = useAuthentification((e) => e.courriel);
  const abandonnerDefi = useAuthentification((e) => e.abandonnerDefi);
  const ouvrirSession = useSession((e) => e.ouvrirSession);

  const verification = useVerificationCode();
  const renvoi = useRenvoiCode();

  const [chiffres, setChiffres] = useState<string[]>(Array(LONGUEUR).fill(""));
  const [secondesAvantRenvoi, setSecondesAvantRenvoi] = useState(
    defi?.delaiRenvoiSecondes ?? 0,
  );
  const cases = useRef<Array<HTMLInputElement | null>>([]);

  /* Arriver ici sans defi signifie que l'etape precedente n'a pas eu lieu :
     l'ecran ne peut rien verifier et renvoie a la connexion. */
  useEffect(() => {
    if (!defi) navigate("/connexion", { replace: true });
  }, [defi, navigate]);

  useEffect(() => {
    if (secondesAvantRenvoi <= 0) return;
    const minuteur = setTimeout(() => setSecondesAvantRenvoi((s) => s - 1), 1000);
    return () => clearTimeout(minuteur);
  }, [secondesAvantRenvoi]);

  if (!defi) return null;

  const code = chiffres.join("");
  const complet = code.length === LONGUEUR;

  function ecrire(index: number, valeur: string) {
    const propre = valeur.replace(/\D/g, "");
    if (!propre) return;

    setChiffres((precedents) => {
      const suivants = [...precedents];
      /* Un collage remplit toutes les cases a partir de celle-ci. */
      for (let decalage = 0; decalage < propre.length && index + decalage < LONGUEUR; decalage += 1) {
        suivants[index + decalage] = propre[decalage];
      }
      return suivants;
    });

    const prochaine = Math.min(index + propre.length, LONGUEUR - 1);
    cases.current[prochaine]?.focus();
  }

  function auClavier(index: number, evenement: React.KeyboardEvent<HTMLInputElement>) {
    if (evenement.key === "Backspace") {
      evenement.preventDefault();
      setChiffres((precedents) => {
        const suivants = [...precedents];
        if (suivants[index]) {
          suivants[index] = "";
        } else if (index > 0) {
          suivants[index - 1] = "";
          cases.current[index - 1]?.focus();
        }
        return suivants;
      });
    }
    if (evenement.key === "ArrowLeft" && index > 0) cases.current[index - 1]?.focus();
    if (evenement.key === "ArrowRight" && index < LONGUEUR - 1) {
      cases.current[index + 1]?.focus();
    }
  }

  const messageErreur = estErreurApi(verification.error)
    ? verification.error.message
    : verification.error
      ? "La vérification a échoué. Réessayez dans un instant."
      : null;

  return (
    <CoqueConnexion>
      <EnTeteConnexion
        titre="Vérification en deux étapes"
        description={`Saisissez le code à ${LONGUEUR} chiffres envoyé à ${defi.destinationMasquee}.`}
      />

      {messageErreur && (
        <Bandeau
          genre="danger"
          titre="Code refusé"
          description={messageErreur}
          className="mt-6 px-5 py-4"
        />
      )}

      <form
        className="mt-8"
        noValidate
        onSubmit={(evenement) => {
          evenement.preventDefault();
          if (!complet) return;
          verification.mutate(
            { jetonDefi: defi.jetonDefi, code, courriel },
            {
              onSuccess: (session) => {
                ouvrirSession(session.utilisateur, session.jeton);
                abandonnerDefi();
                navigate("/accueil", { replace: true });
              },
              onError: () => {
                setChiffres(Array(LONGUEUR).fill(""));
                cases.current[0]?.focus();
              },
            },
          );
        }}
      >
        <fieldset>
          <legend className="sr-only">Code de vérification à six chiffres</legend>
          <div className="flex justify-center gap-3">
            {chiffres.map((chiffre, index) => (
              <input
                key={index}
                ref={(element) => {
                  cases.current[index] = element;
                }}
                value={chiffre}
                onChange={(evenement) => ecrire(index, evenement.target.value)}
                onKeyDown={(evenement) => auClavier(index, evenement)}
                onFocus={(evenement) => evenement.target.select()}
                type="text"
                inputMode="numeric"
                /* Le navigateur et le gestionnaire de mots de passe peuvent
                   proposer le code recu, ce qui evite de le recopier a la
                   main depuis une autre application. */
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Chiffre ${index + 1} sur ${LONGUEUR}`}
                maxLength={LONGUEUR}
                autoFocus={index === 0}
                className={cn(
                  "tabular size-14 rounded-md border bg-card text-center text-titre font-semibold text-fg-primary",
                  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
                  chiffre ? "border-ring" : "border-border",
                )}
              />
            ))}
          </div>
        </fieldset>

        <Button
          type="submit"
          className="mt-8 h-12 w-full"
          disabled={!complet || verification.isPending}
        >
          {verification.isPending ? "Vérification..." : "Vérifier le code"}
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-mention">
        {secondesAvantRenvoi > 0 ? (
          /* Le delai est annonce plutot que le bouton simplement grise :
             sans le compte a rebours, l'attente ressemble a une panne. */
          <p aria-live="polite" className="text-fg-secondary">
            Nouveau code possible dans{" "}
            <span className="tabular font-medium text-fg-primary">
              {secondesAvantRenvoi} s
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() =>
              renvoi.mutate(defi.jetonDefi, {
                onSuccess: () => setSecondesAvantRenvoi(defi.delaiRenvoiSecondes),
              })
            }
            disabled={renvoi.isPending}
            className="rounded-sm font-medium text-warning-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:text-fg-muted"
          >
            {renvoi.isPending ? "Envoi..." : "Recevoir un nouveau code"}
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            abandonnerDefi();
            navigate("/connexion", { replace: true });
          }}
          className="flex items-center gap-1.5 rounded-sm text-fg-secondary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ChevronLeft className="size-4" strokeWidth={TRAIT_ICONE} aria-hidden="true" />
          Changer de compte
        </button>
      </div>
    </CoqueConnexion>
  );
}
