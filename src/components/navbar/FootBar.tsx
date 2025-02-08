import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaChartLine, FaMoneyBill, FaMoneyBillTransfer, FaWallet } from "react-icons/fa6";
import NavbarButton from "./NavbarButton";
import { useState, useEffect, useRef } from "react";

const FootBar = () => {
  const [userLS, setUserLS] = useState<any>();
  const [showNavbar, setShowNavbar] = useState(true);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  
  // Use a ref to hold the inactivity timer
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("utilisateur") || "{}");
    setUserLS(usr);
  }, []);

  // Clear any existing timer
  const clearInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  };

  // Start (or restart) the timer that will hide the navbar after 5 seconds
  const startInactivityTimer = () => {
    clearInactivityTimer();
    inactivityTimer.current = setTimeout(() => {
      setShowNavbar(false);
    }, 5000);
  };

  // Only reset the timer if the navbar is visible
  const resetTimer = () => {
    if (showNavbar) {
      startInactivityTimer();
    }
  };

  // Whenever the navbar becomes visible, start the inactivity timer.
  // When it hides, clear the timer.
  useEffect(() => {
    if (showNavbar) {
      startInactivityTimer();
    } else {
      clearInactivityTimer();
    }
    // Cleanup on unmount or if showNavbar changes
    return () => clearInactivityTimer();
  }, [showNavbar]);

  // Define your navigation pages
  const pages = [
    { destination: "/portefeuille", isCenter: false, icon: <FaWallet />, imgUrl: null, label: "Portefeuille" },
    { destination: "/cours", isCenter: false, icon: <FaChartLine />, imgUrl: null, label: "Cours" },
    { destination: "/profil", isCenter: true, icon: null, imgUrl: userLS?.photoProfile, label: "" },
    { destination: "/historique", isCenter: false, icon: <FaMoneyBillTransfer />, imgUrl: null, label: "Historique" },
    { destination: "/demande", isCenter: false, icon: <FaMoneyBill />, imgUrl: null, label: "Demandes" },
  ];

  return (
    <div className="absolute bottom-5 left-0 w-full flex justify-center z-50">
      <AnimatePresence>
        {showNavbar ? (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setIsNavbarExpanded(true)}
            className="fixed bottom-5 left-5 right-5 bg-white shadow-lg rounded-full flex flex-row items-center justify-around p-3 z-50"
            // Only interactions with the navbar container will reset the timer
            onMouseMove={resetTimer}
            onTouchStart={resetTimer}
          >
            {pages.map((page, index) => (
              <NavbarButton
                key={index}
                destination={page.destination}
                isCenter={page.isCenter}
                icon={page.icon}
                imgUrl={page.imgUrl}
                navBarCollapsed={!isNavbarExpanded}
                label={page.label}
              />
            ))}
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => setIsNavbarExpanded(false)}
            className="fixed bottom-5 right-5 bg-light text-dark p-3 rounded-full shadow-lg z-50"
            // Only clicking the toggle button will show the navbar
            onClick={() => setShowNavbar(true)}
          >
            <FaBars />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FootBar;
