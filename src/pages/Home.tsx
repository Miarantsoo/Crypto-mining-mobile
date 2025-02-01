import { IonButton, IonCard, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useState } from 'react';

const Home: React.FC = () => {

	const [profil, setProfil] = useState<any>();

	const takePicture = async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.DataUrl,
			source: CameraSource.Prompt
		});

		setProfil(image.dataUrl)
	};


	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Blank</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Blank</IonTitle>
					</IonToolbar>
				</IonHeader>
				<ExploreContainer />
				<IonCard>
					{profil && 
						<img src={profil} alt="profil pic" />
					}
				</IonCard>
				<IonButton onClick={takePicture}>START CAMERA</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default Home;
