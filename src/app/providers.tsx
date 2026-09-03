import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";

/*
 * Providers de l'application. Un seul point de montage pour tout ce qui
 * enveloppe l'arbre : c'est ici, et nulle part ailleurs, qu'on ajoute un
 * contexte transverse.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
