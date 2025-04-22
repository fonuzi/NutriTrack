import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing } from '../utils/theme';
import { formatCalories, formatRelativeTime } from '../utils/format';

interface FoodItem {
  name: string;
  amount: string;
  calories: number;
}

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  imageUrl: string;
  items: FoodItem[];
  date: string;
  gymId: number;
  userId: number;
}

interface RecentMealsListProps {
  meals: Food[];
  onMealPress?: (meal: Food) => void;
}

const RecentMealsList: React.FC<RecentMealsListProps> = ({ 
  meals,
  onMealPress,
}) => {
  if (meals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="clipboard" size={32} color={colors.textSecondary} />
        <Text style={styles.emptyText}>No recent meals</Text>
        <Text style={styles.emptySubtext}>
          Take a photo of your food to track it
        </Text>
      </View>
    );
  }
  
  const getMealTypeIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return 'coffee';
      case 'lunch':
        return 'sun';
      case 'dinner':
        return 'moon';
      case 'snack':
        return 'award';
      default:
        return 'utensils';
    }
  };
  
  const renderMealItem = ({ item }: { item: Food }) => (
    <TouchableOpacity 
      style={styles.mealItem}
      onPress={() => onMealPress && onMealPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.mealImage}
        resizeMode="cover"
      />
      
      <View style={styles.mealInfo}>
        <View style={styles.mealHeader}>
          <Feather 
            name={getMealTypeIcon(item.mealType)} 
            size={14} 
            color={colors.primary} 
            style={styles.mealTypeIcon}
          />
          <Text style={styles.mealType}>{item.mealType}</Text>
          <Text style={styles.mealTime}>{formatRelativeTime(item.date)}</Text>
        </View>
        
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealCalories}>{formatCalories(item.calories)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderMealItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  mealItem: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  mealImage: {
    width: 80,
    height: 80,
  },
  mealInfo: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTypeIcon: {
    marginRight: 4,
  },
  mealType: {
    ...typography.label,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  mealTime: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  mealName: {
    ...typography.body,
    color: colors.text,
    marginVertical: 4,
  },
  mealCalories: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

export default RecentMealsList;