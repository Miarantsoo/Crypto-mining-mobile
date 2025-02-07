import React, {useEffect, useState} from "react";
import Bg from "../../assets/bg.jpg";
import { IonContent, IonPage } from "@ionic/react";
import "./Historique.css";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import HistoriqueItem, { HistoriqueType } from "../../components/historique/HistoriqueItem";

const Historique: React.FC = () => {
    const historiques: HistoriqueType[] = [
        {
            id: 1,
            iduUser: 101,
            idCrypto: {id: 1, nom: "Bitcoin", daty: "2025-02-07T00:00:00.000Z"},
            daty: "2025-02-07T00:00:00.000Z",
            achat: 2,
            vente: 0,
            valeur: 50000,
        },
        {
            id: 2,
            iduUser: 102,
            idCrypto: {id: 2, nom: "Ethereum", daty: "2025-02-07T00:00:00.000Z",},
            daty: "2025-02-07T00:00:00.000Z",
            achat: 1,
            vente: 1,
            valeur: 3000,
        },
        {
            id: 3,
            iduUser: 103,
            idCrypto: {id: 3, nom: "Ripple", daty: "2025-02-07T00:00:00.000Z",},
            daty: "2025-02-07T00:00:00.000Z",
            achat: 10,
            vente: 5,
            valeur: 1,
        },
    ];

    const rowRenderer = ({ index, style }: ListChildComponentProps) => {
        const item = historiques[index];
        return (
            <HistoriqueItem
                key={item.id}
                historique={item}
                style={style}
            />
        );
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div
                    className="portefeuille-background"
                    style={{ backgroundImage: `url(${Bg})` }}
                >
                    <div className="portefeuille-content">
                        <div className="portefeuille-header">
                            <h1 className="portefeuille-title">Historique</h1>
                            <h2 className="portefeuille-description">
                                Cette page l'historique des achats/ventes
                            </h2>
                        </div>
                        {historiques && historiques.length > 0 ? (
                            <div className="portefeuille-list-container">
                                <FixedSizeList
                                    height={window.innerHeight*0.7}
                                    width="100%"
                                    itemSize={200}
                                    itemCount={historiques.length}
                                >
                                    {rowRenderer}
                                </FixedSizeList>
                            </div>
                        ) : (
                            <div className="portefeuille-no-data">
                                Aucune historique pour le moment.
                            </div>
                        )}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Historique;