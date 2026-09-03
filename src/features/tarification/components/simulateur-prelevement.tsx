import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carte } from "@/components/shared/carte";
import { ChampFormulaire } from "@/components/shared/champ-formulaire";
import {
  CLASSES_CONTROLE,
  CLASSES_CONTROLE_MONTANT,
} from "@/components/shared/classes-controle";
import { Bandeau } from "@/components/shared/bandeau";
import { Montant } from "@/components/shared/valeur";
import { formatPourcentage, type CodeDevise } from "@/lib/format";
import { TRAIT_ICONE } from "@/lib/icones";
import type { Sens } from "@/features/aiguillage/types";
import type { RegleTarifaire, Simulation } from "../types";

/*
 * Simulateur de prelevement. Releve dans BCP/tarification/Grille Generale.png.
 *
 * La maquette y montre cinq champs dont deux portent le meme libelle,
 * "Sens" : une duplication. Le second est ici le pays, qui est la dimension
 * manquante pour designer une regle.
 */

/*
 * Arrondi du prelevement.
 *
 * Un prelevement s'arrondit a l'unite reellement en circulation dans la
 * devise, et vers le haut : arrondir vers le bas ferait perdre une fraction
 * a chaque paiement, et l'ecart deviendrait visible au rapprochement. La
 * regle est ecrite sous le resultat plutot que cachee ici.
 */
const DECIMALES: Partial<Record<CodeDevise, number>> = {
  XOF: 0,
  XAF: 0,
  GNF: 0,
  GHS: 2,
  NGN: 2,
  EUR: 2,
  USD: 2,
};

function arrondirVersLeHaut(valeur: number, devise: CodeDevise) {
  const facteur = 10 ** (DECIMALES[devise] ?? 2);
  return Math.ceil(valeur * facteur) / facteur;
}

function simuler(
  regle: RegleTarifaire | null,
  montant: number,
): Simulation | null {
  if (!regle || !Number.isFinite(montant) || montant <= 0) return null;

  const brut = (montant * regle.taux) / 100 + regle.partFixe;
  const prelevement = arrondirVersLeHaut(brut, regle.devise);

  return {
    regle,
    montant,
    prelevement,
    /* Les frais sont a la charge du client final dans la grille generale :
       le marchand recoit le montant, le client paie le montant plus les
       frais. */
    recuParLeMarchand: montant,
    payeParLeClient: montant + prelevement,
  };
}

