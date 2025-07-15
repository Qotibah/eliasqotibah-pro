// HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        Alert.alert('خطأ', 'لم يتم تسجيل الدخول. الرجاء المحاولة من جديد.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    try {
      const email = user.email.toLowerCase();
      setUserData({ email });
      fetchAccounts(email);
      fetchRecentTransactions();
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', 'حدث خطأ أثناء جلب بيانات المستخدم.');
      setLoading(false);
    }
  };

  const fetchAccounts = async (email) => {
    try {
      const response = await fetch('https://6873f50ac75558e27355be26.mockapi.io/bank-app');
      const data = await response.json();
      const matchedAccounts = data.filter(acc => acc.email.toLowerCase() === email);
      setAccounts(matchedAccounts);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تحميل بيانات الحساب');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentTransactions');
      const parsed = saved ? JSON.parse(saved) : [];
      setTransactions(parsed);
    } catch (e) {
      console.error('فشل في جلب الأنشطة الأخيرة:', e);
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
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>{userData?.email} أهلاً بك 👋</Text>
        <Text style={styles.userName}>{userData?.email}</Text>
        <Ionicons name="notifications-outline" size={24} color="#333" style={styles.notificationIcon} />
      </View>

      {/* Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
        {accounts.map((card, index) => (
          <View key={card.id || index} style={styles.card}>
            <Text style={styles.balanceTitle}>Balance</Text>
            <Text style={styles.balanceAmount}>${parseFloat(card.balance).toFixed(2)}</Text>
            <Text style={styles.cardNumber}>{card.iban}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => accounts.length > 0 &&
            navigation.navigate('Transfer', {
              account: { ...accounts[0], accountType: accounts[0].accountType || 'حساب جاري' },
            })}
        >
          <Ionicons name="swap-horizontal" size={24} color="#636AE8" />
          <Text style={styles.iconLabel}>تحويل</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Parcode')}
        >
          <Ionicons name="barcode" size={24} color="#636AE8" />
          <Text style={styles.iconLabel}>مسح</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="receipt" size={24} color="#636AE8" />
          <Text style={styles.iconLabel}>فواتير</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} disabled>
          <FontAwesome5 name="piggy-bank" size={20} color="#ccc" />
          <Text style={[styles.iconLabel, { color: '#ccc' }]}>مدخرات</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activities */}
      <View style={styles.activityBox}>
        <Text style={styles.sectionTitle}>الأنشطة الأخيرة</Text>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.activityItem}>
              <Text style={styles.activityName}>{transaction.name}</Text>
              <Text
                style={[
                  styles.activityAmount,
                  { color: transaction.amount.startsWith('-') ? '#c0392b' : '#2ecc71' },
                ]}
              >
                {transaction.amount}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyActivityText}>لا توجد أنشطة حالياً</Text>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#636AE8" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="stats-chart" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="people" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6FA',
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  notificationIcon: {
    position: 'absolute',
    right: 30,
    top: 0,
  },
  cardsScroll: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#636AE8',
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    height: 160,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  balanceTitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'right',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'right',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
    padding: 12,
  },
  iconLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  activityBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    paddingBottom: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityName: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  activityAmount: {
    fontSize: 16,
    textAlign: 'right',
  },
  emptyActivityText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});