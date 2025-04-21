import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useActivity } from '../context/ActivityContext';
import { useFood } from '../context/FoodContext';
import { colors, typography, spacing } from '../utils/theme';
import { LineChart } from 'react-native-chart-kit';
import Header from '../components/Header';

type Period = 'week' | 'month' | '3months';
type ChartType = 'calories' | 'steps' | 'weight';

const ProgressScreen: React.FC = () => {
  const [period, setPeriod] = useState<Period>('week');
  const [chartType, setChartType] = useState<ChartType>('calories');
  
  const { stepsStats } = useActivity();
  const { nutritionStats, weightStats } = useFood();
  
  const screenWidth = Dimensions.get('window').width - 40;
  
  // Generate dummy data for the charts
  // In a real app, this would come from the API
  const getChartData = () => {
    let labels: string[] = [];
    let data: number[] = [];
    
    // Based on the period and chart type, generate different data
    if (period === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      if (chartType === 'calories') {
        data = [2100, 1830, 1950, 2200, 1780, 2050, 1900];
      } else if (chartType === 'steps') {
        data = [8500, 9200, 7600, 10400, 8300, 11200, 9800];
      } else if (chartType === 'weight') {
        data = [172, 171.8, 171.5, 171.3, 171, 170.8, 170.5];
      }
    } else if (period === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      
      if (chartType === 'calories') {
        data = [1950, 1880, 1820, 1770];
      } else if (chartType === 'steps') {
        data = [9000, 9600, 10200, 10800];
      } else if (chartType === 'weight') {
        data = [172, 171, 170, 169];
      }
    } else if (period === '3months') {
      labels = ['Jan', 'Feb', 'Mar'];
      
      if (chartType === 'calories') {
        data = [2000, 1900, 1800];
      } else if (chartType === 'steps') {
        data = [8500, 9500, 10500];
      } else if (chartType === 'weight') {
        data = [180, 175, 170];
      }
    }
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => colors.primary,
          strokeWidth: 2,
        },
      ],
    };
  };
  
  const getChartTitle = () => {
    if (chartType === 'calories') {
      return 'Calories Consumed';
    } else if (chartType === 'steps') {
      return 'Daily Steps';
    } else if (chartType === 'weight') {
      return 'Weight';
    }
    return '';
  };
  
  const getChartYLabel = () => {
    if (chartType === 'calories') {
      return 'kcal';
    } else if (chartType === 'steps') {
      return 'steps';
    } else if (chartType === 'weight') {
      return 'lbs';
    }
    return '';
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Progress" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.chartTypeSelector}>
          <TouchableOpacity 
            style={[
              styles.chartTypeButton, 
              chartType === 'calories' && styles.activeChartTypeButton
            ]}
            onPress={() => setChartType('calories')}
          >
            <Feather 
              name="bar-chart-2" 
              size={18} 
              color={chartType === 'calories' ? colors.primaryForeground : colors.text} 
            />
            <Text 
              style={[
                styles.chartTypeText,
                chartType === 'calories' && styles.activeChartTypeText
              ]}
            >
              Calories
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.chartTypeButton, 
              chartType === 'steps' && styles.activeChartTypeButton
            ]}
            onPress={() => setChartType('steps')}
          >
            <Feather 
              name="activity" 
              size={18} 
              color={chartType === 'steps' ? colors.primaryForeground : colors.text} 
            />
            <Text 
              style={[
                styles.chartTypeText,
                chartType === 'steps' && styles.activeChartTypeText
              ]}
            >
              Steps
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.chartTypeButton, 
              chartType === 'weight' && styles.activeChartTypeButton
            ]}
            onPress={() => setChartType('weight')}
          >
            <Feather 
              name="trending-down" 
              size={18} 
              color={chartType === 'weight' ? colors.primaryForeground : colors.text} 
            />
            <Text 
              style={[
                styles.chartTypeText,
                chartType === 'weight' && styles.activeChartTypeText
              ]}
            >
              Weight
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            style={[styles.periodButton, period === 'week' && styles.activePeriodButton]}
            onPress={() => setPeriod('week')}
          >
            <Text 
              style={[
                styles.periodText,
                period === 'week' && styles.activePeriodText
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.periodButton, period === 'month' && styles.activePeriodButton]}
            onPress={() => setPeriod('month')}
          >
            <Text 
              style={[
                styles.periodText,
                period === 'month' && styles.activePeriodText
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.periodButton, period === '3months' && styles.activePeriodButton]}
            onPress={() => setPeriod('3months')}
          >
            <Text 
              style={[
                styles.periodText,
                period === '3months' && styles.activePeriodText
              ]}
            >
              3 Months
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Main Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{getChartTitle()}</Text>
          
          <LineChart
            data={getChartData()}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundGradientFrom: colors.cardBackground,
              backgroundGradientTo: colors.cardBackground,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: colors.primary,
              },
            }}
            bezier
            style={styles.chart}
            withVerticalLines={false}
            yAxisSuffix={` ${getChartYLabel()}`}
          />
        </View>
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {chartType === 'calories' && (
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Nutrition Stats</Text>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Avg. Daily Calories</Text>
                <Text style={styles.statValue}>{nutritionStats.avgCalories} kcal</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Avg. Daily Protein</Text>
                <Text style={styles.statValue}>{nutritionStats.avgProtein}g</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Carbs to Fat Ratio</Text>
                <Text style={styles.statValue}>{nutritionStats.carbsToFatRatio}</Text>
              </View>
            </View>
          )}
          
          {chartType === 'steps' && (
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Activity Stats</Text>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Daily Average</Text>
                <Text style={styles.statValue}>{stepsStats.dailyAverage.toLocaleString()} steps</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Weekly Total</Text>
                <Text style={styles.statValue}>{stepsStats.total.toLocaleString()} steps</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Calories Burned</Text>
                <Text style={styles.statValue}>{stepsStats.caloriesBurned.toLocaleString()} kcal</Text>
              </View>
            </View>
          )}
          
          {chartType === 'weight' && (
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Weight Stats</Text>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Starting Weight</Text>
                <Text style={styles.statValue}>{weightStats.starting} lbs</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Current Weight</Text>
                <Text style={styles.statValue}>{weightStats.current} lbs</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Change</Text>
                <Text style={[
                  styles.statValue, 
                  weightStats.change < 0 ? styles.positiveChange : styles.negativeChange
                ]}>
                  {weightStats.change > 0 ? '+' : ''}{weightStats.change} lbs ({weightStats.changePercent}%)
                </Text>
              </View>
            </View>
          )}
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
  chartTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: spacing.md,
  },
  chartTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  activeChartTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chartTypeText: {
    ...typography.bodySmall,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  activeChartTypeText: {
    color: colors.primaryForeground,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  periodButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  activePeriodButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  periodText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  activePeriodText: {
    color: colors.primary,
  },
  chartContainer: {
    backgroundColor: colors.cardBackground,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  chartTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 12,
  },
  statsContainer: {
    margin: spacing.md,
    marginTop: 0,
  },
  statsCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  statsTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    ...typography.body,
    color: colors.text,
  },
  statValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  positiveChange: {
    color: colors.success,
  },
  negativeChange: {
    color: colors.error,
  },
});

export default ProgressScreen;