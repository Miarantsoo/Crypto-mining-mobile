import {
  IonPage,
  IonContent,
} from "@ionic/react";
import Bg from "../../assets/bg.jpg";
import "./Login.css";

const Login = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className="flex items-center justify-center w-full h-full p-5"
          style={{ backgroundImage: `url(${Bg})` }}
        >
          <div className="bg-light shadow-2xl rounded-lg"></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
