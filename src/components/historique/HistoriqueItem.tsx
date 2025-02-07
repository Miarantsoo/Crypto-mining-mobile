import React from "react";
import { format } from "date-fns";
import FR from "date-fns/locale/fr";
import "../../pages/portefeuille/PorteFeuille.css";

export type HistoriqueType = {
    id: number;
    iduUser: number;
    idCrypto:{
        id:number,
        nom:string,
        daty:string
    };
    daty: string;
    achat: number;
    vente: number;
    valeur:number;
};

export type HistoriqueItemProps = {
    historique: HistoriqueType;
    style: React.CSSProperties;
};

const HistoriqueItem: React.FC<HistoriqueItemProps> = ({ historique, style }) => {
    return (
        <div style={style} className="portefeuille-item">
            <div className="portefeuille-item-content">
                <div className="portefeuille-item-row">
                    <div className="portefeuille-item-cell">
                        <span className="portefeuille-item-label">{historique.idCrypto.nom}</span>
                    </div>
                </div>
                <div className="portefeuille-item-row">
                    <div className="portefeuille-item-cell">
                        {format(new Date(historique.daty), "d MMMM yyyy", { locale: FR })}
                    </div>
                </div>
                <div className="portefeuille-item-row">
                    <div className="portefeuille-item-cell">
                        <span className="portefeuille-item-label">Achat:</span> {historique.achat}
                    </div>
                    <div className="portefeuille-item-cell">
                        <span className="portefeuille-item-label">Vente:</span> {historique.vente}
                    </div>
                </div>
                <div className="portefeuille-item-row">
                    <div className="portefeuille-item-cell">
                        <span className="portefeuille-item-label">Valeur:</span> {historique.valeur} €
                    </div>
                </div>
                <hr className="portefeuille-item-separator" />
            </div>
        </div>
    );
};

export default HistoriqueItem;
