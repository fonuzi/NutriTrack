import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Camera, X, Image } from "lucide-react";

interface CameraCaptureProps {
  onPhotoTaken?: (imageData: string) => void;
}

export default function CameraCapture({ onPhotoTaken }: CameraCaptureProps) {
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
        console.log("No callback provided, navigating back");
        setLocation("/");
        toast({
          title: "Photo Captured",
          description: "Your photo was captured successfully.",
        });
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
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            console.log("Converted image to data URL, length:", dataUrl ? dataUrl.length : 0);

            if (onPhotoTaken) {
              console.log("Calling photo taken callback with gallery image");
              onPhotoTaken(dataUrl);
            } else {
              console.log("No callback for gallery image, redirecting to home");
              setLocation("/");
              toast({
                title: "Image Selected",
                description: "Your image was selected successfully.",
              });
            }
          };
          reader.readAsDataURL(file);
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

  return (
    <div className="bg-dark-surface rounded-xl overflow-hidden shadow-lg mx-auto max-w-md">
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
        <h2 className="text-lg font-semibold mb-2">Take a Photo of Your Food</h2>
        <p className="text-sm text-text-secondary">
          Make sure the entire plate is visible for best results
        </p>

        <div className="mt-4">
          <button 
            className="w-full bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center justify-center gap-2 text-text-primary"
            onClick={handleSelectFromGallery}
          >
            <Image className="h-5 w-5" />
            <span>Select from Gallery</span>
          </button>
        </div>
      </div>
    </div>
  );
}