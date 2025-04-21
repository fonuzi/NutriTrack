import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useFood } from '../context/FoodContext';
import Header from '../components/Header';

const DiaryScreen = () => {
  const { getFoodsByDate, dailySummary } = useFood();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foods, setFoods] = useState<any[]>([]);

  // Load foods for the selected date whenever the screen is focused or date changes
  useFocusEffect(
    useCallback(() => {
      const fetchFoods = async () => {
        const foodsForDate = getFoodsByDate(selectedDate);
        setFoods(foodsForDate);
      };
      
      fetchFoods();
    }, [selectedDate, getFoodsByDate])
  );

  // Function to change the selected date
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Group foods by meal type
  const groupedFoods = foods.reduce((acc, food) => {
    const mealType = food.mealType || 'Other';
    if (!acc[mealType]) {
      acc[mealType] = [];
    }
    acc[mealType].push(food);
    return acc;
  }, {} as Record<string, any[]>);

  // Order of meal types
  const mealTypeOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other'];

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton}>
          <Icon name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        
        <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateButton}>
          <Icon name="chevron-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{dailySummary.calories}</Text>
            <Text style={styles.summaryLabel}>calories</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{dailySummary.protein}g</Text>
            <Text style={styles.summaryLabel}>protein</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{dailySummary.carbs}g</Text>
            <Text style={styles.summaryLabel}>carbs</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{dailySummary.fat}g</Text>
            <Text style={styles.summaryLabel}>fat</Text>
          </View>
        </View>
        
        <View style={styles.goalBar}>
          <View 
            style={[
              styles.goalProgress, 
              { 
                width: `${Math.min(100, Math.round((dailySummary.calories / dailySummary.caloriesGoal) * 100))}%`,
                backgroundColor: dailySummary.calories > dailySummary.caloriesGoal ? '#EF4444' : '#6366F1' 
              }
            ]} 
          />
        </View>
        
        <Text style={styles.goalText}>
          {dailySummary.caloriesGoal - dailySummary.calories > 0 
            ? `${dailySummary.caloriesGoal - dailySummary.calories} calories remaining`
            : `${dailySummary.calories - dailySummary.caloriesGoal} calories over limit`
          }
        </Text>
      </View>
      
      <ScrollView style={styles.foodsContainer}>
        {foods.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="book-open" size={32} color="#6B7280" />
            <Text style={styles.emptyStateText}>No meals logged</Text>
            <Text style={styles.emptyStateSubtext}>
              Use the camera button to log your meals
            </Text>
          </View>
        ) : (
          mealTypeOrder.map(mealType => {
            if (!groupedFoods[mealType] || groupedFoods[mealType].length === 0) {
              return null;
            }
            
            return (
              <View key={mealType} style={styles.mealSection}>
                <Text style={styles.mealTypeTitle}>{mealType}</Text>
                
                {groupedFoods[mealType].map(food => (
                  <View key={food.id} style={styles.foodItem}>
                    <Image 
                      source={{ uri: food.imageUrl || 'https://via.placeholder.com/80' }}
                      style={styles.foodImage}
                    />
                    
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodMacros}>
                        {food.protein}g P • {food.carbs}g C • {food.fat}g F
                      </Text>
                    </View>
                    
                    <Text style={styles.foodCalories}>{food.calories} cal</Text>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1F2937',
  },
  dateButton: {
    padding: 8,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  goalBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  goalProgress: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  goalText: {
    color: '#D1D5DB',
    fontSize: 14,
    textAlign: 'right',
  },
  foodsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 12,
  },
  emptyStateSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  mealSection: {
    marginBottom: 24,
  },
  mealTypeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  foodItem: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  foodName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  foodMacros: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  foodCalories: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DiaryScreen;