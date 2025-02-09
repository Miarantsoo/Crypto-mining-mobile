import { IonButton, IonCard, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Link, useNavigate } from 'react-router';
import PushNotificationService from '../services/PushNotificationService';

export interface IUtilisateur {
  id: number;
  nom: string;
  prenom: string;
  genre: number;
  mail: string;
  motDePasse: string;
  dateNaissance: Date;
  photoProfile: string;
}

const Home: React.FC = () => {
  const [profil, setProfil] = useState<any>();
  const [user, setUser] = useState<IUtilisateur>();
  const [verif, setVerif] = useState<string | undefined>("");

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

    setProfil(image.dataUrl);
    setVerif(image.path);

    const uniqueName = `${user?.nom}-${user?.prenom}_${Date.now()}`;

    try {
      const cloudinaryUrl = "https://api.cloudinary.com/v1_1/djaekualm/upload";
      const formData = new FormData();
      if (image.dataUrl) {
        formData.append("file", image.dataUrl);
      } else {
        throw new Error("Image data URL is undefined");
      }
      formData.append("public_id", uniqueName);
      formData.append("upload_preset", "ml_default");

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Uploaded image URL:", data.secure_url);

      if (user?.id !== undefined) {
        const utilisateurDoc = doc(
          firestore,
          "utilisateur",
          user.id.toString()
        );
        await updateDoc(utilisateurDoc, {
          photoProfile: uniqueName,
        });
      } else {
        throw new Error("User ID is undefined");
      }
    } catch (error) {
      console.error("Error taking or uploading picture:", error);
    }
  };

  useEffect(() => {
    const userLS = JSON.parse(localStorage.getItem("utilisateur") || "{}");
    setUser(userLS);
  }, []);

  const navigation = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='w-full mt-32'>
          <IonButton onClick={() => { navigation("/cours") }}>Cours</IonButton>
          <IonButton onClick={() => { navigation("/profil") }}>Profil</IonButton>
          <IonButton onClick={() => { PushNotificationService.subscribeTo('crypto-1') }}>Sub to crypto 1</IonButton>
          <IonButton onClick={() => { PushNotificationService.subscribeTo('crypto-2') }}>Sub to crypto 2</IonButton>
          {/* <IonCard>
            {profil &&
              <img src={profil} alt="profil pic" />
            }

            {profil &&
              <p>{verif} ZOZOZI</p>
            }
          </IonCard>
          <IonButton onClick={takePicture}>START CAMERA</IonButton>
          <IonButton>GO TO profile <Link to={"/profil"}>ELLEKRA</Link></IonButton>
          <p>{user?.mail}</p> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
