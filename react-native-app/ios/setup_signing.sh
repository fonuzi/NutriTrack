#!/bin/bash

# This script helps set up code signing for your PERFORMIZE app
# It should be run from the ios directory

# Text styling
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BOLD}PERFORMIZE iOS Code Signing Setup${NC}\n"
echo -e "This script will guide you through setting up code signing for TestFlight distribution.\n"

# Check if Xcode command line tools are installed
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}Error: Xcode command line tools not found.${NC}"
    echo "Please install Xcode command line tools with:"
    echo "  xcode-select --install"
    exit 1
fi

# Check if the Config.xcconfig file exists
if [ ! -f "Config.xcconfig" ]; then
    echo -e "${RED}Error: Config.xcconfig not found.${NC}"
    echo "Please make sure you're running this script from the ios directory."
    exit 1
fi

# Get the current team ID
CURRENT_TEAM_ID=$(grep "DEVELOPMENT_TEAM" Config.xcconfig | awk -F "=" '{print $2}' | tr -d ' ')

echo -e "${YELLOW}Step 1: Apple Developer Team ID${NC}"
echo -e "Your current Team ID is: ${BOLD}$CURRENT_TEAM_ID${NC}"
echo "You can find your Team ID in your Apple Developer account under Membership."
echo -n "Enter your Team ID (leave blank to keep current): "
read TEAM_ID

if [ ! -z "$TEAM_ID" ]; then
    # Update the Team ID in Config.xcconfig
    sed -i '' "s/DEVELOPMENT_TEAM = .*/DEVELOPMENT_TEAM = $TEAM_ID/" Config.xcconfig
    echo -e "${GREEN}Team ID updated to $TEAM_ID${NC}"
    
    # Also update it in ExportOptions.plist
    if [ -f "ExportOptions.plist" ]; then
        CURRENT_EXPORT_TEAM_ID=$(grep -A 1 "<key>teamID</key>" ExportOptions.plist | grep "<string>" | sed 's/<string>\(.*\)<\/string>/\1/')
        sed -i '' "s/<string>$CURRENT_EXPORT_TEAM_ID<\/string>/<string>$TEAM_ID<\/string>/" ExportOptions.plist
        echo -e "${GREEN}Team ID also updated in ExportOptions.plist${NC}"
    fi
else
    echo "Keeping current Team ID."
fi

echo -e "\n${YELLOW}Step 2: Bundle Identifier${NC}"
CURRENT_BUNDLE_ID=$(grep "PRODUCT_BUNDLE_IDENTIFIER" Config.xcconfig | awk -F "=" '{print $2}' | tr -d ' ')
echo -e "Your current Bundle ID is: ${BOLD}$CURRENT_BUNDLE_ID${NC}"
echo "This must match the App ID you created in your Apple Developer account."
echo -n "Enter your Bundle ID (leave blank to keep current): "
read BUNDLE_ID

if [ ! -z "$BUNDLE_ID" ]; then
    # Update the Bundle ID in Config.xcconfig
    sed -i '' "s/PRODUCT_BUNDLE_IDENTIFIER = .*/PRODUCT_BUNDLE_IDENTIFIER = $BUNDLE_ID/" Config.xcconfig
    echo -e "${GREEN}Bundle ID updated to $BUNDLE_ID${NC}"
    
    # Also update it in ExportOptions.plist if it exists
    if [ -f "ExportOptions.plist" ]; then
        sed -i '' "s/<key>$CURRENT_BUNDLE_ID<\/key>/<key>$BUNDLE_ID<\/key>/" ExportOptions.plist
        echo -e "${GREEN}Bundle ID also updated in ExportOptions.plist${NC}"
    fi
else
    BUNDLE_ID=$CURRENT_BUNDLE_ID
    echo "Keeping current Bundle ID."
fi

echo -e "\n${YELLOW}Step 3: App Version${NC}"
CURRENT_VERSION=$(grep "MARKETING_VERSION" Config.xcconfig | awk -F "=" '{print $2}' | tr -d ' ')
echo -e "Your current app version is: ${BOLD}$CURRENT_VERSION${NC}"
echo -n "Enter the app version (e.g. 1.0.0, leave blank to keep current): "
read APP_VERSION

if [ ! -z "$APP_VERSION" ]; then
    # Update the version in Config.xcconfig
    sed -i '' "s/MARKETING_VERSION = .*/MARKETING_VERSION = $APP_VERSION/" Config.xcconfig
    echo -e "${GREEN}App version updated to $APP_VERSION${NC}"
else
    echo "Keeping current app version."
fi

echo -e "\n${YELLOW}Step 4: Build Number${NC}"
CURRENT_BUILD=$(grep "CURRENT_PROJECT_VERSION" Config.xcconfig | awk -F "=" '{print $2}' | tr -d ' ')
echo -e "Your current build number is: ${BOLD}$CURRENT_BUILD${NC}"
echo "For TestFlight, this number must be incremented for each upload."
echo -n "Enter the build number (leave blank to increment by 1): "
read BUILD_NUMBER

if [ -z "$BUILD_NUMBER" ]; then
    # Increment the build number
    NEW_BUILD=$((CURRENT_BUILD + 1))
    sed -i '' "s/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = $NEW_BUILD/" Config.xcconfig
    echo -e "${GREEN}Build number incremented to $NEW_BUILD${NC}"
else
    # Set the specified build number
    sed -i '' "s/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = $BUILD_NUMBER/" Config.xcconfig
    echo -e "${GREEN}Build number set to $BUILD_NUMBER${NC}"
fi

echo -e "\n${GREEN}${BOLD}Code signing setup complete!${NC}"
echo -e "Next steps:"
echo "1. Open the workspace in Xcode:"
echo "   open performize.xcworkspace"
echo "2. In Xcode, select the 'performize' target"
echo "3. Go to 'Signing & Capabilities' tab"
echo "4. Make sure 'Automatically manage signing' is checked"
echo "5. Select your team from the dropdown"
echo "6. Fix any signing issues that Xcode identifies"
echo -e "\nWhen you're ready to archive for TestFlight:"
echo "   ./archive_for_testflight.sh"

# Make script executable
chmod +x $0

echo -e "\n${YELLOW}Would you like to open the workspace in Xcode now? (y/n)${NC} "
read OPEN_XCODE

if [[ $OPEN_XCODE == "y" || $OPEN_XCODE == "Y" ]]; then
    open performize.xcworkspace
fi