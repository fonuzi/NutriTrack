import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeFoodImage, FoodItem, FoodAnalysisResult } from '../api/openai';

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  imageUrl: string;
  items: FoodItem[];
  date: string;
  gymId: number;
  userId: number;
}

interface DailySummary {
  calories: number;
  caloriesGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fat: number;
  fatGoal: number;
  water: string;
  waterGoal: string;
}

interface NutritionStats {
  avgCalories: number;
  avgProtein: number;
  carbsToFatRatio: string;
}

interface WeightStats {
  starting: number;
  current: number;
  change: number;
  changePercent: number;
}

interface UserSettings {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  stepsGoal: number;
  waterGoal: number;
  preferredUnits: "imperial" | "metric";
  notificationsEnabled: boolean;
  healthKitEnabled: boolean;
  dataBackupEnabled: boolean;
}

interface FoodContextType {
  foods: Food[];
  recentMeals: Food[];
  dailySummary: DailySummary;
  nutritionStats: NutritionStats;
  weightStats: WeightStats;
  settings: UserSettings;
  analyzeImage: (imageBase64: string) => Promise<FoodAnalysisResult>;
  saveMeal: (meal: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: string;
    imageUrl: string;
    items: FoodItem[];
  }) => Promise<Food>;
  getFoodsByDate: (date: Date) => Food[];
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

// Default values
const defaultSettings: UserSettings = {
  calorieGoal: 2000,
  proteinGoal: 150,
  carbsGoal: 200,
  fatGoal: 65,
  stepsGoal: 10000,
  waterGoal: 8,
  preferredUnits: "imperial",
  notificationsEnabled: true,
  healthKitEnabled: false,
  dataBackupEnabled: false,
};

const defaultDailySummary: DailySummary = {
  calories: 0,
  caloriesGoal: 2000,
  protein: 0,
  proteinGoal: 150,
  carbs: 0,
  carbsGoal: 200,
  fat: 0,
  fatGoal: 65,
  water: "0",
  waterGoal: "8",
};

const defaultNutritionStats: NutritionStats = {
  avgCalories: 1750,
  avgProtein: 120,
  carbsToFatRatio: "2:1",
};

const defaultWeightStats: WeightStats = {
  starting: 180,
  current: 172,
  change: -8,
  changePercent: -4.4,
};

// Create context
const FoodContext = createContext<FoodContextType>({
  foods: [],
  recentMeals: [],
  dailySummary: defaultDailySummary,
  nutritionStats: defaultNutritionStats,
  weightStats: defaultWeightStats,
  settings: defaultSettings,
  analyzeImage: async () => ({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, items: [] }),
  saveMeal: async () => ({ id: 0, name: '', calories: 0, protein: 0, carbs: 0, fat: 0, mealType: '', imageUrl: '', items: [], date: new Date().toISOString(), gymId: 1, userId: 1 }),
  getFoodsByDate: () => [],
  updateSettings: async () => {},
});

export const useFood = () => useContext(FoodContext);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [recentMeals, setRecentMeals] = useState<Food[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary>(defaultDailySummary);
  const [nutritionStats, setNutritionStats] = useState<NutritionStats>(defaultNutritionStats);
  const [weightStats, setWeightStats] = useState<WeightStats>(defaultWeightStats);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [nextFoodId, setNextFoodId] = useState<number>(1);

  // Load data from AsyncStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFoods = await AsyncStorage.getItem('foods');
        if (storedFoods) setFoods(JSON.parse(storedFoods));
        
        const storedSettings = await AsyncStorage.getItem('settings');
        if (storedSettings) setSettings(JSON.parse(storedSettings));
        
        const storedNextFoodId = await AsyncStorage.getItem('nextFoodId');
        if (storedNextFoodId) setNextFoodId(JSON.parse(storedNextFoodId));
      } catch (e) {
        console.error("Error loading data from AsyncStorage:", e);
      }
    };
    
    loadData();
  }, []);

  // Update recent meals and daily summary whenever foods change
  useEffect(() => {
    // Calculate recent meals - last 5 meals
    const sortedFoods = [...foods].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setRecentMeals(sortedFoods.slice(0, 5));
    
    // Calculate daily summary
    const today = new Date().toISOString().split('T')[0];
    const todayFoods = foods.filter(food => 
      food.date.split('T')[0] === today
    );
    
    const totalCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = todayFoods.reduce((sum, food) => sum + food.protein, 0);
    const totalCarbs = todayFoods.reduce((sum, food) => sum + food.carbs, 0);
    const totalFat = todayFoods.reduce((sum, food) => sum + food.fat, 0);
    
    setDailySummary({
      ...dailySummary,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      caloriesGoal: settings.calorieGoal,
      proteinGoal: settings.proteinGoal,
      carbsGoal: settings.carbsGoal,
      fatGoal: settings.fatGoal,
      waterGoal: settings.waterGoal.toString(),
    });
    
    // Save foods to AsyncStorage
    AsyncStorage.setItem('foods', JSON.stringify(foods)).catch(e => 
      console.error("Error saving foods to AsyncStorage:", e)
    );
  }, [foods, settings]);

  // Save settings to AsyncStorage when they change
  useEffect(() => {
    AsyncStorage.setItem('settings', JSON.stringify(settings)).catch(e => 
      console.error("Error saving settings to AsyncStorage:", e)
    );
    
    // Update daily summary goals
    setDailySummary(prev => ({
      ...prev,
      caloriesGoal: settings.calorieGoal,
      proteinGoal: settings.proteinGoal,
      carbsGoal: settings.carbsGoal,
      fatGoal: settings.fatGoal,
      waterGoal: settings.waterGoal.toString(),
    }));
  }, [settings]);

  // Function to analyze food image using OpenAI API
  const analyzeImage = async (imageBase64: string): Promise<FoodAnalysisResult> => {
    try {
      return await analyzeFoodImage(imageBase64);
    } catch (error) {
      console.error("Error analyzing food image:", error);
      
      // Return fallback data if analysis fails
      const fallbackResult: FoodAnalysisResult = {
        name: "Unknown Food",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        items: []
      };
      
      return fallbackResult;
    }
  };

  // Function to save a new meal
  const saveMeal = async (meal: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: string;
    imageUrl: string;
    items: FoodItem[];
  }): Promise<Food> => {
    try {
      const newFood: Food = {
        id: nextFoodId,
        ...meal,
        date: new Date().toISOString(),
        gymId: 1, // Default gym ID
        userId: 1, // Default user ID
      };
      
      // Update the state
      setFoods(prev => [...prev, newFood]);
      setNextFoodId(prev => prev + 1);
      
      // Save the updated nextFoodId to AsyncStorage
      AsyncStorage.setItem('nextFoodId', JSON.stringify(nextFoodId + 1)).catch(e => 
        console.error("Error saving nextFoodId to AsyncStorage:", e)
      );
      
      return newFood;
    } catch (error) {
      console.error("Error saving meal:", error);
      throw error;
    }
  };

  // Function to get foods by date
  const getFoodsByDate = (date: Date): Food[] => {
    const dateString = date.toISOString().split('T')[0];
    return foods.filter(food => food.date.split('T')[0] === dateString);
  };

  // Function to update user settings
  const updateSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
    try {
      setSettings(prev => ({
        ...prev,
        ...newSettings,
      }));
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  return (
    <FoodContext.Provider value={{
      foods,
      recentMeals,
      dailySummary,
      nutritionStats,
      weightStats,
      settings,
      analyzeImage,
      saveMeal,
      getFoodsByDate,
      updateSettings,
    }}>
      {children}
    </FoodContext.Provider>
  );
};