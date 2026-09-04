# Transposer la tenue visuelle de 3-AMAS sur BCP

Document a remettre tel quel a Claude Code sur le projet BCP.

---

## 0. Ce qu'on te demande

Tu travailles sur **BCP**, un tableau de bord fintech deja construit. Un autre
projet, **3-AMAS**, a ete integre a partir de maquettes de bien meilleure
qualite. Ce document releve ce qui rend 3-AMAS solide **structurellement**, pour
que tu proposes les memes fondations sur BCP.

**Ce que tu fais :**

1. Tu audites BCP point par point contre la grille ci-dessous.
2. Tu produis un **rapport d'ecart** : pour chaque point, ce que BCP fait
   aujourd'hui, ce que la grille demande, le cout du changement.
3. Tu proposes un **plan par lots**, du plus rentable au moins rentable.
4. Tu **n'appliques rien** avant validation explicite, lot par lot.

**Ce que tu ne fais pas :**

- Tu ne remplaces pas la palette de BCP. BCP a deux couleurs de marque, un
  **beige** et un **orange**. Elles restent. C'est leur repartition en roles qui
  peut changer, pas leur valeur.
- Tu ne copies pas les ecrans de 3-AMAS. BCP est une fintech, pas de la gestion
  locative. On transpose des **regles**, pas des maquettes.
- Tu ne corriges rien en silence. Tout ecart au design existant est signale.

---

## 1. Architecture des jetons de couleur, trois niveaux

C'est le point le plus rentable du lot. Tout le reste en decoule.

**Niveau 1, primitives.** Valeurs brutes, sans signification d'usage.
Un fichier `primitives.css`. Chaque valeur porte en commentaire son origine :
relevee dans une maquette, fournie par le brief, ou derivee par calcul.

```css
:root {
  --orange-400: #xxxxxx;   /* [releve] */
  --beige-100:  #xxxxxx;   /* [releve] */
  --neutre-900: #xxxxxx;   /* [releve] texte principal */
  --vert-100:   #xxxxxx;   /* [releve] fond de pastille succes */
  --vert-900:   #xxxxxx;   /* [releve] texte sur --vert-100 */
}
```

**Niveau 2, semantiques.** Ce que la couleur **veut dire**. Seul niveau que les
composants partages citent.

```css
:root {
  --surface-page:   var(--beige-100);
  --surface:        var(--neutre-0);
  --fg-default:     var(--neutre-900);
  --fg-muted:       var(--neutre-650);
  --brand-surface:  var(--orange-800);   /* navigation, panneaux pleins */
  --brand-fg:       var(--orange-800);   /* titres, liens */
  --action-primary: var(--orange-400);   /* FOND uniquement */
  --action-primary-fg: #14161A;          /* texte pose sur ce fond */
  --etat-succes-surface: var(--vert-100);
  --etat-succes-fg:      var(--vert-900);
}
```

**Niveau 3, composants.** Un jeton par role de composant. Un composant ne cite
que le niveau 2 ou le niveau 3, **jamais un hexadecimal**.

```css
:root {
  --tableau-entete-bg: var(--surface-muted);
  --tableau-entete-fg: var(--neutre-700);
  --modale-rayon:      var(--rayon-lg);
  --champ-border:      var(--border-field);
  --avatar-bg:         var(--brand-surface);
}
```

**Puis** on relie ces jetons aux variables attendues par shadcn dans un
`globals.css`, sans jamais toucher `components/ui/`.

**Le gain concret :** le theme sombre, le changement de marque, le passage d'un
bouton du bleu au jaune, tout se fait dans un bloc de dix lignes. Aucun
composant n'est ouvert.

**A auditer sur BCP :** compte les hexadecimaux ecrits en dur dans
`components/`. C'est la mesure de la dette.

---

## 2. La regle qui a le plus change le rendu

**Une couleur de marque vive n'est jamais peinte en texte.**

Sur 3-AMAS, le jaune `#FFC600` donne **1,58:1** sur blanc. Il est donc un
**fond exclusivement**, avec un texte tres sombre `#14161A` pose dessus, qui
donne 11,50:1. Quand un libelle jaune est vraiment necessaire, un jeton
**distinct** existe, `--brand-accent-text` a `#8A6800`, qui donne 5,17:1.

