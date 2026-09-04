# Releve des maquettes, lot 1

Source : `3AMAS-maquettes/`, 36 PNG en 1440 px de large. Echantillonnage au
pixel, aucun serveur Figma.

## Couleurs relevees et ratios de contraste

### Neutres

| Jeton | Valeur | Usage releve | Contraste |
| --- | --- | --- | --- |
| `--neutre-0` | `#FFFFFF` | surfaces, cartes, lignes de tableau | reference |
| `--neutre-50` | `#F8FAFD` | fond du portail locataire | reference |
| `--neutre-100` | `#F7F7F7` | entete de tableau | reference |
| `--neutre-200` | `#EBEBEB` | bordure de carte, separateur de ligne | reference |
| `--neutre-250` | `#E5ECF3` | bordure de champ | reference |
| `--neutre-300` | `#DDE6EF` | piste d'interrupteur inactif | reference |
| `--neutre-500` | `#83899F` | libelle de ligne du portail | **3,47:1** |
| `--neutre-550` | `#797F8F` | texte indicatif de champ | **4,00:1** |
| `--neutre-600` | `#6B7280` | sous-titre de la connexion | 4,83:1 |
| `--neutre-650` | `#5A6E82` | texte secondaire du back-office | 5,27:1 |
| `--neutre-700` | `#838383` | entete de colonne, sur `#F7F7F7` | **3,54:1** |
| `--neutre-900` | `#1A2B3C` | texte principal | 14,44:1 |
| `--neutre-950` | `#14161A` | texte sur fond jaune | 11,50:1 |
| `--neutre-1000` | `#000000` | texte de cellule de tableau | 21:1 |

### Etats

| Jeton | Valeur | Usage releve | Contraste |
| --- | --- | --- | --- |
| `--vert-100` / `--vert-900` | `#C2F5DA` / `#0B4627` | pastille Active, Solde | 9,05:1 |
| `--vert-500` + blanc | `#1FC16B` | pastille Libre, grille des biens | **2,36:1** |
| `--rouge-100` / `--rouge-900` | `#FFC0C5` / `#681219` | pastille Impaye | 8,49:1 |
| `--rouge-500` + blanc | `#FB3748` | pastille Occupe, bouton Supprimer | **3,66:1** |
| `--orange-100` / `--orange-900` | `#FFD5C0` / `#682F12` | etiquette En attente, portail | 7,75:1 |
| `--orange-50` | `#FDF5EB` | fond de pastille d'information | reference |
| `--bleu-800` | `#0B5587` | navigation, titres, boutons | 7,88:1 |
| `--jaune-400` + `#14161A` | `#FFC600` | bouton Export, item de nav actif | 11,50:1 |

### Sous 4,5:1, signale, non corrige

1. Blanc sur `#1FC16B`, pastille **Libre** de la grille des biens : **2,36:1**.
   Alternative disponible sans changer de forme : `--etat-succes-surface` +
   `--etat-succes-fg`, deja utilisee par la pastille Active, a 9,05:1.
2. Blanc sur `#FB3748`, pastille **Occupe** et bouton **Supprimer** : **3,66:1**.
   Passe le seuil des gros textes, echoue en 14 px. Un rouge a `#D91F30`
   donnerait 4,54:1 avec du blanc sans changer la lecture.
3. `#838383` sur `#F7F7F7`, **entetes de colonne** de tous les tableaux :
   **3,54:1**. `#6B7280` sur le meme fond donnerait 4,58:1.
4. `#797F8F`, **texte indicatif** des champs : **4,00:1**. `#6B7280` a 4,83:1.
5. `#83899F`, **libelles** des lignes du portail locataire : **3,47:1**.
   `#5A6E82` a 5,27:1.

Les valeurs relevees sont celles qui sont figees dans `primitives.css`. Les
alternatives ci-dessus ne sont pas appliquees.

## Rayons

