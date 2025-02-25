/* eslint-disable no-unused-vars */
/* eslint-disable curly */
import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ServicesContainer from '../../../utils/ServiceHistoryCard/ServiceHistoryCard';
const { width, height } = Dimensions.get('window');

const Bookings = () => {

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [role, setRole] = useState();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: 'http://10.0.2.2:5000/api/users/get-users',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setRole(response.data.User.role);
      } catch (error) {
        console.error('Error fetching user_ role:', error.message);
      }
    };
    fetchUser();
  }, []);

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     if (!role) {return;}
  //     const url =
  //       role === 'mechanic'
  //         ? 'http://10.0.2.2:5000/api/bookings'
  //         : 'http://10.0.2.2:5000/api/service-bookings';
  //     try {
  //       const token = await AsyncStorage.getItem('token');
  //       const response = await axios({
  //         method: 'GET',
  //         url: url,
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       const serviceBookings = response.data.Bookings;

  //       if (serviceBookings && serviceBookings.length > 0) {
  //         setBookings(serviceBookings);
  //       } else {
  //         console.log('No bookings yet.');
  //         setBookings([]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching bookings:', error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (role || shouldRefresh) fetchBookings();
  // }, [role, shouldRefresh]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!role) return;
      const url =
        role === 'mechanic'
          ? 'http://10.0.2.2:5000/api/bookings'
          : 'http://10.0.2.2:5000/api/service-bookings';
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: url,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const serviceBookings = response.data.Bookings;


        if (serviceBookings && serviceBookings.length > 0) {
          setBookings(serviceBookings);
        } else {
          console.log('No bookings yet.');
          setBookings([]);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      } finally {
        setLoading(false);
        setShouldRefresh(false); // Reset refresh state after fetch
      }
    };
    fetchBookings();
  }, [role, shouldRefresh]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios({
        method: 'PUT',
        url: `http://10.0.2.2:5000/api/service-booking/${id}/status`,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: {
          status: status,
        },
      });
      setShouldRefresh((prev) => !prev);
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error fetching user_ role:', error.message);
    }
  };

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
            { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
          ]}>
          {
            role === 'mechanic' ? 'Bookings' : 'My Bookings'
          }

        </Text>

      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : bookings.length === 0 ? ( 
        <View style={styles.noBookingsContainer}>
          <Text style={styles.noBookingsText}>No bookings available</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <FlatList
            data={bookings}
            scrollEnabled={true}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <ServicesContainer
                item={item}
                role={role}
                status={item.status}
                onShowInProgress={handleUpdateStatus}
                onComplete={handleUpdateStatus}
              />
            )}
            contentContainerStyle={styles.bookingContainer}
          />
        </ScrollView>
      )}

    </SafeAreaView>
  );
};

export default Bookings;

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
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  bookingContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: 10,
  },
  scrollView: {
    flex: 1,
  },
  noBookingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  noBookingsText: {
    fontSize: width * 0.09,
    color: COLORS.text,
    textAlign: 'center',
  },
  
});
