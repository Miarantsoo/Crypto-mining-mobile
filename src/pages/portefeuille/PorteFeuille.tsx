import React, {useEffect, useState} from "react";
import Bg from "../../assets/bg.jpg";
import { IonContent, IonPage } from "@ionic/react";
import "./PorteFeuille.css";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import PorteFeuilleItem, { PorteFeuilleType } from "../../components/portefeuille/PorteFeuilleItem";
import axios from "axios";

const PorteFeuille: React.FC = () => {
    const [portefeuille, setPortefeuille] = useState<PorteFeuilleType[] | null>(null);

    const fetchWallet = async () => {
        try {
            const response = await axios.get('http://localhost:8089/api/mvt-crypto/wallet/1');
            console.log(response.data);
            setPortefeuille(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }

    useEffect( () => {
        fetchWallet();
    }, []);

    const rowRenderer = ({ index, style }: ListChildComponentProps) => {
        const item = portefeuille[index];
        return (
            <PorteFeuilleItem
                key={item.id}
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
