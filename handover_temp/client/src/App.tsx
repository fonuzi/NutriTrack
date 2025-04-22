import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import DiaryPage from "@/pages/DiaryPage";
import CameraPage from "@/pages/CameraPage";
import ProgressPage from "@/pages/ProgressPage";
import SettingsPage from "@/pages/SettingsPage";
import OnboardingPage from "@/pages/OnboardingPage";
import { GymProvider } from "@/context/GymContext";
import { FoodProvider } from "@/context/FoodContext";
import { ActivityProvider } from "@/context/ActivityContext";

function Router() {
  const [location, setLocation] = useLocation();

  // Parse tab from URL or default to dashboard
  useEffect(() => {
    if (location === "/") return;
    if (location === "/onboarding") return; // Allow access to onboarding page
    const tabPaths = ["/diary", "/camera", "/progress", "/settings"];
    if (!tabPaths.includes(location)) {
      setLocation("/");
    }
  }, [location, setLocation]);

  // If we're on the onboarding page, render without header and bottom navigation
  if (location === "/onboarding") {
    return (
      <div className="flex flex-col h-screen bg-dark-bg">
        <main className="flex-1 overflow-y-auto">
          <OnboardingPage />
        </main>
      </div>
    );
  }

  // Standard layout with header and bottom navigation
  return (
    <div className="flex flex-col h-screen bg-dark-bg">
      <Header />
      <main className="flex-1 overflow-y-auto pb-16">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/diary" component={DiaryPage} />
          <Route path="/camera" component={CameraPage} />
          <Route path="/progress" component={ProgressPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNavigation />
    </div>
  );
}

function App() {
  // Ensure we start with default CSS variables for the app
  useEffect(() => {
    try {
      // Set default CSS variables if they don't exist
      const root = document.documentElement;
      if (!root.style.getPropertyValue('--primary')) {
        root.style.setProperty('--primary', '#6366F1');
        root.style.setProperty('--primary-foreground', '#ffffff');
      }
    } catch (e) {
      console.error("Error setting default CSS variables:", e);
    }
  }, []);

  // Simple try-catch approach for error handling
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <GymProvider>
          <FoodProvider>
            <ActivityProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </ActivityProvider>
          </FoodProvider>
        </GymProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("Critical error in App component:", error);
    return <ErrorFallback error={error instanceof Error ? error : new Error("Unknown error occurred")} />;
  }
}

// Simple Error Fallback component instead of full error boundary
const ErrorFallback = ({ error }: { error: Error | null }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-dark-bg text-white">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="mb-4">The application encountered an error. Please try refreshing the page.</p>
      {error && <p className="mb-4 text-red-400">{error.message}</p>}
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Refresh Page
      </button>
    </div>
  );
}

export default App;
