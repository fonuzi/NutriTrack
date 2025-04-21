import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StepsStats {
  dailyAverage: number;
  total: number;
  caloriesBurned: number;
}

interface Activity {
  id: number;
  date: string;
  steps: number;
  caloriesBurned: number;
  duration: number;
  activityType: string;
  gymId: number;
  userId: number;
}

interface ActivityContextType {
  steps: number;
  stepsGoal: number;
  stepsStats: StepsStats;
  updateSteps: (steps: number) => Promise<void>;
  updateStepsGoal: (goal: number) => Promise<void>;
}

const defaultStepsStats: StepsStats = {
  dailyAverage: 7500,
  total: 52500,
  caloriesBurned: 1575,
};

const ActivityContext = createContext<ActivityContextType>({
  steps: 0,
  stepsGoal: 10000,
  stepsStats: defaultStepsStats,
  updateSteps: async () => {},
  updateStepsGoal: async () => {},
});

export const useActivity = () => useContext(ActivityContext);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [steps, setSteps] = useState<number>(0);
  const [stepsGoal, setStepsGoal] = useState<number>(10000);
  const [stepsStats, setStepsStats] = useState<StepsStats>(defaultStepsStats);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [nextActivityId, setNextActivityId] = useState<number>(1);

  // Load activity data from AsyncStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSteps = await AsyncStorage.getItem('currentSteps');
        if (storedSteps) setSteps(JSON.parse(storedSteps));
        
        const storedStepsGoal = await AsyncStorage.getItem('stepsGoal');
        if (storedStepsGoal) setStepsGoal(JSON.parse(storedStepsGoal));
        
        const storedActivities = await AsyncStorage.getItem('activities');
        if (storedActivities) setActivities(JSON.parse(storedActivities));
        
        const storedNextActivityId = await AsyncStorage.getItem('nextActivityId');
        if (storedNextActivityId) setNextActivityId(JSON.parse(storedNextActivityId));
        
        // Calculate today's steps from activities
        const today = new Date().toISOString().split('T')[0];
        const todayActivity = activities.find(activity => 
          activity.date.split('T')[0] === today && activity.activityType === 'steps'
        );
        
        if (todayActivity) {
          setSteps(todayActivity.steps);
        }
      } catch (e) {
        console.error("Error loading activity data from AsyncStorage:", e);
      }
    };
    
    loadData();
  }, []);

  // Update stats whenever activities change
  useEffect(() => {
    if (activities.length === 0) return;
    
    // Calculate stats for the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const recentActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= sevenDaysAgo && activityDate <= today && activity.activityType === 'steps';
    });
    
    const totalSteps = recentActivities.reduce((sum, activity) => sum + activity.steps, 0);
    const totalCaloriesBurned = recentActivities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
    const days = Math.max(1, recentActivities.length);
    
    setStepsStats({
      dailyAverage: Math.round(totalSteps / days),
      total: totalSteps,
      caloriesBurned: totalCaloriesBurned,
    });
    
    // Save activities to AsyncStorage
    AsyncStorage.setItem('activities', JSON.stringify(activities)).catch(e => 
      console.error("Error saving activities to AsyncStorage:", e)
    );
  }, [activities]);

  // Save current steps and steps goal to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem('currentSteps', JSON.stringify(steps)).catch(e => 
      console.error("Error saving current steps to AsyncStorage:", e)
    );
  }, [steps]);

  useEffect(() => {
    AsyncStorage.setItem('stepsGoal', JSON.stringify(stepsGoal)).catch(e => 
      console.error("Error saving steps goal to AsyncStorage:", e)
    );
  }, [stepsGoal]);

  // Function to update steps
  const updateSteps = async (newSteps: number): Promise<void> => {
    try {
      setSteps(newSteps);
      
      // Calculate calories burned (rough estimate)
      const caloriesBurned = Math.round(newSteps * 0.04);
      
      // Update or create activity for today
      const today = new Date().toISOString();
      const todayDate = today.split('T')[0];
      
      const existingActivityIndex = activities.findIndex(activity => 
        activity.date.split('T')[0] === todayDate && activity.activityType === 'steps'
      );
      
      if (existingActivityIndex !== -1) {
        // Update existing activity
        const updatedActivities = [...activities];
        updatedActivities[existingActivityIndex] = {
          ...updatedActivities[existingActivityIndex],
          steps: newSteps,
          caloriesBurned,
        };
        setActivities(updatedActivities);
      } else {
        // Create new activity
        const newActivity: Activity = {
          id: nextActivityId,
          date: today,
          steps: newSteps,
          caloriesBurned,
          duration: 0, // Not tracking duration for steps
          activityType: 'steps',
          gymId: 1, // Default gym ID
          userId: 1, // Default user ID
        };
        
        setActivities(prev => [...prev, newActivity]);
        setNextActivityId(prev => prev + 1);
        
        // Save the updated nextActivityId to AsyncStorage
        AsyncStorage.setItem('nextActivityId', JSON.stringify(nextActivityId + 1)).catch(e => 
          console.error("Error saving nextActivityId to AsyncStorage:", e)
        );
      }
    } catch (error) {
      console.error("Error updating steps:", error);
      throw error;
    }
  };

  // Function to update steps goal
  const updateStepsGoal = async (goal: number): Promise<void> => {
    try {
      setStepsGoal(goal);
    } catch (error) {
      console.error("Error updating steps goal:", error);
      throw error;
    }
  };

  return (
    <ActivityContext.Provider value={{
      steps,
      stepsGoal,
      stepsStats,
      updateSteps,
      updateStepsGoal,
    }}>
      {children}
    </ActivityContext.Provider>
  );
};