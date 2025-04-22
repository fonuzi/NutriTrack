import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  FlatList,
  useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing } from '../utils/theme';
import { formatCalories } from '../utils/format';

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

interface MealSectionProps {
  title: string;
  foods: Food[];
  date: Date;
  mealType: string;
  onAddFood?: () => void;
}

const MealSection: React.FC<MealSectionProps> = ({ 
  title, 
  foods, 
  date, 
  mealType,
  onAddFood 
}) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  
  const handleAddFood = () => {
    if (onAddFood) {
      onAddFood();
    } else {
      // Navigate to camera with meal type pre-selected
      navigation.navigate('Camera' as never, { mealType } as never);
    }
  };
  
  const renderFoodItem = ({ item }: { item: Food }) => (
    <TouchableOpacity 
      style={styles.foodItem}
      onPress={() => {
        // Handle view food details
      }}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.foodImage}
        resizeMode="cover"
      />
      
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodCalories}>{formatCalories(item.calories)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Calculate if it's today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          {foods.length > 0 && (
            <Text style={styles.calories}>{formatCalories(totalCalories)}</Text>
          )}
        </View>
        
        {isToday(date) && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddFood}
          >
            <Feather name="plus" size={18} color={colors.primary} />
            <Text style={styles.addButtonText}>Add Food</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {foods.length > 0 ? (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFoodItem}
          scrollEnabled={false}
          contentContainerStyle={styles.foodList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No foods logged</Text>
          {isToday(date) && (
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={handleAddFood}
            >
              <Feather name="camera" size={16} color={colors.primary} />
              <Text style={styles.emptyAddButtonText}>Take Food Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.headingSmall,
    color: colors.text,
    marginRight: spacing.sm,
  },
  calories: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  addButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  foodList: {
    padding: spacing.sm,
  },
  foodItem: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  foodInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  foodName: {
    ...typography.body,
    color: colors.text,
  },
  foodCalories: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
});

export default MealSection;