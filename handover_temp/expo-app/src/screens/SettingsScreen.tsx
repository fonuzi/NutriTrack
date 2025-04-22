import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useGym } from '../context/GymContext';
import { useFood } from '../context/FoodContext';
import { useActivity } from '../context/ActivityContext';
import { colors, typography, spacing } from '../utils/theme';
import Header from '../components/Header';

const SettingsScreen: React.FC = () => {
  const { gym, updateGymName, updateGymLogo, updateGymPrimaryColor } = useGym();
  const { settings, updateSettings } = useFood();
  const { updateStepsGoal } = useActivity();
  
  const [gymName, setGymName] = useState(gym.name);
  const [calorieGoal, setCalorieGoal] = useState(settings.calorieGoal.toString());
  const [proteinGoal, setProteinGoal] = useState(settings.proteinGoal.toString());
  const [carbsGoal, setCarbsGoal] = useState(settings.carbsGoal.toString());
  const [fatGoal, setFatGoal] = useState(settings.fatGoal.toString());
  const [stepsGoal, setStepsGoal] = useState(settings.stepsGoal.toString());
  const [waterGoal, setWaterGoal] = useState(settings.waterGoal.toString());
  
  const handleSaveGymName = async () => {
    if (gymName.trim() === '') {
      Alert.alert('Error', 'Gym name cannot be empty');
      return;
    }
    
    try {
      await updateGymName(gymName);
      Alert.alert('Success', 'Gym name updated successfully');
    } catch (error) {
      console.error('Error updating gym name:', error);
      Alert.alert('Error', 'Failed to update gym name');
    }
  };
  
  const handlePickLogo = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'We need permission to access your photos');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        await updateGymLogo(result.assets[0].uri);
        Alert.alert('Success', 'Gym logo updated successfully');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update gym logo');
    }
  };
  
  const handleSaveGoals = async () => {
    try {
      // Validate inputs
      const newCalorieGoal = parseInt(calorieGoal);
      const newProteinGoal = parseInt(proteinGoal);
      const newCarbsGoal = parseInt(carbsGoal);
      const newFatGoal = parseInt(fatGoal);
      const newStepsGoal = parseInt(stepsGoal);
      const newWaterGoal = parseInt(waterGoal);
      
      if (isNaN(newCalorieGoal) || isNaN(newProteinGoal) || isNaN(newCarbsGoal) || 
          isNaN(newFatGoal) || isNaN(newStepsGoal) || isNaN(newWaterGoal)) {
        Alert.alert('Error', 'All goals must be valid numbers');
        return;
      }
      
      await updateSettings({
        calorieGoal: newCalorieGoal,
        proteinGoal: newProteinGoal,
        carbsGoal: newCarbsGoal,
        fatGoal: newFatGoal,
        stepsGoal: newStepsGoal,
        waterGoal: newWaterGoal,
      });
      
      await updateStepsGoal(newStepsGoal);
      
      Alert.alert('Success', 'Goals updated successfully');
    } catch (error) {
      console.error('Error updating goals:', error);
      Alert.alert('Error', 'Failed to update goals');
    }
  };
  
  const toggleNotifications = async (value: boolean) => {
    try {
      await updateSettings({
        notificationsEnabled: value,
      });
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };
  
  const toggleHealthKit = async (value: boolean) => {
    try {
      await updateSettings({
        healthKitEnabled: value,
      });
    } catch (error) {
      console.error('Error toggling HealthKit:', error);
    }
  };
  
  const toggleDataBackup = async (value: boolean) => {
    try {
      await updateSettings({
        dataBackupEnabled: value,
      });
    } catch (error) {
      console.error('Error toggling data backup:', error);
    }
  };
  
  const togglePreferredUnits = async () => {
    try {
      await updateSettings({
        preferredUnits: settings.preferredUnits === 'imperial' ? 'metric' : 'imperial',
      });
    } catch (error) {
      console.error('Error toggling preferred units:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.scrollView}>
        {/* Gym Branding Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gym Branding</Text>
          
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: gym.logo }} 
              style={styles.logo}
              resizeMode="cover"
            />
            
            <TouchableOpacity 
              style={styles.changeLogo}
              onPress={handlePickLogo}
            >
              <Feather name="edit-2" size={16} color={colors.primaryForeground} />
              <Text style={styles.changeLogoText}>Change Logo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gym Name</Text>
            <TextInput
              style={styles.input}
              value={gymName}
              onChangeText={setGymName}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
            />
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveGymName}
            >
              <Text style={styles.saveButtonText}>Save Name</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.colorRow}>
            <Text style={styles.inputLabel}>Primary Color</Text>
            <View style={styles.colorOptions}>
              {['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444'].map(color => (
                <TouchableOpacity 
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    gym.primaryColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => updateGymPrimaryColor(color)}
                />
              ))}
            </View>
          </View>
        </View>
        
        {/* Goals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Calorie Goal</Text>
            <TextInput
              style={styles.input}
              value={calorieGoal}
              onChangeText={setCalorieGoal}
              keyboardType="number-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Protein Goal (g)</Text>
            <TextInput
              style={styles.input}
              value={proteinGoal}
              onChangeText={setProteinGoal}
              keyboardType="number-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Carbs Goal (g)</Text>
            <TextInput
              style={styles.input}
              value={carbsGoal}
              onChangeText={setCarbsGoal}
              keyboardType="number-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fat Goal (g)</Text>
            <TextInput
              style={styles.input}
              value={fatGoal}
              onChangeText={setFatGoal}
              keyboardType="number-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Steps Goal</Text>
            <TextInput
              style={styles.input}
              value={stepsGoal}
              onChangeText={setStepsGoal}
              keyboardType="number-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Water Goal (glasses)</Text>
            <TextInput
              style={styles.input}
              value={waterGoal}
              onChangeText={setWaterGoal}
              keyboardType="number-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveGoals}
          >
            <Text style={styles.saveButtonText}>Save Goals</Text>
          </TouchableOpacity>
        </View>
        
        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Enable push notifications
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? colors.primaryForeground : ''}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Health Integration</Text>
              <Text style={styles.settingDescription}>
                Sync with Apple Health or Google Fit
              </Text>
            </View>
            <Switch
              value={settings.healthKitEnabled}
              onValueChange={toggleHealthKit}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? colors.primaryForeground : ''}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Data Backup</Text>
              <Text style={styles.settingDescription}>
                Automatically back up your data
              </Text>
            </View>
            <Switch
              value={settings.dataBackupEnabled}
              onValueChange={toggleDataBackup}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? colors.primaryForeground : ''}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Measurement Units</Text>
              <Text style={styles.settingDescription}>
                {settings.preferredUnits === 'imperial' ? 'Imperial (lbs, inches)' : 'Metric (kg, cm)'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={togglePreferredUnits}
            >
              <Text style={styles.toggleButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* About & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Feather name="help-circle" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Help & FAQ</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Feather name="mail" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Contact Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Feather name="info" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>About App</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Feather name="lock" size={20} color={colors.text} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.poweredByContainer}>
          <Text style={styles.poweredBy}>powered by PERFORMIZE</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.sm,
  },
  changeLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  changeLogoText: {
    ...typography.bodySmall,
    color: colors.primaryForeground,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorRow: {
    marginBottom: spacing.md,
  },
  colorOptions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: spacing.sm,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveButtonText: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  toggleButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  toggleButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.md,
  },
  poweredByContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  poweredBy: {
    ...typography.body,
    color: colors.textSecondary,
  },
  versionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default SettingsScreen;