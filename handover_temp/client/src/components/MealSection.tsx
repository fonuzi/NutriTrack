import { useState } from "react";
import { useLocation } from "wouter";
import { Food } from "@shared/schema";
import { formatTime } from "@/lib/utils";

interface MealSectionProps {
  title: string;
  foods: Food[];
  date: Date;
  mealType: string;
}

export default function MealSection({ title, foods, date, mealType }: MealSectionProps) {
  const [, setLocation] = useLocation();
  
  // Calculate meal totals
  const calories = foods.reduce((sum, food) => sum + food.calories, 0);
  const protein = foods.reduce((sum, food) => sum + food.protein, 0);
  const carbs = foods.reduce((sum, food) => sum + food.carbs, 0);
  const fat = foods.reduce((sum, food) => sum + food.fat, 0);
  
  const handleAddFood = () => {
    setLocation(`/camera?mealType=${mealType}`);
  };
  
  return (
    <div className="bg-dark-surface rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-right">
          <div className="text-sm font-medium">{calories} kcal</div>
          <div className="text-xs text-text-secondary">{protein}g P • {carbs}g C • {fat}g F</div>
        </div>
      </div>
      
      {foods.length === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-dark-card rounded-full flex items-center justify-center mb-3">
            <i className="fas fa-utensils text-2xl text-text-secondary"></i>
          </div>
          <p className="text-text-secondary">No food items added yet</p>
          <p className="text-xs text-text-muted">Tap the button below to add your meal</p>
        </div>
      ) : (
        <div className="space-y-3">
          {foods.map(food => (
            <div key={food.id} className="bg-dark-card rounded-lg p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={food.imageUrl || 'https://via.placeholder.com/80?text=No+Image'}
                  alt={food.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{food.name}</h3>
                    <p className="text-xs text-text-secondary">
                      {formatTime(new Date(food.date))}
                    </p>
                  </div>
                  <span className="font-semibold text-text-primary">{food.calories} kcal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="w-full mt-3 py-2 rounded-lg border border-primary border-dashed text-primary flex items-center justify-center gap-1"
        onClick={handleAddFood}
      >
        <i className="fas fa-plus text-sm"></i>
        <span>Add Food</span>
      </button>
    </div>
  );
}