| Element | Mesure | Jeton |
| --- | --- | --- |
| Champ de formulaire | 8 px | `--rayon-sm` |
| Carte de bien, grille | 12 px | `--rayon-md` |
| Carte de liste, modale, carte du portail | 16 px | `--rayon-lg` |
| Bouton, pastille, onglet | entierement arrondi | `--rayon-pill` |

Echelle figee a trois valeurs plus la pilule, branchee sur `rounded-sm`,
`rounded-md`, `rounded-lg`.

## Typographie

Poppins, quatre graisses relevees et chargees, sous-ensemble latin uniquement :

- 400, texte courant, descriptions, cellules de tableau
- 500, elements de navigation, libelles de champ, onglets
- 600, boutons, entetes de section, titres de modale
- 700, titres de page, titre de carte de bien, nom sur le portail

Chiffres tabulaires actives sur `th`, `td`, `time` et `[data-tabulaire]`.

## Jaune retenu

Les maquettes peignent le bouton Export et l'item de navigation actif en
`#FFC600`. Le brief annoncait `#FFD02F`. La maquette fait foi : `--jaune-400`
vaut `#FFC600`.

| Paire | Contraste |
| --- | --- |
| `#14161A` sur `#FFC600` | 11,50:1 |
| blanc sur `#FFC600` | **1,58:1**, jamais utilise |
| `#FFC600` en texte sur blanc | **1,58:1**, jamais utilise |
| `--brand-accent-text` `#8A6800` sur blanc | 5,17:1 |

Le jaune reste un fond exclusivement. Le seul jaune admis en texte est
`--brand-accent-text`.

## Bouton principal

Les maquettes peignent le bouton principal en `--bleu-800` : Se connecter,
Ajouter un bien, Enroler un locataire, Enregistrer, Continuer, Telecharger le
bail. Le jaune est reserve au bouton Export et a l'item de navigation actif.
`--primary` de shadcn est donc branche sur `--brand-surface`, et le jaune reste
accessible par les utilitaires `bg-action-primary` / `text-action-primary-fg`.

## Coque du back-office, lot 2

| Element | Mesure relevee |
| --- | --- |
| Largeur de la navigation laterale | 276 px |
| Hauteur du bloc de marque | 73 px |
| Item de navigation | 240 x 44 px, marge laterale 18 px, rayon 12 px |
| Pas vertical entre items | 45 px |
| Retrait de l'icone dans l'item | 17 px, icone 20 px, ecart 12 px |
| Hauteur de la barre superieure | 73 px, bordure basse `#EDEDED` |
| Marges du contenu | 36 px a gauche et a droite |
| Champ de recherche global | 319 px de large, entierement arrondi |
| Pastille de notification | `#F57600` |
| Texte de navigation inactif | `#EDEDED`, 6,73:1 sur `#0B5587` |
| Texte de navigation actif | `#1A2B3C` dans la maquette, 9,16:1 sur `#FFC600` |

Le jeton `--action-primary-fg` reste a `#14161A` comme impose par le brief. La
maquette peint ce libelle en `#1A2B3C`. Les deux passent largement le seuil,
l'ecart est invisible.

## Composants partages, lot 3

| Element | Mesure relevee |
| --- | --- |
| Hauteur de ligne de tableau | 72 px, separateur 1 px `#EBEBEB` |
| Hauteur de l'entete de tableau | 38 px, fond `#F7F7F7` |
| Hauteur de la barre d'outils de liste | 62 px |
| Bouton de fin de ligne | carre 32 px, borde, rayon 8 px |
| Modale etroite | 446 px, modale large 640 px |
| Champ de modale | 42 px de haut |
| Champ de la connexion | 44 px de haut |
| Libelle de champ | capitales, 12 px, `--champ-label-fg` |

Le squelette de tableau reprend exactement ces hauteurs, il ne deplace donc pas
la mise en page au chargement.

### Incoherence d'espacement signalee

