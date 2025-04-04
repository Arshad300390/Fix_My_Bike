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
  Image,
  Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const { width } = Dimensions.get('window');

const ServiceCenterLocator = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [mechanics, setMechanics] = useState([]); // State for mechanics data
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [selectedMechanic, setSelectedMechanic] = useState(null); // Store selected mechanic's details

  useEffect(() => {
    getMechanics(); // Fetch mechanics when the component mounts
  }, []);

  const getMechanics = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Signin');
        return;
      }

      const url = "http://10.0.2.2:5000/api/users//get-mechanics-with-location";

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Mechanics Data:", response.data);
      setMechanics(response.data.mechanics || []); // Set mechanics data to state
    } catch (error) {
      console.error("Error fetching mechanics:", error);
    }
  };

  const handleOpenMapModal = (mechanic) => {
    setSelectedMechanic(mechanic); // Store selected mechanic's data
    setModalVisible(true); // Open the map modal
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
        {mechanics &&  mechanics.map((mechanic, index) => (
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
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: selectedMechanic?.latitude || 37.78825, // Use mechanic's latitude or default if undefined
              longitude: selectedMechanic?.longitude || -122.4324, // Use mechanic's longitude or default if undefined
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
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
  map: {
    flex: 1,
  },
});

export default ServiceCenterLocator;
