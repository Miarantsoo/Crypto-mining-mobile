import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { IonButton } from "@ionic/react";
import { useNavigate } from "react-router";

const cld = new Cloudinary({ cloud_name: "your_cloud_name" });

const NavbarButton = ({ link, isCenter = false, icon: Icon, imageUrl }) => {
  const navigation = useNavigate();
  
  const handleClick = () => {
    navigation(link);
  };

  return (
    <IonButton
      fill="clear"
      onClick={handleClick}
      style={{
        background: "transparent",
        borderRadius: "50%",
        width: isCenter ? "60px" : "40px",
        height: isCenter ? "60px" : "40px",
        transform: isCenter ? "translateY(-10px)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl ? (
        <AdvancedImage cldImg={cld.image(imageUrl)} style={{ borderRadius: "50%", width: "100%", height: "100%" }} />
      ) : (
        Icon && <Icon size={24} />
      )}
    </IonButton>
  );
};

export default NavbarButton;