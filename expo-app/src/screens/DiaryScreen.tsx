import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { colors, typography, spacing } from '../utils/theme';
import { useFood } from '../context/FoodContext';
import Header from '../components/Header';
import MealSection from '../components/MealSection';

const DiaryScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { getFoodsByDate } = useFood();
  
  // Get foods for the selected date
  const foods = getFoodsByDate(selectedDate);
  
  // Group foods by meal type
  const breakfastFoods = foods.filter(food => 
    food.mealType.toLowerCase() === 'breakfast'
  );
  
  const lunchFoods = foods.filter(food => 
    food.mealType.toLowerCase() === 'lunch'
  );
  
  const dinnerFoods = foods.filter(food => 
    food.mealType.toLowerCase() === 'dinner'
  );
  
  const snackFoods = foods.filter(food => 
    food.mealType.toLowerCase() === 'snack'
  );
  
  // Reload foods when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // If you need to perform any additional data loading
      // you could do it here
    }, [])
  );
  
  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const showPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };
  
  const showNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    // Don't allow selecting future dates
    if (nextDay <= new Date()) {
      setSelectedDate(nextDay);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Food Diary" />
      
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={showPreviousDay}>
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {format(selectedDate, "EEEE, MMMM d")}
          </Text>
          <Feather name="calendar" size={16} color={colors.text} style={styles.calendarIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={showNextDay}
          disabled={
            new Date(selectedDate).setHours(0, 0, 0, 0) >= 
            new Date().setHours(0, 0, 0, 0)
          }
        >
          <Feather 
            name="chevron-right" 
            size={24} 
            color={
              new Date(selectedDate).setHours(0, 0, 0, 0) >= 
              new Date().setHours(0, 0, 0, 0) 
                ? colors.textSecondary 
                : colors.text
            } 
          />
        </TouchableOpacity>
      </View>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
      
      <ScrollView style={styles.scrollView}>
        <MealSection 
          title="Breakfast" 
          foods={breakfastFoods} 
          date={selectedDate}
          mealType="breakfast"
        />
        
        <MealSection 
          title="Lunch" 
          foods={lunchFoods} 
          date={selectedDate}
          mealType="lunch"
        />
        
        <MealSection 
          title="Dinner" 
          foods={dinnerFoods} 
          date={selectedDate}
          mealType="dinner"
        />
        
        <MealSection 
          title="Snacks" 
          foods={snackFoods} 
          date={selectedDate}
          mealType="snack"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  calendarIcon: {
    marginLeft: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
});

export default DiaryScreen;