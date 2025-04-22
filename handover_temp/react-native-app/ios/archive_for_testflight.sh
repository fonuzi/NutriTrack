#!/bin/bash

# Script to archive and export the app for TestFlight submission
# This script should be run from the ios directory of your project

# Set variables
APP_NAME="performize"
SCHEME_NAME="performize"
CONFIGURATION="Release"
WORKSPACE_NAME="$APP_NAME.xcworkspace"
ARCHIVE_PATH="./build/$APP_NAME.xcarchive"
EXPORT_PATH="./build/Export"
EXPORT_OPTIONS_PLIST="./ExportOptions.plist"

# Echo all commands
set -x

# Create export options plist if it doesn't exist
if [ ! -f $EXPORT_OPTIONS_PLIST ]; then
  cat > $EXPORT_OPTIONS_PLIST << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>method</key>
	<string>app-store</string>
	<key>teamID</key>
	<string>XXXXXXXXXX</string>
	<key>signingStyle</key>
	<string>automatic</string>
	<key>stripSwiftSymbols</key>
	<true/>
	<key>uploadBitcode</key>
	<false/>
	<key>uploadSymbols</key>
	<true/>
</dict>
</plist>
EOF
  echo "Created ExportOptions.plist"
fi

# Make sure the build directory exists
mkdir -p ./build

# Install pods if needed
if [ ! -d "Pods" ]; then
  echo "Installing Pods..."
  pod install
fi

# Clean previous build
xcodebuild clean -workspace "$WORKSPACE_NAME" -scheme "$SCHEME_NAME" -configuration "$CONFIGURATION"

# Archive the project
echo "Archiving project..."
xcodebuild archive \
  -workspace "$WORKSPACE_NAME" \
  -scheme "$SCHEME_NAME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  -destination generic/platform=iOS

# Check if archive was successful
if [ $? -ne 0 ]; then
  echo "Archive failed"
  exit 1
fi

# Export the archive
echo "Exporting archive for TestFlight..."
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS_PLIST" \
  -exportPath "$EXPORT_PATH"

# Check if export was successful
if [ $? -ne 0 ]; then
  echo "Export failed"
  exit 1
fi

echo "App successfully exported for TestFlight at $EXPORT_PATH"
echo "You can now upload the .ipa file to App Store Connect using Application Loader or Transporter."

# Make the script executable
chmod +x $0