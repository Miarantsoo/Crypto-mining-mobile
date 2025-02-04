import { IonPage, IonContent, IonInput, IonButton, IonText } from '@ionic/react';
import { FaArrowRight } from "react-icons/fa6";
import { SubmitHandler, useForm } from "react-hook-form";
import Bg from "../../assets/bg.jpg";
import './Login.css';

type FormFields = {
  email: string;
  mdp: string;
};

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
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
                  Connectez vous avec Connectify
              </span>

                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-wrapper">
                    <IonInput
                        label="Email"
                        labelPlacement="floating"
                        fill="outline"
                        type="email"
                        placeholder="exemple@domain.com"
                        className={`${errors.email ? 'ion-invalid' : ''}`}
                        errorText={errors.email?.message}
                        {...useForm({
                          control,
                          name: "email",
                          rules: {
                            required: "L'adresse mail est requise",
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: "Veuillez insérer un e-mail valide"
                            }
                          }
                        })}
                    />
                  </div>

                  <div className="input-wrapper">
                    <IonInput
                        label="Mot de passe"
                        labelPlacement="floating"
                        fill="outline"
                        type="password"
                        placeholder="••••••••"
                        className={`${errors.mdp ? 'ion-invalid' : ''}`}
                        errorText={errors.mdp?.message}
                        {...useForm({
                          control,
                          name: "mdp",
                          rules: {
                            required: "Le mot de passe est requis"
                          }
                        })}
                    />
                  </div>

                  <IonButton
                      type="submit"
                      expand="block"
                      className="login-button" // Replaced Tailwind class
                      disabled={isSubmitting}
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