import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import FaceDetection from '@react-native-ml-kit/face-detection';

const FaceVarification = () => {
  const [cameraReady, setCameraReady] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [lastBlinkTime, setLastBlinkTime] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices?.[1]; // Front camera
  const blinkAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('Camera permission status:', hasPermission);
    console.log('Available devices:', devices);
    console.log('Selected device:', device);

    if (!hasPermission) {
      console.log('Requesting camera permission...');
      requestPermission();
    }

    // Test ML Kit initialization
    console.log('Testing ML Kit FaceDetection:', FaceDetection);
    console.log('FaceDetection.detect method:', typeof FaceDetection.detect);
  }, [hasPermission, requestPermission, devices, device]);

  useEffect(() => {
    if (blinkCount >= 3) {
      setVerificationComplete(true);
      Alert.alert('Success', 'Eye blink verification completed!');
    }
  }, [blinkCount]);

  const onCameraReady = () => {
    console.log('Camera is ready!');
    setCameraReady(true);
  };

  const onCameraError = (error: any) => {
    console.error('Camera error:', error);
    Alert.alert('Camera Error', 'Failed to start camera: ' + error.message);
  };

  const cameraRef = useRef<Camera>(null);

  const detectBlink = (faces: any[]) => {
    if (faces.length > 0) {
      setFaceDetected(true);
      const face = faces[0];

      // Check if eyes are closed based on eye landmarks
      if (face.leftEyeOpenProbability !== undefined && face.rightEyeOpenProbability !== undefined) {
        const leftEyeOpen = face.leftEyeOpenProbability > 0.5;
        const rightEyeOpen = face.rightEyeOpenProbability > 0.5;
        const eyesClosed = !leftEyeOpen && !rightEyeOpen;

        const currentTime = Date.now();
        const timeSinceLastBlink = currentTime - lastBlinkTime;

        // Detect blink (eyes closed for a short duration)
        if (eyesClosed && !isBlinking && timeSinceLastBlink > 1000) {
          setIsBlinking(true);
          setLastBlinkTime(currentTime);

          // Animate blink indicator
          Animated.sequence([
            Animated.timing(blinkAnimation, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(blinkAnimation, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();

          // Increment blink count
          setBlinkCount(prev => prev + 1);
          console.log('Blink detected! Count:', blinkCount + 1);
        } else if (!eyesClosed) {
          setIsBlinking(false);
        }
      }
    } else {
      setFaceDetected(false);
    }
  };

  const captureAndDetect = async () => {
    if (!cameraReady) {
      console.log('Camera not ready yet, skipping capture');
      return;
    }

    if (cameraRef.current) {
      try {
        setIsCapturing(true);
        console.log('Attempting to take photo...');
        const photo = await cameraRef.current.takePhoto();

        console.log('Photo captured successfully!');
        console.log('Photo path:', photo.path);
        console.log('Photo width:', photo.width);
        console.log('Photo height:', photo.height);

        // Convert file:// path to proper format for ML Kit
        const imagePath = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
        console.log('Image path for ML Kit:', imagePath);

        // Detect faces in the captured image
        const faces = await FaceDetection.detect(imagePath, {
          performanceMode: 'fast',
          landmarkMode: 'all',
          classificationMode: 'all',
          minFaceSize: 0.1,
        });

        console.log('Faces detected:', faces);
        console.log('Number of faces:', faces.length);

        if (faces.length > 0) {
          console.log('First face details:', {
            frame: faces[0].frame,
            leftEyeOpen: faces[0].leftEyeOpenProbability,
            rightEyeOpen: faces[0].rightEyeOpenProbability,
            landmarks: faces[0].landmarks ? Object.keys(faces[0].landmarks) : 'none'
          });
        }

        detectBlink(faces);
      } catch (error) {
        console.error('Error capturing photo:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
      } finally {
        setIsCapturing(false);
      }
    }
  };

  // Set up interval to capture and detect faces
  useEffect(() => {
    if (cameraReady && !verificationComplete) {
      console.log('Starting face detection interval...');
      const interval = setInterval(() => {
        console.log('Attempting to capture photo...');
        captureAndDetect();
      }, 2000); // Capture every 2 seconds to reduce load
      return () => clearInterval(interval);
    }
  }, [cameraReady, verificationComplete]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera Permission Required</Text>
        <Text style={styles.subtext}>Please grant camera permission to use this feature</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading Camera...</Text>
        <Text style={styles.subtext}>Available devices: {JSON.stringify(Object.keys(devices || {}))}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
          ref={cameraRef}
          onInitialized={onCameraReady}
          onError={onCameraError}
        />
      </View>

      {/* Overlay Container */}
      <View style={styles.overlayContainer}>

        {/* Header Overlay */}
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>PinayPal</Text>
          <Text style={styles.headerSubtitle}>Face Verification</Text>
        </View>

        {/* Instructions Overlay */}
        <View style={styles.instructionsOverlay}>
          <Text style={styles.instructionsText}>
            Align your face inside the frame and follow the instruction below. Your video won't be shared publicly.
          </Text>
        </View>

        {/* Face Frame Overlay */}




        {/* Blink Instructions Overlay */}
        <View style={styles.instructionOverlay}>
          <Text style={styles.instructionText}>
            {verificationComplete
              ? 'Verification Complete! ✅'
              : faceDetected
                ? `Please blink ${3 - blinkCount} more times`
                : 'Please blink your eyes slowly...'
            }
          </Text>
          <Text style={styles.blinkCount}>Blinks detected: {blinkCount}/3</Text>
        </View>

        {/* Ready Button */}
        <TouchableOpacity
          style={styles.readyButton}
          onPress={() => {
            if (!verificationComplete) {
              captureAndDetect();
            }
          }}
        >
          <Text style={styles.readyButtonText}>
            {verificationComplete ? 'Verification Complete!' : "I'm ready"}
          </Text>
        </TouchableOpacity>

        {/* Blink Indicator */}
        <Animated.View
          style={[
            styles.blinkIndicator,
            {
              opacity: blinkAnimation,
              transform: [{ scale: blinkAnimation }]
            }
          ]}
        >
          <Text style={styles.blinkIndicatorText}>👁️</Text>
        </Animated.View>



        {!cameraReady && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Initializing Camera...</Text>
          </View>
        )}
      </View>
      <View style={styles.overlayProgress}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    position: 'absolute',
    borderRadius: 100,
    overflow: 'hidden',
    transform: [{ scaleY: 1.4 }],
    borderWidth: 5,
    borderStyle: "dotted",
    borderColor: "white",
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    top: 240,
    width: 212,

  },

  camera: {
    right: 0,
    bottom: 0,
    width: 300,
    height: 200,
  },
  faceFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderStyle: 'dashed',
  },

  instructionOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  blinkCount: {
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  blinkIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blinkIndicatorText: {
    fontSize: 30,
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionsText: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressDots: {
    position: 'absolute',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: 0,
  },
  readyButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  readyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  subtext: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  bg: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  overlayProgress: {
    position: 'absolute',
    top: 240,
    left: 100,
    right: 0,
    bottom: 0,
    zIndex: 1,


    overflow: 'hidden',
    alignSelf: 'center',
    width: 212,
    height: 190,
    borderRadius: 100,
    transform: [{ scaleY: 1.5 }], // stretch vertically



  }
});

export default FaceVarification;