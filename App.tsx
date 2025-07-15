import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import SplashScreen from 'react-native-splash-screen';
const APP_ID = 'YOUR_APP_ID_HERE'; // from Agora Console
const STATIC_UID = 12345; // MUST match the UID used during token generation
const CHANNEL_NAME = 'test-room'; // Channel used when generating token
const TEMP_TOKEN = 'YOUR_TOKEN_HERE'; // Token must be valid & match APP_ID + UID + Channel

const App = () => {
  if (Platform.OS=='android') {
    SplashScreen.hide()
  }
  const [videoCall, setVideoCall] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [callActive, setCallActive] = useState(false);

  const connectionData = {
    appId: '2b4a171cd3464751a2ff1cabc0b46612', // ✅ Your App ID
    channel: 'temp_token', // ❗ Must be same as in token generator
    uid: 0, // ❗ Must match the UID used to generate the token
    token: '007eJxTYKjp5Xx5vZ/jiHzClGJpv9aLzjnHtgsVdz1ZYvPH68VDs5sKDEZJJomG5obJKcYmZibmpoaJRmlphsmJSckGSSZmZoZGUl9KMhoCGRliF85hYWSAQBCfi6EkNbcgviQ/OzWPgQEAU90i5Q=='
  };
  

  const rtcCallbacks = {
    EndCall: () => {
      console.log('Call ended');
      setVideoCall(false);
    },
    UserJoined: (uid) => {
      console.log('User joined:', uid);
    },
    UserOffline: (uid) => {
      console.log('User left:', uid);
    },
    Error: (err) => {
      console.error('Agora error:', err);
      if (err?.code === 110) {
        Alert.alert(
          'Error 110',
          'Token is invalid. Make sure:\n1. App Certificate is enabled\n2. UID matches\n3. Token is not expired'
        );
      } else {
        Alert.alert('Agora Error', JSON.stringify(err));
      }
      setVideoCall(false);
    },
    TokenPrivilegeWillExpire: () => {
      console.log('🔄 Token will expire soon. Refresh if needed.');
    },
  };

  const settings = {
    displayUsername: true,
    showButtonContainer: true,
    layout: 2,
    mode: 0,
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          setPermissionsGranted(true);
        } else {
          Alert.alert('Permissions Denied', 'Camera and microphone permissions are required.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setPermissionsGranted(true);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {!videoCall ? (
        <View style={styles.homeContainer}>
          <Text style={styles.title}>Agora Video Call</Text>
          <Text style={styles.info}>Channel: {CHANNEL_NAME}</Text>
          <Text style={styles.info}>UID: {STATIC_UID}</Text>
          <TouchableOpacity
            onPress={() => {
              if (!permissionsGranted) {
                Alert.alert('Permissions Required', 'Please grant permissions first');
                return;
              }
              if (!TEMP_TOKEN) {
                Alert.alert('Token Required', 'Please provide a valid token');
                return;
              }
              setVideoCall(true);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Join Call</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.videoContainer}>
         {videoCall && <AgoraUIKit
            connectionData={connectionData}
            rtcCallbacks={rtcCallbacks}
            settings={settings}
          />}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  homeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20,fontFamily:"Roboto-Italic" },
  info: { fontSize: 16, marginBottom: 10 },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  videoContainer: { flex: 1, backgroundColor: 'black' },
});

export default App;
