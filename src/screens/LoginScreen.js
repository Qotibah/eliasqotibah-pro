import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useCustomerId, setUseCustomerId] = useState(false);

  const handleLogin = async () => {
    if ((!customerId && !email) || !password) {
      Alert.alert('خطأ', 'يرجى إدخال رقم العميل أو البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      let userCredential;
      if (useCustomerId && customerId) {
        const querySnapshot = await getDoc(doc(db, 'users', customerId)); // افتراضي
        if (!querySnapshot.exists()) {
          Alert.alert('خطأ', 'رقم العميل غير موجود');
          return;
        }
        const userEmail = querySnapshot.data().email;
        userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const userId = userCredential.user.uid;
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const customerIdFromDB = docSnap.data().customerId;
        navigation.navigate('Home', { customerId: customerIdFromDB });
      } else {
        Alert.alert('خطأ', 'تعذر العثور على بيانات المستخدم');
      }
    } catch (error) {
      Alert.alert('فشل تسجيل الدخول', error.message);
    }
  };

  return (
    <View style={styles.page}>
      <LinearGradient
        colors={['#E8618C', '#636AE8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBox}
      >
        <Text style={styles.headerText}>LogIn</Text>
      </LinearGradient>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => setUseCustomerId(!useCustomerId)}>
          <Text style={styles.linkText}>
            {useCustomerId ? 'استخدم البريد الإلكتروني بدلاً من رقم العميل' : 'استخدم رقم العميل بدلاً من البريد الإلكتروني'}
          </Text>
        </TouchableOpacity>

        {useCustomerId ? (
          <TextInput
            style={styles.input}
            placeholder="رقم العميل (Customer ID)"
            placeholderTextColor="#888"
            value={customerId}
            onChangeText={setCustomerId}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text style={styles.linkText}>نسيت كلمة المرور؟</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>ليس لديك حساب؟ أنشئ واحد الآن</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 24, alignSelf: 'center' }}
          onPress={() => navigation.navigate('Home', { name: 'Rana Youssef' })}
        >
          <Text style={{ color: 'gray' }}>دخول مباشر إلى الصفحة الرئيسية</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  gradientBox: { position: 'absolute', top: 0, width, height: height * 0.42, borderBottomLeftRadius: 64, borderBottomRightRadius: 64, justifyContent: 'center', alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 48, fontWeight: 'bold' },
  container: { position: 'absolute', top: height * 0.38, width, padding: 24, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 10, paddingTop: 120 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, backgroundColor: '#f9f9f9' },
  loginButton: { backgroundColor: '#636AE8', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  loginText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkText: { color: '#636AE8', textAlign: 'center', marginTop: 8 },
});