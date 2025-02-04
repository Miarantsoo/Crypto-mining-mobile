import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonText
} from '@ionic/react';
import { FaArrowRight } from "react-icons/fa6";
import { useState } from "react";
import Bg from "../../assets/bg.jpg";
import './Login.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';

type FormFields = {
  email: string;
  mdp: string;
};

interface IUtilisateur {
  id: number;
  nom: string;
  prenom: string;
  genre: number;
  mail: string;
  motDePasse: string;
  dateNaissance: string;
  photoProfile: string;
}

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // const onSubmit: SubmitHandler<FormFields> = async (data) => {
  //   console.log(data);
  //   try {
  //     const usersRef = getDocs(collection(firestore, "utilisateur"))
  //     console.log(usersRef);
      // const q = query(usersRef, where('email', "==", data.email))
      // const querySnapshot = await getDocs(q)

      // if (querySnapshot.empty) {
      //   alert("Tsy miexiste le mail e")
      //   return;
      // }

      // let utilisateur = null;

      // querySnapshot.forEach((doc) => {
      //   utilisateur = { id: doc.id, ...doc.data}
      // })


      // // @ts-ignore
      // if(utilisateur?.motDePasse === data.mdp){
      //   console.log(utilisateur);
      //   alert("TAFACO")
      // } else {
      //   alert("Diso mdp e")
      // }

  //   } catch (error) {
  //     console.log("ERREUR LOGIN E " + error);
  //     alert("ERREUR TAM LOGIN E")
  //   }
  // };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "L'adresse mail est requise";
            setEmail('');
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailRegex.test(email)) {
                newErrors.email = "Veuillez insérer un e-mail valide";
                setEmail('');
            }
        }

        if (!password) {
            newErrors.password = "Le mot de passe est requis";
            setPassword('');
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const data = {
                email: email,
                password: password
            };
            console.log("Submitted data:", data);
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div
                    className="login-background"
                    style={{ backgroundImage: `url(${Bg})` }}
                >
                    <div className="login-container">
                        <div className="login-form-wrapper">
                          <span className="login-title">
                            Connectez-vous avec Connectify
                          </span>
                            <form className="login-form" onSubmit={handleSubmit}>
                                <div className="input-wrapper">
                                    <IonInput
                                        label="Email"
                                        labelPlacement="floating"
                                        fill="outline"
                                        type="email"
                                        placeholder="exemple@domain.com"
                                        value={email}
                                        onIonInput={(e) => setEmail(e.detail.value!)}
                                        className={errors.email ? 'ion-invalid' : ''}
                                    />
                                    {errors.email && (
                                        <IonText color="danger">
                                            <small>{errors.email}</small>
                                        </IonText>
                                    )}
                                </div>

                                <div className="input-wrapper">
                                    <IonInput
                                        label="Mot de passe"
                                        labelPlacement="floating"
                                        fill="outline"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onIonInput={(e) => setPassword(e.detail.value!)}
                                        className={errors.password ? 'ion-invalid' : ''}
                                    />
                                    {errors.password && (
                                        <IonText color="danger">
                                            <small>{errors.password}</small>
                                        </IonText>
                                    )}
                                </div>

                                <IonButton
                                    type="submit"
                                    expand="block"
                                    className="login-button"
                                >
                                    <div className="login-button-content">
                                        <span>Continuer</span>
                                        <FaArrowRight className="login-button-icon" />
                                    </div>
                                </IonButton>
                            </form>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
