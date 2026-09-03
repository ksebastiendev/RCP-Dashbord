import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Bandeau } from "@/components/shared/bandeau";
import { ChampFormulaire } from "@/components/shared/champ-formulaire";
import { CLASSES_CONTROLE } from "@/components/shared/classes-controle";
import { estErreurApi } from "@/lib/erreurs";
import { useSession } from "@/stores/session";
import { useConnexion } from "../hooks/use-authentification";
import { useAuthentification } from "../store";
import { CoqueConnexion, EnTeteConnexion } from "./coque-connexion";

/*
 * Connexion. Relevee dans BCP-marquettes-ui/login infos/.
 *
 * Trois ecarts assumes avec la maquette, tous dans le sens de la coherence
 * avec le reste du back-office : elle est en anglais quand tout le reste est
 * en francais, ses champs sont en gris plein sans bordure la ou le projet
 * utilise du blanc borde, et le texte de son bouton tire vers un bleu qui
 * n'existe pas dans la palette.
 *
 * Une connexion reussie n'ouvre pas de session : elle ouvre un defi. Le
 * second facteur est une etape du protocole, pas une option.
 */

const schema = z.object({
  courriel: z.email("Indiquez une adresse électronique valide."),
  motDePasse: z.string().min(1, "Saisissez votre mot de passe."),
});

type Valeurs = z.infer<typeof schema>;

export function EcranConnexion() {
  const navigate = useNavigate();
  const connexion = useConnexion();
  const demarrerDefi = useAuthentification((e) => e.demarrerDefi);
  const utilisateur = useSession((e) => e.utilisateur);
  const sessionExpiree = useSession((e) => e.sessionExpiree);

  const formulaire = useForm<Valeurs>({
    resolver: zodResolver(schema),
    defaultValues: { courriel: "", motDePasse: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (utilisateur) navigate("/accueil", { replace: true });
  }, [utilisateur, navigate]);

  const messageErreur = estErreurApi(connexion.error)
    ? connexion.error.message
    : connexion.error
      ? "La connexion a échoué. Réessayez dans un instant."
      : null;

  return (
    <CoqueConnexion>
      <EnTeteConnexion
        titre="Connexion au back-office"
        description="Saisissez votre adresse électronique et votre mot de passe pour continuer."
      />

      {sessionExpiree && !messageErreur && (
        <Bandeau
          genre="attente"
          titre="Votre session a expiré"
          description="Reconnectez-vous pour reprendre là où vous en étiez."
          className="mt-6 px-5 py-4"
        />
      )}

      {messageErreur && (
        <Bandeau
          genre="danger"
          titre="Connexion refusée"
          description={messageErreur}
          className="mt-6 px-5 py-4"
        />
      )}

      <form
        className="mt-8 flex flex-col gap-5"
        noValidate
        onSubmit={formulaire.handleSubmit((valeurs) =>
          connexion.mutate(valeurs, {
            onSuccess: (defi) => {
              demarrerDefi(valeurs.courriel, defi);
              navigate("/connexion/code");
            },
          }),
        )}
      >
        <ChampFormulaire
          etiquette="Adresse électronique"
          requis
          erreur={formulaire.formState.errors.courriel?.message}
        >
          {(attributs) => (
            <input
              {...attributs}
              {...formulaire.register("courriel")}
              type="email"
              autoComplete="username"
              autoFocus
              placeholder="prenom.nom@bestcashpay.com"
              className={CLASSES_CONTROLE}
            />
          )}
        </ChampFormulaire>

        <div>
          <ChampFormulaire
            etiquette="Mot de passe"
            requis
            erreur={formulaire.formState.errors.motDePasse?.message}
          >
            {(attributs) => (
              <input
                {...attributs}
                {...formulaire.register("motDePasse")}
                type="password"
                autoComplete="current-password"
                className={CLASSES_CONTROLE}
              />
            )}
          </ChampFormulaire>

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="rounded-sm text-mention font-medium text-warning-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        <Button type="submit" className="h-12 w-full" disabled={connexion.isPending}>
          {connexion.isPending ? "Vérification..." : "Se connecter"}
        </Button>
      </form>

      {/*
        La maquette porte une case "Remember Password". Elle n'est pas
        reprise : sur un back-office qui donne acces aux fonds de la
        plateforme, prolonger une session sur un poste partage est
        exactement ce qu'on ne veut pas rendre facile. A remettre si la
        politique de securite le prevoit explicitement.
      */}
      <p className="mt-8 text-center text-mention leading-relaxed text-fg-secondary">
        Un code à six chiffres vous sera demandé après cette étape. Il est
        envoyé à l'adresse du compte, pas affiché sur cette page.
      </p>
    </CoqueConnexion>
  );
}
