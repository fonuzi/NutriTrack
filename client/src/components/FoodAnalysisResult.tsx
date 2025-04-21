import { useState } from "react";
import { useLocation } from "wouter";
import { useFood } from "@/context/FoodContext";
import { useToast } from "@/hooks/use-toast";
import { X, Save, Utensils } from "lucide-react";

interface FoodItem {
  name: string;
  amount: string;
  calories: number;
}

interface FoodAnalysisResultProps {
  imageUrl: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: FoodItem[];
  isLoading?: boolean;
  onClose: () => void;
}

export default function FoodAnalysisResult({
  imageUrl,
  name,
  calories,
  protein,
  carbs,
  fat,
  items,
  isLoading = false,
  onClose
}: FoodAnalysisResultProps) {
  const [, setLocation] = useLocation();
  const { saveMeal } = useFood();
  const { toast } = useToast();
  const [mealType, setMealType] = useState<string>("breakfast");
  
  const handleSave = async () => {
    try {
      await saveMeal({
        name,
        calories,
        protein,
        carbs,
        fat,
        mealType,
        imageUrl,
        items,
      });
      
      toast({
        title: "Meal Saved",
        description: "Your meal has been added to your food diary.",
      });
      
      setLocation("/");
    } catch (error) {
      console.error("Error saving meal:", error);
      toast({
        title: "Save Error",
        description: "Could not save your meal. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-dark-surface rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        {/* Photo preview */}
        <div className="aspect-[3/4] bg-dark-card">
          <img 
            src={imageUrl}
            alt="Food preview" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-medium">Analyzing your meal...</p>
            <p className="text-sm text-text-secondary mt-2">Identifying food items and calculating calories</p>
          </div>
        )}
      </div>
      
      {/* Result */}
      {!isLoading && (
        <div className="p-4" id="foodAnalysisResult">
          <h2 className="text-lg font-semibold mb-2">Analysis Results</h2>
          
          <div className="bg-dark-card rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{name}</h3>
              <span className="font-semibold">{calories} kcal</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-dark-surface rounded-lg p-2 text-center">
                <div className="text-sm text-text-secondary">Protein</div>
                <div className="font-semibold">{protein}g</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-2 text-center">
                <div className="text-sm text-text-secondary">Carbs</div>
                <div className="font-semibold">{carbs}g</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-2 text-center">
                <div className="text-sm text-text-secondary">Fat</div>
                <div className="font-semibold">{fat}g</div>
              </div>
            </div>
            
            <div className="text-sm text-text-secondary mb-2">Identified Items:</div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-dark-surface rounded-full flex items-center justify-center mr-2">
                      <Utensils className="h-3 w-3" />
                    </div>
                    <span>{item.name} ({item.amount})</span>
                  </div>
                  <span>{item.calories} kcal</span>
                </div>
              ))}
            </div>
            
            {/* Meal type selector */}
            <div className="mt-4">
              <label className="block text-sm text-text-secondary mb-2">Meal Type:</label>
              <select 
                className="w-full bg-dark-surface border border-dark-border rounded-lg p-2"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button 
              className="flex-1 bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center justify-center gap-2 text-text-primary"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </button>
            <button 
              className="flex-1 bg-primary hover:bg-secondary transition rounded-lg py-3 flex items-center justify-center gap-2 text-white"
              onClick={handleSave}
            >
              <Save className="h-5 w-5" />
              <span>Save to Diary</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
