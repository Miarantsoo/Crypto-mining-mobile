import {IonApp, IonContent, IonRouterOutlet, setupIonicReact} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import PushNotificationService from './services/PushNotificationService';
/* Theme variables */
import './theme/variables.css';
import Login from "./pages/login/Login";
import PorteFeuille from "./pages/portefeuille/PorteFeuille";
import Historique from "./pages/historique/Historique";
import Solde from "./pages/solde/Solde";
setupIonicReact();

const App: React.FC = () => {

	const navigate = useNavigate()

	useEffect(() => {
		PushNotificationService.initialize();
		PushNotificationService.subscribeTo('nouveau_topic');
		navigate("/login")
	  }, []);

	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path="/home">
						<Home />
					</Route>
					<Route exact path="/">
						<Redirect to="/home" />
					</Route>
					<Route exact path="/login">
						<Login />
					</Route>
					<Route exact path="/portefeuille">
						<PorteFeuille />
					</Route>
					<Route exact path="/historique">
						<Historique />
					</Route>
					<Route exact path="/solde">
						<Solde />
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
};

export default App;
