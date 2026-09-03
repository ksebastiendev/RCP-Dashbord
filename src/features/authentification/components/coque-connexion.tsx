import { cn } from "@/lib/utils";

/*
 * Coque des ecrans d'authentification.
 *
 * Le fond est l'image fournie, reechantillonnee a 1600 px et convertie en
 * JPEG : l'original fait 2880 px et 4 Mo, ce qui est plus lourd que tout le
 * reste de l'application reunie pour un decor qui ne porte aucune
 * information. Il est marque aria-hidden pour la meme raison.
 */
export function CoqueConnexion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary p-6">
      <img
        src="/marque/fond-connexion.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />

      {/*
        Voile brun.
        L'image brute est un orange sature sur toute la surface : la carte
        blanche s'y detache mal et la couleur de marque perd sa valeur
        d'accent a force d'occuper l'ecran entier. Le voile la ramene au
        rang de fond, sans introduire de couleur etrangere puisqu'il est
        tire de brown-900.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-sidebar/35"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, transparent 0%, rgba(77, 36, 9, 0.3) 100%)",
        }}
      />

      <main
        className={cn(
          "relative w-full max-w-[520px] rounded-lg bg-card px-10 py-12",
          /* Seule ombre du projet, et elle a une fonction : detacher la
             carte du fond photographique. Aucun autre ecran n'en porte. */
          "shadow-[0_24px_64px_-16px_rgba(77,36,9,0.45)]",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function EnTeteConnexion({
  titre,
  description,
}: {
  titre: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <img
        src="/marque/Logo-bestcashpay.png"
        alt=""
        aria-hidden="true"
        className="mx-auto h-10 w-12 object-contain"
      />
      <h1 className="mt-5 text-nombre font-semibold text-fg-primary">
        {titre}
      </h1>
      <p className="mt-2 text-corps leading-relaxed text-fg-secondary">
        {description}
      </p>
    </div>
  );
}
