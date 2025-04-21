import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

// Context Providers
import { GymProvider } from './context/GymContext';
import { FoodProvider } from './context/FoodContext';
import { ActivityProvider } from './context/ActivityContext';

// Screens
import HomeScreen from './screens/HomeScreen';
import DiaryScreen from './screens/DiaryScreen';
import CameraScreen from './screens/CameraScreen';
import ProgressScreen from './screens/ProgressScreen';
import SettingsScreen from './screens/SettingsScreen';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Require cycle:',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <GymProvider>
        <FoodProvider>
          <ActivityProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ color, size }) => {
                    let iconName = 'home';

                    if (route.name === 'Home') {
                      iconName = 'home';
                    } else if (route.name === 'Diary') {
                      iconName = 'book-open';
                    } else if (route.name === 'Camera') {
                      iconName = 'camera';
                    } else if (route.name === 'Progress') {
                      iconName = 'bar-chart-2';
                    } else if (route.name === 'Settings') {
                      iconName = 'settings';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: '#6366F1',
                  tabBarInactiveTintColor: '#6B7280',
                  tabBarStyle: {
                    backgroundColor: '#111827',
                    borderTopColor: '#1F2937',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                  },
                  headerStyle: {
                    backgroundColor: '#111827',
                    shadowColor: 'transparent',
                    elevation: 0,
                  },
                  headerTintColor: '#FFFFFF',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                })}
              >
                <Tab.Screen 
                  name="Home" 
                  component={HomeScreen} 
                />
                <Tab.Screen 
                  name="Diary" 
                  component={DiaryScreen} 
                />
                <Tab.Screen 
                  name="Camera" 
                  component={CameraScreen} 
                  options={{
                    headerShown: false,
                  }}
                />
                <Tab.Screen 
                  name="Progress" 
                  component={ProgressScreen} 
                />
                <Tab.Screen 
                  name="Settings" 
                  component={SettingsScreen} 
                />
              </Tab.Navigator>
            </NavigationContainer>
          </ActivityProvider>
        </FoodProvider>
      </GymProvider>
    </SafeAreaProvider>
  );
};

export default App;