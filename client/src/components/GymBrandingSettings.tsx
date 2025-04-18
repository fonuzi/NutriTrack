import { useState } from "react";
import { useGym } from "@/context/GymContext";
import GymLogo from "./GymLogo";
import { applyPrimaryColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function GymBrandingSettings() {
  const { gym, updateGymName, updateGymPrimaryColor } = useGym();
  const { toast } = useToast();
  const [gymName, setGymName] = useState(gym.name);
  const [primaryColor, setPrimaryColor] = useState(gym.primaryColor);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGymName(e.target.value);
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };
  
  const handleNameBlur = () => {
    if (gymName.trim() !== gym.name) {
      updateGymName(gymName.trim());
      toast({
        title: "Gym Name Updated",
        description: "Your gym name has been updated successfully.",
      });
    }
  };
  
  const handleColorBlur = () => {
    if (primaryColor !== gym.primaryColor) {
      updateGymPrimaryColor(primaryColor);
      applyPrimaryColor(primaryColor);
      toast({
        title: "Primary Color Updated",
        description: "Your app's primary color has been updated.",
      });
    }
  };
  
  const handleColorSelect = () => {
    // This would normally open a color picker
    const picker = document.createElement("input");
    picker.type = "color";
    picker.value = primaryColor;
    picker.addEventListener("change", (e) => {
      const newColor = (e.target as HTMLInputElement).value;
      setPrimaryColor(newColor);
      updateGymPrimaryColor(newColor);
      applyPrimaryColor(newColor);
    });
    picker.click();
  };
  
  return (
    <div className="bg-dark-surface rounded-xl p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Gym Branding</h2>
      
      {/* Logo Upload Section */}
      <div className="flex items-center gap-4 mb-6">
        <GymLogo size="large" />
        <div className="flex-1">
          <h3 className="font-medium">App Logo</h3>
          <p className="text-sm text-text-secondary mb-2">This logo will appear throughout the app</p>
          <button 
            className="text-sm bg-primary text-white px-3 py-1 rounded-lg"
          >
            Change Logo
          </button>
        </div>
      </div>
      
      {/* Gym Name Section */}
      <div className="mb-4">
        <label className="block text-sm text-text-secondary mb-1">Gym Name</label>
        <input 
          type="text" 
          className="w-full bg-dark-card text-text-primary px-3 py-2 rounded-lg border border-dark-border focus:border-primary focus:outline-none" 
          value={gymName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
        />
      </div>
      
      {/* Primary Color */}
      <div className="mb-4">
        <label className="block text-sm text-text-secondary mb-1">Primary Color</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: primaryColor }}
            ></div>
            <input 
              type="text" 
              className="w-full bg-dark-card text-text-primary px-3 py-2 rounded-lg border border-dark-border focus:border-primary focus:outline-none"
              value={primaryColor}
              onChange={handleColorChange}
              onBlur={handleColorBlur}
            />
          </div>
          <button 
            className="text-sm bg-dark-card text-text-primary px-3 py-2 rounded-lg border border-dark-border"
            onClick={handleColorSelect}
          >
            Select
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-1">This color will be used for buttons and accents</p>
      </div>
    </div>
  );
}
