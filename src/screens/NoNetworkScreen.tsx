import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoNetworkScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>No Internet Connection</Text>
      <Text style={styles.subtext}>Please check your network settings.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#888',
  },
});

export default NoNetworkScreen; 