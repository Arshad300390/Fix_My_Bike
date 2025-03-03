/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, FlatList, Text, StyleSheet, TouchableOpacity,
  Dimensions, ActivityIndicator, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ServiceCard from './ServiceCard';

const { width } = Dimensions.get('window');

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please sign in first.');
        navigation.replace('Signin');
        return;
      }

      const response = await axios.get('http://10.0.2.2:5000/api/shop/services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(response.data.Services);
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  const handleEdit = (service) => {
    navigation.navigate('Edit_Service', { service });
  };

  const handleDelete = async (productId) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              Alert.alert('Authentication Error', 'Please sign in first.');
              navigation.replace('Signin');
              return;
            }
            await axios.delete(`http://10.0.2.2:5000/api/shop/services/${productId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            setServices((prevServices) => prevServices.filter(service => service._id !== productId));
            Alert.alert('Success', 'Service deleted successfully!');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete service.');
          }
        }
      }
    ]);
  };
  

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Service Dashboard</Text>

      {/* Header Row with Add Button */}
      <View style={styles.headerRow}>
        <Text style={styles.serviceText}>Services</Text>
        <TouchableOpacity style={styles.addService} onPress={() => navigation.navigate('Add_Service')}>
          <Text style={styles.addServiceText}> Add Service</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) =>
            <ServiceCard service={item}
              onEdit={handleEdit} onDelete={handleDelete}
            />}
          contentContainerStyle={styles.listContainer}
          style={styles.flatList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 5,
    paddingBottom: 5,
    overflow: 'hidden',
  },
  header: {
    fontSize: width * 0.06,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  serviceText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  addService: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  addServiceText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  flatList: {
    flex: 1,
  },
});

export default ServiceDashboard;
