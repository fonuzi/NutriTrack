# TestFlight Distribution Guide for PERFORMIZE

This guide provides step-by-step instructions for preparing and distributing the PERFORMIZE app through TestFlight.

## Prerequisites

- An Apple Developer account ($99/year)
- Xcode 14.0 or later installed on a Mac
- Apple ID with two-factor authentication enabled
- The React Native PERFORMIZE app codebase

## 1. Clone and Set Up the Project

```bash
# Clone the repository
git clone [your-repository-url]
cd performize/react-native-app

# Install dependencies
npm install
```

## 2. Configure iOS Build Settings

### Update Config.xcconfig

Edit the `ios/Config.xcconfig` file:

```
PRODUCT_BUNDLE_IDENTIFIER = com.yourcompany.performize
MARKETING_VERSION = 1.0.0
CURRENT_PROJECT_VERSION = 1
DEVELOPMENT_TEAM = XXXXXXXXXX  # Replace with your Apple Developer Team ID
```

To find your Team ID:
1. Go to [Apple Developer Account](https://developer.apple.com/account)
2. Click "Membership" in the sidebar
3. Your Team ID appears in the Membership Information section

## 3. Set Up Signing Certificate and Provisioning Profile

### Automatic Signing (Easiest Method)

1. Open the project in Xcode:
   ```bash
   cd ios
   pod install
   open performize.xcworkspace
   ```

2. In Xcode:
   - Select the main project target "performize"
   - Go to "Signing & Capabilities" tab
   - Check "Automatic manage signing"
   - Select your Team from the dropdown

## 4. Create an App Record in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to "Apps" > "+" > "New App"
3. Fill in the details:
   - Platform: iOS
   - Name: PERFORMIZE
   - Bundle ID: com.yourcompany.performize
   - SKU: performize001 (or any unique identifier)
   - User Access: Full Access

## 5. Build the App for TestFlight

### Archive and Upload from Xcode

1. In Xcode, select the "performize" scheme
2. Set the device to "Any iOS Device (arm64)"
3. Select "Product" > "Archive"
4. When the archive is complete, click "Distribute App"
5. Select "App Store Connect" > "Upload"
6. Follow the prompts to complete the upload

### Alternative: Building with fastlane

If you prefer using fastlane (recommended for automation):

1. Install fastlane:
   ```bash
   brew install fastlane
   ```

2. Create a Fastfile in the ios directory:
   ```ruby
   default_platform(:ios)

   platform :ios do
     desc "Build and upload to TestFlight"
     lane :beta do
       increment_build_number
       build_app(workspace: "performize.xcworkspace", scheme: "performize")
       upload_to_testflight
     end
   end
   ```

3. Run fastlane:
   ```bash
   cd ios
   fastlane beta
   ```

## 6. TestFlight Processing

After upload:
1. Wait for the app to finish processing (can take 15-30 minutes)
2. Fix any issues reported by App Store Connect
3. Once processing is complete, the build will be available in TestFlight

## 7. Add Testers

### Internal Testers (Apple Developer Account Members)

1. In App Store Connect, go to the app > TestFlight > Internal Testing
2. Click "+" to add internal testers
3. Select testers from your team or invite new ones by email

### External Testers

1. Go to TestFlight > External Testing
2. Create a new group (e.g., "Beta Testers")
3. Add testers by email
4. Select the build to test
5. Complete the test information and submit for review (required for external testers)

## 8. Sending Invitations

- Internal testers: Invites are sent automatically
- External testers: Invites are sent after your app passes beta review

Testers will receive an email with instructions to:
1. Download the TestFlight app from the App Store
2. Use the redemption code to install your app

## 9. Updating Your App

To release new versions:
1. Increment the build number in the Config.xcconfig
2. Create a new build
3. Upload to TestFlight
4. Add the new build to your test groups

## 10. Resolving Common Issues

### Missing Provisioning Profiles
- Ensure Automatic Signing is enabled
- Check that your Apple Developer account has a valid membership

### Upload Failures
- Validate the build before uploading
- Check that your bundle identifier is unique
- Ensure all required app icons are included

### TestFlight Review Rejections
- Ensure Privacy Policy URL is valid
- Make sure app description accurately represents functionality
- Fix any crashes or major bugs

## 11. Going to Production

When you're ready to submit to the App Store:
1. Go to App Store Connect > App Store tab
2. Complete all required metadata
3. Upload screenshots
4. Submit for review

## Need Help?

Refer to Apple's official documentation:
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)