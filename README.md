# BestCash Pay, back-office

Intégration du tableau de bord d'administration, à partir des maquettes de
`BCP-marquettes-ui/`.

## Démarrer

```sh
npm install
npm run dev
```

Aucun compte n'existe côté serveur : la couche de simulation accepte
`o.diallo@bestcashpay.com` avec n'importe quel mot de passe, puis le code
`482913` à l'étape de vérification. Les autres comptes connus sont listés
dans `src/mocks/authentification.ts`.

## Stack

React, TypeScript, Vite, Tailwind v4, shadcn/ui, TanStack Query, Zustand,
React Hook Form avec Zod, Axios, Lucide React. `flag-icons` fournit les
drapeaux de pays, seule exception à Lucide qui n'en a pas.

## Architecture

```
src/
  app/            routes, navigation, providers, garde de session
  components/ui/  shadcn, non modifié
  components/shared/  tableau, pastille, filtres, modale, formulaire, valeurs
  features/<domaine>/ components/ hooks/ services/ types/ store.ts
  lib/            axios, format, erreurs, icones, libellés
  mocks/          données de simulation, lues par la seule couche service
  stores/         état client transverse : session, préférences
```

Une feature ne dépend jamais d'une autre. La seule entorse est le type
`CodePays`, repris du Référentiel par les Marchands et l'Aiguillage : c'est
du vocabulaire, pas un composant. S'il s'étend, il remonte dans `lib/`.

### Séparation des états

TanStack Query porte toute la donnée serveur : listes, fiches, mutations,
cache, revalidation. Les stores Zustand ne portent que ce que l'utilisateur a
choisi de regarder : filtres actifs, onglet courant, modale ouverte,
préférences d'affichage, session. Aucun décompte, aucune liste dans Zustand.

### Passage au vrai backend

Seule la couche `features/<domaine>/services/` connaît l'origine des données.
Chaque fonction a déjà la forme de son futur appel :

```ts
export async function listerFournisseurs(): Promise<Fournisseur[]> {
  return simulerReponse(FOURNISSEURS);
  // deviendra :
  // const { data } = await api.get<Fournisseur[]>("/referentiels/fournisseurs");
  // return data;
}
```

Les hooks, les écrans et les types ne changent pas.

## Variables d'environnement

Voir `.env.example`.

| Variable | Effet |
| --- | --- |
| `VITE_API_URL` | Racine de l'API. Vide tant que le backend n'existe pas. |
| `VITE_TAUX_ECHEC` | Taux d'échec simulé, entre 0 et 1. `0.5` pour éprouver les écrans d'erreur. |
| `VITE_LATENCE_MS` | Latence simulée fixe. `30000` pour observer les états de chargement. |

## Conventions

**Trois absences distinctes.** `undefined` vaut inconnu, `null` vaut sans
objet, `0` vaut zéro. Les trois s'affichent différemment et aucune cellule ne
reste vide. Voir `lib/format.ts` et `components/shared/valeur.tsx`.

**Montants.** Toujours accompagnés de leur devise, en chiffres tabulaires,
alignés à droite dans les tableaux. Jamais sommés entre devises. Un seul
utilitaire de formatage, `lib/format.ts`.

**Couleurs.** Trois niveaux de tokens, `src/styles/primitives.css`,
`semantic.css`, `component.css`. Aucun hexadécimal hors du niveau 1. Les
neutres ont été relevés au pixel dans les maquettes, voir
`scripts/releve-neutres.py`.

**Couleur seule.** Aucune information n'est portée par la seule couleur :
chaque pastille porte son libellé écrit, chaque état son mot.

**États de liste.** Plein, vide, chargement, erreur. Le chargement rend un
squelette aux dimensions réelles et ne déplace pas la mise en page. Le vide
se décline en trois natures : rien n'a encore été créé, le filtre ne renvoie
rien, ou des données étaient attendues et sont absentes. La troisième se
signale comme une anomalie.

**Thème.** Clair, sombre, ou le réglage du système, choisi dans la barre
supérieure. Le thème vit entièrement dans les fichiers de tokens : un bloc
`.dark` par niveau, aucune classe `dark:` écrite dans un composant. Un script
en ligne dans `index.html` pose la classe avant le premier rendu.

**Onglets.** Un onglet est une adresse, jamais un état local : il se partage,
se recharge et se quitte au bouton de retour. Voir
`components/shared/groupe-onglets.tsx`.

**Actions irréversibles.** Modale de confirmation décrivant les conséquences
réelles, jamais les objets techniques, et un bouton qui nomme l'acte.

## Ce qui n'est pas intégré, faute de maquette

- l'onglet Activité de la fiche marchand
- le tableau des dossiers marchands, dont seule la file vide est capturée
- l'onglet Champs exigés des montants autorisés, rogné hors cadre
- l'écran Justificatifs demandés
- l'écran Plafonds de fonds
- les tableaux de règles et de coûts de la Tarification

Chacun le dit à l'écran plutôt que d'être deviné. L'écran Rôles, lui, est
construit à partir de blocs déjà validés ailleurs et le signale.
