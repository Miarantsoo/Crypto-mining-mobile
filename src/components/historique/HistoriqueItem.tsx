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
        <div style={style} className="font-body px-5">
            <div className="">
                <div className="mb-5">
                    <div className="">
                        <div className="">
                            <span className="text-main font-title font-bold">{historique.idCrypto.nom}</span>
                        </div>
                    </div>
                    <div className="">
                        <div className="text-dark">
                            {format(new Date(historique.daty), "d MMMM yyyy", { locale: FR })}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-5">
                    <div className="text-dark">
                        <span className="font-bold">Achat:</span> {historique.achat}
                    </div>
                    <div className="text-dark">
                        <span className="font-bold">Vente:</span> {historique.vente}
                    </div>
                </div>
                <div className="">
                    <div className="text-dark">
                        <span className="font-bold">Valeur:</span> {historique.valeur} €
                    </div>
                </div>
                <hr className="portefeuille-item-separator" />
            </div>
        </div>
    );
};

export default HistoriqueItem;
