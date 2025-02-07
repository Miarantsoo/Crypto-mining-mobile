import React, { useEffect, useState } from "react";
import Bg from "../../assets/bg.jpg";
import { IonContent, IonPage } from "@ionic/react";
import "./PorteFeuille.css";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import PorteFeuilleItem, {
  PorteFeuilleType,
} from "../../components/portefeuille/PorteFeuilleItem";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";

const PorteFeuille: React.FC = () => {
  const portefeuille: PorteFeuilleType[] = [
    {
      quantite: 2,
      crypto: { id: 1, nom: "Bitcoin", daty: "2023-10-01T12:00:00" },
      valeur: 80000,
    },
    {
      quantite: 10,
      crypto: { id: 2, nom: "Ethereum", daty: "2023-10-02T12:00:00" },
      valeur: 25000,
    },
    {
      quantite: 5000,
      crypto: { id: 3, nom: "Cardano", daty: "2023-10-03T12:00:00" },
      valeur: 2500,
    },
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

  const navigation = useNavigate();


  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="min-h-dvh px-5 pt-8 bg-light">
            <HiMiniChevronLeft
                        className="text-4xl text-dark mb-2 mt-5"
                        onClick={() => navigation(-1)}
                      />
          <div className="mb-5 px-2">
            <h1 className="font-title uppercase text-dark text-2xl">
              Portefeuille
            </h1>
            <h2 className="text-slate-500 font-body text-xs">
              Toutes les cryptos en votre possession
            </h2>
          </div>
          {portefeuille && portefeuille.length > 0 ? (
            <div className="demande-list-container">
              <FixedSizeList
                height={window.innerHeight * 0.7}
                width="100%"
                itemSize={180}
                itemCount={portefeuille.length}
              >
                {rowRenderer}
              </FixedSizeList>
            </div>
          ) : (
            <div className="demande-no-data">Aucune crypto pour le moment.</div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PorteFeuille;
