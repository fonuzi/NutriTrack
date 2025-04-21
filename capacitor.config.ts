import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.performize.gymtrack',
  appName: 'GymTrack',
  webDir: 'dist/public',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#13131A",
      showSpinner: true,
      spinnerColor: "#6366F1"
    },
    Camera: {
      promptLabelHeader: "Camera Access",
      promptLabelText: "GymTrack needs your permission to use the camera to analyze your food"
    }
  },
  server: {
    hostname: "app.performize.io",
    androidScheme: "https"
  }
};

export default config;
