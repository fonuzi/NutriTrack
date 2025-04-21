import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { fileToBase64 } from "@/lib/utils";
import { Camera, X, Image, Barcode } from "lucide-react";

interface CameraCaptureProps {
  mode?: "photo" | "barcode";
  onPhotoTaken?: (imageData: string) => void;
}

interface FoodAnalysisResult {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  steps?: string[];
}

// OpenAI API integration for food analysis
const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysisResult> => {
  try {
    const response = await fetch("/api/analyze-food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to analyze food image");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in analyzeFoodImage:", error);
    throw error;
  }
};

export default function CameraCapture({ mode = "photo", onPhotoTaken }: CameraCaptureProps) {
  const { toast } = useToast();
  const { isCameraActive, startCamera, stopCamera, capturePhoto } = useCamera();
  const { uploadFile } = useFileUpload();
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!isCameraActive) {
      startCamera(videoRef.current);
    }

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera, isCameraActive]);

  const handleCapturePhoto = async () => {
    try {
      setIsCapturing(true);
      console.log("Attempting to capture photo from video ref:", videoRef.current ? "Available" : "Not available");

      if (!videoRef.current || !isCameraActive) {
        throw new Error("Camera not active or no video reference");
      }

      const imageData = await capturePhoto(videoRef.current);
      console.log("Photo captured successfully, data length:", imageData.length);

      if (onPhotoTaken) {
        console.log("Calling photo taken callback");
        onPhotoTaken(imageData);
      } else {
        // If no callback provided, analyze the image directly
        console.log("No callback provided, analyzing directly");

        // Extract base64 data without the prefix (e.g., "data:image/jpeg;base64,")
        const base64Image = imageData.split(',')[1];

        if (!base64Image) {
          throw new Error("Invalid image data format");
        }

        console.log("Base64 image data length:", base64Image.length);

        // Call the API to analyze the food
        try {
          const result = await analyzeFoodImage(base64Image);
          console.log("Analysis result:", result);

          // Navigate to results page
          if (result) {
            setLocation("/");
            toast({
              title: "Food Analyzed",
              description: `Detected: ${result.name} (${result.calories} kcal)`,
            });
          }
        } catch (apiError) {
          console.error("Error analyzing image:", apiError);
          toast({
            title: "Analysis Failed",
            description: "Could not analyze your food. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast({
        title: "Camera Error",
        description: "Could not capture photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCloseCamera = () => {
    stopCamera();
    setLocation("/");
  };

  const handleSelectFromGallery = () => {
    uploadFile({
      accept: "image/*",
      onFileSelected: async (file) => {
        try {
          console.log("Gallery image selected:", file.name);

          // Convert file to base64
          const base64 = await fileToBase64(file);
          console.log("Converted image to base64, length:", base64 ? base64.length : 0);

          if (onPhotoTaken) {
            console.log("Calling photo taken callback with gallery image");
            onPhotoTaken(base64);
          } else {
            console.log("Analyzing gallery image directly");

            // Set loading state
            setIsCapturing(true);

            try {
              // Get the base64 data without the prefix if it exists
              const base64Data = base64.includes('base64,') ? base64.split('base64,')[1] : base64;

              // Call the API to analyze the food
              const result = await analyzeFoodImage(base64Data);
              console.log("Gallery image analysis result:", result);

              // Navigate to results page
              if (result) {
                setLocation("/");
                toast({
                  title: "Food Analyzed",
                  description: `Detected: ${result.name} (${result.calories} kcal)`,
                });
              }
            } catch (apiError) {
              console.error("Error analyzing gallery image:", apiError);
              toast({
                title: "Analysis Failed",
                description: "Could not analyze your food. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsCapturing(false);
            }
          }
        } catch (error) {
          console.error("Error processing gallery image:", error);
          toast({
            title: "Image Error",
            description: "Could not process the selected image. Please try again.",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleScanBarcode = () => {
    setLocation("/camera?mode=barcode");
  };

  return (
    <div className="bg-dark-surface rounded-xl overflow-hidden shadow-lg">
      <div className="relative bg-black aspect-[3/4] flex items-center justify-center">
        {isCameraActive ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-center p-6">
            <Camera className="h-10 w-10 text-text-secondary mx-auto mb-2" />
            <p className="text-text-secondary">Camera initializing...</p>
            <p className="text-xs text-text-muted mt-2">Point camera at your food</p>
          </div>
        )}

        {/* Capture button */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button 
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
            onClick={handleCapturePhoto}
            disabled={isCapturing || !isCameraActive}
          >
            {isCapturing ? (
              <div className="w-14 h-14 rounded-full border-2 border-dark-bg flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-dark-bg"></div>
            )}
          </button>
        </div>

        {/* Close button */}
        <button 
          className="absolute top-4 right-4 bg-dark-bg bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center"
          onClick={handleCloseCamera}
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">
          {mode === "photo" ? "Take a Photo of Your Food" : "Scan a Barcode"}
        </h2>
        <p className="text-sm text-text-secondary">
          {mode === "photo" 
            ? "Make sure the entire plate is visible for best results" 
            : "Hold the barcode steady in the frame"}
        </p>

        <div className="flex gap-3 mt-4">
          <button 
            className="flex-1 bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center justify-center gap-2 text-text-primary"
            onClick={handleSelectFromGallery}
          >
            <Image className="h-5 w-5" />
            <span>Gallery</span>
          </button>

          {mode === "photo" ? (
            <button 
              className="flex-1 bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center justify-center gap-2 text-text-primary"
              onClick={handleScanBarcode}
            >
              <Barcode className="h-5 w-5" />
              <span>Barcode</span>
            </button>
          ) : (
            <button 
              className="flex-1 bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center justify-center gap-2 text-text-primary"
              onClick={() => setLocation("/camera")}
            >
              <Camera className="h-5 w-5" />
              <span>Photo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}