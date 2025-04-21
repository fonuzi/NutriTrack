# Deploying PERFORMIZE to TestFlight Using Expo EAS

This guide will walk you through the process of building your Expo app for TestFlight distribution using EAS (Expo Application Services).

## Prerequisites

1. An Apple Developer account ($99/year)
2. Expo account (free at [expo.dev](https://expo.dev))
3. Expo CLI installed globally:
   ```bash
   npm install -g eas-cli
   ```
4. App Store Connect setup with your app
5. OpenAI API key for the food analysis feature

## Step 1: Install and Configure EAS CLI

1. If you haven't already, install the EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Initialize EAS in your project:
   ```bash
   cd expo-app
   eas build:configure
   ```

## Step 2: Update your app.json Configuration

Your app.json already has most of the necessary configuration. Let's enhance it for TestFlight submission:

```json
{
  "expo": {
    "name": "PERFORMIZE",
    "slug": "performize",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#111827"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.performize.app", 
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "We need access to your camera to take photos of your food for analysis.",
        "NSPhotoLibraryUsageDescription": "We need access to your photo library to select gym logos and food images.",
        "NSMotionUsageDescription": "We need access to motion data to track your steps."
      },
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to analyze your food."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos for profile and food images."
        }
      ],
      [
        "expo-sensors",
        {
          "motionPermission": "Allow $(PRODUCT_NAME) to access your device motion to track steps."
        }
      ]
    ]
  }
}
```

## Step 3: Create eas.json Configuration

Create an `eas.json` file in the root of your expo-app directory with the following content:

```json
{
  "cli": {
    "version": ">= 3.13.3"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    },
    "testflight": {
      "distribution": "store",
      "autoIncrement": true,
      "ios": {
        "enterpriseProvisioning": "adhoc"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID@example.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      }
    }
  }
}
```

Replace the placeholders:
- `YOUR_APPLE_ID@example.com` with your Apple ID email
- `YOUR_APP_STORE_CONNECT_APP_ID` with your App Store Connect App ID
- `YOUR_APPLE_TEAM_ID` with your Apple Developer Team ID

## Step 4: Set Up Environment Variables

For security, let's set up your OpenAI API key as an environment variable:

1. Create a new file called `.env` in the root of your expo-app directory:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

2. Install the necessary package:
   ```bash
   npm install dotenv react-native-dotenv
   ```

3. Update your babel.config.js to include:
   ```javascript
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [
         [
           'module:react-native-dotenv',
           {
             moduleName: '@env',
             path: '.env',
             blacklist: null,
             whitelist: null,
             safe: false,
             allowUndefined: true
           }
         ]
       ]
     };
   };
   ```

4. In your app, import the API key with:
   ```javascript
   import { OPENAI_API_KEY } from '@env';
   ```

## Step 5: Install Apple Authentication

1. Install the Apple Authentication package:
   ```bash
   cd expo-app
   npx expo install @expo/apple-authentication
   ```

## Step 6: Build for iOS TestFlight

1. Start the build process:
   ```bash
   cd expo-app
   eas build --platform ios --profile testflight
   ```

2. Follow the prompts:
   - You'll need to log in to your Apple Developer account
   - Choose to let EAS handle your credentials or use your own
   - Wait for the build to complete (this can take 10-30 minutes)

3. After the build completes, EAS will provide a link to view the build status and details.

## Step 7: Submit to TestFlight

1. Submit the build to TestFlight:
   ```bash
   eas submit --platform ios --latest
   ```

2. Alternatively, you can specify a build:
   ```bash
   eas submit --platform ios --id [build-id]
   ```

3. The submission process will:
   - Upload your build to App Store Connect
   - Set up metadata
   - Submit for TestFlight review

4. Wait for Apple to process your build and approve it for TestFlight testing (usually 1-2 days).

## Step 8: Invite Testers

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app > TestFlight
3. Set up test groups and invite testers
4. Internal testers (Apple Developer team members) can test immediately
5. External testers require Apple's review before they can be invited

## Step 9: Update and Re-deploy

When you need to make updates:

1. Make your code changes
2. Update the version and/or build number in app.json
3. Run `eas build --platform ios --profile testflight` again
4. Submit the new build with `eas submit --platform ios --latest`

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check your Expo account dashboard for detailed build logs
   - Ensure all native dependencies are compatible
   - Verify your app.json configuration

2. **Submission Failures**
   - Verify your Apple Developer account has a valid membership
   - Check that your App Store Connect app is properly set up
   - Review the submission logs for specific errors

3. **TestFlight Rejection**
   - Ensure you have a valid Privacy Policy URL
   - Check that your app name and icons meet Apple's guidelines
   - Verify all required permission usage descriptions are provided

### Helpful Commands

- Check build status: `eas build:list`
- Cancel a build: `eas build:cancel`
- View build logs: `eas build:logs`
- Update credentials: `eas credentials`

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Expo iOS Distribution](https://docs.expo.dev/distribution/app-stores/)