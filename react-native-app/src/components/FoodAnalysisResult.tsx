import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface FoodItem {
  name: string;
  amount: string;
  calories: number;
}

interface FoodAnalysisResultProps {
  imageUrl: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: FoodItem[];
  onSave: (mealType: string) => void;
  onRetake: () => void;
}

const FoodAnalysisResult = ({
  imageUrl,
  name,
  calories,
  protein,
  carbs,
  fat,
  items,
  onSave,
  onRetake,
}: FoodAnalysisResultProps) => {
  const [mealTypeModalVisible, setMealTypeModalVisible] = useState(false);

  const handleSave = (mealType: string) => {
    setMealTypeModalVisible(false);
    onSave(mealType);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onRetake} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Analysis</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: imageUrl }} style={styles.foodImage} />

        <View style={styles.resultCard}>
          <Text style={styles.foodName}>{name}</Text>

          <View style={styles.nutritionSummary}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{calories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{protein}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{carbs}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{fat}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>

          {items.length > 0 && (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>Food Items</Text>
              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemAmount}>{item.amount}</Text>
                  </View>
                  <Text style={styles.itemCalories}>{item.calories} cal</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={onRetake}
        >
          <Icon name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.retakeButtonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setMealTypeModalVisible(true)}
        >
          <Icon name="save" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Meal</Text>
        </TouchableOpacity>
      </View>

      {/* Meal Type Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={mealTypeModalVisible}
        onRequestClose={() => setMealTypeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Meal Type</Text>
            
            <TouchableOpacity
              style={styles.mealTypeButton}
              onPress={() => handleSave('Breakfast')}
            >
              <Icon name="sun" size={20} color="#6366F1" />
              <Text style={styles.mealTypeText}>Breakfast</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.mealTypeButton}
              onPress={() => handleSave('Lunch')}
            >
              <Icon name="clock" size={20} color="#6366F1" />
              <Text style={styles.mealTypeText}>Lunch</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.mealTypeButton}
              onPress={() => handleSave('Dinner')}
            >
              <Icon name="moon" size={20} color="#6366F1" />
              <Text style={styles.mealTypeText}>Dinner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.mealTypeButton}
              onPress={() => handleSave('Snack')}
            >
              <Icon name="coffee" size={20} color="#6366F1" />
              <Text style={styles.mealTypeText}>Snack</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.mealTypeButton, styles.cancelButton]}
              onPress={() => setMealTypeModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#1F2937',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  foodImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  resultCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  foodName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  nutritionDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#4B5563',
  },
  itemsContainer: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
  },
  itemsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  itemAmount: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  itemCalories: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  mealTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  mealTypeText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  cancelButton: {
    justifyContent: 'center',
    backgroundColor: '#4B5563',
    marginTop: 6,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default FoodAnalysisResult;