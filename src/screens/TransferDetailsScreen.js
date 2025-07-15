// TransferDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function TransferDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    recipientName,
    recipientIban,
    recipientBank,
    amount,
    transferPurpose,
    transferDetails,
    account,
  } = route.params;

  const handleConfirm = async () => {
    try {
      // حفظ المستفيد في قائمة المفضلة
      const favorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
      const newFavorite = {
        id: Date.now(),
        name: recipientName,
        iban: recipientIban,
        bank: recipientBank,
        amount,
        type: 'Manual',
      };
      await AsyncStorage.setItem('favorites', JSON.stringify([...favorites, newFavorite]));

      // إضافة سجل إلى الأنشطة الأخيرة
      const recent = JSON.parse(await AsyncStorage.getItem('recentTransactions')) || [];
      const newTransaction = {
        id: Date.now(),
        name: recipientName,
        amount: `-${parseFloat(amount).toFixed(2)}`,
      };
      await AsyncStorage.setItem('recentTransactions', JSON.stringify([newTransaction, ...recent]));

      Alert.alert('✅ تم التحويل بنجاح');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('خطأ', 'فشل في حفظ بيانات التحويل');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>تفاصيل التحويل</Text>

      <View style={styles.section}>
        <Text style={styles.label}>الحساب المحول منه:</Text>
        <Text style={styles.value}>{account?.iban || 'غير متوفر'}</Text>
        <Text style={styles.value}>{account?.accountType || 'حساب جاري'}</Text>
        <Text style={styles.value}>الرصيد: {account?.balance ? `دينار ${parseFloat(account.balance).toFixed(2)}` : 'غير متوفر'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>اسم المستلم:</Text>
        <Text style={styles.value}>{recipientName}</Text>

        <Text style={styles.label}>رقم IBAN:</Text>
        <Text style={styles.value}>{recipientIban}</Text>

        <Text style={styles.label}>البنك:</Text>
        <Text style={styles.value}>{recipientBank}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>المبلغ:</Text>
        <Text style={styles.value}>دينار {parseFloat(amount).toFixed(2)}</Text>

        <Text style={styles.label}>غاية التحويل:</Text>
        <Text style={styles.value}>{transferPurpose}</Text>

        {transferDetails ? (
          <>
            <Text style={styles.label}>تفاصيل إضافية:</Text>
            <Text style={styles.value}>{transferDetails}</Text>
          </>
        ) : null}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
        <Text style={styles.confirmText}>تأكيد</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F6F6FA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#222',
    textAlign: 'right',
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
