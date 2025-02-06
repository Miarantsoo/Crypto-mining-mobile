import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart } from "@mui/x-charts";
import { IonPage, IonContent } from "@ionic/react";
import Bg from "../../assets/bg.jpg";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";

type HistoCrypto = {
  daty: string;
  valeur: number;
};

type Crypto = {
  id: number;
  nom: string;
  historique: HistoCrypto[];
};

const staticCryptos: Crypto[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nom: `Crypto ${i + 1}`,
  historique: Array.from({ length: 10 }, (_, j) => ({
    daty: new Date(Date.now() - j * 60000).toISOString(),
    valeur: Math.random() * 100 + 1,
  })).reverse(),
}));

const Cours = () => {
  const [allCryptos] = useState<Crypto[]>(staticCryptos);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  const chartData = allCryptos[selectedIndex].historique.map((histo) => ({
    x: new Date(histo.daty),
    y: histo.valeur,
  }));

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

          <div ref={containerRef} className="w-full h-[350px] mb-2">
            <LineChart
              key={selectedIndex}
              width={dimensions.width}
              height={dimensions.height}
              series={[{ data: chartData.map((d) => d.y), curve: "linear" }]}
              xAxis={[
                {
                  data: chartData.map((d) => d.x),
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
              margin={{ left: 30, right: 10, top: 30, bottom: 30 }}
              grid={{ vertical: false, horizontal: true }}
            />
          </div>

          <div className="mt-1 flex items-center justify-center relative w-full h-10">
            <AnimatePresence>
              {allCryptos.map((crypto, index) => {
                const position = index - selectedIndex;
                return (
                  <motion.div
                    key={crypto.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{
                      opacity:
                        Math.abs(position) === 1 ? 0.5 : position === 0 ? 1 : 0,
                      x: position * 90,
                      scale: position === 0 ? 1.2 : 1,
                    }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className={`absolute text-sm font-bold cursor-pointer font-title uppercase ${
                      position === 0 ? "text-main" : "text-slate-500"
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
      </IonContent>
    </IonPage>
  );
};

export default Cours;
