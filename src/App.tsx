import { IonApp, setupIonicReact } from '@ionic/react';

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
import { LocalNotifications } from '@capacitor/local-notifications';
setupIonicReact();

const App: React.FC = () => {

	const navigate = useNavigate()

	useEffect(() => {
		PushNotificationService.initialize();
		LocalNotifications.schedule({
			notifications: [
				{
				  title: "title",
				  body: "body",
				  id: PushNotificationService.getRandomId(),
				  schedule: { at: new Date(new Date().getTime() + 1000) }, // 1 sec delay
				  sound: null,
				  attachments: null,
				  actionTypeId: "",
				  extra: null,
				  smallIcon: "base_small",
				},
			  ],
		})
		PushNotificationService.subscribeTo('nouveau_topic');
		navigate("/login")
	  }, []);

	return (
		<IonApp>
		</IonApp>
	);
};

export default App;