La hauteur des champs varie d'un ecran a l'autre du meme gabarit : 42 px dans
les modales, 44 px sur l'ecran de connexion. Une seule valeur est retenue,
44 px, sur tous les champs.

### Pagination

Absente de toutes les maquettes alors que le gabarit 3 en prevoit une. Elle est
construite dans le vocabulaire du systeme : bornes explicites a gauche, boutons
en pilule a droite, page courante en `--brand-surface`.

## Theme sombre, ajout hors maquettes

Aucun ecran sombre n'existe dans `3AMAS-maquettes/`. La rampe ci-dessous est
**derivee**, construite sur la teinte de `--bleu-800`. Elle ne remplace pas un
relevé, elle attend une validation.

| Role | Valeur | Contraste |
| --- | --- | --- |
| Fond d'application | `#0C1622` | reference |
| Surface, carte | `#132030` | reference |
| Navigation laterale | `#0A2036` | reference |
| Entete de tableau | `#1B2B3D` | reference |
| Bordure de carte | `#26394F` | reference |
| Texte principal `#E8EDF3` | sur carte | 13,97:1 |
| Texte secondaire `#A8B6C6` | sur carte | 7,97:1 |
| Texte discret `#8FA0B3` | sur carte | 6,15:1 |
| Texte indicatif `#7E8FA3` | sur carte | 4,97:1 |
| Entete de colonne `#9AA9BA` | sur `#1B2B3D` | 6,00:1 |
| Marque `#7ABBEE` | sur carte | 7,96:1 |
| Bouton principal `#1A6FA8` | texte `#E8EDF3` | 4,59:1 |
| Bouton principal `#1A6FA8` | contre le fond | 3,37:1 |
| Succes `#7CEFB4` sur `#0F3A26` | | 8,99:1 |
| Danger `#FFA8B0` sur `#431419` | | 8,49:1 |
| Attente `#FFC59A` sur `#43240F` | | 9,15:1 |
| Neutre `#A8B6C6` sur `#1B2B3D` | | 6,97:1 |
| Jaune `#FFC600` + `#14161A` | inchange | 11,50:1 |
| Jaune en texte `#E3B341` | sur carte | 8,45:1 |

Toutes les paires passent 4,5:1. Les deux pastilles pleines relevees,
`#1FC16B` et `#FB3748` avec du blanc, restent sous le seuil dans les deux
themes : c'est le meme defaut de relevé, pas un defaut du theme sombre.

Aucun composant n'a ete modifie pour le theme sombre, et aucune classe `dark:`
n'est utilisee : seuls les jetons semantiques sont redefinis dans `.dark`.

## Ecran de connexion, lot 4

| Element | Mesure relevee |
| --- | --- |
| Panneau de marque | 720 px, soit la moitie exacte |
| Colonne du formulaire | 422 px, centree dans la moitie droite |
| Retrait du panneau gauche | 84 px |
| Titre Connexion | 36 px gras, `#151924`, 17,55:1 |
| Sous-titre | 15 px, `#6B7280`, 4,83:1 |
| Libelle de champ | 14 px, casse de phrase, `#151924` |
| Champ | 44 px de haut, rayon 10 px, icone a gauche |
| Bouton principal | pleine largeur, 40 px, entierement arrondi |
| Bordure de champ en erreur | `#A73838`, 6,43:1 |
| Message d'erreur | `#9B1C1C`, 8,15:1 |

### Deux styles de libelle dans le meme systeme

Les modales et formulaires ecrivent leurs libelles en capitales 12 px sur
`--champ-label-fg`. L'ecran de connexion les ecrit en casse de phrase 14 px sur
`#151924`. Les deux sont relevés. Un seul composant, `ChampTexte`, porte les
deux par la propriete `styleLibelle`.

### Corrections apportees

- Le libelle passait en rouge `#FB3748` quand le champ etait en erreur, par
  defaut de shadcn, a 3,66:1. Les maquettes gardent le libelle sombre et ne
  colorent que la bordure. Comportement remis a celui des maquettes.
