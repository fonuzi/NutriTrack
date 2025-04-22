# iOS Integration Guide for PERFORMIZE

This guide provides information on integrating native iOS functionality with the PERFORMIZE React Native app.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Native Modules](#native-modules)
3. [Permissions](#permissions)
4. [Troubleshooting](#troubleshooting)
5. [Upgrading React Native](#upgrading-react-native)

## Project Structure

The iOS project is structured as follows:

```
react-native-app/ios/
├── performize/                  # Main app source
│   ├── AppDelegate.h            # App delegate header
│   ├── AppDelegate.m            # App delegate implementation
│   ├── AppDelegate.mm           # App delegate for new architecture 
│   ├── Info.plist               # App configuration and permissions
│   ├── LaunchScreen.storyboard  # Splash screen
│   ├── Images.xcassets/         # App icons and images
│   └── modules/                 # Native modules
├── performizeTests/             # Unit tests
├── Podfile                      # iOS dependencies
├── Config.xcconfig              # Build configuration
├── ExportOptions.plist          # TestFlight export configuration
├── archive_for_testflight.sh    # TestFlight archiving script
└── setup_signing.sh             # Signing configuration script
```

## Native Modules

### Adding a New Native Module

1. Create a new `.h` and `.m` (or `.mm`) files in the `modules` directory

2. Header file template:

```objc
#import <React/RCTBridgeModule.h>

@interface YourModuleName : NSObject <RCTBridgeModule>
// Properties and methods
@end
```

3. Implementation file template:

```objc
#import "YourModuleName.h"

@implementation YourModuleName

RCT_EXPORT_MODULE();

// Export methods to JavaScript
RCT_EXPORT_METHOD(methodName:(NSString *)param
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  // Implementation
  resolve(@{@"result": @"Success"});
}

@end
```

### Using Native Modules in JavaScript

```javascript
import { NativeModules } from 'react-native';

const { YourModuleName } = NativeModules;

// Use the module
async function callNativeMethod() {
  try {
    const result = await YourModuleName.methodName('param');
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

## Permissions

### Adding New Permissions

1. Open `Info.plist`

2. Add the required permission keys and usage descriptions:

```xml
<key>NSCameraUsageDescription</key>
<string>PERFORMIZE needs access to your camera to take photos of your food.</string>

<key>NSMotionUsageDescription</key>
<string>PERFORMIZE needs access to motion data to count your steps.</string>
```

3. Implement permission requesting in your React Native code:

```javascript
import { Platform, PermissionsAndroid } from 'react-native';

async function requestCameraPermission() {
  if (Platform.OS === 'ios') {
    // iOS handles permissions through Info.plist
    // Just try to use the camera and the system will prompt
    return true;
  } else {
    // Android requires explicit permission requests
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "PERFORMIZE needs access to your camera to take photos of your food.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Build Errors

1. **Missing dependencies:**
   ```
   pod install
   ```

2. **Incompatible React Native version:**
   Check that the React Native version in package.json matches the version in Podfile

3. **Code signing issues:**
   Run the signing setup script:
   ```
   ./setup_signing.sh
   ```

#### Runtime Errors

1. **App crashes on startup:**
   - Check crash logs in Xcode's Devices & Simulators window
   - Ensure all native modules are properly initialized
   - Check for missing required permissions

2. **Native modules not found:**
   - Ensure the module is properly exported with `RCT_EXPORT_MODULE()`
   - Check that the module name matches between Objective-C and JavaScript
   - Rebuild and reinstall the app

### Debugging Native Code

1. **Using Xcode debugger:**
   - Open the workspace in Xcode
   - Set breakpoints in your native code
   - Run the app from Xcode on a simulator or device

2. **Logging:**
   - In Objective-C: `NSLog(@"Debug message: %@", value);`
   - In JavaScript: `console.log('Debug message:', value);`
   - View logs in Xcode console or with `react-native log-ios`

## Upgrading React Native

1. Install the React Native upgrade helper:
   ```
   npm install -g react-native-git-upgrade
   ```

2. Run the upgrade command:
   ```
   react-native-git-upgrade
   ```

3. Resolve any conflicts in iOS native code

4. Update the Podfile if needed:
   ```
   cd ios
   pod update
   ```

5. Clean and rebuild:
   ```
   cd ios
   rm -rf build
   pod install
   cd ..
   npx react-native run-ios
   ```

## Resources

- [React Native iOS Documentation](https://reactnative.dev/docs/native-modules-ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)