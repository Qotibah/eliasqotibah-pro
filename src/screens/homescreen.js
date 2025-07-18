import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Dimensions
} from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const customerId = route?.params?.customerId;

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      fetchAccounts(customerId); // 🚀 مباشرة أول ما يدخل الصفحة
    } else {
      Alert.alert('خطأ', 'لم يتم العثور على رقم العميل');
      setLoading(false);
    }
  }, [customerId]);

  const fetchAccounts = async (id) => {
    try {
      setLoading(true);

      const apiUrl = `https://jpcjofsdev.apigw-az-eu.webmethods.io/gateway/Accounts/v0.4.3/accounts`;

      const myHeaders = new Headers();
      myHeaders.append("x-jws-signature", "1");
      myHeaders.append("x-auth-date", "1");
      myHeaders.append("x-idempotency-key", "1");
      myHeaders.append("Authorization", "1");
      myHeaders.append("x-customer-user-agent", "1");
      myHeaders.append("x-financial-id", "1");
      myHeaders.append("x-customer-ip-address", "1");
      myHeaders.append("x-interactions-id", "1");
      myHeaders.append("x-customer-id", id);
      myHeaders.append("Content-Type", "application/json");

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      });

      const result = await response.json();
      console.log('🔁 بيانات من الـ API:', result);

      if (result && result['1']) {
        const data = [result['1']];
        setAccounts(data);

        // 🧠 حفظها في Firestore
        await setDoc(doc(db, 'accounts', id), {
          accounts: data,
          updatedAt: new Date(),
        });
      } else {
        throw new Error('الـ API لم يرجع بيانات');
      }

    } catch (error) {
      console.warn('⚠️ API Error:', error.message);
      const docSnap = await getDoc(doc(db, 'accounts', id));
      if (docSnap.exists()) {
        setAccounts(docSnap.data().accounts);
        Alert.alert('تنبيه', 'تم استخدام بيانات محفوظة مسبقًا');
      } else {
        Alert.alert('خطأ', 'لا يوجد بيانات حسابات متاحة');
      }

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#636AE8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>أهلاً وسهلاً 👋</Text>
      <Text style={styles.subtitle}>رقم العميل: {customerId}</Text>

      {accounts.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
          {accounts.map((acc, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardLabel}>{acc.accountType?.name || 'نوع الحساب'}</Text>
              <Text style={styles.cardIban}>{acc.mainRoute?.address || 'IBAN غير متاح'}</Text>
              <Text style={styles.cardBalance}>
                {acc.availableBalance?.balanceAmount || '0.00'} {acc.accountCurrency || ''}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>لا يوجد حسابات لعرضها</Text>
      )}

      <TouchableOpacity
        style={styles.transferButton}
        onPress={() => navigation.navigate('Transfer')}
      >
        <Ionicons name="swap-horizontal" size={24} color="#fff" />
        <Text style={styles.transferText}>التحويل</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => fetchAccounts(customerId)}
      >
        <Ionicons name="refresh-outline" size={24} color="#636AE8" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6FA', paddingTop: 50, paddingHorizontal: 16 },
  refreshButton: { position: 'absolute', left: 16, top: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  cardsScroll: { marginBottom: 20 },
  card: {
    backgroundColor: '#636AE8',
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    height: 160,
    marginRight: 16
  },
  cardLabel: { color: '#fff', fontSize: 14, textAlign: 'right' },
  cardIban: { color: '#fff', textAlign: 'right', marginVertical: 6 },
  cardBalance: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'right' },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8618C',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 16
  },
  transferText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
