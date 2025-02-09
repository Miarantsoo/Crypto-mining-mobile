import {
	IonPage,
	IonContent,
	IonInput,
	IonButton,
	IonText,
	IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import Bg from "../../assets/bg.jpg";
import "./Solde.css";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { IUtilisateur } from "../Home";

import { getFirestore, collection, query, orderBy, limit, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import Loading from "../../components/loading/Loading";
import { firestore } from "../../firebase";

const Solde = () => {
	const [somme, setSomme] = useState<string>("");
	const [errors, setErrors] = useState<{ somme?: string }>({});
	const [lastId, setLastId] = useState<number>(0);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [utilisateur, setUtilisateur] = useState<IUtilisateur>();
	const [showToast, setShowToast] = useState<boolean>(false);
	const [messageToast, setMessageToast] = useState<string>('');

	const db = getFirestore();

	useEffect(() => {
		const fetchUser = async () => {
			const user = localStorage.getItem("utilisateur")
			if (user) {
				const utilisateurDoc = doc(firestore, "utilisateur", user);
				const docSnap = await getDoc(utilisateurDoc)
				if (docSnap.exists()) {
					const data = docSnap.data();

					setUtilisateur({
						id: Number(user),
						nom: data.nom,
						prenom: data.prenom,
						genre: data.genre,
						mail: data.mail,
						motDePasse: data.motDePasse,
						dateNaissance: data.dateNaissance,
						photoProfile: data.photoProfile,
					});
				}
			}
		}

		fetchUser();
	}, [])

	const getLastDemande = async (): Promise<number> => {
		try {
			const demandesRef = collection(db, "demande");
			const q = query(demandesRef, orderBy("id", "desc"), limit(1));
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				const doc = querySnapshot.docs[0];
				const lastDemande = { id: doc.id, ...doc.data() };
				console.log("io:", lastDemande);
				return Number(lastDemande.id);
			} else {
				console.log("Aucune demande trouvée");
				return 0;
			}
		} catch (error) {
			console.error("Erreur lors de la récupération de la dernière demande :", error);
			return 0;
		}
	};

	const sendDemande = async (data: any) => {
		try {
			const docRef = doc(collection(db, "demande"), data.id.toString());
			console.log(data);

			await setDoc(docRef, data);
			setIsSubmitting(false);
			setShowToast(true)
			setMessageToast("Demande envoyée avec succès !");
			setSomme("")
		} catch (error) {
			console.error("Erreur lors de l'envoi de la demande :", error);
		}
	};

	const handleSubmit = async (
		e: React.FormEvent,
		operation: "depot" | "retrait"
	) => {
		e.preventDefault();
		setIsSubmitting(true);

		const newErrors: { somme?: string } = {};

		if (somme === "0" || somme === "") {
			newErrors.somme = "La somme est requise";
			setSomme("");
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {

			console.log("is submitting...");

			const lastId = await getLastDemande();
			console.log("Last: ", lastId);

			const data = {
				id: lastId + 1,
				iduser: utilisateur?.id,
				depot: operation === "depot" ? Number(somme) : 0,
				retrait: operation === "retrait" ? Number(somme) : 0,
				daty: new Date(),
				etat: 1,
			};

			sendDemande(data);
			console.log("Submitted data:", data);
		}
	};

	const navigation = useNavigate();

	return (
		<IonPage>
			<IonContent fullscreen>
				<div
					className="flex flex-col min-h-dvh px-5 py-5 bg-cover gap-5 pt-8"
					style={{ backgroundImage: `url(${Bg})` }}
				>
					<HiMiniChevronLeft
						className="text-4xl text-dark mb-2 mt-5"
						onClick={() => navigation(-1)}
					/>
					<div className="bg-light py-8 px-8 rounded-lg shadow-2xl">
						<div className="">
							<div className="demande-header">
								<h1 className="font-title uppercase text-2xl text-left text-dark">
									Demande
								</h1>
								<p className="font-body text-slate-500">
									Demande de dépôt ou retrait
								</p>
							</div>
							<form className="text-dark font-body relative">
								{isSubmitting && (<Loading />)}
								<div className="input-wrapper">
									<IonInput
										label="Somme"
										labelPlacement="floating"
										fill="outline"
										type="number"
										placeholder="Somme"
										value={somme}
										onIonInput={(e) => setSomme(e.detail.value!)}
										className={
											errors.somme ? "ion-invalid font-body" : "font-body"
										}
									/>
									{errors.somme && (
										<IonText color="danger">
											<small>{errors.somme}</small>
										</IonText>
									)}
								</div>
								<div className="flex flex-row justify-between my-2">
									<IonButton
										type="button"
										expand="block"
										style={{ "--background": "#4ABFB2" }}
										onClick={(e) => handleSubmit(e, "depot")}
									>
										<div className="py-2 px-2 text-light flex flex-row gap-2 items-center font-body">
											<FaCirclePlus />
											<span>Dépôt</span>
										</div>
									</IonButton>
									<IonButton
										type="button"
										expand="block"
										style={{ "--background": "#dc3545" }}
										onClick={(e) => handleSubmit(e, "retrait")}
									>
										<div className="py-2 px-2 text-light flex flex-row gap-2 items-center font-body">
											<FaCircleMinus />
											<span>Retrait</span>
										</div>
									</IonButton>
								</div>
							</form>
						</div>
					</div>
				</div>
				<IonToast
					isOpen={showToast}
					onDidDismiss={() => setShowToast(false)}
					message={messageToast}
					style={{
						'--background': '#008000', 
						'--color': 'white',       
						'--height': '65px',
						fontSize: '15px',
						'--border-radius': '16px',   
						'--box-shadow': '0 4px 8px rgba(0,0,0,0.2)'
					  }}
					duration={3000} 
					position="bottom"
					className="font-body"
				/>
			</IonContent>
		</IonPage>
	);
};

export default Solde;

