import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nManager, LogBox } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgetPasswordScreen from './src/screens/ForgetPasswordScreen';
import homescreen from './src/screens/homescreen'; // تأكد من المسار الصحيح
import TransferScreen from './src/screens/TransferScreen'; // تأكد من المسار الصحيح
import Transfaredetailscreen from './src/screens/TransferDetailsScreen'; // تأكد من المسار الصحيح

// لتجنب تحذيرات Firebase والتنقل
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

export default function App() {
  // تعطيل RTL مؤقتًا إذا كان مفعل
  React.useEffect(() => {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={homescreen} />
          <Stack.Screen name="Transfer" component={TransferScreen} />
          <Stack.Screen name="TransferDetails" component={Transfaredetailscreen} />
          {/* صفحات ثانية بنضيفها لاحقاً مثل SignUp, ForgetPassword */}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