**Transposition BCP :** l'orange est dans le meme cas. Verifie-le. Si ton
orange de marque donne moins de 4,5:1 sur beige ou sur blanc :

- il devient un fond, avec un texte quasi noir dessus ;
- tu crees un **second orange, plus fonce**, reserve au texte ;
- tu ne melanges jamais les deux roles.

Le beige, lui, est probablement une **surface**, pas un texte. Verifie aussi le
couple beige sur blanc : s'il descend sous 3:1, il ne peut pas servir de
bordure porteuse de sens.

**Methode.** Ne juge pas a l'oeil. Mesure. Script reutilisable :

```python
def luminance(hexa):
    hexa = hexa.lstrip('#')
    canaux = [int(hexa[i:i+2], 16) / 255 for i in (0, 2, 4)]
    canaux = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in canaux]
    return 0.2126 * canaux[0] + 0.7152 * canaux[1] + 0.0722 * canaux[2]

def contraste(a, b):
    l1, l2 = sorted([luminance(a), luminance(b)], reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)
```

Seuils : **4,5:1** pour le texte courant, **3:1** pour le gros texte et pour les
bordures qui portent du sens, comme la bordure d'un champ en erreur.

**Livrable attendu :** un tableau de toutes les paires texte sur fond de BCP,
avec leur ratio, et la liste de celles qui passent sous 4,5:1. Tu les signales,
tu ne les corriges pas encore.

---

## 3. Couleurs d'etat, la forme qui fonctionne

3-AMAS utilise pour chaque etat une **paire douce** : un fond tres clair et un
texte tres sombre de la meme teinte.

| Etat | Fond | Texte | Ratio |
| --- | --- | --- | --- |
| Succes | `#C2F5DA` | `#0B4627` | 9,05:1 |
| Danger | `#FFC0C5` | `#681219` | 8,49:1 |
| Attente | `#FFD5C0` | `#682F12` | 7,75:1 |
| Neutre | `#F7F7F7` | `#5A6E82` | 5,27:1 |

C'est ce qui donne l'aspect calme des pastilles : jamais de bloc de couleur
saturee dans un tableau.

**A l'inverse, ce qui rate.** Les maquettes de 3-AMAS emploient aussi des
pastilles **pleines**, blanc sur vert `#1FC16B` a **2,36:1** et blanc sur rouge
`#FB3748` a **3,66:1**. Les deux echouent. Ne reproduis pas ce motif sur BCP.

**Trois regles a transposer :**

1. **Aucune information n'est portee par la couleur seule.** Une pastille de
   statut porte toujours son libelle ecrit. Si BCP a des pastilles muettes ou
   des points de couleur seuls, c'est un ecart a signaler.
2. **Le meme etat a la meme forme partout.** Une seule primitive de pastille,
   avec une propriete `ton`, pas une pastille par ecran.
3. **Les couleurs d'etat ne sont pas les couleurs de marque.** Sur BCP, l'orange
   de marque et un eventuel orange d'alerte doivent etre deux jetons distincts,
   meme s'ils se ressemblent. Sinon, changer la marque casse les alertes.

---

## 4. Typographie

- **Une seule famille**, auto-hebergee via `@fontsource`, jamais de CDN.
  3-AMAS utilise **Poppins**. Poppins a un dessin geometrique large qui donne
  cet aspect pose et un peu institutionnel. Si BCP est sur une grotesque
  etroite du type Inter ou Roboto, c'est une part reelle de l'ecart percu.
- **Quatre graisses maximum**, choisies parce qu'elles sont employees, pas par
  precaution : 400 texte courant, 500 navigation et libelles, 600 boutons et
  entetes, 700 titres.
- **Sous-ensemble latin uniquement.** Les paquets `@fontsource` embarquent par
  defaut le devanagari et le cyrillique. Importe `latin-400.css`, pas `400.css`.
  Sur 3-AMAS, cela retirait environ 370 Ko du bundle.
- **Chiffres tabulaires partout ou des nombres s'empilent en colonne.** C'est
  decisif pour une fintech.

```css
th, td, time, [data-tabulaire] {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
}
```

**A auditer sur BCP :** montants d'un tableau qui ne s'alignent pas au chiffre
pres, nombre de graisses chargees, sous-ensembles inutiles dans le bundle.

