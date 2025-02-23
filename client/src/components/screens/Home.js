/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../constants/Constants';
import Feather from 'react-native-vector-icons/Feather';
import imgPlaceHolder from '../../assets/placeholders/default-avatar.png';
import ServicesContainer from '../utils/ServicesCard/ServicesCard';
import ScheduleCard from '../utils/SheduleCard/SheduleCard';
import SellerDashboard from './extraScreens/SellerScreens/SellerDashboard';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [searchBorderColor, setSearchBorderColor] = useState(COLORS.lightGray);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [notSchedule, setNotSchedule] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          navigation.replace('Signin');
          return;
        }

        const response = await axios.get(
          'http://10.0.2.2:5000/api/users/get-users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const user = response.data.User;

        if (user && user.full_name) {
          setName(user.full_name);
        } else {
          console.log('Full Name Not Found In Response');
        }

        if (user && user.profile_image) {
          setImage(user.profile_image);
        } else {
          console.log('Profile Image not found in response');
        }

        if (user && user.role) {
          setRole(user.role);
        } else {
          console.log('Role Not Found In Response');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
        navigation.replace('Signin');
      }
    };

    fetchUserData();
  }, [navigation]);

  useEffect(()=>{
    const fetchScheduleRequests = async () => {
      if (role && role === 'mechanic') {
        try {
          const token = await AsyncStorage.getItem('token');

          const response = await axios.get('http://10.0.2.2:5000/api/to-schedule', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const resData = response.data;
          setNotSchedule(resData.count);
          console.log(resData.count);
          console.log('not schedule',resData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching schedule requests:', error);
        }
      }
    };

    fetchScheduleRequests();
    const intervalId = setInterval(() => {
      fetchScheduleRequests();
    }, 9000);

    return () => {
      clearInterval(intervalId);
    }
  },[role]);


  const services = [
    {
      id: '1',
      service_image:
        'https://cdn.dealerspike.com/imglib/seo/stock/ps/ps_bike_mechanic_a.jpg',
      service_name: 'Basic Inspection and Safety Checks',
      service_description:
        'Quick inspection of essential parts, fluid levels, and tire pressure adjustment.',
      service_price: '200',
    },
    {
      id: '2',
      service_image:
        'https://th.bing.com/th/id/R.2a777d5b415a819f3ac3542922df3df1?rik=sc1oKFyTje2e9A&pid=ImgRaw&r=0',
      service_name: 'Battery and Electrical System Check',
      service_description:
        'Battery testing and replacement, terminal cleaning, headlight, taillight, and indicator check.',
      service_price: '250',
    },
    {
      id: '3',
      service_image:
        'https://th.bing.com/th/id/OIP.JR8YkKNYvBdN7kpm4R_xqQHaEK?rs=1&pid=ImgDetMain',
      service_name: 'Cleaning and Detailing Services',
      service_description:
        'Full bike wash, detailing, polishing, waxing, rust removal, and prevention.',
      service_price: '300',
    },
    {
      id: '4',
      service_image:
        'https://th.bing.com/th/id/R.f4362e6fb570750fc1e8d1aba6d0be8b?rik=wL6028BFJxJ2Vw&pid=ImgRaw&r=0&sres=1&sresct=1',
      service_name: 'Pre-ride Inspection for Long Trips',
      service_description:
        'Comprehensive check for long journeys, including fluids, brakes, and lighting.',
      service_price: '300',
    },
    {
      id: '5',
      service_image:
        'https://th.bing.com/th/id/OIP.DT5JvbSS2XEp46EAgEImkQHaE6?rs=1&pid=ImgDetMain',
      service_name: 'Chain and Sprocket Maintenance',
      service_description:
        'Chain cleaning, lubrication, tension adjustment, and sprocket inspection.',
      service_price: '300',
    },
    {
      id: '6',
      service_image:
        'https://th.bing.com/th/id/R.30ccb893250467820b3a0816c7a5324d?rik=te4wHb5Hez4yzg&pid=ImgRaw&r=0',
      service_name: 'Fuel System Services',
      service_description:
        'Fuel filter replacement, carburetor cleaning, fuel line inspection for leaks or clogs.',
      service_price: '400',
    },
    {
      id: '7',
      service_image:
        'https://motoxtasy.com/wp-content/uploads/2023/07/Overheating-Exhaust-System.jpg',
      service_name: 'Exhaust System Check',
      service_description:
        'Exhaust pipe inspection for leaks, cleaning, rust prevention, muffler servicing.',
      service_price: '350',
    },
    {
      id: '8',
      service_image:
        'https://th.bing.com/th/id/OIP.2YZjkYJ1EghXIfybOX3pzQHaEK?rs=1&pid=ImgDetMain',
      service_name: 'Engine Maintenance',
      service_description:
        'Oil change, oil filter replacement, spark plug replacement, air filter cleaning.',
      service_price: '600',
    },
    {
      id: '9',
      service_image:
        'https://th.bing.com/th/id/OIP.iSSb2EXFkzfmD5XoqQrHMQHaE8?rs=1&pid=ImgDetMain',
      service_name: 'Tire and Wheel Services',
      service_description:
        'Tire replacement and balancing, puncture repair, tread depth check, wheel alignment.',
      service_price: '500',
    },
    {
      id: '10',
      service_image:
        'https://thumbs.dreamstime.com/b/motorbike-mechanic-replacing-cooling-radiator-replacement-radiator-maintenance-motorbike-mechanic-replacing-cooling-154095399.jpg',
      service_name: 'Cooling System Maintenance',
      service_description:
        'Radiator and coolant check, coolant flush, and hose inspection.',
      service_price: '450',
    },
    {
      id: '11',
      service_image:
        'https://th.bing.com/th/id/OIP.ToBKyziCrwl5w02R3h0mrgHaE5?rs=1&pid=ImgDetMain',
      service_name: 'Suspension Services',
      service_description:
        'Front and rear suspension adjustment, fork oil change, shock absorber inspection.',
      service_price: '800',
    },
    {
      id: '12',
      service_image:
        'https://th.bing.com/th/id/OIP.7_xsLQ5V0sm4zZI93GwdIQHaFi?rs=1&pid=ImgDetMain',
      service_name: 'Comprehensive Diagnostic Check',
      service_description:
        'Full diagnostics for engine, brakes, exhaust, and electrical systems.',
      service_price: '1000',
    },
    {
      id: '13',
      service_image:
        'https://th.bing.com/th/id/OIP.Y59CgLVJSoFNM3D6OEzumQHaD4?rs=1&pid=ImgDetMain',
      service_name: 'Customization and Upgrades',
      service_description:
        'Accessory installation, performance upgrades, paint and decal services.',
      service_price: '1500',
    },
    {
      id: '14',
      service_image:
        'https://th.bing.com/th/id/R.7a88474dcfc940971ae72abf742f6d00?rik=0Aiexy0aFKgo8w&riu=http%3a%2f%2fwww.johnmason.com%2fwp-content%2fuploads%2f2011%2f06%2fmotorbike-004.jpg&ehk=aFTtFonUMU2Ag4OyLjB2eyOxtbRRAjv0N5j8joENbgk%3d&risl=&pid=ImgRaw&r=0',
      service_name: 'Winterization and Storage Preparation',
      service_description:
        'Fuel stabilizer application, battery storage prep, and full cover for off-season storage.',
      service_price: '550',
    },
  ];

  const filteredServices = services.filter(services =>
    services.service_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = text => {
    setSearchQuery(text);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 900000);
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.greetingContainer}>
              <Text
                style={[
                  styles.greeting,
                  { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                ]}>
                Hello,
              </Text>
              <Text
                style={[
                  styles.name,
                  { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
                ]}>
                {name}
              </Text>
            </View>
            <Text
              style={[
                styles.description,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              Have A Nice Day!
            </Text>
            <Text
              style={[
                styles.description,
                { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark },
              ]}>
              ({role})
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { role })}>
            <View style={styles.rightContainer}>
              <View style={styles.imgContainer}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.img} />
                ) : (
                  <Image source={imgPlaceHolder} style={styles.img} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {
          role === 'mechanic' ? (
            notSchedule === undefined || notSchedule === null ? (
              <Text>Loading  not schedule...</Text> // Show a loading message or spinner
            ) : (
              <ScheduleCard notSchedule={notSchedule} navigation={navigation} />
            )
          )
            : role === 'customer' ? (
              <>
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

                <View style={styles.homeContainer}>
                  <View style={styles.serviceContainer}>
                    {isSearching ? (
                      <View style={styles.loaderContainer}>
                        <ActivityIndicator
                          size="large"
                          color={
                            colorScheme === 'dark' ? COLORS.white : COLORS.darkColor
                          }
                        />
                      </View>
                    ) : filteredServices.length > 0 ? (
                      <FlatList
                        data={filteredServices}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                          <ServicesContainer
                            service_image={item.service_image}
                            service_name={item.service_name}
                            service_description={item.service_description}
                            service_price={item.service_price}
                          />
                        )}
                        contentContainerStyle={styles.serviceContainer}
                      />
                    ) : (
                      <View style={styles.noServiceContainer}>
                        <Text
                          style={[
                            styles.noServiceText,
                            {
                              color:
                                colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                            },
                          ]}>
                          No Service Available!
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </>
              ) : role === 'seller' ? (
                <View><SellerDashboard /></View>
              ) : (
                <Text>Role not recognized</Text>
              )
            }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollViewContainer: {
    marginTop: height * 0.005,
  },

  headerContainer: {
    paddingHorizontal: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
    marginTop: height * 0.01,
  },

  leftContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
  },

  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },

  greeting: {
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  name: {
    fontSize: width * 0.055,
    fontFamily: FONTS.semiBold,
  },

  description: {
    fontSize: width * 0.035,
    fontFamily: FONTS.bold,
    marginTop: width * 0.01,
  },

  rightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgContainer: {
    marginTop: height * 0.02,
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  searchContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.03,
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

  homeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  home: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.05,
  },

  serviceContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: height * 0.01,
    marginLeft: height * 0.01,
  },

  noServiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.25,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.25,
  },

  noServiceText: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff', // White background
    borderRadius: 10, // Rounded corners
    padding: 20, // Internal padding
    margin: 10, // Space around the card
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    elevation: 3, // Shadow for Android
  },
  cardText: {
    fontSize: 16, // Text size
    color: '#333', // Text color
    textAlign: 'center', // Center text
  },
});
