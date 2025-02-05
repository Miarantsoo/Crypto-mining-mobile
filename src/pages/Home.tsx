import { IonButton, IonCard, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useEffect, useState } from 'react';

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

const Home: React.FC = () => {

	const [profil, setProfil] = useState<any>();
	const [user, setUser] = useState<IUtilisateur>();
	const [verif, setVerif] = useState<string | undefined>("")

	const takePicture = async () => {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.DataUrl,
			source: CameraSource.Prompt
		});

		setProfil(image.dataUrl)
		setVerif(image.path)
	};

	useEffect(() => {
		const userLS = JSON.parse(localStorage.getItem("utilisateur") || '{}');
		setUser(userLS);
	}, [])


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

					{profil && 
						<p>{verif} ZOZOZI</p>
					}
				</IonCard>
				<IonButton onClick={takePicture}>START CAMERA</IonButton>
				<p>{user?.mail}</p>
			</IonContent>
		</IonPage>
	);
};

export default Home;
