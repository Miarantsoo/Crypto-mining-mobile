import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";
import Bg from "../../assets/bg.jpg";
import "./Solde.css";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";
import {IUtilisateur} from "../Home";

import { getFirestore, collection, query, orderBy, limit, getDocs, doc, setDoc } from "firebase/firestore";

const Solde = () => {
  const [somme, setSomme] = useState<string>("");
  const [errors, setErrors] = useState<{ somme?: string }>({});
  const [lastId, setLastId] = useState<number>(0);

  const db = getFirestore();

  const getLastDemande = async (): Promise<number> => {
    try {
      const demandesRef = collection(db, "demande");
      const q = query(demandesRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const lastDemande = { id: doc.id, ...doc.data() };
        console.log("io:", lastDemande);
        return Number(lastDemande.id);
      } else {
        console.log("Aucune demande trouvée");
        return 0;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la dernière demande :", error);
      return 0;
    }
  };

  const sendDemande = async (data: any) => {
    try {
      const docRef = doc(collection(db, "demande"), data.id.toString());
      await setDoc(docRef, data);
      console.log("Demande envoyée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande :", error);
    }
  };

  const formatDate = (date: Date): Date => {
    return date.toISOString().slice(0, 19);
  };

  const handleSubmit = async (
      e: React.FormEvent,
      operation: "depot" | "retrait"
  ) => {
    e.preventDefault();

    const newErrors: { somme?: string } = {};

    if (somme === "0" || somme === "") {
      newErrors.somme = "La somme est requise";
      setSomme("");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // @ts-ignore
      const storedId = JSON.parse(localStorage.getItem("utilisateur")) as IUtilisateur;
      if (storedId?.id == null) {
        alert("User manquant");
        return;
      }

      console.log("is submitting...");

      const lastId = await getLastDemande();
      console.log("Last: ", lastId);

      const data = {
        id: lastId + 1,
        iduser: storedId.id,
        depot: operation === "depot" ? Number(somme) : 0,
        retrait: operation === "retrait" ? Number(somme) : 0,
        daty: new Date(),
        etat: 1,
      };

      sendDemande(data);
      console.log("Submitted data:", data);
    }
  };

  const navigation = useNavigate();

  return (
      <IonPage>
        <IonContent fullscreen>
          <div
              className="flex flex-col min-h-dvh px-5 py-5 bg-cover gap-5 pt-8"
              style={{ backgroundImage: `url(${Bg})` }}
          >
            <HiMiniChevronLeft
                className="text-4xl text-dark mb-2 mt-5"
                onClick={() => navigation(-1)}
            />
            <div className="bg-light py-8 px-8 rounded-lg shadow-2xl">
              <div className="">
                <div className="demande-header">
                  <h1 className="font-title uppercase text-2xl text-left text-dark">
                    Demande
                  </h1>
                  <p className="font-body text-slate-500">
                    Demande de dépôt ou retrait
                  </p>
                </div>
                <form className="text-dark font-body">
                  <div className="input-wrapper">
                    <IonInput
                        label="Somme"
                        labelPlacement="floating"
                        fill="outline"
                        type="number"
                        placeholder="Somme"
                        value={somme}
                        onIonInput={(e) => setSomme(e.detail.value!)}
                        className={
                          errors.somme ? "ion-invalid font-body" : "font-body"
                        }
                    />
                    {errors.somme && (
                        <IonText color="danger">
                          <small>{errors.somme}</small>
                        </IonText>
                    )}
                  </div>
                  <div className="flex flex-row justify-between my-2">
                    <IonButton
                        type="button"
                        expand="block"
                        style={{ "--background": "#4ABFB2" }}
                        onClick={(e) => handleSubmit(e, "depot")}
                    >
                      <div className="py-2 px-2 text-light flex flex-row gap-2 items-center font-body">
                        <FaCirclePlus />
                        <span>Dépôt</span>
                      </div>
                    </IonButton>
                    <IonButton
                        type="button"
                        expand="block"
                        style={{ "--background": "#dc3545" }}
                        onClick={(e) => handleSubmit(e, "retrait")}
                    >
                      <div className="py-2 px-2 text-light flex flex-row gap-2 items-center font-body">
                        <FaCircleMinus />
                        <span>Retrait</span>
                      </div>
                    </IonButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
  );
};

export default Solde;

