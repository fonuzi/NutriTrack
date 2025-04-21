# Native Modules for PERFORMIZE

This directory contains native iOS modules that provide functionality for the PERFORMIZE app.

## StepCounterModule

The StepCounterModule leverages CoreMotion to track steps on iOS devices. This provides more accurate and power-efficient step counting compared to JavaScript-only solutions.

### Usage in React Native

```javascript
import { NativeModules, NativeEventEmitter } from 'react-native';

const { StepCounterModule } = NativeModules;
const stepCounterEmitter = new NativeEventEmitter(StepCounterModule);

// Check if step counting is available on the device
const checkAvailability = async () => {
  try {
    const isAvailable = await StepCounterModule.isStepCountingAvailable();
    console.log(`Step counting available: ${isAvailable}`);
    return isAvailable;
  } catch (error) {
    console.error('Error checking step counter availability:', error);
    return false;
  }
};

// Start tracking steps
const startTracking = async () => {
  try {
    const result = await StepCounterModule.startTracking();
    console.log('Step tracking started:', result);
    return result;
  } catch (error) {
    console.error('Error starting step counter:', error);
    throw error;
  }
};

// Stop tracking steps
const stopTracking = async () => {
  try {
    const result = await StepCounterModule.stopTracking();
    console.log('Step tracking stopped:', result);
    return result;
  } catch (error) {
    console.error('Error stopping step counter:', error);
    throw error;
  }
};

// Get step count for today
const getStepsForToday = async () => {
  try {
    const data = await StepCounterModule.getStepCountForToday();
    console.log('Steps today:', data);
    return data;
  } catch (error) {
    console.error('Error getting today\'s steps:', error);
    throw error;
  }
};

// Listen for step count updates
const subscribeToStepUpdates = (callback) => {
  const subscription = stepCounterEmitter.addListener('StepCountUpdate', (data) => {
    callback(data);
  });
  
  return subscription;
};

// Example usage:
useEffect(() => {
  const init = async () => {
    const available = await checkAvailability();
    if (available) {
      await startTracking();
      const subscription = subscribeToStepUpdates((data) => {
        console.log('New step count:', data.steps);
        // Update UI with step count
      });
      
      // Clean up
      return () => {
        subscription.remove();
        stopTracking();
      };
    }
  };
  
  init();
}, []);
```

### Permissions

To use the step counter, add the following to your Info.plist:

```xml
<key>NSMotionUsageDescription</key>
<string>PERFORMIZE needs access to motion data to count your steps and track activity.</string>
```

### Adding More Native Modules

To add more native modules:

1. Create a header (.h) and implementation (.m) file in this directory
2. Follow the RCTBridgeModule protocol
3. Import and register the module in your AppDelegate if necessary
4. Access it from React Native using NativeModules