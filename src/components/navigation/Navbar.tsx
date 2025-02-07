import React, { useState, useEffect, useRef } from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { homeOutline, walletOutline, listOutline, cashOutline, arrowUpOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const history = useHistory();
    const location = useLocation();
    const [isTabBarVisible, setIsTabBarVisible] = useState(false);
    const tabBarWrapperRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const tabs = [
        { path: '/home', label: 'Accueil', icon: homeOutline },
        { path: '/portefeuille', label: 'Portefeuille', icon: walletOutline },
        { path: '/historique', label: 'Historique', icon: listOutline },
        { path: '/solde', label: 'Solde', icon: cashOutline },
    ];

    useEffect(() => {
        const handleInteractionOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            if (isTabBarVisible &&
                !tabBarWrapperRef.current?.contains(target) &&
                !arrowRef.current?.contains(target)) {
                startAutoHideTimer();
            }
        };

        document.addEventListener('pointerdown', handleInteractionOutside);
        return () => {
            document.removeEventListener('pointerdown', handleInteractionOutside);
            clearTimeout(timeoutRef.current);
        };
    }, [isTabBarVisible]);

    const startAutoHideTimer = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsTabBarVisible(false);
        }, 2000);
    };

    const handleTabNavigation = (path: string) => {
        history.push(path);
        clearTimeout(timeoutRef.current);
        startAutoHideTimer();
    };

    return (
        <>
            <div
                ref={arrowRef}
                className={`control-arrow ${isTabBarVisible ? 'hidden' : ''}`}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    setIsTabBarVisible(true);
                    clearTimeout(timeoutRef.current);
                }}
            >
                <IonIcon icon={arrowUpOutline} />
            </div>

            <div ref={tabBarWrapperRef}>
                <IonTabBar
                    slot="bottom"
                    className={`custom-tab-bar ${isTabBarVisible ? 'visible' : ''}`}
                >
                    {tabs.map(tab => (
                        <IonTabButton
                            key={tab.path}
                            tab={tab.path}
                            className={location.pathname === tab.path ? 'active' : ''}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                handleTabNavigation(tab.path);
                            }}
                        >
                            <IonIcon icon={tab.icon} />
                            <IonLabel>{tab.label}</IonLabel>
                        </IonTabButton>
                    ))}
                </IonTabBar>
            </div>
        </>
    );
};

export default Navbar;