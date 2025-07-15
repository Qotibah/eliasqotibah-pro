import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';

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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>أهلاً بك 👋</Text>
        <Text style={styles.userName}>{userData?.email}</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
        {accounts.map((card, index) => (
          <TouchableOpacity key={card.id || index} style={styles.card}>
            <LinearGradient
              colors={['#6B7280', '#4F46E5']}
              style={styles.cardGradient}
            >
              <Text style={styles.accountType}>{card.accountType}</Text>
              <Text style={styles.balanceAmount}>${parseFloat(card.balance).toFixed(2)}</Text>
              <Text style={styles.cardNumber}>{card.iban.slice(-8)}</Text>
            </LinearGradient>
          </TouchableOpacity>
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
          <View style={styles.iconContainer}>
            <Ionicons name="swap-horizontal" size={28} color="#4F46E5" />
          </View>
          <Text style={styles.iconLabel}>تحويل</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('TransferDetails')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="qr-code" size={28} color="#4F46E5" />
          </View>
          <Text style={styles.iconLabel}>مسح</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="receipt" size={28} color="#4F46E5" />
          </View>
          <Text style={styles.iconLabel}>فواتير</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} disabled>
          <View style={[styles.iconContainer, { backgroundColor: '#E5E7EB' }]}>
            <FontAwesome5 name="piggy-bank" size={24} color="#9CA3AF" />
          </View>
          <Text style={[styles.iconLabel, { color: '#9CA3AF' }]}>مدخرات</Text>
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
                  { color: transaction.amount.startsWith('-') ? '#EF4444' : '#10B981' },
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
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={28} color="#4F46E5" />
          <Text style={styles.navLabel}>الرئيسية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart" size={28} color="#6B7280" />
          <Text style={styles.navLabel}>الإحصائيات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="people" size={28} color="#6B7280" />
          <Text style={styles.navLabel}>جهات الاتصال</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={28} color="#6B7280" />
          <Text style={styles.navLabel}>الحساب</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcome: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    flex: 2,
    textAlign: 'right',
  },
  notificationButton: {
    padding: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  cardsScroll: {
    marginBottom: 24,
  },
  card: {
    width: width * 0.85,
    height: 180,
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  accountType: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'right',
  },
  cardNumber: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  iconButton: {
    alignItems: 'center',
    padding: 12,
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  activityBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    paddingBottom: 150,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'right',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  emptyActivityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
});