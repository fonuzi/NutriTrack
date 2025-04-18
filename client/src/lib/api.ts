import { apiRequest } from "./queryClient";
import { 
  Gym, Food, Activity, Weight, UserSettings,
  InsertGym, InsertFood, InsertActivity, InsertWeight, InsertUserSettings
} from "@shared/schema";

// Gym API
export const getGym = async (id: number): Promise<Gym> => {
  const res = await apiRequest("GET", `/api/gym/${id}`);
  return res.json();
};

export const updateGym = async (id: number, gym: Partial<InsertGym>): Promise<Gym> => {
  const res = await apiRequest("PUT", `/api/gym/${id}`, gym);
  return res.json();
};

export const createGym = async (gym: InsertGym): Promise<Gym> => {
  const res = await apiRequest("POST", `/api/gym`, gym);
  return res.json();
};

// Food API
export const getFood = async (id: number): Promise<Food> => {
  const res = await apiRequest("GET", `/api/food/${id}`);
  return res.json();
};

export const getFoodsByDate = async (date: Date, gymId?: number, userId?: number): Promise<Food[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("date", date.toISOString());
  if (gymId) queryParams.append("gymId", gymId.toString());
  if (userId) queryParams.append("userId", userId.toString());
  
  const res = await apiRequest("GET", `/api/foods/date?${queryParams.toString()}`);
  return res.json();
};

export const getRecentFoods = async (limit: number = 5, gymId?: number, userId?: number): Promise<Food[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("limit", limit.toString());
  if (gymId) queryParams.append("gymId", gymId.toString());
  if (userId) queryParams.append("userId", userId.toString());
  
  const res = await apiRequest("GET", `/api/foods/recent?${queryParams.toString()}`);
  return res.json();
};

export const createFood = async (food: InsertFood): Promise<Food> => {
  const res = await apiRequest("POST", `/api/food`, food);
  return res.json();
};

export const updateFood = async (id: number, food: Partial<InsertFood>): Promise<Food> => {
  const res = await apiRequest("PUT", `/api/food/${id}`, food);
  return res.json();
};

export const deleteFood = async (id: number): Promise<{success: boolean}> => {
  const res = await apiRequest("DELETE", `/api/food/${id}`);
  return res.json();
};

// Activity API
export const getActivity = async (id: number): Promise<Activity> => {
  const res = await apiRequest("GET", `/api/activity/${id}`);
  return res.json();
};

export const getActivitiesByDateRange = async (
  startDate: Date, 
  endDate: Date, 
  gymId?: number, 
  userId?: number
): Promise<Activity[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("startDate", startDate.toISOString());
  queryParams.append("endDate", endDate.toISOString());
  if (gymId) queryParams.append("gymId", gymId.toString());
  if (userId) queryParams.append("userId", userId.toString());
  
  const res = await apiRequest("GET", `/api/activities/range?${queryParams.toString()}`);
  return res.json();
};

export const createActivity = async (activity: InsertActivity): Promise<Activity> => {
  const res = await apiRequest("POST", `/api/activity`, activity);
  return res.json();
};

export const updateActivity = async (id: number, activity: Partial<InsertActivity>): Promise<Activity> => {
  const res = await apiRequest("PUT", `/api/activity/${id}`, activity);
  return res.json();
};

// Weight API
export const getWeight = async (id: number): Promise<Weight> => {
  const res = await apiRequest("GET", `/api/weight/${id}`);
  return res.json();
};

export const getWeightsByDateRange = async (
  startDate: Date, 
  endDate: Date, 
  gymId?: number, 
  userId?: number
): Promise<Weight[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("startDate", startDate.toISOString());
  queryParams.append("endDate", endDate.toISOString());
  if (gymId) queryParams.append("gymId", gymId.toString());
  if (userId) queryParams.append("userId", userId.toString());
  
  const res = await apiRequest("GET", `/api/weights/range?${queryParams.toString()}`);
  return res.json();
};

export const createWeight = async (weight: InsertWeight): Promise<Weight> => {
  const res = await apiRequest("POST", `/api/weight`, weight);
  return res.json();
};

// User Settings API
export const getUserSettings = async (userId: number): Promise<UserSettings> => {
  const res = await apiRequest("GET", `/api/settings/${userId}`);
  return res.json();
};

export const updateUserSettings = async (
  userId: number, 
  settings: Partial<InsertUserSettings>
): Promise<UserSettings> => {
  const res = await apiRequest("PUT", `/api/settings/${userId}`, settings);
  return res.json();
};

export const createUserSettings = async (settings: InsertUserSettings): Promise<UserSettings> => {
  const res = await apiRequest("POST", `/api/settings`, settings);
  return res.json();
};

// Food Analysis API
export interface AnalyzeFoodRequest {
  imageBase64: string;
}

export interface FoodItem {
  name: string;
  amount: string;
  calories: number;
}

export interface AnalyzeFoodResponse {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: FoodItem[];
}

export const analyzeFood = async (request: AnalyzeFoodRequest): Promise<AnalyzeFoodResponse> => {
  const res = await apiRequest("POST", `/api/analyze-food`, request);
  return res.json();
};
