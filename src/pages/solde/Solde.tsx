import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonText, IonIcon
} from '@ionic/react';
import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons';
import React, { useState } from "react";
import Bg from "../../assets/bg.jpg";
import './Solde.css';

const Solde = () => {
    const [somme, setSomme] = useState<string>('');
    const [errors, setErrors] = useState<{ somme?: string }>({});

    const formatDate = (date: Date): string => {
        return date.toISOString().slice(0, 19);
    };

    const handleDepot= (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { somme?: string } = {};

        if (somme==0) {
            newErrors.somme = "La somme est requise";
            setSomme('');
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const data = {
                id:1,
                somme: somme,
                daty: formatDate(new Date())
            };
            console.log("Submitted data:", data);
        }
    };

    const handleRetrait= (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { somme?: string } = {};

        if (somme==0) {
            newErrors.somme = "La somme est requise";
            setSomme('');
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const data = {
                id:1,
                somme: somme,
                daty: formatDate(new Date())
            };
            console.log("Submitted data:", data);
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div
                    className="demande-background"
                    style={{ backgroundImage: `url(${Bg})` }}
                >
                    <div className="demande-container">
                        <div className="demande-form-wrapper">
                            <div className="demande-header">
                                <h1 className="demande-title">Demande</h1>
                                <p className="demande-description">
                                    Demande de depot et/ou retrait
                                </p>
                            </div>
                            <form className="demande-form">
                                <div className="input-wrapper">
                                    <IonInput
                                        label="Somme"
                                        labelPlacement="floating"
                                        fill="outline"
                                        type="number"
                                        placeholder="Somme"
                                        value={somme}
                                        onIonInput={(e) => setSomme(e.detail.value!)}
                                        className={errors.somme ? 'ion-invalid' : ''}
                                    />
                                    {errors.somme && (
                                        <IonText color="danger">
                                            <small>{errors.somme}</small>
                                        </IonText>
                                    )}
                                </div>
                                <div className="demande-buttons">
                                    <IonButton
                                        type="button"
                                        expand="block"
                                        className="demande-button-depot"
                                        style={{ '--background': '#28a745' }}
                                        onClick={handleDepot}
                                    >
                                        <div className="demande-button-content">
                                            <span>Depot</span>
                                            <IonIcon
                                                icon={arrowUpOutline}
                                                className="demande-button-icon"
                                                style={{ fontSize: '1.3em', color: 'white' }}
                                            />
                                        </div>
                                    </IonButton>
                                    <IonButton
                                        type="button"
                                        expand="block"
                                        className="demande-button-retrait"
                                        style={{ '--background': '#dc3545' }}
                                        onClick={handleRetrait}
                                    >
                                        <div className="demande-button-content">
                                            <span>Retrait</span>
                                            <IonIcon
                                                icon={arrowDownOutline}
                                                className="demande-button-icon"
                                                style={{ fontSize: '1.3em', color: 'white' }}
                                            />
                                        </div>
                                    </IonButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Solde;
