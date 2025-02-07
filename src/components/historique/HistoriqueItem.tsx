import React from "react";
import { format } from "date-fns";
import FR from "date-fns/locale/fr";
import "../../pages/portefeuille/PorteFeuille.css";

export type HistoriqueType = {
    id: number;
    iduUser: number;
    idCrypto: {
        id: number;
        nom: string;
        daty: any;
    };
    daty: any;
    achat: number;
    vente: number;
    valeur: number;
};

export type HistoriqueItemProps = {
    historique: HistoriqueType;
    style: React.CSSProperties;
};

const HistoriqueItem: React.FC<HistoriqueItemProps> = ({ historique, style }) => {
    let dateObj: Date | null = null;

    if (historique.daty) {
        try {
            dateObj = historique.daty?.toDate ? historique.daty.toDate() : new Date(historique.daty);
            if (isNaN(dateObj.getTime())) {
                console.error("Date invalide détectée :", historique.daty);
                dateObj = null;
            }
        } catch (error) {
            console.error("Erreur lors de la conversion de la date :", error);
            dateObj = null;
        }
    }

    return (
        <div className="font-body px-5 my-5 py-8 rounded-lg border">
            <div className="mb-5">
                <div>
                    <span className="text-main font-title font-bold text-lg">
                        {historique.idCrypto.nom}
                    </span>
                </div>
                <div className="text-dark">
                    {dateObj
                        ? `${format(dateObj, "d MMMM yyyy", { locale: FR })} à ${format(dateObj, "HH:mm:ss")}`
                        : "Date invalide"}
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
            <div>
                <div className="text-dark">
                    <span className="font-bold">Valeur:</span> {historique.valeur} €
                </div>
            </div>
        </div>
    );
};

export default HistoriqueItem;

