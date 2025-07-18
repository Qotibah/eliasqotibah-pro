import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function SignUpScreen({ navigation }) {
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValidCustomerId = (id) => {
    const validPrefixes = ['IND_CUST_', 'CORP_CUST_', 'BUS_CUST_'];
    return validPrefixes.some(prefix => id.startsWith(prefix));
  };

  const isPasswordStrong = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;
    return hasUpperCase && hasNumber && hasSymbol && isLongEnough;
  };

  const handleSignUp = async () => {
    if (!customerId || !email || !password || !confirmPassword) {
      Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول');
      return;
    }

    if (!isValidCustomerId(customerId)) {
      Alert.alert('خطأ', 'رقم العميل غير صحيح. يجب أن يبدأ بـ IND_CUST_, CORP_CUST_, أو BUS_CUST_');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمتا المرور غير متطابقتين');
      return;
    }

    if (!isPasswordStrong(password)) {
      Alert.alert(
        'كلمة المرور ضعيفة',
        'كلمة المرور يجب أن تحتوي على:\n• حرف كبير\n• رقم\n• رمز خاص\n• 8 أحرف على الأقل'
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        customerId,
        email,
        createdAt: new Date(),
      });

      Alert.alert('تم إنشاء الحساب بنجاح!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('فشل التسجيل', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إنشاء حساب جديد</Text>

      <TextInput
        style={styles.input}
        placeholder="رقم العميل (Customer ID)"
        placeholderTextColor="#888"
        value={customerId}
        onChangeText={setCustomerId}
      />

      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="تأكيد كلمة المرور"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupText}>تسجيل</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>رجوع إلى تسجيل الدخول</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#E8618C' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, backgroundColor: '#f9f9f9' },
  signupButton: { backgroundColor: '#636AE8', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  signupText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backText: { marginTop: 24, color: '#E8618C', textAlign: 'center', fontSize: 14 },
});