import { useState, useCallback, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseCameraReturn {
  isCameraActive: boolean;
  startCamera: (videoElement: HTMLVideoElement | null) => void;
  stopCamera: () => void;
  capturePhoto: (videoElement: HTMLVideoElement | null) => Promise<string>;
}

export function useCamera(): UseCameraReturn {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  
  // Clean up the camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);
  
  const startCamera = useCallback(async (videoElement: HTMLVideoElement | null) => {
    if (!videoElement) return;
    
    try {
      // Check if camera is already active
      if (streamRef.current) {
        videoElement.srcObject = streamRef.current;
        setIsCameraActive(true);
        return;
      }
      
      // Get camera stream with rear camera if available (for mobile)
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Error",
        description: "Could not access your camera. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  }, []);
  
  const capturePhoto = useCallback(async (videoElement: HTMLVideoElement | null): Promise<string> => {
    if (!videoElement || !isCameraActive) {
      throw new Error("Camera is not active");
    }
    
    return new Promise((resolve, reject) => {
      try {
        // Create a canvas element to capture the frame
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        // Draw the video frame to the canvas
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(imageDataUrl);
      } catch (error) {
        console.error("Error capturing photo:", error);
        reject(error);
      }
    });
  }, [isCameraActive]);
  
  return {
    isCameraActive,
    startCamera,
    stopCamera,
    capturePhoto
  };
}
