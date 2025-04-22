import { useCallback } from "react";
import { useGym } from "@/context/GymContext";
import { useFileUpload } from "@/hooks/useFileUpload";

interface GymLogoProps {
  size?: "small" | "large";
  onClick?: () => void;
}

export default function GymLogo({ size = "small", onClick }: GymLogoProps) {
  const { gym, updateGymLogo } = useGym();
  const { uploadFile } = useFileUpload();
  
  const handleLogoClick = useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }
    
    // If no onClick is provided, handle logo upload
    uploadFile({
      accept: "image/*",
      onFileSelected: async (file) => {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (typeof reader.result === "string") {
              updateGymLogo(reader.result);
            }
          };
        } catch (error) {
          console.error("Error uploading logo:", error);
        }
      }
    });
  }, [onClick, uploadFile, updateGymLogo]);
  
  const sizeClasses = size === "large" 
    ? "w-20 h-20" 
    : "w-10 h-10";
  
  return (
    <div 
      className={`relative overflow-hidden ${sizeClasses} bg-dark-card rounded-lg flex items-center justify-center border border-dark-border cursor-pointer`}
      onClick={handleLogoClick}
    >
      <img 
        src={gym.logo}
        alt={`${gym.name} Logo`} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-200">
        <i className="fas fa-camera text-white"></i>
      </div>
    </div>
  );
}
