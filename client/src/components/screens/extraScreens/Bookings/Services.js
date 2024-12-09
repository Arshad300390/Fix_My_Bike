import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  useColorScheme,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../../constants/Constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const Services = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: 'http://10.0.2.2:5000/api/service-History',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const bookings = response.data.Bookings;
        if (bookings && bookings.length > 0) {
          console.log('Fetched bookings history:', bookings);
        setServices(bookings);
        }else{
          console.log('No booking history yet.');
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching services history:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const renderBookingItem = ({item}) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingServiceName}>Service Name: {item.serviceName}</Text>
      <Text style={styles.bookingDetails}>Bike Name: {item.bikeName}</Text>
      {/* <Text style={styles.bookingDetails}>Bike Model: {item.bikeModel}</Text>
      <Text style={styles.bookingDetails}>Bike Company: {item.bikeCompanyName}</Text>
      <Text style={styles.bookingDetails}>Bike Reg Number: {item.bikeRegNumber}</Text>
      <Text style={styles.bookingDetails}>Address: {item.address}</Text>
      <Text style={styles.bookingDetails}>Cell: {item.cell}</Text> */}
      <Text style={styles.bookingDetails}>Comments: {item.comments}</Text>
      <Text style={styles.bookingDetails}>Total Price: ${item.totalPrice}</Text>
      <Text style={styles.bookingStatus}>Status: {item.status}</Text>
      <Text style={styles.bookingTimestamp}>Date: {new Date(item.timestamp).toLocaleString()}</Text> 
    </View>
  );


  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          My Booking History.
        </Text>
        {/* <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Here is your all service bookings!
        </Text> */}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <ScrollView >
        <FlatList
          data={services}
          scrollEnabled={false}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.bookingContainer}
        />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Services;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
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

  headerTextContainer: {
    marginTop: height * 0.12,
    marginLeft: width * 0.05,
  },

  headerTitleText: {
    fontSize: width * 0.06,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  bookingContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: 10,
  },

  bookingCard: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  bookingServiceName: {
    fontSize: width * 0.05,
    fontFamily: FONTS.bold,
  },

  bookingDetails: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    marginVertical: 5,
  },

  bookingStatus: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
  },
});
