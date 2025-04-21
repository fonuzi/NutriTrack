import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';

type IconName = 'home' | 'book-open' | 'camera' | 'bar-chart-2' | 'settings';

interface TabBarIconProps {
  name: IconName;
  color: string;
  size?: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size = 24 }) => {
  return (
    <View style={{ marginTop: 5 }}>
      <Feather name={name} size={size} color={color} />
    </View>
  );
};

export default TabBarIcon;