import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { ErreurApi, MESSAGE_PAR_GENRE, type GenreErreur } from "./erreurs";
import { lireJeton, signalerExpiration } from "./jeton";

/*
 * Instance Axios unique du projet.
 * Aucun composant, aucun hook n'appelle axios directement : seule la couche
 * `features/<domaine>/services/` importe ce module. Le jour ou le backend
 * existe, c'est le seul endroit qui change de comportement.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
const DELAI_MS = 20_000;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DELAI_MS,
  headers: { "Content-Type": "application/json" },
});

/* Requete : jeton de session et identifiant de correlation. */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const jeton = lireJeton();
  if (jeton) {
    config.headers.set("Authorization", `Bearer ${jeton}`);
  }
  config.headers.set("X-Request-Id", crypto.randomUUID());
  return config;
});

function genreDepuisStatut(statut: number): GenreErreur {
  if (statut === 401) return "authentification";
  if (statut === 403) return "droits";
  if (statut === 404) return "introuvable";
  if (statut === 409) return "conflit";
  if (statut === 400 || statut === 422) return "validation";
  return "serveur";
}

type CorpsErreur = {
  message?: string;
  detail?: string;
  errors?: Record<string, string | string[]>;
};

function champsDepuisCorps(corps: CorpsErreur | undefined) {
  if (!corps?.errors) return null;
  const champs: Record<string, string> = {};
  for (const [cle, valeur] of Object.entries(corps.errors)) {
    champs[cle] = Array.isArray(valeur) ? valeur[0] : valeur;
  }
  return Object.keys(champs).length > 0 ? champs : null;
}

/* Reponse : toute erreur sortant de cette instance est une ErreurApi.
   Les ecrans ne manipulent donc jamais un statut HTTP. */
api.interceptors.response.use(
  (reponse) => reponse,
  (erreur: AxiosError<CorpsErreur>) => {
    if (!erreur.response) {
      const genre: GenreErreur = "reseau";
      return Promise.reject(new ErreurApi(genre, MESSAGE_PAR_GENRE[genre]));
    }

    const statut = erreur.response.status;
    const genre = genreDepuisStatut(statut);
    const corps = erreur.response.data;
    const message = corps?.message ?? corps?.detail ?? MESSAGE_PAR_GENRE[genre];

    if (genre === "authentification") {
      signalerExpiration();
    }

    return Promise.reject(
      new ErreurApi(genre, message, statut, champsDepuisCorps(corps)),
    );
  },
);
