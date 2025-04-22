import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useFood } from '../context/FoodContext';
import { useActivity } from '../context/ActivityContext';
import { useGym } from '../context/GymContext';
import Header from '../components/Header';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { dailySummary, recentMeals } = useFood();
  const { steps, stepsGoal } = useActivity();
  const { gym } = useGym();

  // Calculate progress percentages
  const caloriePercentage = Math.min(
    100,
    Math.round((dailySummary.calories / dailySummary.caloriesGoal) * 100)
  );
  const proteinPercentage = Math.min(
    100,
    Math.round((dailySummary.protein / dailySummary.proteinGoal) * 100)
  );
  const stepsPercentage = Math.min(
    100,
    Math.round((steps / stepsGoal) * 100)
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          
          {/* Calories */}
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Icon name="zap" size={18} color="#6366F1" />
              <Text style={styles.summaryLabel}>Calories</Text>
              <Text style={styles.summaryValue}>
                {dailySummary.calories} / {dailySummary.caloriesGoal}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${caloriePercentage}%` },
                  caloriePercentage > 100 ? styles.overLimit : null
                ]} 
              />
            </View>
          </View>
          
          {/* Protein */}
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Icon name="award" size={18} color="#6366F1" />
              <Text style={styles.summaryLabel}>Protein</Text>
              <Text style={styles.summaryValue}>
                {dailySummary.protein}g / {dailySummary.proteinGoal}g
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${proteinPercentage}%` }
                ]} 
              />
            </View>
          </View>
          
          {/* Steps */}
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Icon name="activity" size={18} color="#6366F1" />
              <Text style={styles.summaryLabel}>Steps</Text>
              <Text style={styles.summaryValue}>
                {steps.toLocaleString()} / {stepsGoal.toLocaleString()}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${stepsPercentage}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Camera')}
            >
              <Icon name="camera" size={24} color="#ffffff" />
              <Text style={styles.actionButtonText}>Scan Food</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Diary')}
            >
              <Icon name="book-open" size={24} color="#ffffff" />
              <Text style={styles.actionButtonText}>Diary</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Progress')}
            >
              <Icon name="bar-chart-2" size={24} color="#ffffff" />
              <Text style={styles.actionButtonText}>Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Recent Meals */}
        <View style={styles.recentMealsContainer}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          
          {recentMeals.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="coffee" size={32} color="#6B7280" />
              <Text style={styles.emptyStateText}>No recent meals</Text>
              <Text style={styles.emptyStateSubtext}>
                Meals you add will appear here
              </Text>
            </View>
          ) : (
            recentMeals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <Image 
                  source={{ uri: meal.imageUrl || 'https://via.placeholder.com/100' }} 
                  style={styles.mealImage} 
                />
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealType}>{meal.mealType}</Text>
                  <View style={styles.mealNutrition}>
                    <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                    <Text style={styles.mealMacros}>
                      {meal.protein}g P | {meal.carbs}g C | {meal.fat}g F
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  summaryContainer: {
    marginTop: 16,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  summaryItem: {
    marginBottom: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  summaryValue: {
    color: '#D1D5DB',
    fontSize: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  overLimit: {
    backgroundColor: '#EF4444',
  },
  actionsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '500',
  },
  recentMealsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mealImage: {
    width: 100,
    height: 100,
  },
  mealInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  mealName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealType: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  mealNutrition: {
    marginTop: 8,
  },
  mealCalories: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '600',
  },
  mealMacros: {
    color: '#D1D5DB',
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptyStateSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeScreen;