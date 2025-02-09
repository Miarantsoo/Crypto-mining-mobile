import React, { useEffect, useState } from "react";
import "./Historique.css";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import HistoriqueItem, {
  HistoriqueType,
} from "../../components/historique/HistoriqueItem";
import { useNavigate } from "react-router";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { IUtilisateur } from "../Home";
import Loading from "../../components/loading/Loading";
import { firestore } from "../../firebase";

const Historique: React.FC = () => {
  const [historiques, setHistoriques] = useState<HistoriqueType[]>([]);
  const navigation = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [utilisateur, setUtilisateur] = useState<IUtilisateur>();
  const db = getFirestore();

  const convertToDate = (timestamp: any): Date | null => {
    if (timestamp && typeof timestamp === "object" && "epochSecond" in timestamp) {
      return new Date(timestamp.epochSecond * 1000);
    }
    return null;
  };

  const sortHistoriqueByDate = (historiques: HistoriqueType[]): HistoriqueType[] => {
    return historiques.sort((a, b) => {
      const dateA = new Date(a.daty);
      const dateB = new Date(b.daty);

      return dateB.getTime() - dateA.getTime();
    });
  };

  useEffect(() => {
    setLoading(true)
    const fetchUser = async () => {
      const user = localStorage.getItem("utilisateur")
      if (!user) {
        alert("Utilisateur non trouvé");
        return;
      }
      else {
        const utilisateurDoc = doc(firestore, "utilisateur", user);
        const docSnap = await getDoc(utilisateurDoc)
        if (docSnap.exists()) {
          const data = docSnap.data();

          setUtilisateur({
            id: Number(user),
            nom: data.nom,
            prenom: data.prenom,
            genre: data.genre,
            mail: data.mail,
            motDePasse: data.motDePasse,
            dateNaissance: data.dateNaissance,
            photoProfile: data.photoProfile,
          });
        }
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {

    if (utilisateur) {
      const fetchHistorique = async () => {
        try {
          const mvtCryptoRef = collection(db, "mvt_crypto");
          const q = query(mvtCryptoRef, where("idUser", "==", utilisateur.id));
          const querySnapshot = await getDocs(q);
          const fetchedHistoriques: HistoriqueType[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data() as HistoriqueType;
            data.daty = convertToDate(data.daty);
            fetchedHistoriques.push(data);
          });
          console.log(fetchedHistoriques);
          const order = sortHistoriqueByDate(fetchedHistoriques);
          console.log(order);
          setHistoriques(order);
        } catch (error) {
          console.error("Erreur lors de la récupération des historiques :", error);
        }
      };

      console.log("fetching....");
      fetchHistorique();
      console.log("fetched !!!");
      setLoading(false)
    }
  }, [utilisateur]);


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
        <div className="font-body text-xl text-center py-10">Il n'y a encore aucune donnée</div>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default Historique;
