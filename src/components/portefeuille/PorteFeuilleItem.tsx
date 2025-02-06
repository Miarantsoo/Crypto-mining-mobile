import React from "react";
import { format } from "date-fns";
import FR from "date-fns/locale/fr";
import "../../pages/portefeuille/PorteFeuille.css";

export type PorteFeuilleType = {
    quatite:number;
    crypto:{
        id:number,
        nom:string,
        daty:string
    };
    valeur:number;
};

export type PorteFeuilleItemProps = {
    portefeuille: PorteFeuilleType;
    style: React.CSSProperties;
};

const PorteFeuilleItem: React.FC<PorteFeuilleItemProps> = ({ portefeuille, style}) => {
    return (
        <div style={style} className="demande-item">
            <div className="demande-item-content">
                <div className="demande-item-row">
                    <div className="demande-item-cell">
                        <span className="demande-item-label">{portefeuille.crypto.nom}</span>
                    </div>
                </div>
                <div className="demande-item-row">
                    <div className="demande-item-cell">
                        {format(new Date(portefeuille.crypto.daty), "d MMMM yyyy", { locale: FR })}
                    </div>
                </div>
                <div className="demande-item-row">
                    <div className="demande-item-cell">
                        <span className="demande-item-label">Quantite:</span> {portefeuille.quantite}
                    </div>
                    <div className="demande-item-cell">
                        <span className="demande-item-label">Valeur:</span> {portefeuille.valeur} €
                    </div>
                </div>
                <hr className="demande-item-separator" />
            </div>
        </div>
    );
};

export default PorteFeuilleItem;
