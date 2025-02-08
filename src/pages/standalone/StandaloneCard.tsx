import { IonPage, IonContent } from "@ionic/react";
import { Outlet, useNavigate } from "react-router";
import { HiMiniChevronLeft } from "react-icons/hi2";
import FootBar from "../../components/navbar/FootBar";

const StandaloneCard = () => {
  const navigation = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="min-h-dvh px-5 pt-8 pb-56 bg-light relative">
          {/* Back Button */}
          <HiMiniChevronLeft
            className="text-4xl text-dark mb-2 mt-5"
            onClick={() => navigation(-1)}
          />

          {/* Main Content */}
          <Outlet />

          {/* Floating Bottom Navigation */}
          <FootBar></FootBar>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StandaloneCard;
