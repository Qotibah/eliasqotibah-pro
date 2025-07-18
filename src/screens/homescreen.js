import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// تأكد من استيراد Dimensions بشكل صحيح
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const customerId = route?.params?.customerId; // فحص أمان لـ route.params

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      fetchAccounts(customerId);
    } else {
      Alert.alert('خطأ', 'لم يتم العثور على معرف المستخدم');
      setLoading(false);
    }
  }, [customerId]);

  const fetchAccounts = async (id) => {
    try {
      const apiUrl = 'https://jpjofsdvapigw-az.eu.webmethods.io/gateway/Accounts/v0.4.3/accounts';
      const res = await fetch(apiUrl, {
        headers: {
          'x-customer-id': id,
        },
      });

      const json = await res.json();
      if (json && json['1']) { // استنادًا إلى استجابة Postman
        setAccounts([json['1']]);
        await setDoc(doc(db, 'accounts', id), {
          accounts: [json['1']],
          updatedAt: new Date(),
        });
      } else {
        const docSnap = await getDoc(doc(db, 'accounts', id));
        if (docSnap.exists()) {
          setAccounts(docSnap.data().accounts);
        } else {
          Alert.alert('خطأ', 'لم يتم العثور على بيانات حساب');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('خطأ', 'فشل في جلب بيانات الحساب من JOF');
      const docSnap = await getDoc(doc(db, 'accounts', id));
      if (docSnap.exists()) {
        setAccounts(docSnap.data().accounts);
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
      <Text style={styles.title}>مرحبًا 👋</Text>
      <Text style={styles.subtitle}>رقم العميل: {customerId || 'غير متاح'}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
        {accounts.map((acc, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardLabel}>{acc.accountType?.name || 'نوع الحساب'}</Text>
            <Text style={styles.cardIban}>{acc.mainRoute?.address || 'IBAN غير متاح'}</Text>
            <Text style={styles.cardBalance}>
              {acc.availableBalance?.balanceAmount} {acc.accountCurrency}
            </Text>
          </View>
        ))}
      </ScrollView>

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
  refreshButton: { position: 'absolute', left: 0, top: 0 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
  cardsScroll: { marginBottom: 20 },
  card: { backgroundColor: '#636AE8', borderRadius: 20, padding: 20, width: width * 0.8, height: 160, marginRight: 16 },
  cardLabel: { color: '#fff', fontSize: 14, textAlign: 'right' },
  cardIban: { color: '#fff', textAlign: 'right', marginVertical: 6 },
  cardBalance: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'right' },
  transferButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8618C', padding: 16, borderRadius: 12, justifyContent: 'center' },
  transferText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});