import React, { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import CameraCapture from "@/components/CameraCapture";
import FoodAnalysisResult from "@/components/FoodAnalysisResult";
import { useFood } from "@/context/FoodContext";
import { useToast } from "@/hooks/use-toast";
import { AnalyzeFoodResponse } from "@/lib/api";

// Alias for clarity
type AnalysisResult = AnalyzeFoodResponse;

export default function CameraPage() {
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/camera:rest*");
  const { toast } = useToast();
  const { analyzeImage } = useFood();
  
  const [mode, setMode] = useState<"photo" | "barcode">("photo");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Parse query parameters to determine camera mode
  useEffect(() => {
    if (params && params["rest*"]) {
      const query = new URLSearchParams(params["rest*"]);
      const modeParam = query.get("mode");
      if (modeParam === "barcode") {
        setMode("barcode");
      } else {
        setMode("photo");
      }
    }
  }, [params]);
  
  const handlePhotoTaken = async (imageData: string) => {
    console.log("Photo taken, image data length:", imageData ? imageData.length : 0);
    setCapturedImage(imageData);
    setIsAnalyzing(true);
    
    try {
      // Call the API through our backend proxy to analyze the food
      // Extract base64 data without the prefix (e.g., "data:image/jpeg;base64,")
      const base64Image = imageData.split(',')[1]; 
      console.log("Extracted base64 data length:", base64Image ? base64Image.length : 0);
      
      if (!base64Image) {
        throw new Error("Invalid image data");
      }
      
      const result = await analyzeImage(base64Image);
      console.log("Analysis result:", result);
      
      setAnalysisResult({
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        items: result.items,
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
      <div className="px-4 py-6 space-y-6">
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
    <div className="px-4 py-6 space-y-6">
      <CameraCapture mode={mode} onPhotoTaken={handlePhotoTaken} />
    </div>
  );
}
