import { useLocation } from "wouter";

export default function QuickScan() {
  const [, setLocation] = useLocation();
  
  const handleCameraClick = () => {
    setLocation("/camera");
  };
  
  const handleBarcodeClick = () => {
    setLocation("/camera?mode=barcode");
  };
  
  return (
    <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-5 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Track your meal</h2>
      <p className="text-sm text-white/80 mb-5">Snap a photo or scan a barcode to instantly track your calories</p>
      
      <div className="flex gap-3">
        <button 
          className="flex-1 bg-white/20 hover:bg-white/30 transition rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-white"
          onClick={handleCameraClick}
        >
          <i className="fas fa-camera"></i>
          <span>Take Photo</span>
        </button>
        
        <button 
          className="flex-1 bg-white/20 hover:bg-white/30 transition rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-white"
          onClick={handleBarcodeClick}
        >
          <i className="fas fa-barcode"></i>
          <span>Scan Barcode</span>
        </button>
      </div>
    </div>
  );
}
