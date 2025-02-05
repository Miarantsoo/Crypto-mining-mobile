import React from "react";
import { IonContent } from "@ionic/react";
import { MutatingDots } from "react-loader-spinner";
import "./Loading.css";

type LoadingProps = {
  text?: string;
};

const Loading: React.FC<LoadingProps> = ({ text = "Chargement..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-inner">
          <MutatingDots
          color="#1C32C4"
          secondaryColor="#D8E1FF"
          height={100}
          width={100}
          aria-label="loading"
          data-testid="loader"
        />
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
