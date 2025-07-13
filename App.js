import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nManager, LogBox } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

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
          {/* صفحات ثانية بنضيفها لاحقاً مثل SignUp, ForgetPassword */}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
