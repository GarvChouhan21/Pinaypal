import { StyleSheet, Text, View, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  RecordBackType,
  PlayBackType,
} from 'react-native-audio-recorder-player';

const requestAudioPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'This app needs access to your microphone to record audio.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    // NOTE: For Android 13+ you may also need to request READ_MEDIA_AUDIO or READ_EXTERNAL_STORAGE
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const HomeScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedFile, setRecordedFile] = useState<string | null>(null);
  const [status, setStatus] = useState('Idle');

  // Recording
  const onStartRecord = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      console.warn('Microphone permission denied');
      return;
    }
    setStatus('Recording...');
    setIsRecording(true);
    AudioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      // Optionally update UI with e.currentPosition
    });
    try {
      const result = await AudioRecorderPlayer.startRecorder(undefined, {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: 'aac', // fixed: use string value instead of AVEncodingOption.aac
      });
      setRecordedFile(result);
      console.log('Recording started:', result);
      // Log the file path for debugging
      console.log('Recorded file path:', result);
    } catch (error) {
      setIsRecording(false);
      setStatus('Idle');
      console.error('startRecorder failed:', error);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await AudioRecorderPlayer.stopRecorder();
      AudioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setStatus('Recording stopped');
      // Do NOT setRecordedFile(result) here!
      console.log('Recording stopped:', result);
      // Log the file path for debugging
      // The file path remains as set from startRecorder
    } catch (error) {
      setIsRecording(false);
      setStatus('Idle');
      console.error('stopRecorder failed:', error);
    }
  };

  // Playback
  const onStartPlay = async () => {
    if (!recordedFile) {
      setStatus('No recording to play');
      return;
    }
    setStatus('Playing...');
    setIsPlaying(true);
    AudioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
      if (e.currentPosition >= e.duration) {
        onStopPlay();
      }
    });
    try {
      console.log('Trying to play file:', recordedFile);
      await AudioRecorderPlayer.startPlayer(recordedFile);
      console.log('Playback started');
    } catch (error) {
      setIsPlaying(false);
      setStatus('Idle');
      console.error('startPlayer failed:', error, 'File:', recordedFile);
    }
  };

  const onStopPlay = async () => {
    try {
      await AudioRecorderPlayer.stopPlayer();
      AudioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      setStatus('Playback stopped');
    } catch (error) {
      setIsPlaying(false);
      setStatus('Idle');
      console.error('stopPlayer failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{status}</Text>
      <View style={styles.buttonRow}>
        {/* Record/Stop Button */}
        <TouchableOpacity
          style={[styles.button, isRecording && styles.buttonActive]}
          onPress={isRecording ? onStopRecord : onStartRecord}
          disabled={isPlaying}
        >
          <Text style={styles.buttonIcon}>{isRecording ? '⏹️' : '🎤'}</Text>
          <Text style={styles.buttonLabel}>{isRecording ? 'Stop' : 'Record'}</Text>
        </TouchableOpacity>
        {/* Play/Stop Button */}
        <TouchableOpacity
          style={[styles.button, isPlaying && styles.buttonActive, !recordedFile && styles.buttonDisabled]}
          onPress={isPlaying ? onStopPlay : onStartPlay}
          disabled={isRecording || !recordedFile}
        >
          <Text style={styles.buttonIcon}>{isPlaying ? '⏹️' : '▶️'}</Text>
          <Text style={styles.buttonLabel}>{isPlaying ? 'Stop' : 'Play'}</Text>
        </TouchableOpacity>
      </View>
      {/* Show the file path for debugging */}
      {recordedFile && (
        <Text style={{ fontSize: 12, color: '#888', marginTop: 20, textAlign: 'center' }}>
          File: {recordedFile}
        </Text>
      )}
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 30,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'column',
    minWidth: 90,
  },
  buttonActive: {
    backgroundColor: '#cce5ff',
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
    opacity: 0.6,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  buttonLabel: {
    fontSize: 16,
    color: '#333',
  },
});