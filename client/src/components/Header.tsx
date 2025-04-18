import { useState } from "react";
import GymLogo from "./GymLogo";
import { useGym } from "@/context/GymContext";

export default function Header() {
  const { gym } = useGym();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  return (
    <header className="relative flex items-center justify-between px-4 py-4 bg-dark-surface shadow-md">
      <div className="flex items-center gap-2">
        <GymLogo />
        <div>
          <h1 className="text-lg font-semibold text-text-primary">{gym.name}</h1>
          <p className="text-xs text-text-secondary">powered by CalAI</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          className="text-text-primary" 
          onClick={toggleNotifications}
        >
          <i className="fas fa-bell text-lg"></i>
        </button>
      </div>
      
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-dark-surface rounded-lg shadow-lg border border-dark-border p-3 z-50">
          <h3 className="font-medium mb-2">Notifications</h3>
          <div className="text-sm text-text-secondary">No new notifications</div>
        </div>
      )}
    </header>
  );
}
