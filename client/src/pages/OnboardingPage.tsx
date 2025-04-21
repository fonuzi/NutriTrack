import { useState } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useFood } from "@/context/FoodContext";
import GymLogo from "@/components/GymLogo";
import { ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { updateSettings } = useFood();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    goalWeight: "",
    goal: "lose",
    activityLevel: "moderate",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      // Calculate calorie goal based on form data
      const calorieGoal = calculateCalorieGoal();
      const proteinGoal = Math.round(calorieGoal * 0.3 / 4); // 30% of calories from protein
      const carbsGoal = Math.round(calorieGoal * 0.4 / 4); // 40% of calories from carbs
      const fatGoal = Math.round(calorieGoal * 0.3 / 9); // 30% of calories from fat

      await updateSettings({
        calorieGoal,
        proteinGoal,
        carbsGoal,
        fatGoal,
        stepsGoal: 10000,
        waterGoal: formData.gender === "male" ? 3.7 : 2.7,
        preferredUnits: formData.weightUnit === "kg" ? "metric" : "imperial",
      });

      // Navigate to home page after saving
      setLocation("/");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  const calculateCalorieGoal = () => {
    // Parse input values
    const age = parseInt(formData.age);
    const weight = parseInt(formData.weight);
    const height = parseInt(formData.height);
    
    // Convert to metric if needed
    const weightKg = formData.weightUnit === "lb" ? weight * 0.453592 : weight;
    const heightCm = formData.heightUnit === "in" ? height * 2.54 : height;
    
    // Basic BMR calculation (Harris-Benedict equation)
    let bmr = 0;
    if (formData.gender === "male") {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
    }
    
    // Apply activity multiplier
    let activityMultiplier = 1.2; // sedentary
    if (formData.activityLevel === "light") activityMultiplier = 1.375;
    if (formData.activityLevel === "moderate") activityMultiplier = 1.55;
    if (formData.activityLevel === "active") activityMultiplier = 1.725;
    if (formData.activityLevel === "very active") activityMultiplier = 1.9;
    
    const maintenanceCalories = Math.round(bmr * activityMultiplier);
    
    // Adjust based on goal
    let calorieGoal = maintenanceCalories;
    if (formData.goal === "lose") calorieGoal = Math.round(maintenanceCalories * 0.8);
    if (formData.goal === "gain") calorieGoal = Math.round(maintenanceCalories * 1.15);
    
    return calorieGoal;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <GymLogo size="large" />
          <p className="mt-2 text-sm text-text-secondary">powered by PERFORMIZE</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Welcome!"}
              {step === 2 && "Body Metrics"}
              {step === 3 && "Your Goals"}
              {step === 4 && "Almost Done!"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Let's set up your profile"}
              {step === 2 && "Enter your current measurements"}
              {step === 3 && "What are you aiming for?"}
              {step === 4 && "Review your personalized plan"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      placeholder="Height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <Select
                      value={formData.heightUnit}
                      onValueChange={(value) => handleSelectChange("heightUnit", value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">inches</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Current Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      placeholder="Weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <Select
                      value={formData.weightUnit}
                      onValueChange={(value) => handleSelectChange("weightUnit", value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lb">lb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goalWeight">Goal Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      id="goalWeight"
                      name="goalWeight"
                      type="number"
                      placeholder="Goal weight"
                      value={formData.goalWeight}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <div className="w-24 py-2 px-3 text-center border rounded-md bg-muted">
                      {formData.weightUnit}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Your Goal</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value) => handleSelectChange("goal", value)}
                  >
                    <SelectTrigger id="goal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">Lose Weight</SelectItem>
                      <SelectItem value="maintain">Maintain Weight</SelectItem>
                      <SelectItem value="gain">Gain Weight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) => handleSelectChange("activityLevel", value)}
                  >
                    <SelectTrigger id="activityLevel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very active">Very Active (strenuous exercise daily)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-text-secondary">
                  Based on your information, we've created a personalized nutrition plan for you:
                </p>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between py-2 border-b border-primary/20">
                    <span className="font-medium">Daily Calorie Target:</span>
                    <span className="font-bold">{calculateCalorieGoal()} kcal</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary/20">
                    <span className="font-medium">Protein Target:</span>
                    <span className="font-bold">{Math.round(calculateCalorieGoal() * 0.3 / 4)}g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary/20">
                    <span className="font-medium">Carbs Target:</span>
                    <span className="font-bold">{Math.round(calculateCalorieGoal() * 0.4 / 4)}g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Fat Target:</span>
                    <span className="font-bold">{Math.round(calculateCalorieGoal() * 0.3 / 9)}g</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  You can always adjust these values in the Settings.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <Button onClick={handleNext} className="flex items-center gap-1">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Complete Setup</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}