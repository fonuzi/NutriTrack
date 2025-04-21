import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useGym } from '../context/GymContext';
import { useFood } from '../context/FoodContext';
import { useActivity } from '../context/ActivityContext';
import { colors, typography, spacing } from '../utils/theme';
import { formatCalories, formatMacro, calculatePercentage } from '../utils/format';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import StepCounter from '../components/StepCounter';
import RecentMealsList from '../components/RecentMealsList';

const HomeScreen: React.FC = () => {
  const { gym } = useGym();
  const { dailySummary, recentMeals } = useFood();
  const { steps, stepsGoal } = useActivity();
  
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionHeading}>Today's Summary</Text>
          
          {/* Calories */}
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Calories</Text>
              <Text style={styles.summaryValue}>
                {formatCalories(dailySummary.calories)} / {formatCalories(dailySummary.caloriesGoal)}
              </Text>
            </View>
            <ProgressBar 
              percentage={calculatePercentage(dailySummary.calories, dailySummary.caloriesGoal)} 
              color={colors.primary}
            />
          </View>
          
          {/* Protein */}
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Protein</Text>
              <Text style={styles.summaryValue}>
                {formatMacro(dailySummary.protein)} / {formatMacro(dailySummary.proteinGoal)}
              </Text>
            </View>
            <ProgressBar 
              percentage={calculatePercentage(dailySummary.protein, dailySummary.proteinGoal)} 
              color={colors.success}
            />
          </View>
          
          {/* Carbs */}
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Carbs</Text>
              <Text style={styles.summaryValue}>
                {formatMacro(dailySummary.carbs)} / {formatMacro(dailySummary.carbsGoal)}
              </Text>
            </View>
            <ProgressBar 
              percentage={calculatePercentage(dailySummary.carbs, dailySummary.carbsGoal)} 
              color={colors.warning}
            />
          </View>
          
          {/* Fat */}
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Fat</Text>
              <Text style={styles.summaryValue}>
                {formatMacro(dailySummary.fat)} / {formatMacro(dailySummary.fatGoal)}
              </Text>
            </View>
            <ProgressBar 
              percentage={calculatePercentage(dailySummary.fat, dailySummary.fatGoal)} 
              color="#F87171"
            />
          </View>
        </View>
        
        {/* Step Counter */}
        <StepCounter steps={steps} stepsGoal={stepsGoal} />
        
        {/* Recent Meals */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Recent Meals</Text>
          <RecentMealsList meals={recentMeals} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  sectionHeading: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryItem: {
    marginBottom: spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.label,
    color: colors.text,
  },
  summaryValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sectionContainer: {
    margin: spacing.md,
  },
});

export default HomeScreen;