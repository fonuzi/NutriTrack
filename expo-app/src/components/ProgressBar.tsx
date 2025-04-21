import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: number;
  backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = colors.primary,
  height = 8,
  backgroundColor = colors.border,
}) => {
  // Ensure percentage is within 0-100 range
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${clampedPercentage}%`, 
            backgroundColor: color 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

export default ProgressBar;