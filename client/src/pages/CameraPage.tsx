import React, { useState } from "react";
import { useLocation } from "wouter";
import CameraCapture from "@/components/CameraCapture";
import FoodAnalysisResult from "@/components/FoodAnalysisResult";
import { useFood } from "@/context/FoodContext";
import { useToast } from "@/hooks/use-toast";
import { AnalyzeFoodResponse } from "@/lib/api";

// Alias for clarity
type AnalysisResult = AnalyzeFoodResponse;

export default function CameraPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { analyzeImage } = useFood();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handlePhotoTaken = async (imageData: string) => {
    console.log("Photo taken, image data length:", imageData ? imageData.length : 0);
    setCapturedImage(imageData);
    setIsAnalyzing(true);

    try {
      // Extract base64 data without the prefix (e.g., "data:image/jpeg;base64,")
      let base64Image = imageData;
      if (imageData.includes('base64,')) {
        base64Image = imageData.split('base64,')[1];
      }
      console.log("Extracted base64 data length:", base64Image ? base64Image.length : 0);

      if (!base64Image) {
        throw new Error("Invalid image data");
      }

      // Add a small delay to ensure UI updates properly
      await new Promise(resolve => setTimeout(resolve, 200));

      // Call the API to analyze the image
      const result = await analyzeImage(base64Image);
      console.log("Analysis result:", result);

      if (!result) {
        throw new Error("No analysis result returned");
      }

      setAnalysisResult({
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        items: result.items,
      });

      // Success message
      toast({
        title: "Analysis Complete",
        description: `Detected: ${result.name} (${result.calories} kcal)`,
      });
    } catch (error) {
      console.error("Error analyzing photo:", error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze your food photo. Please try again.",
        variant: "destructive",
      });
      setCapturedImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setLocation("/");
  };

  // If the image is being analyzed or an analysis result exists, show the result component
  if (capturedImage && (isAnalyzing || analysisResult)) {
    return (
      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-screen-lg mx-auto">
        <FoodAnalysisResult
          imageUrl={capturedImage}
          name={analysisResult?.name || "Analyzing..."}
          calories={analysisResult?.calories || 0}
          protein={analysisResult?.protein || 0}
          carbs={analysisResult?.carbs || 0}
          fat={analysisResult?.fat || 0}
          items={analysisResult?.items || []}
          isLoading={isAnalyzing}
          onClose={handleClose}
        />
      </div>
    );
  }

  // Otherwise, show the camera capture component
  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-screen-lg mx-auto">
      <CameraCapture onPhotoTaken={handlePhotoTaken} />
    </div>
  );
}