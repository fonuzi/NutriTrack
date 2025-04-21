import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.performize.gymtrack',
  appName: 'GymTrack',
  webDir: 'dist/public',
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
  }
  // No server config - this ensures the app uses bundled web content
};

export default config;