---

## 5. Rayons

**Une echelle a trois valeurs, plus la pilule. Figee. Non rediscutee.**

| Element | 3-AMAS | Jeton |
| --- | --- | --- |
| Champ de formulaire | 8 px | `--rayon-sm` |
| Carte de contenu, vignette | 12 px | `--rayon-md` |
| Carte de liste, modale | 16 px | `--rayon-lg` |
| Bouton, pastille, onglet | entierement arrondi | `--rayon-pill` |

Le point que tu as remarque sur les boutons vient de la : **tous les boutons
sont des pilules**, sans exception, y compris les boutons de tableau et les
boutons d'icone. C'est un choix binaire, jamais melange avec des coins a 6 px.
Le contraste entre des **cartes a 16 px** et des **boutons entierement
arrondis** est ce qui produit la lecture nette.

Les jetons sont branches sur `--radius-sm`, `--radius-md`, `--radius-lg` de
Tailwind, donc `rounded-sm` et compagnie donnent directement les bonnes valeurs.

**A auditer sur BCP :** compte les valeurs de rayon distinctes dans le code. Si
tu en trouves plus de quatre, c'est la source du flottement.

---

## 6. Modales

Trois choses font le rendu que tu as remarque :

1. **Rayon 16 px** et fond blanc pur, jamais la couleur de fond de page.
2. **Voile sombre** sur tout l'ecran, `rgb(0 0 0 / 0.5)`, avec un fondu
   d'entree. C'est ce qui donne l'impression de flou : ce n'est pas un
   `backdrop-filter`, c'est un aplat sombre qui desature tout le fond. Si tu
   veux le flou reel, `backdrop-blur-sm` s'ajoute, mais l'essentiel est le
   voile.
3. **Deux largeurs seulement** : 446 px pour un formulaire court, 640 px pour un
   formulaire long ou une liste de permissions. Pas de troisieme.

**Le point structurel le plus important :**

> **Une seule modale CRUD, trois variantes : ajout, modification, suppression.
> Pas treize composants de modale.**

Sur 3-AMAS, ce composant unique couvre **13 ecrans**. Sa signature :

```tsx
<ModaleCrud
  variante="ajout" | "modification" | "suppression"
  titre sousTitre taille="sm" | "md"
  idFormulaire      // le bouton de pied soumet le formulaire enfant
  consequences      // variante suppression uniquement
  enCours
/>
```

La variante suppression impose une regle de contenu :

> **La confirmation nomme ce qui va disparaitre en consequences reelles, pas en
> objets techniques.**

Mauvais : « Supprimer cet element ? 2 entites liees seront affectees. »

Bon : « ADJOVI Rachidatou, en place depuis le 01 aout 2025, n'aura plus de
logement rattache. Le detail des 7 pieces et leurs photos ne seront plus
consultables. Les quittances deja emises restent conservees. »

Sur une fintech, c'est encore plus important : dis le montant, le compte, la
date de valeur, et ce qui reste trace.

**A auditer sur BCP :** compte les composants de modale. S'il y en a plus de
deux, tu tiens un lot entier de simplification.

---

## 7. Tableaux

Mesures relevees sur 3-AMAS, toutes transposables :

| Element | Valeur |
| --- | --- |
| Hauteur de ligne | 72 px |
| Hauteur d'entete | 38 px |
| Fond d'entete | gris tres clair, distinct du blanc des lignes |
| Separateur | 1 px, gris clair, **entre les lignes seulement** |
| Entete de colonne | capitales, 12 px, gris moyen, graisse normale |
| Barre d'outils au dessus | 62 px, dans la meme carte |
| Bouton de fin de ligne | carre 32 px, borde, rayon 8 px |

**Regles de fond :**

- La barre d'outils, le tableau et la pagination vivent dans **une seule carte
  bordee et arrondie**, pas trois blocs empiles. C'est ce qui donne la lecture
  compacte.
- **Alignement par colonne, declare dans la definition de colonne**, pas dans la
  cellule. Les montants tirent leur entete a droite avec eux.
- **Pas de bordures verticales.** Aucune grille. Seulement des lignes
  horizontales.
