import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API routes, all prefixed with /api
  const apiRouter = express.Router();
  
  // Gym routes
  apiRouter.get('/gym/:id', async (req, res) => {
    const gym = await storage.getGym(parseInt(req.params.id));
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(gym);
  });
  
  apiRouter.put('/gym/:id', async (req, res) => {
    const updatedGym = await storage.updateGym(parseInt(req.params.id), req.body);
    if (!updatedGym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(updatedGym);
  });
  
  apiRouter.post('/gym', async (req, res) => {
    const newGym = await storage.createGym(req.body);
    res.status(201).json(newGym);
  });
  
  // Food routes
  apiRouter.get('/food/:id', async (req, res) => {
    const food = await storage.getFood(parseInt(req.params.id));
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  });
  
  apiRouter.get('/foods/date', async (req, res) => {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const gymId = req.query.gymId ? parseInt(req.query.gymId as string) : undefined;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    const foods = await storage.getFoodsByDate(date, gymId, userId);
    res.json(foods);
  });
  
  apiRouter.get('/foods/recent', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const gymId = req.query.gymId ? parseInt(req.query.gymId as string) : undefined;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    const foods = await storage.getRecentFoods(limit, gymId, userId);
    res.json(foods);
  });
  
  apiRouter.post('/food', async (req, res) => {
    const newFood = await storage.createFood(req.body);
    res.status(201).json(newFood);
  });
  
  apiRouter.put('/food/:id', async (req, res) => {
    const updatedFood = await storage.updateFood(parseInt(req.params.id), req.body);
    if (!updatedFood) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(updatedFood);
  });
  
  apiRouter.delete('/food/:id', async (req, res) => {
    const success = await storage.deleteFood(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json({ success: true });
  });
  
  // Activity routes
  apiRouter.get('/activity/:id', async (req, res) => {
    const activity = await storage.getActivity(parseInt(req.params.id));
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  });
  
  apiRouter.get('/activities/range', async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
    const gymId = req.query.gymId ? parseInt(req.query.gymId as string) : undefined;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    const activities = await storage.getActivitiesByDateRange(startDate, endDate, gymId, userId);
    res.json(activities);
  });
  
  apiRouter.post('/activity', async (req, res) => {
    const newActivity = await storage.createActivity(req.body);
    res.status(201).json(newActivity);
  });
  
  apiRouter.put('/activity/:id', async (req, res) => {
    const updatedActivity = await storage.updateActivity(parseInt(req.params.id), req.body);
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(updatedActivity);
  });
  
  // Weight routes
  apiRouter.get('/weight/:id', async (req, res) => {
    const weight = await storage.getWeight(parseInt(req.params.id));
    if (!weight) {
      return res.status(404).json({ message: 'Weight not found' });
    }
    res.json(weight);
  });
  
  apiRouter.get('/weights/range', async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
    const gymId = req.query.gymId ? parseInt(req.query.gymId as string) : undefined;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    const weights = await storage.getWeightsByDateRange(startDate, endDate, gymId, userId);
    res.json(weights);
  });
  
  apiRouter.post('/weight', async (req, res) => {
    const newWeight = await storage.createWeight(req.body);
    res.status(201).json(newWeight);
  });
  
  // User settings routes
  apiRouter.get('/settings/:userId', async (req, res) => {
    const settings = await storage.getUserSettings(parseInt(req.params.userId));
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  });
  
  apiRouter.put('/settings/:userId', async (req, res) => {
    const updatedSettings = await storage.updateUserSettings(parseInt(req.params.userId), req.body);
    if (!updatedSettings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(updatedSettings);
  });
  
  apiRouter.post('/settings', async (req, res) => {
    const newSettings = await storage.createUserSettings(req.body);
    res.status(201).json(newSettings);
  });
  
  // OpenAI API for food recognition
  apiRouter.post('/analyze-food', async (req, res) => {
    try {
      const { imageBase64 } = req.body;

      if (!imageBase64) {
        console.error('Missing image data in analyze-food request');
        return res.status(400).json({ message: 'Image data is required' });
      }

      console.log(`Received image data for analysis, length: ${imageBase64.length} characters`);

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.error('OpenAI API key not configured for analyze-food endpoint');

        // Return dummy data for testing when API key is not configured
        if (process.env.NODE_ENV === 'development') {
          console.log('Returning dummy data for development');
          return res.json({
            name: "Test Meal",
            calories: 550,
            protein: 35,
            carbs: 45,
            fat: 15,
            items: [
              { name: "Grilled Salmon", amount: "6 oz", calories: 350 },
              { name: "Brown Rice", amount: "1/2 cup", calories: 120 },
              { name: "Steamed Broccoli", amount: "1 cup", calories: 80 }
            ]
          });
        }

        return res.status(500).json({ message: 'OpenAI API key not configured' });
      }

      console.log('Using OpenAI API to analyze food image...');

      // Import and use the OpenAI service to analyze the food image
      const { analyzeFoodImage } = await import('./openai');
      const result = await analyzeFoodImage(imageBase64);

      console.log('Analysis completed successfully:', JSON.stringify(result).substring(0, 100) + '...');
      res.json(result);
    } catch (error) {
      console.error('Error analyzing food:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorType = error instanceof Error ? error.constructor.name : 'Unknown';

      console.error(`Food analysis error (${errorType}): ${errorMessage}`);

      res.status(500).json({ 
        message: 'Failed to analyze food', 
        error: errorMessage,
        errorType: errorType
      });
    }
  });
  
  app.use('/api', apiRouter);

  return httpServer;
}