- `Left Brand Block.png` portait en bas, en blanc, la mention
  « © 2026 Gridlines UI. Tous droits reserves. ». L'image est recadree a
  720 x 854 pour la retirer ; la mention francaise est posee en HTML.
- L'illustration porte des textes anglais incrustes dans le bitmap
  (« find your ideal house », « for sale », « for rent »). Non modifiables.

## Biens, lot 5

| Element | Mesure relevee |
| --- | --- |
| Carte de la grille | 346 x 252, rayon 12 px, 3 colonnes, gouttiere 26 px |
| Bandeau de prix | diagonale a 45 degres, fond `--action-primary`, texte `#14161A` |
| Photo de la fiche | rapport 679 / 480, rayon 16 px |
| Vignette de la fiche | 108 x 96, rayon 8 px, contour bleu sur la vignette active |
| Colonne droite de la fiche | 380 px |

### Ecarts et decisions

- **Le voile des cartes est un degrade** dans la maquette, du noir en bas vers
  le transparent en haut. Il sert la lisibilite du titre pose sur la photo,
  il n'est pas decoratif : il est conserve tel quel. Un aplat produisait une
  arete visible en travers de la photo.
- **Les pastilles de la grille sont pleines** : blanc sur `#1FC16B` a 2,36:1 et
  blanc sur `#FB3748` a 3,66:1. Valeurs relevees, conservees, deja signalees.
- **Le fil d'ariane de la fiche** disait « Biens / Liste / Detail », seul ecran
  a ne pas commencer par « Accueil ». Aligne sur le reste : « Accueil / Biens /
  nom du bien ».
- **Aucune action sur la fiche ni sur les cartes** dans les maquettes, alors
  que la modale de suppression est presentee au dessus de la grille. Un menu
  d'actions a ete ajoute sur chaque carte et deux boutons sur la fiche, sans
  quoi Modifier et Supprimer sont inatteignables.
- **Les badges ronds de la liste des pieces** affichaient tous « 2 », sans unite
  ni sens lisible. Ils portent desormais la surface de la piece, la donnee que
  le formulaire collecte pour chaque piece.
- **Les montants etaient ecrits « 200.000 FCFA »**, avec un point separateur.
  L'application applique la convention francaise, espace insecable etroit.
- **Aucune pagination dans la maquette de la grille** alors que le portefeuille
  compte 21 biens. Neuf cartes par page, trois rangees de trois.
- **« Nombre de pieces » et la liste des pieces font double emploi** dans le
  formulaire. Les deux sont conserves ; le service retient le nombre reel de
  pieces decrites.

### Galerie fournie

`galerie/` ne contient que quatre photos de bien exploitables, en 639 x 434 :
un salon, un sejour, une cuisine, une entree. La maquette de la grille montre
six exterieurs differents qui ne sont pas fournis. Les quatre photos sont
recyclees d'un bien a l'autre.

Les photos deposees dans le formulaire vivent le temps de la session sous forme
d'URL d'objet : leur conservation demande le backend.

## Locataires, Demarcheurs, Roles, Utilisateurs, lot 6

Quatre features construites sur les gabarits du lot 3, sans composant nouveau
sauf `cellule-personne`, `onglets-navigation` et `galerie-photos`, remontee
depuis la feature Biens pour servir aussi l'etat des lieux d'un locataire.

### Nouvelles valeurs relevees

| Jeton | Valeur | Usage | Contraste |
| --- | --- | --- | --- |
| `--jaune-100` + `--bleu-800` | `#FDEEB2` / `#0B5587` | pastille de role, profil | 6,78:1 |
| pastille Inactif relevee | `#737373` sur `#EBEBEB` | liste des roles | **3,98:1** |

La pastille Inactif relevee passe sous le seuil. Le jeton `--etat-neutre`
existant, `#5A6E82` sur `#F7F7F7`, rend le meme gris a 5,27:1 : c'est lui qui
est applique. L'ecart visuel est d'un ton de fond.

