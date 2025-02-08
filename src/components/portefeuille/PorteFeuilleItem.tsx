import React from "react";
import { format } from "date-fns";
import FR from "date-fns/locale/fr";
import "../../pages/portefeuille/PorteFeuille.css";

export type PorteFeuilleType = {
  quantite: number;
  crypto: {
    id: number;
    nom: string;
    daty: string;
  };
  valeur: number;
};

export type PorteFeuilleItemProps = {
  portefeuille: PorteFeuilleType;
  style: React.CSSProperties;
};

const PorteFeuilleItem: React.FC<PorteFeuilleItemProps> = ({
  portefeuille,
  style,
}) => {
  return (
    <div className="font-body px-5 my-5 py-8 rounded-lg border">
      <div className="mb-5">
        <div className="">
          <div className="">
            <span className="text-main font-title font-bold text-lg">
              {portefeuille.crypto.nom}
            </span>
          </div>
        </div>
      </div>
      <div className="">
        <div className="text-dark">
          <span className="font-bold">Valeur :</span> {portefeuille.valeur} €
        </div>
        <div className="text-dark">
          <span className="font-bold">Quantité :</span> {portefeuille.quantite}
        </div>
      </div>
    </div>
  );
};

export default PorteFeuilleItem;
