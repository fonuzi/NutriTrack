import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  
  // Load gym data from AsyncStorage on initial render
  useEffect(() => {
    const loadGym = async () => {
      try {
        const storedGym = await AsyncStorage.getItem('gym');
        if (storedGym) {
          try {
            const parsedGym = JSON.parse(storedGym);
            setGym(parsedGym);
          } catch (e) {
            console.error("Failed to parse gym data from AsyncStorage:", e);
            // If parsing fails, apply the default gym
            setGym(defaultGym);
            await AsyncStorage.setItem('gym', JSON.stringify(defaultGym));
          }
        } else {
          // Set default gym if nothing is stored
          await AsyncStorage.setItem('gym', JSON.stringify(defaultGym));
        }
      } catch (e) {
        console.error("Error in GymContext initialization:", e);
        // Ensure we at least have the default gym configuration
        setGym(defaultGym);
      }
    };
    
    loadGym();
  }, []);
  
  // Save gym data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveGym = async () => {
      try {
        await AsyncStorage.setItem('gym', JSON.stringify(gym));
      } catch (e) {
        console.error("Failed to save gym data to AsyncStorage:", e);
      }
    };
    
    saveGym();
  }, [gym]);
  
  const updateGymName = async (name: string) => {
    try {
      // In a real app, you would call an API to update the gym name
      setGym({ ...gym, name });
    } catch (error) {
      console.error("Error updating gym name:", error);
      throw error;
    }
  };
  
  const updateGymLogo = async (logo: string) => {
    try {
      // In a real app, you would call an API to update the gym logo
      setGym({ ...gym, logo });
    } catch (error) {
      console.error("Error updating gym logo:", error);
      throw error;
    }
  };
  
  const updateGymPrimaryColor = async (primaryColor: string) => {
    try {
      // In a real app, you would call an API to update the gym primary color
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