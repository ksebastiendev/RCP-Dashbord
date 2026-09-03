import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Providers } from "@/app/providers";
import { router } from "@/app/routes";
import { ouvrirSessionDeDemonstration } from "@/app/session-demonstration";
import "./index.css";

/* Session locale, en attente de l'ecran de connexion. */
ouvrirSessionDeDemonstration();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
