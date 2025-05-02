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
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
const { width } = Dimensions.get('window');

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  // const [latitude, setLatitude] = useState('');
  // const [longitude, setLongitude] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
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

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    console.log("Selected Location:", { latitude, longitude });
  };

  const saveShopLocation = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location on the map first.');
      return;
    }
  
    const { latitude, longitude } = selectedLocation;
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please sign in first.');
        navigation.replace('Signin');
        return;
      }
  
      const response = await axios.put(
        'http://10.0.2.2:5000/api/shop/set-coordinates',
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
            
            return (
              <ServiceCard
                service={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          }}
          contentContainerStyle={styles.serviceContainer}
        />
      )}


<Modal
  visible={modalVisible}
  animationType="slide"
  transparent={false}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={{ flex: 1 }}>
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 30.3753,
        longitude: 69.3451,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }}
      onPress={handleMapPress}
    >
      {selectedLocation && (
        <Marker coordinate={selectedLocation} />
      )}
    </MapView>

    <View style={{ padding: 10 }}>
      <TouchableOpacity style={styles.saveButton} onPress={saveShopLocation}>
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Text style={{ color: 'red', textAlign: 'center' }}>Cancel</Text>
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