- La cellule d'identite est un composant partage : pastille d'initiales, nom en
  gras, ligne secondaire en gris.

**A auditer sur BCP :** hauteurs de ligne variables d'un ecran a l'autre,
bordures verticales, entetes de colonne trop contrastes, montants alignes a
gauche.

---

## 8. Les quatre etats obligatoires de toute liste

C'est le point invisible qui separe un integre d'un prototype.

Toute liste, sans exception, a **quatre** rendus :

1. **Plein.**
2. **Squelette.** Il reprend les **dimensions reelles** des lignes, meme hauteur,
   meme nombre de colonnes, meme entete. Il ne deplace pas la mise en page au
   chargement.
3. **Vide.** Il dit **s'il est normal ou anormal** et propose une sortie.
   Trois natures distinctes :
   - `normal` : rien n'a encore ete cree, c'est attendu ;
   - `filtre` : la liste est vide a cause des filtres, pas des donnees, et le
     bouton propose de les reinitialiser ;
   - `anormal` : des donnees etaient attendues, la mention est en rouge.
4. **Erreur.**

Et un cinquieme, transverse :

> **Erreur et acces refuse sont un composant unique reutilise partout.**

Sur 3-AMAS, un seul composant couvre erreur serveur, reseau injoignable, acces
refuse et introuvable, avec une fonction qui traduit le code d'erreur de
l'intercepteur Axios en nature d'affichage.

**A auditer sur BCP :** liste les ecrans qui n'ont pas de squelette, ceux dont
l'etat vide est un simple « Aucune donnee », et compte les composants d'erreur.

---

## 9. Regles de contenu

Ce sont elles qui font le serieux percu, plus que les couleurs.

1. **Tout montant s'affiche avec sa devise**, aligne a droite, en chiffres
   tabulaires. **Un seul utilitaire de formatage** dans `lib/`. Aucun composant
   ne formate lui meme.
2. **Une valeur inconnue, une valeur absente et un zero sont trois affichages
   differents.** `undefined` donne « Non renseigne », `null` donne « Sans
   objet », `0` donne « 0 FCFA ». **Jamais une cellule vide pour signifier
   l'absence.** Sur une fintech, la difference entre « solde inconnu » et
   « solde a zero » est critique.
3. **Toutes les dates passent par un seul utilitaire**, locale fr, formats
   figes : une date, une date avec heure, un mois, une periode, une anciennete.
   Aucun `toLocaleDateString` disperse dans les composants.
4. **Accord en nombre** sur tout compteur affiche. « 1 jour », pas « 1 jours ».
5. **Aucun emoji.** Une seule bibliotheque d'icones, poids de trait uniforme,
   style contour.

**A auditer sur BCP :** cherche les appels de formatage disperses, les cellules
vides, les « 1 jours ».

---

## 10. Gabarits de page

3-AMAS couvre **37 ecrans avec 8 gabarits et 20 composants partages**. C'est la
vraie raison de la coherence.

Les gabarits :

1. Connexion, plein ecran deux colonnes, trois etats.
2. Tableau de bord.
3. Liste : entete, barre de filtres, tableau, pagination. Variante grille.
4. Fiche detail.
5. Formulaire plein ecran, creation et modification par **un seul composant**.
6. **Modale CRUD, trois variantes.**
7. Assistant multi-etapes.
8. Coque secondaire, ici le portail locataire.

**L'entete de page est un composant partage** : titre, fil d'ariane, emplacement
d'action a droite. Il est identique sur tous les ecrans, ce qui fait qu'aucun
titre ne bouge d'un pixel d'une page a l'autre.

**Le point que tu as souleve sur Roles et Utilisateurs.** Sur 3-AMAS, ce sont
**deux routes distinctes** qui partagent un groupe d'onglets. Chaque onglet est
une vraie adresse, partageable et rechargeable, pas un etat local. Le groupe
d'onglets est un composant partage qui prend une liste de chemins. Le meme
composant sert Paiements et Quittances.

C'est preferable a un `useState` d'onglet : l'utilisateur peut envoyer un lien,
recharger, revenir en arriere.

**A auditer sur BCP :** les onglets qui ne sont pas des routes, les entetes de
page redigees ecran par ecran, les formulaires de creation et de modification
dupliques.

---

