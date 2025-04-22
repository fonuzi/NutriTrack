import { useState } from "react";
import { useActivity } from "@/context/ActivityContext";
import { useFood } from "@/context/FoodContext";

interface ChartProps {
  period: "week" | "month" | "3months";
  type: "steps" | "calories" | "weight";
}

const ChartComponent = ({ period, type }: ChartProps) => {
  // This would normally use a charting library like Recharts
  // Here we'll just use SVG as a placeholder
  return (
    <div className="mt-4 mb-6 h-40 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={type === "steps" ? "#6366F1" : type === "calories" ? "#22D3EE" : "#10B981"}
            strokeWidth="2"
            points="
              0,70
              50,65
              100,40
              150,55
              200,30
              250,50
              300,35
            "
          />
          <polyline
            fill={`rgba(${type === "steps" ? "99, 102, 241" : type === "calories" ? "34, 211, 238" : "16, 185, 129"}, 0.1)`}
            stroke="none"
            points="
              0,70
              50,65
              100,40
              150,55
              200,30
              250,50
              300,35
              300,100
              0,100
            "
          />
        </svg>
      </div>
      
      {period === "week" && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex justify-between text-xs text-text-secondary px-2">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>
        </div>
      )}
      
      {period === "month" && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex justify-between text-xs text-text-secondary px-2">
            <div>Week 1</div>
            <div>Week 2</div>
            <div>Week 3</div>
            <div>Week 4</div>
          </div>
        </div>
      )}
      
      {period === "3months" && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex justify-between text-xs text-text-secondary px-2">
            <div>Jan</div>
            <div>Feb</div>
            <div>Mar</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProgressCharts() {
  const [stepsPeriod, setStepsPeriod] = useState<"week" | "month" | "3months">("week");
  const [nutritionPeriod, setNutritionPeriod] = useState<"week" | "month" | "3months">("week");
  const [weightPeriod, setWeightPeriod] = useState<"week" | "month" | "3months">("month");
  
  const { stepsStats } = useActivity();
  const { nutritionStats, weightStats } = useFood();
  
  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="bg-dark-surface rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Steps & Activity</h2>
          <select 
            className="bg-dark-card text-sm px-2 py-1 rounded-lg border border-dark-border"
            value={stepsPeriod}
            onChange={(e) => setStepsPeriod(e.target.value as any)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
        
        {/* Steps Chart */}
        <ChartComponent period={stepsPeriod} type="steps" />
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Daily Avg</div>
            <div className="font-semibold">{stepsStats.dailyAverage.toLocaleString()}</div>
            <div className="text-xs text-text-secondary">steps</div>
          </div>
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Total</div>
            <div className="font-semibold">{stepsStats.total.toLocaleString()}</div>
            <div className="text-xs text-text-secondary">steps</div>
          </div>
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Calories</div>
            <div className="font-semibold">{stepsStats.caloriesBurned.toLocaleString()}</div>
            <div className="text-xs text-text-secondary">burned</div>
          </div>
        </div>
      </div>
      
      {/* Nutrition Trends */}
      <div className="bg-dark-surface rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Nutrition Trends</h2>
          <select 
            className="bg-dark-card text-sm px-2 py-1 rounded-lg border border-dark-border"
            value={nutritionPeriod}
            onChange={(e) => setNutritionPeriod(e.target.value as any)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
        
        {/* Calories Chart */}
        <ChartComponent period={nutritionPeriod} type="calories" />
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Avg. Calories</div>
            <div className="font-semibold">{nutritionStats.avgCalories.toLocaleString()}</div>
            <div className="text-xs text-text-secondary">per day</div>
          </div>
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Avg. Protein</div>
            <div className="font-semibold">{nutritionStats.avgProtein}g</div>
            <div className="text-xs text-text-secondary">per day</div>
          </div>
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Carbs/Fat</div>
            <div className="font-semibold">{nutritionStats.carbsToFatRatio}</div>
            <div className="text-xs text-text-secondary">ratio</div>
          </div>
        </div>
      </div>
      
      {/* Weight Tracking */}
      <div className="bg-dark-surface rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Weight Tracking</h2>
          <div className="flex items-center gap-2">
            <select 
              className="bg-dark-card text-sm px-2 py-1 rounded-lg border border-dark-border"
              value={weightPeriod}
              onChange={(e) => setWeightPeriod(e.target.value as any)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="3months">Last 3 Months</option>
            </select>
            <button className="bg-primary text-white text-sm px-3 py-1 rounded-lg">
              Add Entry
            </button>
          </div>
        </div>
        
        {/* Weight Chart */}
        <ChartComponent period={weightPeriod} type="weight" />
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Starting</div>
            <div className="font-semibold">{weightStats.starting} lbs</div>
            <div className="text-xs text-text-secondary">4 weeks ago</div>
          </div>
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Current</div>
            <div className="font-semibold">{weightStats.current} lbs</div>
            <div className="text-xs text-text-secondary">today</div>
          </div>
          <div className="bg-dark-card rounded-lg p-3 text-center">
            <div className="text-xs text-text-secondary mb-1">Change</div>
            <div className={`font-semibold ${weightStats.change < 0 ? 'text-success' : 'text-error'}`}>
              {weightStats.change > 0 ? '+' : ''}{weightStats.change} lbs
            </div>
            <div className="text-xs text-text-secondary">{weightStats.changePercent}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
