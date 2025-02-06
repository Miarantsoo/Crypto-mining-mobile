import React, {useEffect, useState} from "react";
import Bg from "../../assets/bg.jpg";
import { IonContent, IonPage } from "@ionic/react";
import "./Historique.css";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import HistoriqueItem, { HistoriqueType } from "../../components/historique/HistoriqueItem";
import axios from 'axios';

const Historique: React.FC = () => {
    const [historiques, setHistoriques] = useState<HistoriqueType[] | null>(null);

    const fetchHistoriques = async () => {
        try {
            const response = await axios.get('http://localhost:8089/api/mvt-crypto/list/1');
            console.log(response.data);
            setHistoriques(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    };

    useEffect(() => {
        fetchHistoriques();
    }, [])

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