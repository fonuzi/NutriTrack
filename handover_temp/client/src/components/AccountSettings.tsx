import { useToast } from "@/hooks/use-toast";

export default function AccountSettings() {
  const { toast } = useToast();
  
  const handleSignOut = () => {
    // In a real implementation, this would sign the user out
    toast({
      title: "Sign Out",
      description: "You have been signed out of your account.",
    });
  };
  
  const showFeatureNotImplemented = () => {
    toast({
      title: "Feature Not Implemented",
      description: "This feature is not implemented in the demo.",
    });
  };
  
  return (
    <div className="bg-dark-surface rounded-xl p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Account</h2>
      
      <div className="space-y-4">
        <button 
          className="w-full bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center px-4 text-text-primary justify-between"
          onClick={showFeatureNotImplemented}
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-user-circle text-lg text-primary"></i>
            <span>Profile Settings</span>
          </div>
          <i className="fas fa-chevron-right text-text-secondary"></i>
        </button>
        
        <button 
          className="w-full bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center px-4 text-text-primary justify-between"
          onClick={showFeatureNotImplemented}
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-lock text-lg text-primary"></i>
            <span>Privacy & Security</span>
          </div>
          <i className="fas fa-chevron-right text-text-secondary"></i>
        </button>
        
        <button 
          className="w-full bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center px-4 text-text-primary justify-between"
          onClick={showFeatureNotImplemented}
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-question-circle text-lg text-primary"></i>
            <span>Help & Support</span>
          </div>
          <i className="fas fa-chevron-right text-text-secondary"></i>
        </button>
        
        <button 
          className="w-full bg-dark-card hover:bg-dark-border transition rounded-lg py-3 flex items-center px-4 text-text-primary justify-between"
          onClick={showFeatureNotImplemented}
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-info-circle text-lg text-primary"></i>
            <span>About & Legal</span>
          </div>
          <i className="fas fa-chevron-right text-text-secondary"></i>
        </button>
        
        <button 
          className="w-full mt-4 bg-red-900 hover:bg-red-800 transition rounded-lg py-3 flex items-center justify-center gap-2 text-white"
          onClick={handleSignOut}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
