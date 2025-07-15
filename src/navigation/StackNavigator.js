import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import homescreen from '../screens/homescreen'; 
import TransferScreen from '../screens/TransferScreen';
import Transfaredetailscreen from '../screens/TransferDetailsScreen'; 

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="Home" component={homescreen} />
      <Stack.Screen name="Transfer" component={TransferScreen} />
      <Stack.Screen name="TransferDetails" component={Transfaredetailscreen} />
    </Stack.Navigator>
  );
}
