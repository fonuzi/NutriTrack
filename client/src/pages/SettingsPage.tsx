import React from "react";
import GymBrandingSettings from "@/components/GymBrandingSettings";
import AppSettings from "@/components/AppSettings";
import AccountSettings from "@/components/AccountSettings";

export default function SettingsPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <GymBrandingSettings />
      <AppSettings />
      <AccountSettings />
    </div>
  );
}
