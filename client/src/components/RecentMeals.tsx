import { useFood } from "@/context/FoodContext";
import { useLocation } from "wouter";
import { formatDateTime } from "@/lib/utils";

export default function RecentMeals() {
  const { recentMeals } = useFood();
  const [, setLocation] = useLocation();
  
  const handleViewAll = () => {
    setLocation("/diary");
  };
  
  return (
    <div className="bg-dark-surface rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Meals</h2>
        <button 
          className="text-sm text-primary"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>
      
      {recentMeals.length === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-dark-card rounded-full flex items-center justify-center mb-3">
            <i className="fas fa-utensils text-2xl text-text-secondary"></i>
          </div>
          <p className="text-text-secondary">No meals tracked yet</p>
          <p className="text-xs text-text-muted">Take a photo of your food to get started</p>
        </div>
      ) : (
        recentMeals.map((meal) => (
          <div 
            key={meal.id} 
            className="bg-dark-card rounded-lg p-3 mb-3 flex items-center gap-3"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={meal.imageUrl || 'https://via.placeholder.com/100?text=No+Image'}
                alt={meal.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{meal.name}</h3>
                  <p className="text-xs text-text-secondary">
                    {formatDateTime(new Date(meal.date))} • {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                  </p>
                </div>
                <span className="font-semibold text-text-primary">{meal.calories} kcal</span>
              </div>
              <div className="flex gap-3 mt-1">
                <span className="text-xs text-text-secondary">P: {meal.protein}g</span>
                <span className="text-xs text-text-secondary">C: {meal.carbs}g</span>
                <span className="text-xs text-text-secondary">F: {meal.fat}g</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
