import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { useFood } from '../context/FoodContext';
import FoodAnalysisModal from '../components/FoodAnalysisModal';

const CameraScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  
  const cameraRef = useRef<Camera | null>(null);
  const navigation = useNavigation();
  const { analyzeImage, saveMeal } = useFood();
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'We need camera access to analyze your food',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);
  
  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        // Resize and compress the image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        
        setCapturedImageUri(manipulatedImage.uri);
        
        // Analyze the image
        if (manipulatedImage.base64) {
          const result = await analyzeImage(manipulatedImage.base64);
          setAnalysisResult(result);
          setShowAnalysisModal(true);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture and analyze the image');
      } finally {
        setIsCapturing(false);
      }
    }
  };
  
  const saveMealData = async (mealType: string) => {
    if (analysisResult && capturedImageUri) {
      try {
        await saveMeal({
          name: analysisResult.name,
          calories: analysisResult.calories,
          protein: analysisResult.protein,
          carbs: analysisResult.carbs,
          fat: analysisResult.fat,
          mealType,
          imageUrl: capturedImageUri,
          items: analysisResult.items,
        });
        
        // Close modal and navigate back
        setShowAnalysisModal(false);
        navigation.goBack();
      } catch (error) {
        console.error('Error saving meal:', error);
        Alert.alert('Error', 'Failed to save meal data');
      }
    }
  };
  
  const toggleCameraType = () => {
    setCameraType(prev => 
      prev === CameraType.back ? CameraType.front : CameraType.back
    );
  };
  
  const toggleFlashMode = () => {
    setFlashMode(prev => 
      prev === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  };
  
  const closeAnalysisModal = () => {
    setShowAnalysisModal(false);
    setAnalysisResult(null);
    setCapturedImageUri(null);
  };
  
  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
      >
        <View style={styles.topControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={toggleFlashMode}
          >
            <Feather 
              name={flashMode === FlashMode.on ? "zap" : "zap-off"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.overlayMessage}>
          <Text style={styles.overlayText}>
            Take a photo of your food to analyze
          </Text>
        </View>
        
        <View style={styles.bottomControls}>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={toggleCameraType}
          >
            <Feather name="refresh-cw" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      
      {/* Analysis Modal */}
      {showAnalysisModal && analysisResult && (
        <FoodAnalysisModal
          visible={showAnalysisModal}
          result={analysisResult}
          imageUri={capturedImageUri}
          onSave={saveMealData}
          onClose={closeAnalysisModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingTop: Platform.OS === 'android' ? spacing.xl : 50,
  },
  overlayMessage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.md,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
});

export default CameraScreen;