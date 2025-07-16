import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import CameraScreen from 'react-native-camera-kit';
import { useThemeColors } from '../utils/AppColors';

const { width, height } = Dimensions.get('window');

const FaceVerificationScreen = () => {
  const colors = useThemeColors();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  const onBottomButtonPressed = (event: any) => {
    const captureImages = JSON.stringify(event.captureImages);
    console.log('Capture Images:', captureImages);
  };

  const onFaceDetected = (event: any) => {
    console.log('Face detected:', event);
  };

  const onFacesDetected = (event: any) => {
    console.log('Faces detected:', event);
  };

  const handleRecordVideo = async () => {
    try {
      if (!isRecording) {
        setIsRecording(true);
        // Start recording logic will be handled by camera component
      } else {
        setIsRecording(false);
        // Stop recording logic will be handled by camera component
      }
    } catch (error) {
      console.error('Error with recording:', error);
      Alert.alert('Error', 'Failed to handle recording');
    }
  };

  const retakeVideo = () => {
    setRecordedVideo(null);
    setIsRecording(false);
  };

  const submitVideo = () => {
    if (recordedVideo) {
      Alert.alert('Success', 'Video submitted for verification!');
      // Here you would typically upload the video to your server
      console.log('Video to submit:', recordedVideo);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>PinayPal</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Face Verification</Text>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={[styles.instruction, { color: colors.text }]}>
          Align your face inside the frame and follow the instruction below. Your video won't be shared publicly.
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        {!recordedVideo ? (
          <View style={styles.cameraWrapper}>
            <CameraScreen
              ref={cameraRef}
              style={styles.camera}
              cameraType="front"
              flashMode="off"
              focusMode="on"
              zoomMode="on"
              saveToCameraRoll={false}
              saveToAppDirectory={true}
              showCaptureButton={false}
              showBottomButton={false}
              onBottomButtonPressed={onBottomButtonPressed}
              onFaceDetected={onFaceDetected}
              onFacesDetected={onFacesDetected}
              faceDetectionMode="accurate"
              faceDetectionLandmarks="all"
              faceDetectionClassifications="all"
              faceDetectionMinDetectionInterval={100}
              faceDetectionTrackingEnabled={true}
              onVideoRecorded={(event: any) => {
                console.log('Video recorded:', event);
                setRecordedVideo(event.uri);
                setIsRecording(false);
                Alert.alert('Success', 'Video recorded successfully!');
              }}
              onVideoRecordingStarted={() => {
                console.log('Video recording started');
              }}
              onVideoRecordingStopped={() => {
                console.log('Video recording stopped');
              }}
            />
            <View style={styles.faceFrame}>
              <View style={styles.frameCircle} />
            </View>
            <View style={styles.instructionOverlay}>
              <Text style={styles.liveInstruction}>Please blink your eyes slowly...</Text>
            </View>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <Text style={[styles.previewText, { color: colors.text }]}>
              Video recorded successfully!
            </Text>
            <Text style={[styles.previewSubtext, { color: colors.text }]}>
              Tap "Retake" to record again or "Submit" to continue
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {!recordedVideo ? (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isRecording ? '#FF6B6B' : '#8B5CF6' }
            ]}
            onPress={handleRecordVideo}
          >
            <Text style={styles.buttonText}>
              {isRecording ? 'Stop Recording' : 'I\'m ready'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.retakeButton]}
              onPress={retakeVideo}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={submitVideo}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  instructionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
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
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderStyle: 'dashed',
  },
  instructionOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  liveInstruction: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
  },
  previewText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  previewSubtext: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  retakeButton: {
    backgroundColor: '#6B7280',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    flex: 1,
  },
});

export default FaceVerificationScreen; 