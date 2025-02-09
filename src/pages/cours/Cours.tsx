import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart } from "@mui/x-charts";
import { IonPage, IonContent } from "@ionic/react";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";
import {collection, doc, getDocs, setDoc, deleteDoc} from "firebase/firestore";
import { db, firestore } from "../../firebase";
import Loading from "../../components/loading/Loading";
import { limitToLast, onValue, orderByKey, query, ref } from "firebase/database";
import {HiStar} from "react-icons/hi";
import {IUtilisateur} from "../Home";
import PushNotificationService from "../../services/PushNotificationService";

type HistoCrypto = {
    id: number;
    daty: { epochSecond: number };
    valeur: number;
    idCrypto: {
        id: number;
        nom: string;
        daty: { epochSecond: number };
    };
};

type Crypto = {
    id: number;
    nom: string;
    daty: Date;
    isFavories: boolean;
};

type Favorie = {
    id: number,
    iduser: number,
    idCrypto: number,
    daty: Date;
}

const Cours = () => {
    const [load, setLoad] = useState<boolean>(true)
    const [allCryptos, setAllCryptos] = useState<Crypto[]>([]);
    const [userFavories, setUserFavories] = useState<Favorie[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [cryptoHistory, setCryptoHistory] = useState<HistoCrypto[]>([]);
    const [checkFavorie, setCheckFavorie] = useState(false);
    const [checkData, setCheckData] = useState(false);


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
    };
    useEffect(() => {fetchUserFavories();},[checkFavorie])
        const fetchUserFavories = async () => {
            try{
                const querySnapshot = await getDocs(collection(firestore, "favoris"));

                const userFavorisresp = querySnapshot.docs
                    .map((doc) => ({
                        id: Number(doc.id) - 1,
                        ...doc.data(),
                    }as unknown as Favorie) );
                // .filter((favori) => favori.idUser === idUser); // Filtrer directement
                setUserFavories(userFavorisresp);
                console.log("FonctionUserFav",userFavorisresp)
                setCheckFavorie(false);
                setCheckData(true);

            }catch (error) {
                console.log(error)
            }
        };


    const checkOneFavorie = (idUser: number, idCrypto: number) => {
        return userFavories.find((userFav) => userFav.iduser === idUser && userFav.idCrypto === (idCrypto+1));
    };

    const addFavorie = async (idCrypto: number) => {
        try {
            setLoad(true)
            allCryptos[selectedIndex].isFavories = true;
            console.log(allCryptos[selectedIndex].isFavories);
            //@ts-ignore
            const utilisateur = JSON.parse(localStorage.getItem("utilisateur")) as IUtilisateur;
            if (!utilisateur?.id) {
                alert("Utilisateur manquant");
                return;
            }

            const iduser = utilisateur.id;
            console.log("FonctionUserFavOnAddData",userFavories)


            let id = userFavories.length > 0 ? userFavories[userFavories.length-1].id + 1 : 1;

            console.log("parametreeeeee", utilisateur.id, idCrypto);

            idCrypto += 1; // (Si nécessaire)

            await setDoc(doc(firestore, "favoris", String(id)), {
                id,
                iduser,
                idCrypto,
                daty: new Date(), // Date d'ajout du favori
            });

            setCheckFavorie(true);
            PushNotificationService.subscribeTo(`crypto-${idCrypto}`);
            console.log("Favori ajouté avec succès !");
            setLoad(false);
            return "Succès";
        } catch (err) {
            console.error("Erreur lors de l'ajout du favori :", err);
            return "Erreur";
        }
    };

    const deleteFavorie = async (idCrypto: number) => {
        try {
            setLoad(true);
            allCryptos[selectedIndex].isFavories = false;
            console.log(allCryptos[selectedIndex].isFavories);
            //@ts-ignore
            const utilisateur = JSON.parse(localStorage.getItem("utilisateur")) as IUtilisateur;
            if (!utilisateur?.id) {
                alert("Utilisateur manquant");
                return;
            }

            const idUtilisateur = utilisateur.id;

            // Vérifier si le favori existe
            const favori = checkOneFavorie(idUtilisateur, idCrypto);
            if (!favori) {
                alert("Favori introuvable");
                return;
            }

            // Suppression du favori dans Firestore
            await deleteDoc(doc(firestore, "favoris", String(favori.id)));
            PushNotificationService.unSubscribeFrom(`crypto-${idCrypto}`);
            console.log("Favori supprimé avec succès !");
            setLoad(false);
            return "Succès";
        } catch (err) {
            console.error("Erreur lors de la suppression du favori :", err);
            return "Erreur";
        }
    };


    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(([entry]) => {
            if (entry) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: Math.min(entry.contentRect.height, 400),
                });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);


    useEffect(() => {fetchData();},[checkData])
        //@ts-ignore
    const utilisateur = JSON.parse(localStorage.getItem("utilisateur")) as IUtilisateur;
    if (utilisateur?.id == null) {
        alert("utilisateur manquant");
    }


    const fetchData = async () => {
        try {
            console.log("FetchFavorie");
            console.log(userFavories);

            // Récupérer les cryptos
            const cryptoQuerySnapshot = await getDocs(collection(firestore, "crypto"));
            const newData = cryptoQuerySnapshot.docs.map((doc) => ({
                id: Number(doc.id) - 1,
                ...doc.data(),
                isFavories: false, // Valeur par défaut
            })) as Crypto[];

            // Afficher les favoris pour débogage
            console.log("Database", newData);

            // Parcourir les cryptos et vérifier si elles sont dans les favoris de l'utilisateur
            const updatedData = newData.map((crypto) => {
                console.log(`Crypto ID: ${crypto.id + 1}`);
                console.log(`User Favorites:`, userFavories.map(f => `idCrypto: ${f.idCrypto}, idUser: ${f.iduser}`).join(" | "));

                const isFavori = userFavories.some(
                    (favori) => {
                        console.log(`Comparing: idUser ${favori.iduser} === ${utilisateur.id}, idCrypto ${favori.idCrypto} === ${crypto.id + 1}`);
                        return Number(favori.iduser) === Number(utilisateur.id) && Number(favori.idCrypto) === (Number(crypto.id) + 1);
                    }
                );

                console.log(`isFavori for crypto ${crypto.id}:`, isFavori);
                return { ...crypto, isFavories: isFavori };
            });

            console.log("updatedData", updatedData);
            setAllCryptos(updatedData);
            setLoad(false);
        } catch (err) {
            setLoad(false);
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        const histoRef = query(ref(db, "histo-crypto"), orderByKey(), limitToLast(150));

        const unsubscribe = onValue(histoRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                const formattedData: HistoCrypto[] = Object.values(data)
                    .filter((entry: any) => {
                        return entry.idCrypto.id-1 === selectedIndex;
                    })
                    .sort((a: any, b: any) => b.daty.epochSecond - a.daty.epochSecond)
                    .slice(0, 10) as HistoCrypto[];

                setCryptoHistory(formattedData);
            } else {
                setCryptoHistory([]);
            }
        });

        return () => unsubscribe();
    }, [selectedIndex]);

    const navigation = useNavigate();

    return (
        <IonPage>
            <IonContent className="">
                <div className="bg-light shadow-2xl w-full min-h-dvh pb-36 pt-10 px-5">
                    <HiMiniChevronLeft
                        className="text-4xl text-dark mb-2"
                        onClick={() => navigation(-1)}
                    />

                    <div className="ml-2 mb-10">
                        <h1 className="font-title font-bold text-2xl text-left text-dark uppercase">
                            Cours des cryptomonnaies
                        </h1>
                        <p className="text-slate-500 font-body text-xs">
                            Cette page vous montre le cours actuel des cryptomonnaies
                        </p>
                    </div>

                    <div
                        className="flex items-center justify-between bg-gradient-to-br from-secondary to-main shadow-md rounded-lg p-3 mb-5">
                        <span className="text-white font-body text-lg">{allCryptos[selectedIndex]?.nom}</span>
                        <div className="flex items-center gap-2">
                            <span
                                className="text-white font-body text-lg">{formatCurrency(cryptoHistory.at(-1)?.valeur || 0)}</span>
                            <HiStar
                                className={`text-2xl cursor-pointer ${allCryptos[selectedIndex]?.isFavories ? "text-yellow-500" : "text-gray-400"}`}
                                onClick={() =>
                                    allCryptos[selectedIndex]?.isFavories
                                        ? deleteFavorie(allCryptos[selectedIndex].id)
                                        : addFavorie(allCryptos[selectedIndex].id)
                                }
                            />
                        </div>
                    </div>

                    <div ref={containerRef} className="w-full h-[350px] mb-2">
                        <LineChart
                            key={selectedIndex}
                            width={dimensions.width}
                            height={dimensions.height}
                            series={[
                                {
                                    data: cryptoHistory.map((entry) => entry.valeur),
                                    curve: "linear",
                                },
                            ]}
                            xAxis={[
                                {
                                    data: cryptoHistory.map((entry) => new Date(entry.daty.epochSecond * 1000)),
                                    scaleType: "time",
                                    valueFormatter: (date: Date) =>
                                        date.toLocaleTimeString("fr-FR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            timeZone: "UTC",
                                        }),
                                },
                            ]}
                            colors={["#1C32C4"]}
                            margin={{left: 30, right: 10, top: 30, bottom: 30}}
                            grid={{vertical: false, horizontal: true}}
                        />
                    </div>

                    <div className="mt-1 flex items-center justify-center relative w-full h-10">
                        <AnimatePresence>
                            {allCryptos.map((crypto, index) => {
                                const position = index - selectedIndex;
                                return (
                                    <motion.div
                                        key={crypto.id}
                                        initial={{opacity: 0, x: 50}}
                                        animate={{
                                            opacity:
                                                Math.abs(position) === 1 ? 0.5 : position === 0 ? 1 : 0,
                                            x: position * 90,
                                            scale: position === 0 ? 1.2 : 1,
                                        }}
                                        exit={{opacity: 0, x: -50}}
                                        transition={{type: "spring", stiffness: 120}}
                                        className={`absolute text-sm font-bold cursor-pointer font-title uppercase ${position === 0 ? "text-main" : "text-slate-500"
                                        }`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        {crypto.nom}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
                {load &&
                    <Loading/>
                }
            </IonContent>
        </IonPage>
    );
};

export default Cours;
