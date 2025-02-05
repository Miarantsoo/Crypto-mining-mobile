import { IonButton, IonCard, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useEffect, useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

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

	const cld = new Cloudinary({ cloud: { cloudName: 'djaekualm' } });

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

		const uniqueImageName = `image_${Date.now()}`;

		// Now, upload the image to Cloudinary using the unique name as public_id
		try {
		  const uploadResult = await cld.uploader.upload(
			image.dataUrl, // Using the data URL from the camera capture
			{
			  public_id: uniqueImageName,
			}
		  );
		  console.log('Upload successful:', uploadResult);
		} catch (error) {
		  console.log(error)
		}
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
