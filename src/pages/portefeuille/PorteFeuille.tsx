import React, { useEffect, useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import PorteFeuilleItem, { PorteFeuilleType } from "../../components/portefeuille/PorteFeuilleItem";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { IUtilisateur } from "../Home";
import "./PorteFeuille.css";
import Loading from "../../components/loading/Loading";
import { firestore } from "../../firebase";

const PorteFeuille: React.FC = () => {
  const [portefeuille, setPortefeuille] = useState<PorteFeuilleType[]>([]);
  const navigation = useNavigate();
  const db = getFirestore();
  const [utilisateur, setUtilisateur] = useState<IUtilisateur>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPortefeuille = async (userId: number) => {
    try {
      const mvtCryptoRef = collection(db, "mvt_crypto");
      const q = query(mvtCryptoRef, where("idUser", "==", userId));
      const querySnapshot = await getDocs(q);

      const aggregation: Record<number, PorteFeuilleType> = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const cryptoId: number = data.idCrypto.id;
        const cryptoNom: string = data.idCrypto.nom;
        const cryptoDaty: string = data.idCrypto.daty; // On suppose que c'est une chaîne
        const achat: number = data.achat || 0;
        const vente: number = data.vente || 0;

        if (!aggregation[cryptoId]) {
          aggregation[cryptoId] = {
            quantite: 0,
            crypto: {
              id: cryptoId,
              nom: cryptoNom,
              daty: cryptoDaty,
            },
          };
        }
        aggregation[cryptoId].quantite += achat - vente;
      });

      setPortefeuille(Object.values(aggregation));
      setLoading(false);
      
    } catch (error) {
      console.error("Erreur lors de la récupération du portefeuille :", error);
    }
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
    if (utilisateur?.id) {
      fetchPortefeuille(utilisateur.id);
    }
  }, [utilisateur])

  const rowRenderer = ({ index, style }: ListChildComponentProps) => {
    const item = portefeuille[index];
    return (
      <PorteFeuilleItem key={item.crypto.id} portefeuille={item} style={style} />
    );
  };

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
          {portefeuille.length > 0 ? (
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
            <div className="font-body text-xl text-center py-10">Il n'y a encore aucune donnée</div>
          )}
          {loading && <Loading/>}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PorteFeuille;
