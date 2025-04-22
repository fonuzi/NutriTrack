import { useLocation } from "wouter";
import { Camera } from "lucide-react";

export default function QuickScan() {
  const [, setLocation] = useLocation();

  const handleCameraClick = () => {
    setLocation("/camera");
  };

  return (
    <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-4 sm:p-5 shadow-lg mx-auto w-full max-w-screen-lg">
      <h2 className="text-lg font-semibold mb-2 sm:mb-4">Track your meal</h2>
      <p className="text-sm text-white/80 mb-4 sm:mb-5">Snap a photo to instantly track your calories</p>

      <button 
        className="w-full bg-white/20 hover:bg-white/30 transition rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-white"
        onClick={handleCameraClick}
      >
        <Camera className="h-5 w-5" />
        <span>Take Photo</span>
      </button>
    </div>
  );
}