### Ecarts et decisions

- **Les entetes de la liste des roles ne correspondent pas a leur contenu** :
  la colonne « Description » affiche « 3 utilisateurs » et la colonne
  « Nbr. utilisateurs » affiche « Toutes » ou « 4 permissions ». Les colonnes
  sont remises en face de leur donnee : nom et description, utilisateurs,
  permissions, statut.
- **Le fil d'ariane de la fiche locataire** disait « Locataires / Liste /
  Detail ». Aligne sur « Accueil / Locataires / nom ».
- **Le libelle de la nav change d'une maquette a l'autre** : « Favorite Apps »
  sur la plupart des ecrans, « Menu Principal » sur le profil. Un seul libelle
  est retenu, « Navigation ».
- **Le profil porte deux boutons, « Modifier » et « Sauvegarder »**, sans etat
  indique. Lecture retenue : les champs sont en lecture seule, « Modifier » les
  ouvre, « Enregistrer » valide. Les champs en lecture seule gardent leur
  contraste, ils ne sont pas grises comme des controles desactives.
- **Les avatars des tableaux sont roses** `#FF3489` dans toutes les maquettes,
  couleur absente de la palette. Remplaces par les initiales sur
  `--brand-surface`.
- **Le role se change directement dans la ligne** du tableau des utilisateurs,
  comme la maquette le montre. La liste des roles attribuables ne contient que
  les roles actifs.
- **Les roles ne sont que huit**, la ou le brief demande vingt lignes minimum
  par liste. Une agence n'a pas vingt roles ; les autres listes en ont vingt et
  une, vingt, vingt et vingt.
- **`Id card.png`** fournie dans la galerie est un specimen de carte
  d'identite azerbaidjanaise. Elle est utilisee telle quelle faute d'autre
  ressource, et elle detonne sur des dossiers beninois.
- **La couverture de la fiche locataire** est `Image.png`, un voilier, sans
  rapport avec la gestion locative. Conservee faute d'alternative fournie.

### Fautes et libelles corriges

`REVENUES` devient `Revenus generes` · `NBR DE BIENS` devient `Biens apportes`
· `STATUS` devient `Statut` · `Quitance de mai` devient `Quittance` ·
`Etat des lieux` devient `Etat des lieux` avec accent · `A l'entree` devient
`A l'entree` avec accent · `Download` devient `Telecharger` ·
`Gestion des locataires & dossiers` devient `Gestion des locataires et des
dossiers`, comme les trois autres permissions ecrites avec une esperluette.

## Assistant d'enrolement, lot 7

La maquette en fait une **modale**, pas une page plein ecran : 652 px de large,
entete avec le titre et « Etape N sur 3 », trois barres de progression, un
libelle de section en capitales, puis « Precedent » et « Continuer ».

### Conservation de la saisie

Le brouillon vit dans le store Zustand de la feature, pas dans le formulaire.
Chaque etape est un formulaire distinct, initialise depuis le brouillon et qui
y reverse ses valeurs. Le retour arriere ne perd donc rien, y compris sur deux
etapes d'affilee. Verifie au navigateur.

### Ecarts et decisions

- **L'emoji de signature** dans la maquette est remplace par l'icone Lucide
  `PenLine`, conformement a la regle qui exclut les emoji.
- **Le bouton de la derniere etape disait « Continuer »**, sans rien apres.
  Il devient « Enroler le locataire ».
- **Le contrat de la maquette porte un texte de remplissage non substitue** :
  « Entre M. N'GUESSAN Tano, le Bailleur, et kjbhjb. ». Le contrat est
  desormais compose depuis les donnees saisies : bailleur, preneur, reference
  et nom du bien, adresse, ville, loyer.
- **Aucune date de debut ni duree de bail** dans la maquette, alors que la liste
  des locataires affiche une duree et une periode. Deux champs sont ajoutes a
  l'etape 3, sans quoi l'enrolement ne peut pas produire ce que la liste
  affiche.