## 11. Separation des etats serveur et client

Regle stricte, tenue sur les 37 ecrans :

- **TanStack Query** gere tout ce qui vient du serveur : listes, fiches,
  mutations, cache, invalidation.
- **Zustand** gere l'etat purement client : session et role, filtres actifs,
  preferences d'affichage, ouverture des modales, etat intermediaire d'un
  assistant.
- **Aucune donnee serveur dans Zustand.**

Deux consequences visibles :

- Un filtre qui change ramene toujours a la page 1, sinon on affiche une page
  vide sans que l'utilisateur comprenne pourquoi.
- L'assistant multi-etapes garde sa saisie dans le store, pas dans le
  formulaire, ce qui rend le retour arriere sans perte gratuit.

**A auditer sur BCP :** des listes stockees dans Zustand, des `useEffect` qui
recopient des donnees serveur dans un etat local.

---

## 12. Couche de service remplacable

Chaque feature a un dossier `services/` dont chaque fonction a cette forme :

```ts
export async function listerX(options) {
  if (API_ACTIVE) {
    const { data } = await api.get('/x', { params: options })
    return data
  }
  return simuler(() => paginer(base, options, ...))
}
```

Les composants n'importent **jamais** `mocks/`. Ils appellent un hook, qui
appelle un service. Le passage au vrai backend ne modifie que la couche service.

Le simulateur injecte une **latence** entre 250 et 900 ms et un **taux d'echec**
reglable, pour que les etats de chargement et d'erreur soient reellement
testables.

**A auditer sur BCP :** des `fetch` dans des composants, des donnees factices
importees directement dans des pages.

---

## 13. Decoupage des dossiers

Par **domaine**, pas par type de fichier.

```
src/
  app/                routes, coques, providers, navigation
  components/ui/      shadcn, non modifie
  components/shared/  tableau, pastille, filtres, pagination, champ,
                      modale-crud, assistant, etats de liste
  features/
    <domaine>/  components/ hooks/ services/ types/ store.ts
  lib/                axios, format, dates
  mocks/
  stores/
  styles/
```

**Une feature ne depend jamais d'une autre.** Ce qui est partage remonte dans
`components/shared/` ou `lib/`. Sur 3-AMAS, cette regle est verifiable en une
commande, et elle vaut zero sur les douze features.

Quand une feature a besoin d'une donnee d'une autre, deux solutions :

- elle definit son **propre type minimal** et son service lit la source
  partagee ;
- ou l'element commun remonte dans `shared/`.

**A auditer sur BCP :** les imports croises entre domaines.

---

## 14. Theme sombre

Grace aux trois niveaux de jetons, le theme sombre tient dans **un bloc `.dark`
par fichier de jetons**. Aucun composant modifie, **aucune classe `dark:`
ecrite**.

```css
.dark {
  color-scheme: dark;
  --surface-page: var(--nuit-950);
  --surface:      var(--nuit-900);
  --fg-default:   var(--nuit-100);
  --brand-fg:     var(--bleu-300);
}
```

Trois pieges rencontres, a anticiper sur BCP :

1. **Le bouton principal disparait.** La couleur de marque foncee se confond
   avec le fond sombre. Il faut une variante plus claire, verifiee a la fois
   contre son texte, 4,5:1, et contre le fond, 3:1.
2. **L'anneau de focus devient invisible** pour la meme raison.
3. **Les pastilles d'initiales et les onglets actifs** se confondent avec la
   carte. Un jeton dedie regle les trois cas.

**Pas de flash au chargement.** Un script inline dans `index.html` pose la
classe avant le premier rendu, en lisant la preference stockee, avec repli sur
`prefers-color-scheme`.

Trois modes : clair, sombre, systeme. Le defaut suit le systeme.

**Sur BCP :** un beige et un orange se transposent mal tels quels en sombre. Le
beige devient une teinte neutre tres foncee de la meme famille chromatique.
L'orange de fond reste utilisable, l'orange de texte doit etre eclairci. Toutes
les paires sont a re-mesurer.

---

## 15. Responsive

Les maquettes de 3-AMAS sont en **une seule largeur, 1440 px**. Le responsive
n'etait pas couvert. Ce qui a ete ajoute :

