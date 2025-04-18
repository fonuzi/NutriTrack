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
  
  // O3 API proxy for food recognition
  apiRouter.post('/analyze-food', async (req, res) => {
    try {
      // This would normally call the O3 API
      // For now we'll return a mock response to be replaced by actual API implementation
      const apiKey = process.env.O3_API_KEY || "";
      if (!apiKey) {
        return res.status(500).json({ message: 'O3 API key not configured' });
      }
      
      // With a real API key, we would make the actual API call
      // const response = await fetch('https://api.o3.service/analyze', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${apiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(req.body)
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`O3 API responded with ${response.status}: ${response.statusText}`);
      // }
      //
      // const data = await response.json();
      // res.json(data);
      
      // Since we don't have the actual API key, we'll return an error
      res.status(500).json({ message: 'Could not process food image. Please ensure O3_API_KEY is configured.' });
    } catch (error) {
      console.error('Error analyzing food:', error);
      res.status(500).json({ message: 'Failed to analyze food', error: error instanceof Error ? error.message : String(error) });
    }
  });
  
  app.use('/api', apiRouter);

  return httpServer;
}
