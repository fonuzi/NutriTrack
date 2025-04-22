import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useGym } from '../context/GymContext';

const Header = () => {
  const { gym } = useGym();

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: gym.logo }} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={styles.logoText}>{gym.name}</Text>
      </View>
      <View style={styles.poweredByContainer}>
        <Text style={styles.poweredByText}>powered by</Text>
        <Text style={styles.performizeText}>PERFORMIZE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  poweredByContainer: {
    alignItems: 'flex-end',
  },
  poweredByText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  performizeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Header;