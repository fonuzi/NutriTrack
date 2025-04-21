# PERFORMIZE React Native App

A mobile fitness and nutrition tracking application designed for gym owners, offering AI-powered insights and engaging user experience.

## Features

- Food analysis using OpenAI's GPT-4o model
- Calorie and nutrition tracking
- Activity tracking and progress visualization
- Dark mode UI
- Customizable gym branding

## Prerequisites

- Node.js >= 18
- npm or yarn
- React Native development environment set up
- For iOS: macOS with Xcode
- For Android: Android Studio with SDK

## Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd performize/react-native-app
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Install pods (iOS only):
```bash
cd ios && pod install && cd ..
```

4. Add your OpenAI API key:
- Create a `.env` file in the project root
- Add your key: `OPENAI_API_KEY=your_api_key_here`

## Running the App

### iOS:
```bash
npm run ios
# or
yarn ios
```

### Android:
```bash
npm run android
# or
yarn android
```

### Metro server:
```bash
npm start
# or
yarn start
```

## Project Structure

- `/src`: Main source code
  - `/api`: API integrations (OpenAI, etc.)
  - `/components`: Reusable UI components
  - `/context`: React Context providers for state management
  - `/screens`: App screens
  - `/utils`: Utility functions

## Dependencies

- React Native
- OpenAI API
- React Navigation
- React Native Camera
- React Native Chart Kit
- React Native Vector Icons
- Async Storage