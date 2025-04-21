import { useActivity } from "@/context/ActivityContext";
import { useFood } from "@/context/FoodContext";
import { cn, formatCalories, formatMacro, calculatePercentage } from "@/lib/utils";
import { format } from "date-fns";
import { Flame, Footprints, Drumstick, Droplet } from "lucide-react";

export default function DailySummary() {
  const { dailySummary } = useFood();
  const { steps, stepsGoal } = useActivity();
  const currentDate = format(new Date(), "MMM d, yyyy");
  
  return (
    <div className="bg-dark-surface rounded-xl p-5 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Today's Summary</h2>
        <span className="text-sm text-text-secondary">{currentDate}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-5">
        {/* Calories */}
        <div className="bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-primary bg-opacity-20 p-2 rounded-full mr-3">
                <Flame className="text-primary w-5 h-5" />
              </div>
              <span className="text-sm text-text-secondary">Calories</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{formatCalories(dailySummary.calories)}</div>
              <div className="text-xs text-text-secondary">/ {formatCalories(dailySummary.caloriesGoal)}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-dark-border rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(dailySummary.calories, dailySummary.caloriesGoal)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Steps */}
        <div className="bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-accent bg-opacity-20 p-2 rounded-full mr-3">
                <Footprints className="text-accent w-5 h-5" />
              </div>
              <span className="text-sm text-text-secondary">Steps</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{steps.toLocaleString()}</div>
              <div className="text-xs text-text-secondary">/ {stepsGoal.toLocaleString()}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-dark-border rounded-full h-2.5">
            <div 
              className="bg-accent h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(steps, stepsGoal)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Protein */}
        <div className="bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-success bg-opacity-20 p-2 rounded-full mr-3">
                <Drumstick className="text-success w-5 h-5" />
              </div>
              <span className="text-sm text-text-secondary">Protein</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{formatMacro(dailySummary.protein)}</div>
              <div className="text-xs text-text-secondary">/ {formatMacro(dailySummary.proteinGoal)}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-dark-border rounded-full h-2.5">
            <div 
              className="bg-success h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(dailySummary.protein, dailySummary.proteinGoal)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Water */}
        <div className="bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-[#22D3EE] bg-opacity-20 p-2 rounded-full mr-3">
                <Droplet className="text-[#22D3EE] w-5 h-5" />
              </div>
              <span className="text-sm text-text-secondary">Water</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{dailySummary.water}L</div>
              <div className="text-xs text-text-secondary">/ {dailySummary.waterGoal}L</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-dark-border rounded-full h-2.5">
            <div 
              className="bg-[#22D3EE] h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(
                parseFloat(dailySummary.water), 
                parseFloat(dailySummary.waterGoal)
              )}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}