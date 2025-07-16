import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BottomTabNavigation from './src/navigation/BottomTabNavigation'
import { NetworkProvider, useNetwork } from './src/service/NetworkService'
import NoNetworkScreen from './src/screens/NoNetworkScreen'
import SplashScreen from "react-native-splash-screen"
const Main = () => {
  const { isConnected, isInternetReachable } = useNetwork();
  if (!isConnected || isInternetReachable === false) {
    return <NoNetworkScreen />;
  }
  return <BottomTabNavigation />;
}

const App = () => {
  SplashScreen.hide()
  return (
    <NetworkProvider>
      <Main />
    </NetworkProvider>
  )
}

export default App

const styles = StyleSheet.create({})