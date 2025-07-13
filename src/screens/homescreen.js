import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();

  const user = {
    name: 'أنتونيو دياز',
    cards: [
      { id: 1, balance: 850.0, number: '2412 7512 3412 3458' },
      { id: 2, balance: 115.0, number: '6542 3587 1489 2940' },
    ],
  };

  const recentActivities = [
    { id: 1, name: 'Sarah Allen', amount: '+300.00', color: 'green' },
    { id: 2, name: 'Riverside Theater', amount: '-13.00', color: 'red' },
    { id: 3, name: 'Daniel Jackson', amount: '-25.00', color: 'red' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>أهلاً بك 👋</Text>
        <Text style={styles.userName}>{user.name}</Text>
        <Ionicons name="notifications-outline" size={24} color="#333" style={styles.notificationIcon} />
      </View>

      {/* Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
        {user.cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <Text style={styles.balanceTitle}>Balance</Text>
            <Text style={styles.balanceAmount}>${card.balance.toFixed(2)}</Text>
            <Text style={styles.cardNumber}>{card.number}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}> {/*Transfer */}
          <Ionicons name="swap-horizontal" size={24} color="#636AE8" />
          <Text style={styles.iconLabel}>Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="qr-code" size={24} color="#636AE8" />
          <Text style={styles.iconLabel}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>{/*'Payments */}
          <MaterialIcons name="receipt" size={24} color="#636AE8" />
          <Text style={styles.iconLabel}>Pay Bills</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome5 name="piggy-bank" size={20} color="#ccc" />
          <Text style={[styles.iconLabel, { color: '#ccc' }]}>Savings</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activities */}
      <View style={styles.activityBox}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <Text style={styles.activityName}>{activity.name}</Text>
            <Text style={[styles.activityAmount, { color: activity.color }]}>{activity.amount}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#636AE8" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
          <Ionicons name="stats-chart" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Connections')}>
          <Ionicons name="people" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6FA', paddingTop: 50, paddingHorizontal: 10,paddingBottom: 20 },
  header: { marginBottom: 20 },
  welcome: { fontSize: 16, color: '#666' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  notificationIcon: { position: 'absolute', right: 0, top: 0 },
  cardsScroll: { marginBottom: 0},
  card: {
    backgroundColor: '#636AE8',
    borderRadius: 20,
    padding: 20,
    width: width * 0.7,
    height: 150,
    marginRight: 16,
  },
  balanceTitle: { color: '#fff', fontSize: 14 },
  balanceAmount: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginVertical: 10 },
  cardNumber: { color: '#fff', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  iconButton: { alignItems: 'center' },
  iconLabel: { marginTop: 4, fontSize: 12, color: '#333' },
  activityBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  activityItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  activityName: { fontSize: 16, color: '#333' },
  activityAmount: { fontSize: 16 },
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14, borderTopWidth: 1, borderColor: '#ddd', marginTop: 20,
  },
});
