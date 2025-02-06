import {
  IonButton,
  IonCard,
  IonContent,
  IonPage,
} from "@ionic/react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useState } from "react";
import "./Home.css";

export interface NotificationData {
  title: string;
  content: string;
  link: string;
  image: string;
  user: string;
  date: Date;
}

const Home: React.FC = () => {
  const [profil, setProfil] = useState<any>();

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });
    setProfil(image.dataUrl);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* <NotificationPopup /> */}

        {/* Original Content */}
        <IonCard>
          {profil && (
            <img
              src={profil}
              alt="profile"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
        </IonCard>

        <IonButton
          expand="block"
          onClick={takePicture}
          className="font-title text-red-500"
        >
          Take Picture
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Home;
