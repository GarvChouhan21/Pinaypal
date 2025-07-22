import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import Login from '../screens/loginScreen/Login';
import FaceVarification from '../screens/faceVarification/FaceVarification';
// or use other icon library

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={Login} />
        <Tab.Screen name="face" component={FaceVarification} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigation;
