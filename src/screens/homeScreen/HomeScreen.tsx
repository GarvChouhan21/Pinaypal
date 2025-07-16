import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getThemeColors, useThemeColors } from '../../utils/AppColors'

const HomeScreen = () => {
  const colors = useThemeColors();

  return (
    <View style={{backgroundColor:colors.background,flex:1}}>
      <Text style={{}}>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})