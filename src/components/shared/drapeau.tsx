import bf from "flag-icons/flags/4x3/bf.svg";
import bj from "flag-icons/flags/4x3/bj.svg";
import cg from "flag-icons/flags/4x3/cg.svg";
import ci from "flag-icons/flags/4x3/ci.svg";
import cm from "flag-icons/flags/4x3/cm.svg";
import gh from "flag-icons/flags/4x3/gh.svg";
import gn from "flag-icons/flags/4x3/gn.svg";
import gw from "flag-icons/flags/4x3/gw.svg";
import lr from "flag-icons/flags/4x3/lr.svg";
import ml from "flag-icons/flags/4x3/ml.svg";
import ne from "flag-icons/flags/4x3/ne.svg";
import ng from "flag-icons/flags/4x3/ng.svg";
import sl from "flag-icons/flags/4x3/sl.svg";
import sn from "flag-icons/flags/4x3/sn.svg";
import td from "flag-icons/flags/4x3/td.svg";
import tg from "flag-icons/flags/4x3/tg.svg";
import { cn } from "@/lib/utils";

/*
 * Drapeaux de pays.
 *
 * Seule exception a la regle Lucide, qui n'a pas de drapeaux. Jeu unique,
 * flag-icons, importe pays par pays et non par sa feuille de style
 * complete : le paquet couvre 260 pays, seuls ceux du perimetre sont
 * embarques dans le bundle.
 *
 * Le drapeau est decoratif. Le nom du pays ecrit a cote porte
 * l'information, y compris pour qui ne reconnait pas le drapeau.
 */

const DRAPEAUX: Record<string, string> = {
  BF: bf, BJ: bj, CG: cg, CI: ci, CM: cm, GH: gh, GN: gn, GW: gw,
  LR: lr, ML: ml, NE: ne, NG: ng, SL: sl, SN: sn, TD: td, TG: tg,
};

export function Drapeau({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const source = DRAPEAUX[code];

  /* Un pays hors perimetre n'affiche pas un drapeau approchant : il affiche
     son code, ce qui reste juste. */
  if (!source) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "grid h-4 w-[22px] shrink-0 place-items-center rounded-sm bg-neutral-bg text-[9px] font-medium text-neutral-fg",
          className,
        )}
      >
        {code}
      </span>
    );
  }

  return (
    <img
      src={source}
      alt=""
      className={cn("h-4 w-[22px] shrink-0 rounded-sm object-cover", className)}
    />
  );
}

/** Pays avec son drapeau. Le nom reste le porteur de l'information. */
export function CellulePays({ code, nom }: { code: string; nom: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Drapeau code={code} />
      <span className="truncate text-fg-primary">{nom}</span>
    </span>
  );
}
