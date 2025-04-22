import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing } from '../utils/theme';
import { formatCalories, formatMacro } from '../utils/format';

interface FoodItem {
  name: string;
  amount: string;
  calories: number;
}

interface FoodAnalysisResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: FoodItem[];
}

interface FoodAnalysisModalProps {
  visible: boolean;
  result: FoodAnalysisResult;
  imageUri: string | null;
  isLoading?: boolean;
  onSave: (mealType: string) => void;
  onClose: () => void;
}

const FoodAnalysisModal: React.FC<FoodAnalysisModalProps> = ({
  visible,
  result,
  imageUri,
  isLoading = false,
  onSave,
  onClose,
}) => {
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  
  const mealTypes = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
  ];
  
  const handleSave = () => {
    if (selectedMealType) {
      onSave(selectedMealType);
    }
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food Analysis</Text>
          <View style={{ width: 30 }} /> {/* For header alignment */}
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Analyzing your food...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
            {imageUri && (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.foodImage} 
                resizeMode="cover"
              />
            )}
            
            <View style={styles.resultContainer}>
              <Text style={styles.foodName}>{result.name}</Text>
              
              <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {formatCalories(result.calories)}
                  </Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {formatMacro(result.protein)}
                  </Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {formatMacro(result.carbs)}
                  </Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {formatMacro(result.fat)}
                  </Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
              
              {result.items && result.items.length > 0 && (
                <View style={styles.itemsContainer}>
                  <Text style={styles.sectionTitle}>Food Items</Text>
                  
                  {result.items.map((item, index) => (
                    <View key={index} style={styles.foodItem}>
                      <Text style={styles.foodItemName}>{item.name}</Text>
                      <View style={styles.foodItemDetails}>
                        <Text style={styles.foodItemAmount}>{item.amount}</Text>
                        <Text style={styles.foodItemCalories}>
                          {formatCalories(item.calories)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.mealTypeContainer}>
                <Text style={styles.sectionTitle}>Meal Type</Text>
                
                <View style={styles.mealTypesGrid}>
                  {mealTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.mealTypeButton,
                        selectedMealType === type && styles.selectedMealType,
                      ]}
                      onPress={() => setSelectedMealType(type)}
                    >
                      <Text 
                        style={[
                          styles.mealTypeText,
                          selectedMealType === type && styles.selectedMealTypeText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              !selectedMealType && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={!selectedMealType || isLoading}
          >
            <Text style={styles.saveButtonText}>Save to Journal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : spacing.md,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.headingSmall,
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  foodImage: {
    width: '100%',
    height: 200,
  },
  resultContainer: {
    padding: spacing.md,
  },
  foodName: {
    ...typography.headingMedium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  nutritionContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  nutritionLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
  },
  itemsContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  foodItem: {
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foodItemName: {
    ...typography.body,
    color: colors.text,
  },
  foodItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  foodItemAmount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  foodItemCalories: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  mealTypeContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.md,
  },
  mealTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  mealTypeButton: {
    width: '50%',
    padding: spacing.xs,
  },
  selectedMealType: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  mealTypeText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  selectedMealTypeText: {
    color: colors.primaryForeground,
    borderColor: colors.primary,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.secondary,
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
});

export default FoodAnalysisModal;