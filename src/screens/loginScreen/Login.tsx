import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, TouchableOpacity, Image } from 'react-native';

const { width, height } = Dimensions.get('window');
const RADAR_SIZE = Math.min(width, height) * 0.6;
const RADAR_CENTER = RADAR_SIZE / 2;

interface Profile {
  id: number;
  name: string;
  age: number;
  distance: number;
  avatar: string;
  bio: string;
}

const Login = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Sample profiles data
  const sampleProfiles: Profile[] = [
    {
      id: 1,
      name: "Sarah",
      age: 25,
      distance: 2.3,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Love hiking and coffee ☕"
    },
    {
      id: 2,
      name: "Emma",
      age: 28,
      distance: 1.8,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Adventure seeker 🌍"
    },
    {
      id: 3,
      name: "Jessica",
      age: 24,
      distance: 3.1,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      bio: "Foodie and traveler 🍕"
    },
    {
      id: 4,
      name: "Amanda",
      age: 26,
      distance: 2.7,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      bio: "Yoga instructor 🧘‍♀️"
    }
  ];

  useEffect(() => {
    startRadarAnimation();
  }, []);

  const startRadarAnimation = () => {
    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startSearch = () => {
    setIsSearching(true);
    setCurrentProfile(null);
    
    // Animate radar scale
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Simulate finding profiles
    setTimeout(() => {
      const randomProfile = sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)];
      setCurrentProfile(randomProfile);
      setIsSearching(false);
    }, 2000);
  };

  const resetSearch = () => {
    setCurrentProfile(null);
    setIsSearching(false);
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ghosts on Radar</Text>
      
      {/* Radar Container */}
      <View style={styles.radarContainer}>
        {/* Radar Background */}
        <View style={styles.radarBackground}>
          {/* Radar circles */}
          {[1, 2, 3, 4].map((circle) => (
            <View
              key={circle}
              style={[
                styles.radarCircle,
                {
                  width: (RADAR_SIZE * circle) / 4,
                  height: (RADAR_SIZE * circle) / 4,
                  borderRadius: (RADAR_SIZE * circle) / 8,
                },
              ]}
            />
          ))}
          
          {/* Radar lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <View
              key={angle}
              style={[
                styles.radarLine,
                {
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          ))}
        </View>

        {/* Radar Sweep Wedge */}
        <Animated.Image
        source={require('../../../assets/images/RadarRange.png')}
          style={[
            styles.radarWedge,
            {
              transform: [
                { rotate: spin },
                { scale: scaleAnim },
              ],
            },
          ]}
        />
     
        {/* Pulse Effect */}
        <Animated.View
          style={[
            styles.pulseEffect,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Center Dot */}
        <View style={styles.centerDot} />

        {/* Profile Blips on Radar */}
        {currentProfile && (
          <View style={styles.profileBlip}>
            <Image source={require('../../../assets/images/birlaji.png')} style={styles.blipAvatar} />
            <View style={styles.blipPulse} />
          </View>
        )}

        {/* Search Status */}
        {isSearching && (
          <View style={styles.searchStatus}>
            <Text style={styles.searchText}>SCANNING...</Text>
            <View style={styles.loadingDots}>
              {[0, 1, 2].map((dot) => (
                <Animated.View
                  key={dot}
                  style={[
                    styles.loadingDot,
                    {
                      transform: [
                        {
                          scale: pulseAnim.interpolate({
                            inputRange: [1, 1.2],
                            outputRange: [0.8, 1.2],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.searchButton]}
          onPress={startSearch}
          disabled={isSearching}
        >
          <Text style={styles.controlButtonText}>
            {isSearching ? 'Scanning...' : 'Start Radar'}
          </Text>
        </TouchableOpacity>
        
        {currentProfile && (
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetSearch}
          >
            <Text style={styles.controlButtonText}>Stop Radar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FF00',
    marginBottom: 40,
    fontFamily: 'monospace',
    textShadowColor: '#00FF00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  radarContainer: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarBackground: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.4)',
    backgroundColor: 'transparent',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  radarLine: {
    position: 'absolute',
    width: 1,
    height: RADAR_SIZE ,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',

  },
  radarWedge: {
    position: 'absolute',
    width: RADAR_SIZE/2,
    height: RADAR_SIZE/2,
    left: 128,
    top: 128,
    transformOrigin: 'top-left',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  pulseEffect: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00',
    position: 'absolute',
  },
  profileBlip: {
    position: 'absolute',
    left: RADAR_CENTER + 50,
    top: RADAR_CENTER - 30,
  },
  blipAvatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  blipPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 25,
    // backgroundColor: 'rgba(0, 255, 0, 0.3)',
    top: -5,
    left: -5,
  },
  searchStatus: {
    position: 'absolute',
    top: RADAR_SIZE + 20,
    alignItems: 'center',
  },
  searchText: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00',
    marginHorizontal: 4,
  },

  controls: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 15,
  },
  controlButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#00FF00',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
  },
  controlButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;