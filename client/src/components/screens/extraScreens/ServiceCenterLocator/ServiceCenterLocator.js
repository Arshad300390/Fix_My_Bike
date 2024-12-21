import React from 'react';
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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ServiceCenterLocator = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  // Marker coordinates
  const markers = [
    { id: 1, name: 'Multan FIX MY BIKE Service Center', latitude: 30.1575, longitude: 71.5249 },
    { id: 2, name: 'Lahore FIX MY BIKE Service Center', latitude: 31.5204, longitude: 74.3587 },
    { id: 3, name: 'Karachi FIX MY BIKE Service Center', latitude: 24.8607, longitude: 67.0011 },
    { id: 4, name: 'Islamabad FIX MY BIKE Service Center', latitude: 33.6844, longitude: 73.0479 },
    { id: 5, name: 'Peshawar FIX MY BIKE Service Center', latitude: 34.0151, longitude: 71.5249 },
    { id: 6, name: 'Quetta FIX MY BIKE Service Center', latitude: 30.1798, longitude: 66.9750 },
    { id: 7, name: 'Faisalabad FIX MY BIKE Service Center', latitude: 31.4504, longitude: 73.1350 },
    { id: 8, name: 'Hyderabad FIX MY BIKE Service Center', latitude: 25.3960, longitude: 68.3578 },
    { id: 9, name: 'Sialkot FIX MY BIKE Service Center', latitude: 32.4945, longitude: 74.5229 },
    { id: 10, name: 'Rawalpindi FIX MY BIKE Service Center', latitude: 33.6007, longitude: 73.0679 },
  ];
  

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
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: 30.3753,
            longitude: 69.3451,
            latitudeDelta: 6,
            longitudeDelta: 6,
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            >
              <View style={styles.markerWrapper}>
                <View style={styles.markerCircle}>
                  <Image
                    source={require('../../../../assets/png/mechanic.png')} // Replace with your custom image path
                    style={styles.markerIcon}
                  />
                </View>
                <Text style={styles.markerText}>{marker.name}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

export default ServiceCenterLocator;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  markerText: {
    marginBottom: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
