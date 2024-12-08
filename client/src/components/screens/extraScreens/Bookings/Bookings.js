import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../../constants/Constants';

const {width, height} = Dimensions.get('window');

const Bookings = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('token');
  //       const response = await axios({
  //         method: 'GET',
  //         url: 'http://10.0.2.2:5000/api/getAllServices',
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });
  //       console.log('Fetched Data:', response.data);
  //       setServices(response.data);
  //     } catch (error) {
  //       console.error('Error fetching services:', error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchServices();
  // }, []);

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
          My Bookings
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Here is your all service bookings!
        </Text>
      </View>

      <View style={styles.bookingContainer}>
        <Text
          style={[
            styles.booking,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          My Bookings
        </Text>
      </View>
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

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  bookingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  booking: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.09,
  },
});