- navigation laterale fixe a partir de `lg`, panneau lateral avec voile en
  dessous ;
- grilles qui passent de 3 a 2 a 1 colonne ;
- tableaux dans un conteneur `overflow-x-auto`, jamais de defilement horizontal
  de la page entiere ;
- nom d'utilisateur replie sous `md`, avatar conserve ;
- boutons d'action groupes qui passent a la ligne au lieu de deborder.

C'est un **ajout signale**, pas un releve. Fais pareil sur BCP : ajoute, et dis
que tu as ajoute.

---

## 16. Ce qu'il ne faut PAS copier de 3-AMAS

Sois explicite la dessus dans ton rapport.

- **Les pastilles pleines** blanc sur vert et blanc sur rouge, a 2,36:1 et
  3,66:1. Elles echouent. Elles sont conservees sur 3-AMAS uniquement parce
  qu'elles sont relevees dans les maquettes.
- **Les entetes de colonne a 3,54:1** et les textes indicatifs de champ a
  4,00:1. Meme raison.
- **Le placement du message d'erreur de connexion** sous la ligne de creation de
  compte, loin du bouton. Il est conserve par fidelite au design, mais au dessus
  du bouton serait meilleur.
- **La redondance entre un champ « nombre de pieces » et la liste des pieces**
  dans un formulaire. Cherche l'equivalent sur BCP : un total saisi a la main a
  cote de la liste qui le determine.
- **La devise incoherente entre deux zones du produit.** Sur 3-AMAS, le
  back-office etait en FCFA et le portail en euros dans les maquettes. Sur une
  fintech, verifie qu'une seule devise et un seul format de montant traversent
  tout le produit.

---

## 17. Livrable attendu de ta part

**Ne code rien avant validation.** Produis un document en trois parties.

**Partie A, rapport d'ecart.** Un tableau, une ligne par point de la grille
ci-dessus, quatre colonnes : le point, l'etat actuel de BCP, l'ecart, le cout
estime en lots.

**Partie B, audit de contraste.** Toutes les paires texte sur fond de BCP, leur
ratio mesure, et la liste de celles qui passent sous 4,5:1. Pour chacune, une
alternative qui passe, sans changer la teinte.

**Partie C, plan par lots**, ordonne par rentabilite. Sur 3-AMAS, l'ordre qui a
fonctionne :

1. Jetons, theme, typographie, rayons. Ne touche aucun ecran, debloque tout.
2. Coque : navigation, barre superieure, entete de page.
3. Composants partages, dont **la modale CRUD unique**. Le plus rentable.
4. Connexion.
5. La feature la plus complete, celle qui exerce tous les gabarits.
6. Les features qui reutilisent sans rien inventer.
7. Assistants et parcours multi-etapes.
8. Le reste des listes.
9. Coques secondaires.
10. Tableau de bord en dernier, quand toutes les donnees existent.

Un commit par lot. Un compte rendu par lot. Arret et attente d'accord entre
chaque.

---

## 18. Captures de reference

Les captures sont dans `captures/`, prises en 1440 px de large, densite 2.

| Fichier | Ce qu'il montre |
| --- | --- |
| `connexion.png` | gabarit deux colonnes, champs a icone, bouton pilule pleine largeur |
| `tableau-de-bord.png` | tuiles cliquables, barre d'occupation, blocs de cinq lignes |
| `liste-tableau.png` | carte unique qui contient outils, tableau et pagination |
| `liste-grille.png` | variante grille, pastilles de statut, bandeau d'accent |
| `fiche-detail.png` | colonne media plus colonne donnees, badges de valeur |
| `modale-formulaire.png` | rayon 16, voile, largeur 446, libelles en capitales |
| `modale-suppression.png` | variante destructive, consequences reelles enoncees |
| `assistant-etape.png` | barres de progression, pied Precedent et Continuer |
| `coque-secondaire.png` | seconde coque, navigation reduite, onglets pleine largeur |
| `theme-sombre.png` | la meme liste en sombre, aucune classe `dark:` ecrite |
| `etats-liste.png` | plein, squelette, vide et erreur cote a cote |

**Ces captures montrent la structure et les proportions, pas la palette.** La
palette de BCP reste le beige et l'orange. Ne reprends ni le bleu ni le jaune de
3-AMAS.
