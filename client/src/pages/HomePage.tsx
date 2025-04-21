import React from "react";
import { useLocation } from "wouter";
import DailySummary from "@/components/DailySummary";
import QuickScan from "@/components/QuickScan";
import RecentMeals from "@/components/RecentMeals";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [, setLocation] = useLocation();

  const goToOnboarding = () => {
    setLocation("/onboarding");
  };

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-screen-lg mx-auto">
      {/* Development Tool - Access Onboarding */}
      <div className="bg-dark-surface rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
        <h3 className="text-lg font-semibold mb-2">Developer Options</h3>
        <Button 
          onClick={goToOnboarding} 
          className="w-full bg-accent hover:bg-accent/90"
        >
          Go to Onboarding Page
        </Button>
      </div>

      {/* Daily Summary */}
      <DailySummary />

      {/* Quick Scan Section */}
      <QuickScan />

      {/* Recent Meals */}
      <RecentMeals />
    </div>
  );
}