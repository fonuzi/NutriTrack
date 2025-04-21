#!/bin/bash

# Text styling
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BOLD}PERFORMIZE TestFlight Setup Script${NC}\n"
echo -e "This script will guide you through setting up your Expo app for TestFlight submission.\n"

# Step 1: Check if Node.js and npm are installed
echo -e "${YELLOW}Step 1: Checking Node.js and npm...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ Node.js version: $NODE_VERSION${NC}"
echo -e "${GREEN}✓ npm version: $NPM_VERSION${NC}"

# Step 2: Install EAS CLI globally
echo -e "\n${YELLOW}Step 2: Installing EAS CLI...${NC}"
if ! command -v eas &> /dev/null; then
    echo "Installing EAS CLI globally..."
    npm install -g eas-cli
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to install EAS CLI.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ EAS CLI installed successfully${NC}"
else
    EAS_VERSION=$(eas --version)
    echo -e "${GREEN}✓ EAS CLI is already installed (version $EAS_VERSION)${NC}"
fi

# Step 3: Install project dependencies
echo -e "\n${YELLOW}Step 3: Installing project dependencies...${NC}"
echo "Running npm install..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed successfully${NC}"

# Step 4: Check for react-native-dotenv
echo -e "\n${YELLOW}Step 4: Checking for react-native-dotenv...${NC}"
if ! grep -q "react-native-dotenv" package.json; then
    echo "Installing react-native-dotenv..."
    npm install --save-dev react-native-dotenv
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to install react-native-dotenv.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ react-native-dotenv installed successfully${NC}"
else
    echo -e "${GREEN}✓ react-native-dotenv is already installed${NC}"
fi

# Step 5: Check for .env file
echo -e "\n${YELLOW}Step 5: Checking for .env file...${NC}"
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "OPENAI_API_KEY=your_api_key_here" > .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️ Remember to replace 'your_api_key_here' with your actual OpenAI API key${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
    if ! grep -q "OPENAI_API_KEY" .env; then
        echo "OPENAI_API_KEY=your_api_key_here" >> .env
        echo -e "${YELLOW}⚠️ Added OPENAI_API_KEY to .env file. Remember to replace 'your_api_key_here' with your actual OpenAI API key${NC}"
    fi
fi

# Step 6: Check for babel.config.js configuration
echo -e "\n${YELLOW}Step 6: Checking babel.config.js...${NC}"
if ! grep -q "react-native-dotenv" babel.config.js; then
    echo "Updating babel.config.js to support environment variables..."
    # Create a temporary file with the updated content
    cat > babel.config.js.tmp << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
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
    ],
  };
};
EOF
    # Replace the original file
    mv babel.config.js.tmp babel.config.js
    echo -e "${GREEN}✓ babel.config.js updated successfully${NC}"
else
    echo -e "${GREEN}✓ babel.config.js already configured for environment variables${NC}"
fi

# Step 7: Check for eas.json
echo -e "\n${YELLOW}Step 7: Checking for eas.json...${NC}"
if [ ! -f "eas.json" ]; then
    echo "Creating eas.json..."
    cat > eas.json << 'EOF'
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
EOF
    echo -e "${GREEN}✓ eas.json created${NC}"
    echo -e "${YELLOW}⚠️ Remember to update your Apple ID, App Store Connect App ID, and Apple Team ID in eas.json${NC}"
else
    echo -e "${GREEN}✓ eas.json already exists${NC}"
fi

# Step 8: Check for app.json iOS configuration
echo -e "\n${YELLOW}Step 8: Checking app.json iOS configuration...${NC}"
if ! grep -q "buildNumber" app.json; then
    echo "Updating app.json with iOS build configuration..."
    
    # This is a basic update that may need to be refined
    # A proper solution would parse and modify the JSON
    sed -i.bak 's/"ios": {/"ios": {\
      "buildNumber": "1",/g' app.json
    rm app.json.bak
    
    echo -e "${GREEN}✓ Added buildNumber to app.json${NC}"
fi

if ! grep -q "usesNonExemptEncryption" app.json; then
    echo "Adding usesNonExemptEncryption configuration..."
    
    # This is a basic update that may need to be refined
    # A proper solution would parse and modify the JSON
    sed -i.bak 's/"infoPlist": {/"infoPlist": {\
        "NSCameraUsageDescription": "We need access to your camera to take photos of your food for analysis.",\
        "NSPhotoLibraryUsageDescription": "We need access to your photo library to select gym logos and food images.",\
        "NSMotionUsageDescription": "We need access to motion data to track your steps."\
      },\
      "config": {\
        "usesNonExemptEncryption": false\
      /g' app.json
    rm app.json.bak
    
    echo -e "${GREEN}✓ Added usesNonExemptEncryption to app.json${NC}"
else
    echo -e "${GREEN}✓ app.json already has the necessary iOS configurations${NC}"
fi

# Step 9: EAS Login and Setup
echo -e "\n${YELLOW}Step 9: EAS Login${NC}"
echo -e "You need to login to your Expo account to use EAS Build."
echo -n "Would you like to login now? (y/n): "
read LOGIN_CHOICE

if [[ $LOGIN_CHOICE == "y" || $LOGIN_CHOICE == "Y" ]]; then
    eas login
    echo -e "\n${GREEN}✓ EAS login completed${NC}"
else
    echo -e "\n${YELLOW}⚠️ Skipping EAS login. Remember to login before building.${NC}"
    echo "You can login later with: eas login"
fi

# Final instructions
echo -e "\n${GREEN}${BOLD}TestFlight setup completed!${NC}"
echo -e "\nNext steps:"
echo "1. Update the .env file with your OpenAI API key"
echo "2. Edit eas.json with your Apple Developer account details:"
echo "   - appleId: Your Apple ID email"
echo "   - ascAppId: Your App Store Connect App ID"
echo "   - appleTeamId: Your Apple Developer Team ID"
echo "3. Build your app for TestFlight with:"
echo "   eas build --platform ios --profile testflight"
echo "4. Submit to TestFlight:"
echo "   eas submit --platform ios --latest"
echo ""
echo "For more details, see EXPO_TESTFLIGHT_GUIDE.md"

# Make the script executable
chmod +x $0