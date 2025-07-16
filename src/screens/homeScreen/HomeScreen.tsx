import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getThemeColors, useThemeColors } from '../../utils/AppColors'
import CommonInput from '../../components/CommonInput';
import { useForm } from 'react-hook-form';
import FaceVerificationScreen from '../FaceVerificationScreen';

const HomeScreen = () => {
  const colors = useThemeColors();
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    Alert.alert('Form Submitted', JSON.stringify(data));
  };


  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Text style={{}}>HomeScreen</Text>
      <CommonInput
        name="email"
        label="Email"
        control={control}
        keyboardType="email-address"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          },
        }}
      />
      <CommonInput
        name="phone"
        label="Phone"
        control={control}
        keyboardType="email-address"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          },
        }}
      />
      <FaceVerificationScreen/>
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})