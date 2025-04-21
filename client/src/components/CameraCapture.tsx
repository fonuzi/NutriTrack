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

      // We have the image data, now let's pass it to the callback
      if (onPhotoTaken) {
        onPhotoTaken(imageData);
      } else {
        console.log("No callback provided, processing image without a callback");
        // Redirect to home page with a success message since we don't have a callback to process the image
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

          // Convert file to data URL format (not just base64)
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