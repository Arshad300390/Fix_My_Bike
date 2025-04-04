/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity,
  Dimensions, ActivityIndicator, Alert, TextInput, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ServiceCard from './ServiceCard';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
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
        headers: { Authorization: `Bearer ${token}` },
      });

      const servicesData = response.data.Services;

      if (!servicesData || servicesData.length === 0) {
        //Alert.alert('No Services', 'No services available yet.');
        setServices([]); // Ensure it's an empty array
      } else {
        setServices(servicesData);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
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

  const saveShopLocation = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please sign in first.');
        navigation.replace('Signin');
        return;
      }

      if (!latitude || !longitude) {
        Alert.alert('Error', 'Please enter both latitude and longitude.');
        return;
      }
      console.log("Latitude:", latitude, "Longitude:", longitude);
      const response = await axios.put('http://10.0.2.2:5000/api/shop/set-coordinates',
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', response.data.message);
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving coordinates:', error);
      Alert.alert('Error', 'Failed to save coordinates.');
    }
  };

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
        <TouchableOpacity style={styles.addService} onPress={() => setModalVisible(true)}>
          <Text style={styles.addServiceText}> Add Shop Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addService} onPress={() => navigation.navigate('Add_Service')}>
          <Text style={styles.addServiceText}> Add Service</Text>
        </TouchableOpacity>
      </View>
      <View><Text style={styles.serviceText}>Services List</Text></View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : services.length === 0 ? (
        <Text style={styles.noServiceText}>No services yet.</Text> // Display message when no services
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => {
            let imageUrl = "https://img.freepik.com/premium-photo/motorcycle-set-tuning-customizing-shop_1098-7606.jpg"; // Default image

            if (item.service_name.toLowerCase().includes("oil change")) {
              imageUrl = "https://media.istockphoto.com/id/1174788025/photo/the-process-of-pouring-new-oil-into-the-motorcycle-engine.jpg?s=612x612&w=0&k=20&c=IQHgBZ4SdLc6urAyfY-srbXaXeTxBZpWvbEUMPlj2_U=";
            } else if (item.service_name.toLowerCase().includes("tyre change")) {
              imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2dC1oSGcqSdmccoXHsSbh_0Rs1qoC4vKwY3K6r9uP5zVR7qQJsEOpihapFg6OXqxD9jc&usqp=CAU";
            } else if (item.service_name.toLowerCase().includes("head light change")) {
              imageUrl = "https://www.shutterstock.com/shutterstock/photos/329460197/display_1500/stock-photo-headlight-and-wheel-of-an-old-motorcycle-329460197.jpg";
            }

            return (
              <ServiceCard
                service={item}
                service_image={imageUrl}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          }}
          contentContainerStyle={styles.serviceContainer}
        />
      )}

      {/* Modal for Adding Shop Location */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Shop Location</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <TextInput
              style={styles.input}
              placeholder="Enter Latitude"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Longitude"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={saveShopLocation}>
              <Text style={styles.saveButtonText}>Save Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    marginVertical: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,

  },
  serviceText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
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
  noServiceText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceDashboard;
