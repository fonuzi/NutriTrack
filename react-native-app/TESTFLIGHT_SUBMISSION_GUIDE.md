# TestFlight Submission Guide for PERFORMIZE

This guide provides detailed step-by-step instructions with screenshots for submitting the PERFORMIZE app to TestFlight.

## Prerequisites

Before you begin, make sure you have:

- An Apple Developer account ($99/year)
- Xcode 14.0 or later installed on your Mac
- The PERFORMIZE app codebase
- Access to App Store Connect
- Your app binary compiled and ready to upload

## Step 1: Set Up App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)

2. Navigate to "Apps" and click the "+" button to add a new app

   ![Create New App](https://developer.apple.com/app-store-connect/images/adding-apps-1-create-app.jpg)

3. Fill in the details for your app:

   - Platforms: iOS
   - Name: PERFORMIZE
   - Primary language: English
   - Bundle ID: com.performize.app (or your custom bundle ID)
   - SKU: performize001 (or any unique identifier)
   - User Access: Full Access

4. Click "Create"

## Step 2: Complete App Information

1. In App Store Connect, go to the "App Information" section.

2. Fill in all required fields:
   - Privacy Policy URL (required)
   - Support URL
   - Marketing URL (optional)
   - App screenshots and description will be needed later for App Store, but aren't necessary for TestFlight

## Step 3: Configure TestFlight

1. Select the "TestFlight" tab

   ![TestFlight Tab](https://help.apple.com/app-store-connect/en.lproj/static/ScreenShots/en/AC-TF-TestingOverview.png)

2. Set up test groups (optional but recommended):
   - Click "Add Group" to create a testing group (e.g., "Internal Testers", "Gym Owners", etc.)
   - Add email addresses of testers to invite them

## Step 4: Configure Signing in Xcode

1. Open the PERFORMIZE project in Xcode:
   ```bash
   cd ios
   open performize.xcworkspace
   ```

2. Select the "performize" project in the navigator

3. Select the "performize" target (not the workspace)

4. Go to the "Signing & Capabilities" tab

   ![Signing & Capabilities](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/AppDistributionGuide/Art/4_exportworkflow_signing_2x.png)

5. Check "Automatically manage signing"

6. Select your Team from the dropdown

7. Xcode will automatically create and download the necessary provisioning profiles

## Step 5: Run the Signing Setup Script

1. From the project root, run:
   ```bash
   cd ios
   chmod +x setup_signing.sh
   ./setup_signing.sh
   ```

2. Follow the prompts to configure:
   - Team ID
   - Bundle ID
   - App Version
   - Build Number

## Step 6: Build and Archive the App

### Option 1: Using Xcode

1. In Xcode, select "Generic iOS Device" as the build target (not a simulator)

   ![Generic iOS Device](https://help.apple.com/xcode/mac/current/en.lproj/Art/debugmenu_device_2x.png)

2. Select Product > Archive from the menu

   ![Archive Menu](https://help.apple.com/xcode/mac/current/en.lproj/Art/archive_product_2x.png)

3. Wait for the archive process to complete (this can take several minutes)

### Option 2: Using the Archive Script

1. From the project root, run:
   ```bash
   cd ios
   chmod +x archive_for_testflight.sh
   ./archive_for_testflight.sh
   ```

2. The script will automatically handle pods installation, cleaning, archiving, and export

## Step 7: Upload to App Store Connect

### Option 1: Upload directly from Xcode

1. When archiving completes, the Organizer window will appear

   ![Organizer Window](https://help.apple.com/xcode/mac/current/en.lproj/Art/organizer_archives_2x.png)

2. Select the latest archive

3. Click "Distribute App"

4. Select "App Store Connect" and click "Next"

5. Select "Upload" and click "Next"

6. Select options for your app:
   - Include bitcode: No
   - Upload symbols: Yes
   - App Store icon already included: Yes

7. Click "Next" through any remaining screens

8. Review the upload information and click "Upload"

9. Wait for the upload to complete (this can take several minutes to an hour depending on your connection)

### Option 2: Upload with Application Loader

1. If you used the archive script, the IPA file will be in `ios/build/Export`

2. Open Xcode and select Xcode > Open Developer Tool > Application Loader

3. Click "Deliver Your App"

4. Sign in with your Apple ID

5. Click "Choose" and select the IPA file

6. Click "Next" and wait for the upload to complete

## Step 8: Wait for Processing

1. After uploading, the build will appear in App Store Connect's TestFlight tab as "Processing"

   ![Processing Build](https://help.apple.com/app-store-connect/en.lproj/static/ScreenShots/en/AC-TF-ViewBuildMetadata.png)

2. Processing typically takes 15-30 minutes

3. If there are any issues, you'll receive an email with details

## Step 9: Add Build to Testing Groups

1. Once processing is complete, go to the TestFlight tab in App Store Connect

2. Select your build

3. Click "Add to Group" and select the groups that should test this build

   ![Add to Group](https://help.apple.com/app-store-connect/en.lproj/static/ScreenShots/en/AC-TF-AddBuildToGroup.png)

4. Add information required for testing:
   - What to test
   - Instructions
   - Contact information

5. Click "Save"

## Step 10: Invite Testers

1. For external testers (non-team members), you'll need to submit the build for review first

2. For internal testers (team members), they will be notified automatically

3. Testers will receive an email with instructions to download TestFlight and install your app

## Troubleshooting Common Issues

### Missing Provisioning Profiles

If Xcode cannot create a provisioning profile automatically:

1. Go to the [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)
2. Create a distribution certificate if you don't have one
3. Create an App ID matching your bundle identifier
4. Create a distribution provisioning profile for that App ID
5. Download and double-click the provisioning profile to install it
6. In Xcode, uncheck and recheck "Automatically manage signing"

### Build Rejected by TestFlight

Common reasons for rejection:

1. **App crashes on launch**: Test thoroughly on a device before uploading
2. **Missing privacy policy**: Add a valid privacy policy URL in App Store Connect
3. **Incomplete metadata**: Ensure all required fields are completed
4. **Missing permission usage descriptions**: Check your Info.plist for proper descriptions

### Version and Build Number Issues

If you receive an error that your build number has already been used:

1. Run the setup script again: `./setup_signing.sh`
2. Increment the build number
3. Archive and upload again

## Next Steps

After your app is available on TestFlight:

1. Share the TestFlight link with your testers
2. Gather feedback through TestFlight or external channels
3. Fix issues and submit new builds as needed
4. When ready for the App Store, complete the remaining metadata in App Store Connect
5. Submit for App Store Review