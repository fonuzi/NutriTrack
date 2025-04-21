import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useFood } from '../context/FoodContext';
import { useActivity } from '../context/ActivityContext';
import { useGym } from '../context/GymContext';
import Header from '../components/Header';

const SettingsScreen = () => {
  const { settings, updateSettings } = useFood();
  const { updateStepsGoal } = useActivity();
  const { gym, updateGymName, updateGymLogo, updateGymPrimaryColor } = useGym();
  
  const [activeSection, setActiveSection] = useState<'account' | 'goals' | 'app' | 'gym'>('account');
  const [tempSettings, setTempSettings] = useState({ ...settings });
  const [tempGym, setTempGym] = useState({ ...gym });
  
  // Function to handle saving all settings
  const saveSettings = async () => {
    try {
      // Update food settings
      await updateSettings({
        calorieGoal: tempSettings.calorieGoal,
        proteinGoal: tempSettings.proteinGoal,
        carbsGoal: tempSettings.carbsGoal,
        fatGoal: tempSettings.fatGoal,
        waterGoal: tempSettings.waterGoal,
        preferredUnits: tempSettings.preferredUnits,
        notificationsEnabled: tempSettings.notificationsEnabled,
        healthKitEnabled: tempSettings.healthKitEnabled,
        dataBackupEnabled: tempSettings.dataBackupEnabled,
      });
      
      // Update steps goal
      await updateStepsGoal(tempSettings.stepsGoal);
      
      // Update gym settings
      if (tempGym.name !== gym.name) {
        await updateGymName(tempGym.name);
      }
      if (tempGym.logo !== gym.logo) {
        await updateGymLogo(tempGym.logo);
      }
      if (tempGym.primaryColor !== gym.primaryColor) {
        await updateGymPrimaryColor(tempGym.primaryColor);
      }
      
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };
  
  const selectImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
      });
      
      if (result.assets && result.assets[0]?.uri) {
        setTempGym({
          ...tempGym,
          logo: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  // Toggle switches for boolean settings
  const toggleSetting = (setting: keyof typeof tempSettings) => {
    if (typeof tempSettings[setting] === 'boolean') {
      setTempSettings({
        ...tempSettings,
        [setting]: !tempSettings[setting],
      });
    }
  };
  
  // Numeric input handler
  const handleNumericInput = (value: string, setting: keyof typeof tempSettings) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setTempSettings({
        ...tempSettings,
        [setting]: numericValue,
      });
    } else if (value === '') {
      setTempSettings({
        ...tempSettings,
        [setting]: 0,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeSection === 'account' && styles.activeTab]}
          onPress={() => setActiveSection('account')}
        >
          <Icon 
            name="user" 
            size={20} 
            color={activeSection === 'account' ? '#FFFFFF' : '#9CA3AF'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeSection === 'goals' && styles.activeTab]}
          onPress={() => setActiveSection('goals')}
        >
          <Icon 
            name="target" 
            size={20} 
            color={activeSection === 'goals' ? '#FFFFFF' : '#9CA3AF'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeSection === 'app' && styles.activeTab]}
          onPress={() => setActiveSection('app')}
        >
          <Icon 
            name="settings" 
            size={20} 
            color={activeSection === 'app' ? '#FFFFFF' : '#9CA3AF'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeSection === 'gym' && styles.activeTab]}
          onPress={() => setActiveSection('gym')}
        >
          <Icon 
            name="home" 
            size={20} 
            color={activeSection === 'gym' ? '#FFFFFF' : '#9CA3AF'} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {activeSection === 'account' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            <View style={styles.settingGroup}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Units</Text>
                <View style={styles.unitsToggle}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      tempSettings.preferredUnits === 'imperial' && styles.activeUnitButton
                    ]}
                    onPress={() => setTempSettings({
                      ...tempSettings,
                      preferredUnits: 'imperial'
                    })}
                  >
                    <Text style={[
                      styles.unitButtonText,
                      tempSettings.preferredUnits === 'imperial' && styles.activeUnitButtonText
                    ]}>
                      Imperial
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      tempSettings.preferredUnits === 'metric' && styles.activeUnitButton
                    ]}
                    onPress={() => setTempSettings({
                      ...tempSettings,
                      preferredUnits: 'metric'
                    })}
                  >
                    <Text style={[
                      styles.unitButtonText,
                      tempSettings.preferredUnits === 'metric' && styles.activeUnitButtonText
                    ]}>
                      Metric
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        
        {activeSection === 'goals' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Nutrition Goals</Text>
            
            <View style={styles.settingGroup}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Daily Calorie Goal</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={tempSettings.calorieGoal.toString()}
                  onChangeText={(value) => handleNumericInput(value, 'calorieGoal')}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Protein Goal (g)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={tempSettings.proteinGoal.toString()}
                  onChangeText={(value) => handleNumericInput(value, 'proteinGoal')}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Carbs Goal (g)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={tempSettings.carbsGoal.toString()}
                  onChangeText={(value) => handleNumericInput(value, 'carbsGoal')}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Fat Goal (g)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={tempSettings.fatGoal.toString()}
                  onChangeText={(value) => handleNumericInput(value, 'fatGoal')}
                />
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Activity Goals</Text>
            
            <View style={styles.settingGroup}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Daily Steps Goal</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={tempSettings.stepsGoal.toString()}
                  onChangeText={(value) => handleNumericInput(value, 'stepsGoal')}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Water Intake Goal (cups)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={tempSettings.waterGoal.toString()}
                  onChangeText={(value) => handleNumericInput(value, 'waterGoal')}
                />
              </View>
            </View>
          </View>
        )}
        
        {activeSection === 'app' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            <View style={styles.settingGroup}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Switch
                  value={tempSettings.notificationsEnabled}
                  onValueChange={() => toggleSetting('notificationsEnabled')}
                  trackColor={{ false: '#374151', true: '#6366F1' }}
                  thumbColor={tempSettings.notificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Health App Integration</Text>
                <Switch
                  value={tempSettings.healthKitEnabled}
                  onValueChange={() => toggleSetting('healthKitEnabled')}
                  trackColor={{ false: '#374151', true: '#6366F1' }}
                  thumbColor={tempSettings.healthKitEnabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Data Backup</Text>
                <Switch
                  value={tempSettings.dataBackupEnabled}
                  onValueChange={() => toggleSetting('dataBackupEnabled')}
                  trackColor={{ false: '#374151', true: '#6366F1' }}
                  thumbColor={tempSettings.dataBackupEnabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
            
            <View style={styles.settingGroup}>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutTitle}>About PERFORMIZE</Text>
                <Text style={styles.aboutText}>
                  Version 1.0.0
                </Text>
                <Text style={styles.aboutText}>
                  © 2025 PERFORMIZE. All rights reserved.
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {activeSection === 'gym' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Gym Branding</Text>
            
            <View style={styles.settingGroup}>
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: tempGym.logo }}
                  style={styles.logo}
                />
                <TouchableOpacity
                  style={styles.changeLogoButton}
                  onPress={selectImage}
                >
                  <Text style={styles.changeLogoText}>Change Logo</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Gym Name</Text>
                <TextInput
                  style={styles.input}
                  value={tempGym.name}
                  onChangeText={(value) => setTempGym({
                    ...tempGym,
                    name: value
                  })}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Primary Color</Text>
                <View style={styles.colorPickerContainer}>
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#6366F1' },
                      tempGym.primaryColor === '#6366F1' && styles.selectedColor
                    ]}
                    onPress={() => setTempGym({
                      ...tempGym,
                      primaryColor: '#6366F1'
                    })}
                  />
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#EF4444' },
                      tempGym.primaryColor === '#EF4444' && styles.selectedColor
                    ]}
                    onPress={() => setTempGym({
                      ...tempGym,
                      primaryColor: '#EF4444'
                    })}
                  />
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#10B981' },
                      tempGym.primaryColor === '#10B981' && styles.selectedColor
                    ]}
                    onPress={() => setTempGym({
                      ...tempGym,
                      primaryColor: '#10B981'
                    })}
                  />
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#F59E0B' },
                      tempGym.primaryColor === '#F59E0B' && styles.selectedColor
                    ]}
                    onPress={() => setTempGym({
                      ...tempGym,
                      primaryColor: '#F59E0B'
                    })}
                  />
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: '#8B5CF6' },
                      tempGym.primaryColor === '#8B5CF6' && styles.selectedColor
                    ]}
                    onPress={() => setTempGym({
                      ...tempGym,
                      primaryColor: '#8B5CF6'
                    })}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#374151',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingGroup: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#374151',
    color: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 120,
    textAlign: 'center',
  },
  unitsToggle: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 6,
    overflow: 'hidden',
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeUnitButton: {
    backgroundColor: '#6366F1',
  },
  unitButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  activeUnitButtonText: {
    color: '#FFFFFF',
  },
  aboutItem: {
    padding: 16,
  },
  aboutTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aboutText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  logoContainer: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  changeLogoButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changeLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  colorPickerContainer: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 4,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  saveButtonContainer: {
    padding: 16,
    backgroundColor: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;