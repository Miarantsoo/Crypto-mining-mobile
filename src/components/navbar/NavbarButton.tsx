import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { IonButton } from "@ionic/react";
import { useNavigate } from "react-router";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { IconType } from "react-icons"; // Import type for icons

interface RedirectionProps {
  destination: string;
  isCenter?: boolean;
  icon?: any; // Updated type for icon
  imgUrl?: string;
  navBarCollapsed:boolean;
  label: string;
}

const NavbarButton: React.FC<RedirectionProps> = ({
  destination,
  isCenter = false,
  icon,
  imgUrl,
  navBarCollapsed,
  label
}) => {
  const navigate = useNavigate();
  const cld = new Cloudinary({ cloud: { cloudName: "djaekualm" } });

  const img = imgUrl
    ? cld
        .image(imgUrl)
        .format("auto")
        .quality("auto")
        .resize(auto().gravity(autoGravity()).width(50).height(50))
    : null;

    const handleClick = () => {
        if (!navBarCollapsed) {
            navigate(destination);
        }
    }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer overflow-hidden bg-light flex flex-col items-center ${
        isCenter ? "-translate-y-5 text-light rounded-full w-[50px] h-[50px] justify-center" : "text-dark"
      }`}
    >
      {imgUrl ? (
        <AdvancedImage cldImg={img!} />
      ) : icon ? (
        icon
      ) : null}
      <span className="text-[9px] font-body mt-1 text-slate-500">{label}</span>
    </div>
  );
};

export default NavbarButton;
