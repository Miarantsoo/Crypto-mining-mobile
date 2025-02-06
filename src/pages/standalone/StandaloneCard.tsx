import {
  IonPage,
  IonContent,
} from "@ionic/react";
import Bg from "../../assets/bg.jpg";
import { Outlet } from "react-router";

const StandaloneCard = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className="flex items-center justify-center w-full h-full p-5"
          style={{ backgroundImage: `url(${Bg})` }}
        >
          <div className="bg-light shadow-2xl rounded-lg">
            <Outlet></Outlet>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StandaloneCard;
