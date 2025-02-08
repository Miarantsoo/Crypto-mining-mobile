import React, { useEffect, useState } from "react";
import "./Historique.css";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import HistoriqueItem, {
  HistoriqueType,
} from "../../components/historique/HistoriqueItem";
import { useNavigate } from "react-router";
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";
import {IUtilisateur} from "../Home";
import Loading from "../../components/loading/Loading";

const Historique: React.FC = () => {
  const [historiques, setHistoriques] = useState<HistoriqueType[]>([]);
  const navigation = useNavigate();

  const db = getFirestore();

  const convertToDate = (timestamp: any): Date | null => {
    if (timestamp && typeof timestamp === "object" && "epochSecond" in timestamp) {
      return new Date(timestamp.epochSecond * 1000);
    }
    return null;
  };

  useEffect(() => {

    // @ts-ignore
    const storedId = JSON.parse(localStorage.getItem("utilisateur")) as IUtilisateur;
    if (storedId?.id == null) {
      alert("User manquant");
      return;
    }

    const fetchHistorique = async () => {
      try {
        const mvtCryptoRef = collection(db, "mvt_crypto");
        const q = query(mvtCryptoRef, where("idUser", "==", storedId.id));
        const querySnapshot = await getDocs(q);
        const fetchedHistoriques: HistoriqueType[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as HistoriqueType;
          data.daty = convertToDate(data.daty);
          fetchedHistoriques.push(data);
        });
        console.log(fetchedHistoriques);
        setHistoriques(fetchedHistoriques);
      } catch (error) {
        console.error("Erreur lors de la récupération des historiques :", error);
      }
    };

    console.log("fetching....");
    fetchHistorique();
    console.log("fetched !!!");
  }, []);


    const rowRenderer = ({ index, style }: ListChildComponentProps) => {
    const item = historiques[index];
    return <HistoriqueItem key={item.id} historique={item} style={style} />;
  };

  return (

        <div className="">
          <div className="mb-5 px-2">
            <h1 className="font-title uppercase text-dark text-2xl">
              Historique
            </h1>
            <h2 className="text-slate-500 font-body text-xs">
              Cette page l'historique des achats/ventes
            </h2>
          </div>
          {historiques && historiques.length > 0 ? (
            <div className="portefeuille-list-container">
              <FixedSizeList
                height={window.innerHeight * 0.7}
                width="100%"
                itemSize={200}
                itemCount={historiques.length}
              >
                {rowRenderer}
              </FixedSizeList>
            </div>
          ) : (
            <Loading />
          )}
        </div>
  );
};

export default Historique;
