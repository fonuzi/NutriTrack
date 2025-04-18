import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Gym settings table for customization
export const gyms = pgTable("gyms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  primaryColor: text("primary_color").notNull().default("#6366F1"),
  ownerId: integer("owner_id"),
});

export const insertGymSchema = createInsertSchema(gyms).omit({
  id: true
});

// Foods table for tracking meals
export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url"),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(),
  carbs: integer("carbs").notNull(),
  fat: integer("fat").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  gymId: integer("gym_id"),
  userId: integer("user_id"),
  items: jsonb("items"), // Detailed breakdown of the meal components
});

export const insertFoodSchema = createInsertSchema(foods).omit({
  id: true,
});

// Activities table for tracking steps and exercises
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  steps: integer("steps").notNull().default(0),
  caloriesBurned: integer("calories_burned").notNull().default(0),
  date: timestamp("date").notNull().defaultNow(),
  gymId: integer("gym_id"),
  userId: integer("user_id"),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

// Weight entries for tracking weight changes
export const weights = pgTable("weights", {
  id: serial("id").primaryKey(),
  weight: integer("weight").notNull(), // in grams for precision
  date: timestamp("date").notNull().defaultNow(),
  gymId: integer("gym_id"),
  userId: integer("user_id"),
});

export const insertWeightSchema = createInsertSchema(weights).omit({
  id: true,
});

// User settings and goals
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  calorieGoal: integer("calorie_goal").notNull().default(2000),
  proteinGoal: integer("protein_goal").notNull().default(100),
  carbsGoal: integer("carbs_goal").notNull().default(250),
  fatGoal: integer("fat_goal").notNull().default(70),
  stepsGoal: integer("steps_goal").notNull().default(10000),
  waterGoal: integer("water_goal").notNull().default(2500), // in ml
  preferredUnits: text("preferred_units").notNull().default("imperial"), // imperial or metric
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  healthKitEnabled: boolean("health_kit_enabled").notNull().default(true),
  dataBackupEnabled: boolean("data_backup_enabled").notNull().default(false),
  gymId: integer("gym_id"),
  userId: integer("user_id"),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

// Type definitions
export type Gym = typeof gyms.$inferSelect;
export type InsertGym = z.infer<typeof insertGymSchema>;

export type Food = typeof foods.$inferSelect;
export type InsertFood = z.infer<typeof insertFoodSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Weight = typeof weights.$inferSelect;
export type InsertWeight = z.infer<typeof insertWeightSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
