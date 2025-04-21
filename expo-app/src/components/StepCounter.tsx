import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing } from '../utils/theme';
import ProgressBar from './ProgressBar';
import { calculatePercentage } from '../utils/format';

interface StepCounterProps {
  steps: number;
  stepsGoal: number;
  onPress?: () => void;
}

const StepCounter: React.FC<StepCounterProps> = ({ 
  steps, 
  stepsGoal,
  onPress,
}) => {
  const stepProgress = calculatePercentage(steps, stepsGoal);
  const caloriesBurned = Math.round(steps * 0.04); // Rough estimate
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="activity" size={20} color={colors.primary} />
          <Text style={styles.title}>Step Counter</Text>
        </View>
        
        <Text style={styles.steps}>{steps.toLocaleString()}</Text>
      </View>
      
      <ProgressBar percentage={stepProgress} color={colors.primary} />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Goal: {stepsGoal.toLocaleString()} steps</Text>
        <Text style={styles.footerText}>Calories: ~{caloriesBurned} kcal</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.headingSmall,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  steps: {
    ...typography.headingSmall,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

export default StepCounter;