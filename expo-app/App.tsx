import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GymProvider } from './src/context/GymContext';
import { FoodProvider } from './src/context/FoodContext';
import { ActivityProvider } from './src/context/ActivityContext';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import CameraScreen from './src/screens/CameraScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import icons
import TabBarIcon from './src/components/TabBarIcon';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <GymProvider>
        <FoodProvider>
          <ActivityProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{
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
                }}
              >
                <Tab.Screen 
                  name="Home" 
                  component={HomeScreen} 
                  options={{
                    tabBarIcon: ({ color }) => (
                      <TabBarIcon name="home" color={color} />
                    ),
                  }}
                />
                <Tab.Screen 
                  name="Diary" 
                  component={DiaryScreen} 
                  options={{
                    tabBarIcon: ({ color }) => (
                      <TabBarIcon name="book-open" color={color} />
                    ),
                  }}
                />
                <Tab.Screen 
                  name="Camera" 
                  component={CameraScreen} 
                  options={{
                    tabBarIcon: ({ color }) => (
                      <TabBarIcon name="camera" color={color} />
                    ),
                    headerShown: false,
                  }}
                />
                <Tab.Screen 
                  name="Progress" 
                  component={ProgressScreen} 
                  options={{
                    tabBarIcon: ({ color }) => (
                      <TabBarIcon name="bar-chart-2" color={color} />
                    ),
                  }}
                />
                <Tab.Screen 
                  name="Settings" 
                  component={SettingsScreen} 
                  options={{
                    tabBarIcon: ({ color }) => (
                      <TabBarIcon name="settings" color={color} />
                    ),
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </ActivityProvider>
        </FoodProvider>
      </GymProvider>
    </SafeAreaProvider>
  );
}