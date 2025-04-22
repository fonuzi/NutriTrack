import { useLocation, useRoute } from "wouter";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const [isHome] = useRoute("/");
  const [isDiary] = useRoute("/diary");
  const [isCamera] = useRoute("/camera");
  const [isProgress] = useRoute("/progress");
  const [isSettings] = useRoute("/settings");
  
  const getTabClass = (isActive: boolean) => 
    isActive 
      ? "flex flex-col items-center w-16 py-1 text-primary" 
      : "flex flex-col items-center w-16 py-1 text-text-secondary";
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        <button 
          className={getTabClass(isHome)} 
          onClick={() => setLocation("/")}
        >
          <i className="fas fa-home text-lg"></i>
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          className={getTabClass(isDiary)} 
          onClick={() => setLocation("/diary")}
        >
          <i className="fas fa-book text-lg"></i>
          <span className="text-xs mt-1">Diary</span>
        </button>
        
        <div className="relative -mt-8">
          <button 
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-secondary to-primary shadow-lg"
            onClick={() => setLocation("/camera")}
          >
            <i className="fas fa-camera text-2xl text-white"></i>
          </button>
        </div>
        
        <button 
          className={getTabClass(isProgress)} 
          onClick={() => setLocation("/progress")}
        >
          <i className="fas fa-chart-line text-lg"></i>
          <span className="text-xs mt-1">Progress</span>
        </button>
        
        <button 
          className={getTabClass(isSettings)} 
          onClick={() => setLocation("/settings")}
        >
          <i className="fas fa-cog text-lg"></i>
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </nav>
  );
}
