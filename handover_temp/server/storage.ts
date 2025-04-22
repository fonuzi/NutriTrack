import { 
  Gym, InsertGym, Food, InsertFood, Activity, InsertActivity, 
  Weight, InsertWeight, UserSettings, InsertUserSettings 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Gym operations
  getGym(id: number): Promise<Gym | undefined>;
  updateGym(id: number, gym: Partial<InsertGym>): Promise<Gym | undefined>;
  createGym(gym: InsertGym): Promise<Gym>;
  
  // Food operations
  getFood(id: number): Promise<Food | undefined>;
  getFoodsByDate(date: Date, gymId?: number, userId?: number): Promise<Food[]>;
  getRecentFoods(limit: number, gymId?: number, userId?: number): Promise<Food[]>;
  createFood(food: InsertFood): Promise<Food>;
  updateFood(id: number, food: Partial<InsertFood>): Promise<Food | undefined>;
  deleteFood(id: number): Promise<boolean>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByDateRange(startDate: Date, endDate: Date, gymId?: number, userId?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined>;
  
  // Weight operations
  getWeight(id: number): Promise<Weight | undefined>;
  getWeightsByDateRange(startDate: Date, endDate: Date, gymId?: number, userId?: number): Promise<Weight[]>;
  createWeight(weight: InsertWeight): Promise<Weight>;
  
  // User settings operations
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private gyms: Map<number, Gym>;
  private foods: Map<number, Food>;
  private activities: Map<number, Activity>;
  private weights: Map<number, Weight>;
  private settings: Map<number, UserSettings>;
  
  private gymId: number;
  private foodId: number;
  private activityId: number;
  private weightId: number;
  private settingsId: number;
  
  constructor() {
    this.gyms = new Map();
    this.foods = new Map();
    this.activities = new Map();
    this.weights = new Map();
    this.settings = new Map();
    
    this.gymId = 1;
    this.foodId = 1;
    this.activityId = 1;
    this.weightId = 1;
    this.settingsId = 1;
    
    // Initialize with a default gym and settings
    const defaultGym: Gym = {
      id: this.gymId++,
      name: "FitTrack",
      logo: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
      primaryColor: "#6366F1",
      ownerId: 1,
    };
    
    const defaultSettings: UserSettings = {
      id: this.settingsId++,
      calorieGoal: 2100,
      proteinGoal: 140,
      carbsGoal: 250,
      fatGoal: 70,
      stepsGoal: 10000,
      waterGoal: 2500,
      preferredUnits: "imperial",
      notificationsEnabled: true,
      healthKitEnabled: true,
      dataBackupEnabled: false,
      gymId: defaultGym.id,
      userId: 1,
    };
    
    this.gyms.set(defaultGym.id, defaultGym);
    this.settings.set(defaultSettings.id, defaultSettings);
  }
  
  // Gym operations
  async getGym(id: number): Promise<Gym | undefined> {
    return this.gyms.get(id);
  }
  
  async updateGym(id: number, gym: Partial<InsertGym>): Promise<Gym | undefined> {
    const existingGym = this.gyms.get(id);
    if (!existingGym) return undefined;
    
    const updatedGym = { ...existingGym, ...gym };
    this.gyms.set(id, updatedGym);
    return updatedGym;
  }
  
  async createGym(gym: InsertGym): Promise<Gym> {
    const id = this.gymId++;
    const newGym = { ...gym, id };
    this.gyms.set(id, newGym);
    return newGym;
  }
  
  // Food operations
  async getFood(id: number): Promise<Food | undefined> {
    return this.foods.get(id);
  }
  
  async getFoodsByDate(date: Date, gymId?: number, userId?: number): Promise<Food[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return Array.from(this.foods.values()).filter(food => {
      const foodDate = new Date(food.date);
      const dateMatch = foodDate >= startOfDay && foodDate <= endOfDay;
      const gymMatch = gymId ? food.gymId === gymId : true;
      const userMatch = userId ? food.userId === userId : true;
      
      return dateMatch && gymMatch && userMatch;
    });
  }
  
  async getRecentFoods(limit: number, gymId?: number, userId?: number): Promise<Food[]> {
    return Array.from(this.foods.values())
      .filter(food => {
        const gymMatch = gymId ? food.gymId === gymId : true;
        const userMatch = userId ? food.userId === userId : true;
        return gymMatch && userMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
  
  async createFood(food: InsertFood): Promise<Food> {
    const id = this.foodId++;
    const newFood = { ...food, id };
    this.foods.set(id, newFood);
    return newFood;
  }
  
  async updateFood(id: number, food: Partial<InsertFood>): Promise<Food | undefined> {
    const existingFood = this.foods.get(id);
    if (!existingFood) return undefined;
    
    const updatedFood = { ...existingFood, ...food };
    this.foods.set(id, updatedFood);
    return updatedFood;
  }
  
  async deleteFood(id: number): Promise<boolean> {
    return this.foods.delete(id);
  }
  
  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async getActivitiesByDateRange(startDate: Date, endDate: Date, gymId?: number, userId?: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => {
      const activityDate = new Date(activity.date);
      const dateMatch = activityDate >= startDate && activityDate <= endDate;
      const gymMatch = gymId ? activity.gymId === gymId : true;
      const userMatch = userId ? activity.userId === userId : true;
      
      return dateMatch && gymMatch && userMatch;
    });
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const newActivity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  
  async updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined> {
    const existingActivity = this.activities.get(id);
    if (!existingActivity) return undefined;
    
    const updatedActivity = { ...existingActivity, ...activity };
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }
  
  // Weight operations
  async getWeight(id: number): Promise<Weight | undefined> {
    return this.weights.get(id);
  }
  
  async getWeightsByDateRange(startDate: Date, endDate: Date, gymId?: number, userId?: number): Promise<Weight[]> {
    return Array.from(this.weights.values()).filter(weight => {
      const weightDate = new Date(weight.date);
      const dateMatch = weightDate >= startDate && weightDate <= endDate;
      const gymMatch = gymId ? weight.gymId === gymId : true;
      const userMatch = userId ? weight.userId === userId : true;
      
      return dateMatch && gymMatch && userMatch;
    });
  }
  
  async createWeight(weight: InsertWeight): Promise<Weight> {
    const id = this.weightId++;
    const newWeight = { ...weight, id };
    this.weights.set(id, newWeight);
    return newWeight;
  }
  
  // User settings operations
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.settings.values()).find(setting => setting.userId === userId);
  }
  
  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const existingSettings = Array.from(this.settings.values()).find(setting => setting.userId === userId);
    if (!existingSettings) return undefined;
    
    const updatedSettings = { ...existingSettings, ...settings };
    this.settings.set(updatedSettings.id, updatedSettings);
    return updatedSettings;
  }
  
  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const id = this.settingsId++;
    const newSettings = { ...settings, id };
    this.settings.set(id, newSettings);
    return newSettings;
  }
}

export const storage = new MemStorage();