export function SimulateurPrelevement({
  regles,
  chargement,
}: {
  regles: RegleTarifaire[] | undefined;
  chargement: boolean;
}) {
  const [montant, setMontant] = useState("25000");
  const [portefeuille, setPortefeuille] = useState("");
  const [sens, setSens] = useState<Sens>("encaissement");
  const [devise, setDevise] = useState<CodeDevise>("XOF");
  const [soumis, setSoumis] = useState(false);

  const portefeuilles = useMemo(
    () => Array.from(new Set(regles?.map((r) => r.portefeuille) ?? [])),
    [regles],
  );

  const portefeuilleChoisi = portefeuille || portefeuilles[0] || "";

  const regle = useMemo(
    () =>
      regles?.find(
        (r) =>
          r.portefeuille === portefeuilleChoisi &&
          r.sens === sens &&
          r.devise === devise,
      ) ?? null,
    [regles, portefeuilleChoisi, sens, devise],
  );

  const resultat = soumis ? simuler(regle, Number(montant.replace(/\s/g, ""))) : null;

  return (
    <Carte avecBordure={false} className="px-6 py-6">
      <div className="flex items-start gap-3">
        <Calculator
          className="mt-0.5 size-5 shrink-0 text-fg-muted"
          strokeWidth={TRAIT_ICONE}
          aria-hidden="true"
        />
        <div>
          <h2 className="text-titre font-semibold text-fg-primary">
            Simuler un prélèvement
          </h2>
          <p className="mt-1 text-mention text-fg-secondary">
            Voyez quelle règle s'applique et combien elle prélève, avant de
            l'appliquer à un vrai paiement.
          </p>
        </div>
      </div>

      <form
        className="mt-5 grid gap-5 lg:grid-cols-5"
        onSubmit={(evenement) => {
          evenement.preventDefault();
          setSoumis(true);
        }}
      >
        <ChampFormulaire etiquette="Montant" requis>
          {(attributs) => (
            <input
              {...attributs}
              type="text"
              inputMode="numeric"
              value={montant}
              onChange={(e) => {
                setMontant(e.target.value);
                setSoumis(false);
              }}
              className={CLASSES_CONTROLE_MONTANT}
            />
          )}
        </ChampFormulaire>

        <ChampFormulaire etiquette="Devise" requis>
          {(attributs) => (
            <select
              {...attributs}
              value={devise}
              onChange={(e) => {
                setDevise(e.target.value as CodeDevise);
                setSoumis(false);
              }}
              className={CLASSES_CONTROLE}
            >
              {(["XOF", "XAF", "GHS", "NGN", "GNF"] as CodeDevise[]).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </ChampFormulaire>

        <ChampFormulaire etiquette="Sens" requis>
          {(attributs) => (
            <select
              {...attributs}
              value={sens}
              onChange={(e) => {
                setSens(e.target.value as Sens);
                setSoumis(false);
              }}
              className={CLASSES_CONTROLE}
            >
              <option value="encaissement">Encaissement</option>
              <option value="decaissement">Décaissement</option>
            </select>
          )}
        </ChampFormulaire>

        <ChampFormulaire etiquette="Portefeuille" requis>
          {(attributs) => (
            <select
              {...attributs}
              value={portefeuilleChoisi}
              onChange={(e) => {
                setPortefeuille(e.target.value);
                setSoumis(false);
              }}
              disabled={chargement}
              className={CLASSES_CONTROLE}
            >
              {portefeuilles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </ChampFormulaire>

        <div className="flex items-end">
          <Button type="submit" className="h-12 w-full" disabled={chargement}>
            Simuler
          </Button>
        </div>
      </form>

      {soumis && !resultat && (
        <Bandeau
          genre="attente"
          titre="Aucune règle ne s'applique à cette combinaison"
          description="Aucune règle tarifaire ne couvre ce portefeuille dans ce sens et cette devise. Un paiement dans cette combinaison serait refusé faute de savoir ce qu'il coûte."
          className="mt-6"
        />
      )}

      {resultat && resultat.regle && (
        <div className="mt-6 border-t border-table-row-separator pt-5">
          <dl className="grid max-w-xl gap-3">
            <Ligne etiquette="Le client paie">
              <Montant valeur={resultat.payeParLeClient} devise={resultat.regle.devise} />
            </Ligne>
            <Ligne
              etiquette={`Prélèvement (${formatPourcentage(resultat.regle.taux, 2)}${
                resultat.regle.partFixe > 0 ? " plus part fixe" : ""
              })`}
            >
              <Montant valeur={resultat.prelevement} devise={resultat.regle.devise} />
            </Ligne>
            <Ligne etiquette="Le marchand reçoit">
              <Montant
                valeur={resultat.recuParLeMarchand}
                devise={resultat.regle.devise}
              />
            </Ligne>
          </dl>

          <p className="mt-4 text-mention leading-relaxed text-fg-secondary">
            Le prélèvement est arrondi au supérieur, à l'unité en circulation
            dans la devise. Arrondir au plus proche ferait perdre une fraction
            à chaque paiement, et l'écart deviendrait visible au rapprochement.
          </p>
        </div>
      )}
    </Carte>
  );
}

function Ligne({
  etiquette,
  children,
}: {
  etiquette: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-table-row-separator pb-2">
      <dt className="text-mention text-fg-secondary">{etiquette}</dt>
      <dd className="w-48 text-corps font-medium text-fg-primary">{children}</dd>
    </div>
  );
}
