import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase'; // عدّل المسار إذا لزم

const { width } = Dimensions.get('window');

export default function ForgetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    if (!email) {
      Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('تم الإرسال', 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      navigation.goBack();
    } catch (error) {
      Alert.alert('خطأ', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>نسيت كلمة المرور</Text>
      <TextInput
        style={styles.input}
        placeholder="أدخل بريدك الإلكتروني"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>إرسال رابط إعادة التعيين</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>رجوع إلى تسجيل الدخول</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#636AE8' },
  input: {
    height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 16, marginBottom: 24, backgroundColor: '#f9f9f9',
  },
  resetButton: {
    backgroundColor: '#E8618C', paddingVertical: 14,
    borderRadius: 12, alignItems: 'center',
  },
  resetText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backText: {
    marginTop: 24, color: '#636AE8', textAlign: 'center', fontSize: 14,
  },
});
