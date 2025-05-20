/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width } = Dimensions.get('window');

const ServiceCenterLocator = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [mechanics, setMechanics] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getMechanics();
  }, []);

  const getMechanics = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Signin');
        return;
      }

      const url = "http://10.0.2.2:5000/api/users/get-mechanics-with-location";

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Mechanics Data:", response.data);
      setMechanics(response.data.mechanics || []);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
    }
  };

  const handleOpenMapModal = (mechanic) => {
    setSelectedMechanic(mechanic);
    setMapRegion({
      latitude: mechanic.latitude || 37.78825,
      longitude: mechanic.longitude || -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}
      >
        <Text style={styles.headerText}>Service Center Locator</Text>
      </View>

      {/* Mechanic List */}
      <View style={styles.mechanicListContainer}>
        {mechanics.map((mechanic, index) => (
          <View key={index} style={styles.mechanicCard}>
            <View>
              <Text style={styles.mechanicName}>{mechanic.full_name}</Text>
              <Text style={styles.mechanicService}>{mechanic.email}</Text>
              <Text style={styles.mechanicService}>{mechanic.phone_number}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewMapButton}
              onPress={() => handleOpenMapModal(mechanic)}
            >
              <Feather name="arrow-right" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal for Map */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>
              {selectedMechanic?.full_name}
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBoxContainer}>
            <GooglePlacesAutocomplete
              placeholder="Search location"
              fetchDetails
              onPress={(data, details = null) => {
                if (details?.geometry?.location) {
                  setMapRegion({
                    ...mapRegion,
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  });
                }
              }}
              query={{
                key: 'YOUR_GOOGLE_API_KEY', // Replace with your Google Maps API key
                language: 'en',
              }}
              styles={{
                textInput: {
                  height: 44,
                  color: '#000',
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  fontSize: 16,
                },
              }}
            />
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={(region) => setMapRegion(region)}
          >
            <Marker
              coordinate={{
                latitude: selectedMechanic?.latitude || 37.78825,
                longitude: selectedMechanic?.longitude || -122.4324,
              }}
              title={selectedMechanic?.full_name}
              description={selectedMechanic?.service_name}
            />
          </MapView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mechanicListContainer: {
    flex: 1,
    marginTop: 20,
  },
  mechanicCard: {
    backgroundColor: COLORS.lightDark,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warning,
  },
  mechanicService: {
    fontSize: 14,
    color: COLORS.white,
  },
  viewMapButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    padding: 15,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 5,
    borderRadius: 50,
  },
  searchBoxContainer: {
    zIndex: 1,
    position: 'absolute',
    top: 70,
    left: 10,
    right: 10,
  },
  map: {
    flex: 1,
  },
});

export default ServiceCenterLocator;
