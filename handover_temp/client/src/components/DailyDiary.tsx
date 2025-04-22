import { useState } from "react";
import { useFood } from "@/context/FoodContext";
import MealSection from "./MealSection";
import { format, addDays, subDays } from "date-fns";

export default function DailyDiary() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getFoodsByDate } = useFood();
  
  const foods = getFoodsByDate(selectedDate);
  
  const breakfast = foods.filter(food => food.mealType === "breakfast");
  const lunch = foods.filter(food => food.mealType === "lunch");
  const dinner = foods.filter(food => food.mealType === "dinner");
  const snacks = foods.filter(food => food.mealType === "snack");
  
  const goToPreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };
  
  const goToNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };
  
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const formatSelectedDate = (): string => {
    if (isToday(selectedDate)) {
      return "Today, " + format(selectedDate, "MMM d");
    } else {
      return format(selectedDate, "EEE, MMM d");
    }
  };
  
  const handleDateClick = () => {
    // In a real implementation, this would show a date picker
    alert("Date picker would open here");
  };
  
  return (
    <div className="space-y-6">
      {/* Date selector */}
      <div className="flex items-center justify-between bg-dark-surface rounded-xl p-4 shadow-lg">
        <button 
          className="w-8 h-8 flex items-center justify-center text-text-secondary"
          onClick={goToPreviousDay}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="text-center" onClick={handleDateClick}>
          <h2 className="text-lg font-semibold">{formatSelectedDate()}</h2>
          <p className="text-xs text-text-secondary">Tap to select date</p>
        </div>
        <button 
          className="w-8 h-8 flex items-center justify-center text-text-secondary"
          onClick={goToNextDay}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      {/* Meal sections */}
      <MealSection 
        title="Breakfast" 
        foods={breakfast} 
        date={selectedDate}
        mealType="breakfast"
      />
      
      <MealSection 
        title="Lunch" 
        foods={lunch} 
        date={selectedDate}
        mealType="lunch"
      />
      
      <MealSection 
        title="Dinner" 
        foods={dinner} 
        date={selectedDate}
        mealType="dinner"
      />
      
      <MealSection 
        title="Snacks" 
        foods={snacks} 
        date={selectedDate}
        mealType="snack"
      />
    </div>
  );
}
