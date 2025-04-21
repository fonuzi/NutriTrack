import React, { createContext, useContext, useState, useEffect } from "react";
import { Food, InsertFood } from "@shared/schema";
import { analyzeFood, createFood, getFoodsByDate, getRecentFoods, updateUserSettings, AnalyzeFoodResponse } from "@/lib/api";
import { fileToBase64 } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, addDays, isSameDay } from "date-fns";

interface FoodItem {
  name: string;
  amount: string;
  calories: number;
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
  analyzeImage: (imageBase64: string) => Promise<AnalyzeFoodResponse>;
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

const defaultSettings: UserSettings = {
  calorieGoal: 2100,
  proteinGoal: 140,
  carbsGoal: 70,
  fatGoal: 70,
  stepsGoal: 10000,
  waterGoal: 2.5,
  preferredUnits: "imperial",
  notificationsEnabled: true,
  healthKitEnabled: true,
  dataBackupEnabled: false,
};

const defaultDailySummary: DailySummary = {
  calories: 1240,
  caloriesGoal: 2100,
  protein: 89,
  proteinGoal: 140,
  carbs: 104,
  carbsGoal: 220,
  fat: 36,
  fatGoal: 70,
  water: "1.2",
  waterGoal: "2.5",
};

const defaultNutritionStats: NutritionStats = {
  avgCalories: 1840,
  avgProtein: 102,
  carbsToFatRatio: "2:1",
};

const defaultWeightStats: WeightStats = {
  starting: 185,
  current: 178,
  change: -7,
  changePercent: -3.8,
};

const mockAnalyzeImage = async (): Promise<AnalyzeFoodResponse> => {
  return {
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    items: []
  };
};

const mockSaveMeal = async (): Promise<Food> => {
  return {
    id: 0,
    name: "",
    date: new Date(),
    imageUrl: "",
    mealType: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    gymId: null,
    userId: null,
    items: []
  };
};

const FoodContext = createContext<FoodContextType>({
  foods: [],
  recentMeals: [],
  dailySummary: defaultDailySummary,
  nutritionStats: defaultNutritionStats,
  weightStats: defaultWeightStats,
  settings: defaultSettings,
  analyzeImage: mockAnalyzeImage,
  saveMeal: mockSaveMeal,
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
  const { toast } = useToast();
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch recent meals
        const recentMealsData = await getRecentFoods(5);
        setRecentMeals(recentMealsData);
        
        // Fetch today's foods
        const todayFoods = await getFoodsByDate(new Date());
        setFoods(todayFoods);
        
        // Calculate daily summary based on today's foods
        calculateDailySummary(todayFoods);
        
      } catch (error) {
        console.error("Error fetching initial food data:", error);
        toast({
          title: "Data Loading Error",
          description: "Could not load your meal data. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    fetchInitialData();
  }, [toast]);
  
  // Calculate daily summary based on foods
  const calculateDailySummary = (foodsData: Food[]) => {
    const totalCalories = foodsData.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = foodsData.reduce((sum, food) => sum + food.protein, 0);
    const totalCarbs = foodsData.reduce((sum, food) => sum + food.carbs, 0);
    const totalFat = foodsData.reduce((sum, food) => sum + food.fat, 0);
    
    setDailySummary({
      ...dailySummary,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    });
  };
  
  const analyzeImage = async (imageBase64: string) => {
    try {
      console.log("FoodContext: calling analyzeFood with image data length:", imageBase64 ? imageBase64.length : 0);
      
      // For a quick test, use mock data to see if the UI flow works
      // Later we'll fix the API connection issue
      const mockResult = {
        name: "Test Food",
        calories: 350,
        protein: 15,
        carbs: 40,
        fat: 10,
        items: [
          { name: "Test Item 1", amount: "1 serving", calories: 200 },
          { name: "Test Item 2", amount: "1/2 cup", calories: 150 }
        ]
      };
      
      // Try the real API call
      try {
        const result = await analyzeFood({ imageBase64 });
        console.log("Food analysis result from API:", result);
        
        toast({
          title: "Food Analyzed",
          description: `Detected: ${result.name} (${result.calories} kcal)`,
        });
        
        return result;
      } catch (apiError) {
        console.error("API call failed, using mock data for now:", apiError);
        
        // Use mock data if the API fails
        toast({
          title: "Food Analyzed (Demo Mode)",
          description: "Using test data while we fix the API connection",
        });
        
        return mockResult;
      }
    } catch (error) {
      console.error("Error analyzing food image:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze your food. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const saveMeal = async (meal: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: string;
    imageUrl: string;
    items: FoodItem[];
  }) => {
    try {
      const newFood: InsertFood = {
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        mealType: meal.mealType,
        imageUrl: meal.imageUrl,
        date: new Date(),
        items: meal.items,
        gymId: 1, // Default gym ID
        userId: 1, // Default user ID
      };
      
      const savedFood = await createFood(newFood);
      
      // Update the foods list
      setFoods(prevFoods => [savedFood, ...prevFoods]);
      
      // Update recent meals
      setRecentMeals(prevMeals => {
        const updatedMeals = [savedFood, ...prevMeals];
        return updatedMeals.slice(0, 5); // Keep only the 5 most recent
      });
      
      // Recalculate daily summary
      calculateDailySummary([...foods, savedFood]);
      
      return savedFood;
    } catch (error) {
      console.error("Error saving meal:", error);
      toast({
        title: "Save Failed",
        description: "Could not save your meal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const getFoodsByDate = (date: Date): Food[] => {
    // Filter foods by date
    return foods.filter(food => {
      const foodDate = new Date(food.date);
      return isSameDay(foodDate, date);
    });
  };
  
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      // In a real implementation, this would update the user settings in the database
      // await updateUserSettings(1, newSettings);
      
      setSettings(prevSettings => ({
        ...prevSettings,
        ...newSettings,
      }));
      
      // Update calorie goals in daily summary if they changed
      if (newSettings.calorieGoal) {
        setDailySummary(prevSummary => ({
          ...prevSummary,
          calorieGoal: newSettings.calorieGoal!,
        }));
      }
      
      // Update protein goals in daily summary if they changed
      if (newSettings.proteinGoal) {
        setDailySummary(prevSummary => ({
          ...prevSummary,
          proteinGoal: newSettings.proteinGoal!,
        }));
      }
      
      // Update water goals in daily summary if they changed
      if (newSettings.waterGoal !== undefined) {
        const waterGoalValue = newSettings.waterGoal;
        setDailySummary(prevSummary => ({
          ...prevSummary,
          waterGoal: waterGoalValue.toString(),
        }));
      }
      
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Settings Update Failed",
        description: "Could not update your settings. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return (
    <FoodContext.Provider
      value={{
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
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};
