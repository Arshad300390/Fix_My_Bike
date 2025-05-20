import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const sections = [
  { label: 'User Management', screen: 'UserManagement' },
  { label: 'Bookings Management', screen: 'BookingsManagement' },
  { label: 'Products Management', screen: 'ProductsManagement' },
  { label: 'Services Management', screen: 'ServicesManagement' },
  { label: 'Orders Management', screen: 'OrdersManagement' },
];

const AdminDashboard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => navigation.navigate(section.screen)}>
          <Text style={styles.cardText}>{section.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
