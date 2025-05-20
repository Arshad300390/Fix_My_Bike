/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, colorScheme,
  Dimensions, ActivityIndicator, Alert, TextInput, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ServiceCard from './ServiceCard';
import Feather from 'react-native-vector-icons/Feather';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
  const [modalVisible, setModalVisible] = useState(false);
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
        setServices([]);
      } else {
        setServices(servicesData);
        setFilteredServices(servicesData);
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

  useEffect(() => {
    let updatedServices = [...services];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      updatedServices = updatedServices.filter(service => {
        const name = typeof service?.service_name === 'string' ? service.service_name.toLowerCase() : '';
        const price = typeof service?.service_price === 'string' ? service.service_price : service?.service_price?.toString() || '';

        const nameMatches = name.includes(searchQuery.toLowerCase());
        const priceMatches = price.includes(searchQuery);

        return nameMatches || priceMatches;
      });
    }


    // Apply sort
    if (sortOrder === 'asc') {
      updatedServices.sort((a, b) => (parseFloat(a.service_price) || 0) - (parseFloat(b.service_price) || 0));
    } else if (sortOrder === 'desc') {
      updatedServices.sort((a, b) => (parseFloat(b.service_price) || 0) - (parseFloat(a.service_price) || 0));
    }

    console.log("Filtered and Sorted Services:", updatedServices);
    setFilteredServices(updatedServices);
  }, [services, searchQuery, sortOrder]);
  const handleSearch = text => {
    setSearchQuery(text);
  }
  const handleEdit = (service) => {
    navigation.navigate('Edit_Service', { service });
  };

  const handleDelete = async (serviceId) => {
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
            await axios.delete(`http://10.0.2.2:5000/api/shop/services/${serviceId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            setServices((prevServices) => prevServices.filter(service => service._id !== serviceId));
            Alert.alert('Success', 'Service deleted successfully!');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete service.');
          }
        }
      }
    ]);
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
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

  return (
    <View style={styles.screen}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colorScheme === 'dark' ? COLORS.dark : COLORS.white,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Service Dashboard</Text>
        <View />
      </View>


      {/* Header Row with Add Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.addShop} onPress={() => setModalVisible(true)}>
          <Text style={styles.addShoptext}> Add Shop Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addService} onPress={() => navigation.navigate('Add_Service')}>
          <Text style={styles.addServiceText}> Add Service</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBarContainer,
            { borderColor: searchBorderColor },
          ]}>
          <Feather
            name="search"
            size={width * 0.045}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInputField,
              { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
            ]}
            placeholder="Search!"
            placeholderTextColor={
              colorScheme === 'dark' ? COLORS.gray : COLORS.lightGray
            }
            onFocus={() => setSearchBorderColor(COLORS.primary)}
            onBlur={() => setSearchBorderColor(COLORS.lightGray)}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSortOrder('asc')}>
          <View style={styles.radioCircle}>
            {sortOrder === 'asc' && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Lowest to Highest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setSortOrder('desc')}>
          <View style={styles.radioCircle}>
            {sortOrder === 'desc' && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>Highest to Lowest</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : filteredServices.length === 0 ? (
        <Text style={styles.noServiceText}>No services yet.</Text>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.serviceContainer}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
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
    alignItems: 'center',
    backgroundColor: COLORS.white,

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
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  addShop: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addShoptext: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  addService: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addServiceText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: width * 0.04,
    width: '100%',
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeSortButton: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    color: COLORS.dark,
    fontSize: width * 0.04,
  },
  noServiceText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
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
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
  },

  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },

  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  radioText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  searchContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
    width: '100%',
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
  },

  searchInputField: {
    paddingHorizontal: width * 0.03,
    fontFamily: FONTS.semiBold,
    width: width * 0.65,
  },

  searchIcon: {
    marginRight: width * 0.01,
  },
});

export default ServiceDashboard;