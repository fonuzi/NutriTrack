import React from "react";
import DailySummary from "@/components/DailySummary";
import QuickScan from "@/components/QuickScan";
import RecentMeals from "@/components/RecentMeals";

export default function HomePage() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Daily Summary */}
      <DailySummary />
      
      {/* Quick Scan Section */}
      <QuickScan />
      
      {/* Recent Meals */}
      <RecentMeals />
    </div>
  );
}
