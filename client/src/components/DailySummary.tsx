import { useActivity } from "@/context/ActivityContext";
import { useFood } from "@/context/FoodContext";
import { cn, formatCalories, formatMacro, calculatePercentage } from "@/lib/utils";
import { format } from "date-fns";
// Using react-icons instead for better compatibility
import { FaFire } from "react-icons/fa";
import { FaPersonWalking } from "react-icons/fa6";
import { GiChickenLeg } from "react-icons/gi";
import { BiSolidDroplet } from "react-icons/bi";

export default function DailySummary() {
  const { dailySummary } = useFood();
  const { steps, stepsGoal } = useActivity();
  const currentDate = format(new Date(), "MMM d, yyyy");

  return (
    <div className="bg-dark-surface rounded-xl p-4 sm:p-5 shadow-lg mx-auto w-full max-w-screen-lg mb-4 sm:mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Today's Summary</h2>
        <span className="text-xs sm:text-sm text-text-secondary">{currentDate}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
        {/* Calories */}
        <div className="bg-dark-card rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-primary bg-opacity-20 p-2 rounded-full mr-2 sm:mr-3">
                <FaFire className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm text-text-secondary">Calories</span>
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-semibold">{formatCalories(dailySummary.calories)}</div>
              <div className="text-[10px] sm:text-xs text-text-secondary">/ {formatCalories(dailySummary.caloriesGoal)}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 sm:mt-3 bg-dark-border rounded-full h-2 sm:h-2.5">
            <div 
              className="bg-primary h-2 sm:h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(dailySummary.calories, dailySummary.caloriesGoal)}%` }}
            ></div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-dark-card rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-accent bg-opacity-20 p-2 rounded-full mr-2 sm:mr-3">
                <FaPersonWalking className="text-accent w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm text-text-secondary">Steps</span>
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-semibold">{steps.toLocaleString()}</div>
              <div className="text-[10px] sm:text-xs text-text-secondary">/ {stepsGoal.toLocaleString()}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 sm:mt-3 bg-dark-border rounded-full h-2 sm:h-2.5">
            <div 
              className="bg-accent h-2 sm:h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(steps, stepsGoal)}%` }}
            ></div>
          </div>
        </div>

        {/* Protein */}
        <div className="bg-dark-card rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-success bg-opacity-20 p-2 rounded-full mr-2 sm:mr-3">
                <GiChickenLeg className="text-success w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm text-text-secondary">Protein</span>
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-semibold">{formatMacro(dailySummary.protein)}</div>
              <div className="text-[10px] sm:text-xs text-text-secondary">/ {formatMacro(dailySummary.proteinGoal)}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 sm:mt-3 bg-dark-border rounded-full h-2 sm:h-2.5">
            <div 
              className="bg-success h-2 sm:h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(dailySummary.protein, dailySummary.proteinGoal)}%` }}
            ></div>
          </div>
        </div>

        {/* Water */}
        <div className="bg-dark-card rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-[#22D3EE] bg-opacity-20 p-2 rounded-full mr-2 sm:mr-3">
                <BiSolidDroplet className="text-[#22D3EE] w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm text-text-secondary">Water</span>
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-semibold">{dailySummary.water}L</div>
              <div className="text-[10px] sm:text-xs text-text-secondary">/ {dailySummary.waterGoal}L</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 sm:mt-3 bg-dark-border rounded-full h-2 sm:h-2.5">
            <div 
              className="bg-[#22D3EE] h-2 sm:h-2.5 rounded-full" 
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