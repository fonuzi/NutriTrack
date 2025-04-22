import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useFood } from '../context/FoodContext';
import FoodAnalysisResult from '../components/FoodAnalysisResult';

const CameraScreen = () => {
  const navigation = useNavigation();
  const { analyzeImage, saveMeal } = useFood();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setImageUri(photo.uri);
        setBase64Image(photo.base64 || null);
        analyzePhoto(photo.base64 || '');
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const analyzePhoto = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(base64);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Analysis Failed', 'Could not analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = async (mealType: string) => {
    if (!analysisResult || !imageUri) return;

    try {
      await saveMeal({
        name: analysisResult.name,
        calories: analysisResult.calories,
        protein: analysisResult.protein,
        carbs: analysisResult.carbs,
        fat: analysisResult.fat,
        mealType,
        imageUrl: imageUri,
        items: analysisResult.items,
      });

      // Reset state
      setImageUri(null);
      setBase64Image(null);
      setAnalysisResult(null);

      // Navigate back to the diary page
      navigation.navigate('Diary');
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Error', 'Failed to save the meal. Please try again.');
    }
  };

  const resetCamera = () => {
    setImageUri(null);
    setBase64Image(null);
    setAnalysisResult(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageUri && analysisResult ? (
        <FoodAnalysisResult
          imageUrl={imageUri}
          name={analysisResult.name}
          calories={analysisResult.calories}
          protein={analysisResult.protein}
          carbs={analysisResult.carbs}
          fat={analysisResult.fat}
          items={analysisResult.items}
          onSave={handleSaveMeal}
          onRetake={resetCamera}
        />
      ) : imageUri && isAnalyzing ? (
        <View style={styles.analysingContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.analysisOverlay}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.analysingText}>Analyzing food...</Text>
          </View>
        </View>
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ratio="4:3"
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.overlayContainer}>
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>
                  Point your camera at your food
                </Text>
              </View>
            </View>

            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
          </Camera>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  analysingContainer: {
    flex: 1,
    position: 'relative',
  },
  analysisOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    borderRadius: 8,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CameraScreen;