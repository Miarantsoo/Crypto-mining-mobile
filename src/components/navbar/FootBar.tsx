import { AnimatePresence, motion } from "framer-motion"
import { FaBars, FaChartLine, FaMoneyBill, FaMoneyBillTransfer, FaWallet } from "react-icons/fa6"
import NavbarButton from "./NavbarButton"
import { useState, useEffect } from "react";

const FootBar = () => {
    const [userLS, setUserLS] = useState<any>();

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("utilisateur") || "{}");
    setUserLS(usr);
  }, []);

  const [showNavbar, setShowNavbar] = useState(true);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  let inactivityTimer: NodeJS.Timeout | null = null;


  // Function to reset the timer on user activity
  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    setShowNavbar(true);
    inactivityTimer = setTimeout(() => setShowNavbar(false), 5000); // Auto-hide after 3s
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
        {
          destination: "/portefeuille",
          isCenter: false,
          icon: <FaWallet />,
          imgUrl: null,
          label: "Portefeuille",
        },
        {
          destination: "/cours",
          isCenter: false,
          icon: <FaChartLine />,
          imgUrl: null,
          label: "Cours",
        },
        {
          destination: "/profil",
          isCenter: true,
          icon: null,
          imgUrl: userLS?.photoProfile,
          label: "",
        },
        {
          destination: "/historique",
          isCenter: false,
          icon: <FaMoneyBillTransfer />,
          imgUrl: null,
          label: "Historique",
        },
        {
          destination: "/demande",
          isCenter: false,
          icon: <FaMoneyBill />,
          imgUrl: null,
          label: "Demandes",
        },
        // {destination: '', isCenter: false, icon: null, imgUrl: null},
        // {destination: '', isCenter: false, icon: null, imgUrl: null},
      ];
    
      return (
        <div className="absolute bottom-5 left-0 w-full flex justify-center z-50">
          <AnimatePresence>
            {showNavbar ? (
              <motion.div
                initial={{ x: "100%", opacity: 0 }} // Start off-screen
                animate={{ x: "0%", opacity: 1 }} // Animate into view
                exit={{ x: "-100%", opacity: 0 }} // Exit to the right
                transition={{ duration: 0.5 }}
                onAnimationComplete={() => setIsNavbarExpanded(true)} // Mark as expanded
                className="fixed bottom-5 left-5 right-5 bg-white shadow-lg rounded-full flex flex-row items-center justify-around p-3 z-50"
              >
                {pages.map((page, index) => (
                  <NavbarButton
                    key={index}
                    destination={page.destination}
                    isCenter={page.isCenter}
                    icon={page.icon}
                    imgUrl={page.imgUrl}
                    navBarCollapsed={!isNavbarExpanded} // Pass correct prop
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
                onClick={() => setShowNavbar(true)}
                onAnimationComplete={() => setIsNavbarExpanded(false)}
                className="fixed bottom-5 right-5 bg-light text-dark p-3 rounded-full shadow-lg z-50"
              >
                <FaBars></FaBars>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )
}

export default FootBar; 