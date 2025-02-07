import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
} from "@ionic/react";
import { arrowUpOutline, arrowDownOutline } from "ionicons/icons";
import React, { useState } from "react";
import Bg from "../../assets/bg.jpg";
import "./Solde.css";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";

const Solde = () => {
  const [somme, setSomme] = useState<string>("");
  const [errors, setErrors] = useState<{ somme?: string }>({});

  const formatDate = (date: Date): string => {
    return date.toISOString().slice(0, 19);
  };

  const handleDepot = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { somme?: string } = {};

    if (somme == 0) {
      newErrors.somme = "La somme est requise";
      setSomme("");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = {
        id: 1,
        somme: somme,
        daty: formatDate(new Date()),
      };
      console.log("Submitted data:", data);
    }
  };

  const handleRetrait = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { somme?: string } = {};

    if (somme == 0) {
      newErrors.somme = "La somme est requise";
      setSomme("");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = {
        id: 1,
        somme: somme,
        daty: formatDate(new Date()),
      };
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
                      errors.somme ? "ion-invalid font-body" : " font-body"
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
                    className=""
                    style={{ "--background": "#4ABFB2" }}
                    onClick={handleDepot}
                  >
                    <div className="py-2 px-2 text-light flex flex-row gap-2 items-center font-body">
                      <FaCirclePlus />
                      <span>Dépôt</span>
                    </div>
                  </IonButton>
                  <IonButton
                    type="button"
                    expand="block"
                    className=""
                    style={{ "--background": "#dc3545" }}
                    onClick={handleRetrait}
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
