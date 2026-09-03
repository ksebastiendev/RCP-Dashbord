import { cn } from "@/lib/utils";

/*
 * Surface de carte. Rayon 8px, bordure 1px releves dans les maquettes.
 * Les cartes de tableau n'ont pas de bordure dans les maquettes, d'ou
 * `avecBordure`.
 */
export function Carte({
  avecBordure = true,
  className,
  children,
}: {
  avecBordure?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card",
        avecBordure && "border border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
