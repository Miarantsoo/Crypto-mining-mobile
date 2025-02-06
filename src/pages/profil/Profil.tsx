import { IonButton, IonContent, IonPage } from "@ionic/react";
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { useEffect, useState } from "react";
import { IUtilisateur } from "../Home";
import { FaMars, FaVenus } from "react-icons/fa6";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { TbPhotoEdit } from "react-icons/tb";
import { useNavigate } from "react-router";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import Loading from "../../components/loading/Loading";

const Profil = () => {

    const navigation = useNavigate();
    const [user, setUser] = useState<IUtilisateur>();
    const [profil, setProfil] = useState<any>();
    const [imageName, setImageName] = useState<string>('');
    const [dateNaissance, setDateNaissance] = useState<string>('');
    const [noChange, setNoChange] = useState<boolean>(true)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    useEffect(() => {
        const userLS = JSON.parse(localStorage.getItem("utilisateur") || '{}');
        setUser(userLS);
        const date = new Date(userLS.dateNaissance.seconds * 1000);

        const formattedDate = date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        setDateNaissance(formattedDate)
    }, [])

    const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Prompt
        });

        setProfil(image.dataUrl)
        setImageName(`${user?.nom}-${user?.prenom}_${Date.now()}`);
        setNoChange(!noChange)
    };

    const uploadImage = async () => {
        setIsSubmitting(!isSubmitting)
        try {
            const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/djaekualm/upload';
            const formData = new FormData();
            if (profil) {
                formData.append('file', profil);
            } else {
                throw new Error('Image data URL is undefined');
            }
            formData.append('public_id', imageName);
            formData.append('upload_preset', 'ml_default');

            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (user?.id !== undefined) {
                const utilisateurDoc = doc(firestore, "utilisateur", user.id.toString());
                await updateDoc(utilisateurDoc, {
                    photoProfile: imageName
                })
                user.photoProfile = imageName;
                localStorage.setItem('utilisateur', JSON.stringify(user));
                setNoChange(!noChange)
                setIsSubmitting(false)
            } else {
                throw new Error('User ID is undefined');
            }

        } catch (error) {
            console.error('Error taking or uploading picture:', error);
        }
    }


    const cld = new Cloudinary({ cloud: { cloudName: 'djaekualm' } });

    const img = cld
        .image(user?.photoProfile)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(700));

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="absolute w-full top-0 flex flex-row justify-between pt-20 pb-5 px-5 bg-gradient-to-b from-black/80 via-black/50 to-transparent">
                    <HiMiniChevronLeft className="text-4xl text-light" onClick={() => navigation(-1)} />
                    <TbPhotoEdit className="text-4xl text-light" onClick={takePicture} />
                </div>
                <div className="h-2/3 rounded-b-[55px] object-contain overflow-hidden">
                    {noChange ? (
                        <AdvancedImage cldImg={img} />
                    ) : (
                        <img className="w-full h-full object-cover" src={profil} alt="profil pic" />
                    )}
                </div>
                <div className="flex flex-row justify-between items-center mt-6 px-5">
                    <div>
                        <h1 className="font-title text-2xl font-bold uppercase text-dark">
                            {user?.prenom}
                            {/* Mia */}
                        </h1>
                        <h1 className="font-title text-2xl font-bold uppercase text-dark">
                            {user?.nom}
                            {/* Aina */}
                        </h1>
                    </div>
                    <span className="ml-5 text-4xl">
                        {user?.genre === 0 ? (
                            <FaVenus className="text-secondary-300" />
                        ) : user?.genre === 1 ? (
                            <FaMars className="text-secondary-300" />
                        ) : (
                            <span className="text-gray-500">Inconnu</span>
                        )}
                    </span>
                </div>
                <div className="my-3 flex flex-col gap-3">
                    <div className="py-3 px-5 border-b border-b-lavender font-body">
                        <h3 className="font-extrabold text-xl text-secondary">{user?.genre == 1 ? "Né" : "Née"} le</h3>
                        <p className="text-darl">{dateNaissance}</p>
                    </div>
                    <div className="py-3 px-5 font-body">
                        <h3 className="font-extrabold text-xl text-secondary">Email</h3>
                        <p className="text-darl">{user?.mail}</p>
                    </div>
                </div>
                {!noChange &&
                    <div className="absolute w-full bottom-0 flex flex-row justify-evenly pt-20 pb-10 px-5 bg-gradient-to-b from-transparent via-black/50 to-black/80">
                        <button className="h-12 px-5 font-title text-xl bg-light rounded-xl" onClick={() => setNoChange(!noChange)}>Annuler</button>
                        <button className="h-12 px-5 font-title text-xl text-light bg-main rounded-xl" onClick={uploadImage}>Changer</button>
                    </div>
                }
                {isSubmitting &&
                    <Loading />
                }
            </IonContent>
        </IonPage>
    );
};

export default Profil;