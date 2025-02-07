import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart } from "@mui/x-charts";
import { IonPage, IonContent } from "@ionic/react";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { collection, getDocs } from "firebase/firestore";
import { db, firestore } from "../../firebase";
import Loading from "../../components/loading/Loading";
import { limitToLast, onValue, orderByKey, query, ref } from "firebase/database";
import {HiStar} from "react-icons/hi";

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
};

const Cours = () => {
  const [load, setLoad] = useState<boolean>(true)
  const [allCryptos, setAllCryptos] = useState<Crypto[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cryptoHistory, setCryptoHistory] = useState<HistoCrypto[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "crypto"));
        const newData = querySnapshot.docs.map((doc) => ({
          id: Number(doc.id)-1,
          ...doc.data()
        } as unknown as Crypto));
        setAllCryptos(newData);

        setLoad(false);
      } catch (err) {
        setLoad(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData()
  }, [])

  useEffect(() => {
    const histoRef = query(ref(db, "histo-crypto"), orderByKey(), limitToLast(150));

    const unsubscribe = onValue(histoRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);

        const formattedData: HistoCrypto[] = Object.values(data)
        .filter((entry: any) => {
          return entry.idCrypto.id-1 === selectedIndex;
        })
        .sort((a: any, b: any) => b.daty.epochSecond - a.daty.epochSecond) 
        .slice(0, 10) as HistoCrypto[]; 

        console.log(formattedData);
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
        <div className="bg-light shadow-2xl w-full min-h-dvh pb-5 pt-10 px-5">
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

          <div className="flex items-center justify-between bg-gradient-to-br from-secondary to-main shadow-md rounded-lg p-3 mb-5">
            <span className="text-white font-body text-lg">{allCryptos[selectedIndex]?.nom}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-body text-lg">{formatCurrency(cryptoHistory.at(-1)?.valeur || 0)}</span>
              <HiStar
                  className={`text-2xl cursor-pointer ${isFavorite ? "text-yellow-500" : "text-gray-400"}`}
                  onClick={() => setIsFavorite(!isFavorite)}
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
