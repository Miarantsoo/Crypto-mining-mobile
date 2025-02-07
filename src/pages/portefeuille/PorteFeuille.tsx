import React, {useEffect, useState} from "react";
import Bg from "../../assets/bg.jpg";
import { IonContent, IonPage } from "@ionic/react";
import "./PorteFeuille.css";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import PorteFeuilleItem, { PorteFeuilleType } from "../../components/portefeuille/PorteFeuilleItem";

const PorteFeuille: React.FC = () => {
    const portefeuille: PorteFeuilleType[] = [
        {
            quantite: 2,
            crypto: {id: 1, nom: "Bitcoin", daty: "2023-10-01T12:00:00"},
            valeur: 80000
        },
        {
            quantite: 10,
            crypto: {id: 2, nom: "Ethereum", daty: "2023-10-02T12:00:00"},
            valeur: 25000
        },
        {
            quantite: 5000,
            crypto: {id: 3, nom: "Cardano", daty: "2023-10-03T12:00:00"},
            valeur: 2500
        }
    ];

    const rowRenderer = ({ index, style }: ListChildComponentProps) => {
        const item = portefeuille[index];
        return (
            <PorteFeuilleItem
                key={item.crypto.id}
                portefeuille={item}
                style={style}
            />
        );
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div
                    className="demande-background"
                    style={{ backgroundImage: `url(${Bg})` }}
                >
                    <div className="demande-content">
                        <div className="demande-header">
                            <h1 className="demande-title">PorteFeuille</h1>
                            <p className="demande-description">
                                Cette page affiche tout les cryptos en votre possession
                            </p>
                        </div>
                        {portefeuille && portefeuille.length > 0 ? (
                            <div className="demande-list-container">
                                <FixedSizeList
                                    height={window.innerHeight*0.7}
                                    width="100%"
                                    itemSize={180}
                                    itemCount={portefeuille.length}
                                >
                                    {rowRenderer}
                                </FixedSizeList>
                            </div>
                        ) : (
                            <div className="demande-no-data">
                                Aucune crypto pour le moment.
                            </div>
                        )}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PorteFeuille;
