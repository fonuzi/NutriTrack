import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useGym } from '../context/GymContext';
import { colors, typography, spacing } from '../utils/theme';

interface HeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  showBackButton = false, 
  onBackPress,
  title,
}) => {
  const { gym } = useGym();
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {showBackButton && onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        ) : (
          <Image 
            source={{ uri: gym.logo }} 
            style={styles.logo} 
            resizeMode="contain"
          />
        )}
        <Text style={styles.gymName}>{title || gym.name}</Text>
      </View>
      
      <Text style={styles.poweredBy}>powered by PERFORMIZE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: spacing.sm,
  },
  gymName: {
    ...typography.headingSmall,
    color: colors.text,
  },
  poweredBy: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 24,
  },
});

export default Header;