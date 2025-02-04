import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText
} from '@ionic/react';
import { FaArrowRight } from "react-icons/fa6";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
  } = useForm<FormFields>({
    defaultValues: {
      email: '',
      mdp: ''
    },
    mode: 'onChange'
  });

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
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                          required: "L'adresse mail est requise",
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Veuillez insérer un e-mail valide"
                          }
                        }}
                        render={({ field }) => (
                            <>
                              <IonInput
                                  label="Email"
                                  labelPlacement="floating"
                                  fill="outline"
                                  type="email"
                                  placeholder="exemple@domain.com"
                                  className={`${errors.email ? 'ion-invalid' : ''}`}
                                  onIonChange={(e) => field.onChange(e.detail.value)}
                                  value={field.value || ''}
                              />
                              {errors.email && (
                                  <IonText color="danger">
                                    <small>{errors.email.message}</small>
                                  </IonText>
                              )}
                            </>
                        )}
                    />
                  </div>

                  <div className="input-wrapper">
                    <Controller
                        control={control}
                        name="mdp"
                        rules={{
                          required: "Le mot de passe est requis"
                        }}
                        render={({ field }) => (
                            <>
                              <IonInput
                                  label="Mot de passe"
                                  labelPlacement="floating"
                                  fill="outline"
                                  type="password"
                                  placeholder="••••••••"
                                  className={`${errors.mdp ? 'ion-invalid' : ''}`}
                                  onIonChange={(e) => field.onChange(e.detail.value)}
                                  value={field.value || ''}
                              />
                              {errors.mdp && (
                                  <IonText color="danger">
                                    <small>{errors.mdp.message}</small>
                                  </IonText>
                              )}
                            </>
                        )}
                    />
                  </div>

                  <IonButton
                      type="submit"
                      expand="block"
                      className="login-button"
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