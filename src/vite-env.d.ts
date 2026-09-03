/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Racine de l'API. Absente tant que le backend n'existe pas. */
  readonly VITE_API_URL?: string;
  /** Taux d'echec simule par la couche service, entre 0 et 1. */
  readonly VITE_TAUX_ECHEC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