- **La signature est exigee** avant enrolement ; sans elle le contrat n'a pas
  de valeur. La maquette ne le disait pas.
- **L'enrolement cree reellement le dossier** dans la simulation et occupe le
  bien choisi : la fiche du nouveau locataire s'ouvre, le bien quitte la liste
  des biens libres.

## Paiements, Quittances, Relances, lot 8

### Les deux fichiers de maquette sont intervertis

`Paiements - En attente.png` montre l'onglet **Quittances emises** actif, avec
un bouton de telechargement par ligne. `Paiements - Quittances emises.png`
montre l'onglet **En attente de validation** actif, avec trois boutons ronds
d'action. Le contenu de chaque fichier a ete suivi, pas son nom.

### Ecarts et decisions

- **L'ecran « En attente » n'affichait que des lignes « Solde »**, ce qui n'a
  pas de sens pour un ecran de validation. Les versements en attente y sont
  desormais reellement en attente.
- **Les trois boutons ronds ne portaient aucune etiquette.** Ils sont
  identifies : valider, ouvrir le dossier, rejeter. Chacun a un texte pour
  lecteur d'ecran et une infobulle.
- **Le rejet passe par la modale de confirmation**, avec ses consequences
  reelles : aucune quittance emise, le locataire reste redevable, il verra le
  rejet depuis son portail.
- **Une colonne « Moyen »** est ajoutee : le portail collecte le moyen de
  reglement, le back-office doit le voir.
- **La validation emet la quittance** et la fait apparaitre dans l'onglet
  voisin, sur la fiche du locataire et sur le portail.
- **Sur les Relances**, la colonne « Mois impaye » a ete fondue dans la colonne
  « Bien » : sept colonnes plus trois boutons ne tenaient pas dans la largeur.
- **L'interrupteur de relances automatiques** est un etat client persiste. Son
  effet reel demande le backend.

## Portail locataire, lot 9

- **Les montants du portail etaient en euros** alors que tout le back-office
  est en FCFA. Le portail passe en FCFA.
- **Le degrade de la carte de tete est conserve** : il porte la photo du bien
  et le contraste du texte pose dessus.
- **« En attente de 2 jours »** devient « A regler sous 2 jours », ou « En
  retard de N jours » quand l'echeance est passee, avec l'accord en nombre.
- **Le portail refuse le back-office** : un compte locataire qui vise `/biens`
  tombe sur l'ecran d'acces refuse.
- Le dossier est retrouve par l'adresse e-mail du compte connecte. Un compte
  sans dossier de location voit un message explicite, pas un ecran vide.

## Tableau de bord, lot 10

**Aucune maquette n'existe** : le dossier ne contient qu'un libelle de
209 x 30 px. Cet ecran est donc entierement construit. Il n'introduit ni
composant ni jeton nouveau, et ne dessine aucun graphique, ce qui aurait
demande une dependance de plus.

Contenu retenu, dans l'ordre de lecture :

1. Quatre tuiles cliquables : biens au portefeuille, locataires actifs,
   encaisse du mois, impayes en cours. Chaque tuile mene a l'ecran concerne.
2. Une barre d'occupation du portefeuille, avec les deux pastilles libelles.
3. Deux blocs de cinq lignes : versements a valider, impayes a relancer.

Toutes les valeurs sont calculees a partir des memes bases de simulation que
les autres ecrans : le tableau de bord ne peut pas mentir sur ce que les listes
montrent.

## Theme sombre, corrections du lot 10

- **Les pastilles d'initiales** utilisaient `--brand-surface`, qui se confond
  avec la carte en theme sombre. Jeton dedie `--avatar-bg`, `#1A6FA8` en
  sombre : 4,59:1 avec son texte, 3,04:1 contre la carte.
- **L'onglet actif et les badges de surface des pieces** passent par
  `--bouton-primaire-bg`, pour la meme raison.
