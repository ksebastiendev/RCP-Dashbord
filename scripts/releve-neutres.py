from PIL import Image
from collections import Counter
import glob, os

def hx(p): return '#%02X%02X%02X' % p[:3]

screens = sorted(glob.glob('BCP-marquettes-ui/BCP/**/*.png', recursive=True))
c = Counter()
for f in screens:
    im = Image.open(f).convert('RGB')
    c.update(im.getdata())
print("=== 25 couleurs les plus frequentes, tous ecrans ===")
for col, n in c.most_common(25):
    print(hx(col), col, n)

im = Image.open('BCP-marquettes-ui/BCP/Referentiels/Operateur.png').convert('RGB')
pts = {
 'fond zone contenu (700,90)': (700,90),
 'fond zone contenu (1420,300)': (1420,300),
 'surface carte / ligne tableau (700,430)': (700,430),
 'entete tableau (700,369)': (700,369),
 'separateur ligne (700,449)': (700,449),
 'bord haut carte (700,306)': (700,306),
 'nav surface (140,600)': (140,600),
 'topbar (900,32)': (900,32),
 'fond champ recherche (500,248)': (500,248),
 'bord champ recherche (310,248)': (310,248),
 'pastille ancien nom fond (977,589)': (977,589),
}
print("\n=== points cibles Operateur.png ===")
for k,(x,y) in pts.items():
    print(f"{k:45s} {hx(im.getpixel((x,y)))}")

def darkest(im, box, label):
    reg = im.crop(box)
    px = list(reg.getdata())
    d = min(px, key=lambda p: p[0]+p[1]+p[2])
    print(f"{label:45s} {hx(d)}")

print("\n=== texte : pixel le plus dense de la zone ===")
darkest(im, (309,110,470,145), 'titre H1 "Operateur"')
darkest(im, (309,150,930,192), 'sous-titre / texte secondaire')
darkest(im, (332,360,410,380), 'entete de colonne "Operateur"')
darkest(im, (369,410,450,432), 'texte de cellule "MTN Benin"')
darkest(im, (659,410,700,432), 'texte de cellule "Benin"')
darkest(im, (334,315,475,338), 'titre de carte "56 Operateurs"')
darkest(im, (320,238,560,260), 'placeholder champ recherche')
darkest(im, (943,410,955,432), 'tiret valeur absente')

nav = Image.open('BCP-marquettes-ui/BCP/Accueil.png').convert('RGB')
print("\n=== nav / topbar (Accueil.png) ===")
darkest(nav, (58,150,140,172), 'label nav inactif "Marchand"')
for k,(x,y) in {'nav fond (140,600)':(140,600),'nav item actif fond (140,106)':(140,106),
 'topbar fond (900,32)':(900,32),'fond page (700,1000)':(700,1000),
 'carte KPI fond (410,400)':(410,400)}.items():
    print(f"{k:45s} {hx(nav.getpixel((x,y)))}")
