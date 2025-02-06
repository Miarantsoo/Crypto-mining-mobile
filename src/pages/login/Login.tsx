import {
	IonPage,
	IonContent,
	IonInput,
	IonButton,
	IonText,
	IonToast
} from '@ionic/react';
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Bg from "../../assets/bg.jpg";
import './Login.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SHA256 } from 'crypto-js'
import storage from '../../storage';
import Loading from '../../components/loading/Loading';
import { useNavigate } from 'react-router';

type FormFields = {
	email: string;
	mdp: string;
};


const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<FormFields>()

	const [showToast, setShowToast] = useState<boolean>(false);
	const [messageToast, setMessageToast] = useState<string>('');

	const navigate = useNavigate();

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		console.log(data);
		try {
			const usersRef = collection(firestore, "utilisateur")

			const allDocsSnapshot = await getDocs(usersRef);
			console.log("All documents count:", allDocsSnapshot);
			const q = query(usersRef, where('mail', "==", data.email));
			const querySnapshot = await getDocs(q);

			console.log("Query snapshot size:", querySnapshot.size);

			if (querySnapshot.empty) {
				setShowToast(true);
				setMessageToast("L'email que vous avez inscrit n'existe pas. Veuillez réessayer")
				return;
			}

			let utilisateur = null;

			querySnapshot.forEach((doc) => {
				const data = doc.data()
				utilisateur = { id: Number(doc.id), ...data }
			})

			// @ts-ignore
			if (utilisateur?.motDePasse === SHA256(data.mdp).toString()) {
				console.log(utilisateur);
				await localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
				navigate("/home")
			} else {
				setShowToast(true);
				setMessageToast("Votre mot de passe est erroné. Veuillez réessayer")
			}

		} catch (error) {
			setShowToast(true);
			setMessageToast("Une erreur s'est produite: "+error)
		}
	};

	return (
		<IonPage>
			<IonContent fullscreen>
				<div
					className="login-background"
					style={{ backgroundImage: `url(${Bg})` }}
				>
					<div className="login-container bg-light shadow-2xl">
						<div className="login-form-wrapper">
							<span className="login-title font-title">
								Connectez-vous avec Connectify
							</span>
							<form
								className="login-form"
								onSubmit={handleSubmit(onSubmit)}
							>
								<div className="input-wrapper">
									<IonInput
										label="Email"
										labelPlacement="floating"
										fill="outline"
										type="email"
										placeholder="exemple@domain.com"
										{...register("email", {
											required: "L'adresse email est requise",
											pattern: {
												value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
												message: "Veuillez inserer un e-mail valide",
											}
										})}
										className={errors.email ? 'ion-invalid' : ''}
									/>
									{errors.email && (
										<IonText color="danger">
											<small>{errors.email?.message}</small>
										</IonText>
									)}
								</div>

								<div className="input-wrapper">
									<IonInput
										label="Mot de passe"
										labelPlacement="floating"
										fill="outline"
										type="password"
										{...register("mdp", {
											required: "Le mot de passe est requis"
										})}
										className={errors.mdp ? 'ion-invalid' : ''}
									/>
									{errors.mdp && (
										<IonText color="danger">
											<small>{errors.mdp?.message}</small>
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
				{isSubmitting &&
					<Loading />
				}
				<IonToast
					isOpen={showToast}
					onDidDismiss={() => setShowToast(false)}
					message={messageToast}
					style={{
						'--background': '#F32013', 
						'--color': 'white',       
						'--height': '65px',
						fontSize: '15px',
						'--border-radius': '16px',   
						'--box-shadow': '0 4px 8px rgba(0,0,0,0.2)'
					  }}
					duration={3000} 
					position="bottom"
				/>
			</IonContent>
		</IonPage>
	);
};

export default Login;
