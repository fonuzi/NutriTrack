import { useState } from "react";
import { useFood } from "@/context/FoodContext";
import { useActivity } from "@/context/ActivityContext";
import { useToast } from "@/hooks/use-toast";

export default function AppSettings() {
  const { settings, updateSettings } = useFood();
  const { toast } = useToast();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [healthKitEnabled, setHealthKitEnabled] = useState(settings.healthKitEnabled);
  const [dataBackupEnabled, setDataBackupEnabled] = useState(settings.dataBackupEnabled);
  const [preferredUnits, setPreferredUnits] = useState(settings.preferredUnits);
  
  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    updateSettings({ notificationsEnabled: newValue });
    toast({
      title: `Notifications ${newValue ? 'Enabled' : 'Disabled'}`,
      description: `You will ${newValue ? 'now' : 'no longer'} receive notifications and reminders.`,
    });
  };
  
  const handleToggleHealthKit = () => {
    const newValue = !healthKitEnabled;
    setHealthKitEnabled(newValue);
    updateSettings({ healthKitEnabled: newValue });
    toast({
      title: `HealthKit Integration ${newValue ? 'Enabled' : 'Disabled'}`,
      description: `Steps and activity data will ${newValue ? 'now' : 'no longer'} be synced.`,
    });
  };
  
  const handleToggleDataBackup = () => {
    const newValue = !dataBackupEnabled;
    setDataBackupEnabled(newValue);
    updateSettings({ dataBackupEnabled: newValue });
    toast({
      title: `Data Backup ${newValue ? 'Enabled' : 'Disabled'}`,
      description: `Your data will ${newValue ? 'now' : 'no longer'} be automatically backed up.`,
    });
  };
  
  const handleUnitsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as "imperial" | "metric";
    setPreferredUnits(newValue);
    updateSettings({ preferredUnits: newValue });
    toast({
      title: "Units Updated",
      description: `Your preferred units are now set to ${newValue}.`,
    });
  };
  
  return (
    <div className="bg-dark-surface rounded-xl p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">App Settings</h2>
      
      {/* Settings List */}
      <div className="space-y-4">
        {/* Notification Settings */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-text-secondary">Reminders and updates</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="notificationsToggle" 
              className="sr-only" 
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
            />
            <label 
              htmlFor="notificationsToggle" 
              className="block bg-dark-card w-12 h-6 rounded-full cursor-pointer relative"
            >
              <span 
                className={`block ${notificationsEnabled ? 'bg-primary' : 'bg-gray-400'} w-5 h-5 rounded-full absolute left-0.5 top-0.5 transition-transform ${notificationsEnabled ? 'transform translate-x-6' : ''}`}
              ></span>
            </label>
          </div>
        </div>
        
        {/* Health App Integration */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">HealthKit Integration</h3>
            <p className="text-sm text-text-secondary">Sync steps and activity data</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="healthkitToggle" 
              className="sr-only" 
              checked={healthKitEnabled}
              onChange={handleToggleHealthKit}
            />
            <label 
              htmlFor="healthkitToggle" 
              className="block bg-dark-card w-12 h-6 rounded-full cursor-pointer relative"
            >
              <span 
                className={`block ${healthKitEnabled ? 'bg-primary' : 'bg-gray-400'} w-5 h-5 rounded-full absolute left-0.5 top-0.5 transition-transform ${healthKitEnabled ? 'transform translate-x-6' : ''}`}
              ></span>
            </label>
          </div>
        </div>
        
        {/* Data Backup */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Data Backup</h3>
            <p className="text-sm text-text-secondary">Automatic cloud backup</p>
          </div>
          <div className="relative">
            <input 
              type="checkbox" 
              id="backupToggle" 
              className="sr-only"
              checked={dataBackupEnabled}
              onChange={handleToggleDataBackup}
            />
            <label 
              htmlFor="backupToggle" 
              className="block bg-dark-card w-12 h-6 rounded-full cursor-pointer relative"
            >
              <span 
                className={`block ${dataBackupEnabled ? 'bg-primary' : 'bg-gray-400'} w-5 h-5 rounded-full absolute left-0.5 top-0.5 transition-transform ${dataBackupEnabled ? 'transform translate-x-6' : ''}`}
              ></span>
            </label>
          </div>
        </div>
        
        {/* Units of Measurement */}
        <div>
          <h3 className="font-medium mb-2">Units of Measurement</h3>
          <select 
            className="w-full bg-dark-card text-text-primary px-3 py-2 rounded-lg border border-dark-border"
            value={preferredUnits}
            onChange={handleUnitsChange}
          >
            <option value="imperial">Imperial (lb, in)</option>
            <option value="metric">Metric (kg, cm)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
