import { IonApp, setupIonicReact, useIonViewDidEnter } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import { useEffect } from "react";
import { useNavigate } from "react-router";
import PushNotificationService from "./services/PushNotificationService";
import { App as A } from "@capacitor/app";
import { alertController } from "@ionic/core";
setupIonicReact();

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const returnListener = () => {
      document.addEventListener("ionBackButton", async (event) => {
        if (window.history.state && window.history.state.idx > 0) {
          const previousPath = document.referrer; // Check previous URL
          navigate(-1); // Go back  
        } else {
          const alert = await alertController.create({
            header: "Exit App",
            message: "Are you sure you want to exit?",
            buttons: [
              { text: "Cancel", role: "cancel" },
              { text: "Exit", handler: () => A.exitApp() },
            ],
          });
          await alert.present();
        }
      });
    };

	returnListener();
  }, [navigate]);

  useEffect(() => {
    PushNotificationService.initialize();
    PushNotificationService.subscribeTo("nouveau_topic");
    navigate("/login");
  }, []);

  return <IonApp></IonApp>;
};

export default App;
