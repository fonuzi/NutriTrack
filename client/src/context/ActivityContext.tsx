import React, { createContext, useContext, useState, useEffect } from "react";
import { Activity, InsertActivity } from "@shared/schema";
import { createActivity, getActivitiesByDateRange } from "@/lib/api";
import { useStepCounter } from "@/hooks/useStepCounter";

interface StepsStats {
  dailyAverage: number;
  total: number;
  caloriesBurned: number;
}

interface ActivityContextType {
  steps: number;
  stepsGoal: number;
  stepsStats: StepsStats;
  updateSteps: (steps: number) => Promise<void>;
  updateStepsGoal: (goal: number) => Promise<void>;
}

const defaultStepsStats: StepsStats = {
  dailyAverage: 8243,
  total: 57705,
  caloriesBurned: 2308,
};

const ActivityContext = createContext<ActivityContextType>({
  steps: 6432,
  stepsGoal: 10000,
  stepsStats: defaultStepsStats,
  updateSteps: async () => {},
  updateStepsGoal: async () => {},
});

export const useActivity = () => useContext(ActivityContext);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [steps, setSteps] = useState<number>(6432);
  const [stepsGoal, setStepsGoal] = useState<number>(10000);
  const [stepsStats, setStepsStats] = useState<StepsStats>(defaultStepsStats);
  const { currentSteps } = useStepCounter();
  
  // Update steps from step counter hook
  useEffect(() => {
    if (currentSteps > 0) {
      setSteps(currentSteps);
    }
  }, [currentSteps]);
  
  // Fetch initial activity data
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        // Get date range for the past week
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        // Fetch activities for the past week
        const activitiesData = await getActivitiesByDateRange(weekAgo, today);
        
        // Calculate stats
        if (activitiesData.length > 0) {
          const totalSteps = activitiesData.reduce((sum, activity) => sum + activity.steps, 0);
          const totalCaloriesBurned = activitiesData.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
          const avgSteps = Math.floor(totalSteps / activitiesData.length);
          
          setStepsStats({
            dailyAverage: avgSteps,
            total: totalSteps,
            caloriesBurned: totalCaloriesBurned,
          });
        }
        
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };
    
    fetchActivityData();
  }, []);
  
  const updateSteps = async (newSteps: number) => {
    try {
      // Create a new activity entry
      const newActivity: InsertActivity = {
        steps: newSteps - steps, // Record the difference
        caloriesBurned: Math.floor((newSteps - steps) * 0.04), // Rough estimate of calories burned per step
        date: new Date(),
        gymId: 1, // Default gym ID
        userId: 1, // Default user ID
      };
      
      // Save the activity
      await createActivity(newActivity);
      
      // Update local state
      setSteps(newSteps);
      
      // Update stats
      setStepsStats(prevStats => ({
        ...prevStats,
        total: prevStats.total + (newSteps - steps),
        caloriesBurned: prevStats.caloriesBurned + Math.floor((newSteps - steps) * 0.04),
        dailyAverage: Math.floor((prevStats.total + (newSteps - steps)) / 7), // Assuming 7 days
      }));
      
    } catch (error) {
      console.error("Error updating steps:", error);
      throw error;
    }
  };
  
  const updateStepsGoal = async (goal: number) => {
    setStepsGoal(goal);
    // In a real implementation, this would update the user's steps goal in the database
  };
  
  return (
    <ActivityContext.Provider
      value={{
        steps,
        stepsGoal,
        stepsStats,
        updateSteps,
        updateStepsGoal,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
