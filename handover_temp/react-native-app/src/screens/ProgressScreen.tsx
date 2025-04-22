import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';
import { useFood } from '../context/FoodContext';
import { useActivity } from '../context/ActivityContext';
import Header from '../components/Header';

const ProgressScreen = () => {
  const { nutritionStats, weightStats } = useFood();
  const { stepsStats } = useActivity();
  const [activeChart, setActiveChart] = useState<'nutrition' | 'steps' | 'weight'>('nutrition');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | '3months'>('week');

  // Dummy data for charts
  const nutritionData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [1800, 1650, 2200, 1900, 1750, 2100, 1800],
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Calories"]
  };

  const stepsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [8200, 7500, 9100, 6800, 8500, 10200, 7800],
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Steps"]
  };

  const weightData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [172, 171.5, 171, 171, 170.5, 170, 169.5],
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Weight (lbs)"]
  };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#1F2937',
    backgroundGradientTo: '#1F2937',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#6366F1',
    },
  };

  // Render the active chart
  const renderChart = () => {
    const screenWidth = Dimensions.get('window').width - 32;
    let data;
    let yAxisSuffix = '';
    
    switch (activeChart) {
      case 'nutrition':
        data = nutritionData;
        yAxisSuffix = ' cal';
        break;
      case 'steps':
        data = stepsData;
        break;
      case 'weight':
        data = weightData;
        yAxisSuffix = ' lbs';
        break;
    }
    
    return (
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix={yAxisSuffix}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeChart === 'nutrition' && styles.activeToggle
            ]}
            onPress={() => setActiveChart('nutrition')}
          >
            <Text style={[
              styles.toggleText,
              activeChart === 'nutrition' && styles.activeToggleText
            ]}>
              Nutrition
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeChart === 'steps' && styles.activeToggle
            ]}
            onPress={() => setActiveChart('steps')}
          >
            <Text style={[
              styles.toggleText,
              activeChart === 'steps' && styles.activeToggleText
            ]}>
              Steps
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeChart === 'weight' && styles.activeToggle
            ]}
            onPress={() => setActiveChart('weight')}
          >
            <Text style={[
              styles.toggleText,
              activeChart === 'weight' && styles.activeToggleText
            ]}>
              Weight
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.timeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.timeToggleButton,
              timePeriod === 'week' && styles.activeTimeToggle
            ]}
            onPress={() => setTimePeriod('week')}
          >
            <Text style={[
              styles.timeToggleText,
              timePeriod === 'week' && styles.activeTimeToggleText
            ]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timeToggleButton,
              timePeriod === 'month' && styles.activeTimeToggle
            ]}
            onPress={() => setTimePeriod('month')}
          >
            <Text style={[
              styles.timeToggleText,
              timePeriod === 'month' && styles.activeTimeToggleText
            ]}>
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timeToggleButton,
              timePeriod === '3months' && styles.activeTimeToggle
            ]}
            onPress={() => setTimePeriod('3months')}
          >
            <Text style={[
              styles.timeToggleText,
              timePeriod === '3months' && styles.activeTimeToggleText
            ]}>
              3 Months
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          {renderChart()}
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>
            {activeChart === 'nutrition'
              ? 'Nutrition Stats'
              : activeChart === 'steps'
              ? 'Activity Stats'
              : 'Weight Stats'}
          </Text>
          
          {activeChart === 'nutrition' && (
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Icon name="zap" size={20} color="#6366F1" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Avg. Calories</Text>
                  <Text style={styles.statValue}>{nutritionStats.avgCalories} cal/day</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="award" size={20} color="#6366F1" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Avg. Protein</Text>
                  <Text style={styles.statValue}>{nutritionStats.avgProtein}g/day</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="pie-chart" size={20} color="#6366F1" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Carbs to Fat Ratio</Text>
                  <Text style={styles.statValue}>{nutritionStats.carbsToFatRatio}</Text>
                </View>
              </View>
            </View>
          )}
          
          {activeChart === 'steps' && (
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Icon name="activity" size={20} color="#6366F1" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Daily Average</Text>
                  <Text style={styles.statValue}>{stepsStats.dailyAverage.toLocaleString()} steps</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="trending-up" size={20} color="#6366F1" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Total Steps</Text>
                  <Text style={styles.statValue}>{stepsStats.total.toLocaleString()} steps</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="zap" size={20} color="#6366F1" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Calories Burned</Text>
                  <Text style={styles.statValue}>{stepsStats.caloriesBurned} calories</Text>
                </View>
              </View>
            </View>
          )}
          
          {activeChart === 'weight' && (
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Icon name="flag" size={20} color="#6366F1" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Starting Weight</Text>
                  <Text style={styles.statValue}>{weightStats.starting} lbs</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="check-circle" size={20} color="#6366F1" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Current Weight</Text>
                  <Text style={styles.statValue}>{weightStats.current} lbs</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="trending-down" size={20} color="#10B981" style={styles.statIcon} />
                <View>
                  <Text style={styles.statLabel}>Change</Text>
                  <Text style={[
                    styles.statValue,
                    weightStats.change < 0 ? styles.positiveChange : weightStats.change > 0 ? styles.negativeChange : null
                  ]}>
                    {weightStats.change > 0 ? '+' : ''}{weightStats.change} lbs ({weightStats.changePercent}%)
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    padding: 4,
    borderRadius: 8,
    margin: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#374151',
  },
  toggleText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  timeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  timeToggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeTimeToggle: {
    backgroundColor: '#6366F1',
  },
  timeToggleText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  activeTimeToggleText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
    marginHorizontal: 16,
  },
  statsContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContent: {
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 12,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
});

export default ProgressScreen;