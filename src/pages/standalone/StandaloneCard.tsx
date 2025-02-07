import { IonPage, IonContent } from "@ionic/react";
import { Outlet, useNavigate } from "react-router";
import { HiMiniChevronLeft } from "react-icons/hi2";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const StandaloneCard = () => {
  const navigation = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  let inactivityTimer: NodeJS.Timeout | null = null;

  // Function to reset the timer on user activity
  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    setShowNavbar(true);
    inactivityTimer = setTimeout(() => setShowNavbar(false), 3000); // Auto-hide after 3s
  };

  useEffect(() => {
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, []);

  const pages = [
    {icon: <></>, link: ''},
  ]

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="min-h-dvh px-5 pt-8 bg-light relative">
          {/* Back Button */}
          <HiMiniChevronLeft
            className="text-4xl text-dark mb-2 mt-5"
            onClick={() => navigation(-1)}
          />

          {/* Main Content */}
          <Outlet />

          {/* Floating Bottom Navigation */}
          <div className="absolute bottom-5 left-0 w-full flex justify-center z-50">
            <AnimatePresence>
              {showNavbar ? (
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }} // Start off-screen to the right
                  animate={{ x: "0%", opacity: 1 }} // Slide into view from the right
                  exit={{ x: "100%", opacity: 0 }} // Exit to the left
                  transition={{ duration: 0.5 }}
                  className="fixed bottom-5 left-5 right-5 bg-white shadow-lg rounded-full flex justify-around p-3 z-50"
                >
                  <button className="text-lg text-dark">🏠 Home</button>
                  <button className="text-lg text-dark">🔍 Search</button>
                  <button className="text-lg text-dark">⚙️ Settings</button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowNavbar(true)}
                  className="fixed bottom-5 left-5 bg-primary text-dark p-3 rounded-full shadow-lg z-50"
                >
                  <FaBars></FaBars>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StandaloneCard;
