import React, { createContext, useContext, useState, useEffect } from "react";
import { updateGym } from "@/lib/api";
import { applyPrimaryColor } from "@/lib/utils";

interface Gym {
  id: number;
  name: string;
  logo: string;
  primaryColor: string;
}

interface GymContextType {
  gym: Gym;
  updateGymName: (name: string) => Promise<void>;
  updateGymLogo: (logo: string) => Promise<void>;
  updateGymPrimaryColor: (color: string) => Promise<void>;
}

const defaultGym: Gym = {
  id: 1,
  name: "FitTrack",
  logo: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
  primaryColor: "#6366F1"
};

const GymContext = createContext<GymContextType>({
  gym: defaultGym,
  updateGymName: async () => {},
  updateGymLogo: async () => {},
  updateGymPrimaryColor: async () => {}
});

export const useGym = () => useContext(GymContext);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gym, setGym] = useState<Gym>(defaultGym);
  
  // Load gym data from localStorage on initial render
  useEffect(() => {
    const storedGym = localStorage.getItem("gym");
    if (storedGym) {
      try {
        const parsedGym = JSON.parse(storedGym);
        setGym(parsedGym);
        
        // Apply the stored primary color
        applyPrimaryColor(parsedGym.primaryColor);
      } catch (e) {
        console.error("Failed to parse gym data from localStorage:", e);
      }
    } else {
      // Apply the default primary color
      applyPrimaryColor(defaultGym.primaryColor);
    }
  }, []);
  
  // Save gym data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gym", JSON.stringify(gym));
  }, [gym]);
  
  const updateGymName = async (name: string) => {
    try {
      await updateGym(gym.id, { name });
      setGym({ ...gym, name });
    } catch (error) {
      console.error("Error updating gym name:", error);
      throw error;
    }
  };
  
  const updateGymLogo = async (logo: string) => {
    try {
      await updateGym(gym.id, { logo });
      setGym({ ...gym, logo });
    } catch (error) {
      console.error("Error updating gym logo:", error);
      throw error;
    }
  };
  
  const updateGymPrimaryColor = async (primaryColor: string) => {
    try {
      await updateGym(gym.id, { primaryColor });
      setGym({ ...gym, primaryColor });
    } catch (error) {
      console.error("Error updating gym primary color:", error);
      throw error;
    }
  };
  
  return (
    <GymContext.Provider value={{ 
      gym,
      updateGymName,
      updateGymLogo,
      updateGymPrimaryColor
    }}>
      {children}
    </GymContext.Provider>
  );
};
