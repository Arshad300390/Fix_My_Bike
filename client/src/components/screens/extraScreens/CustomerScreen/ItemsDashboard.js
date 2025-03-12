/* eslint-disable curly */
/* eslint-disable comma-dangle */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Dimensions,
    useColorScheme,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../../constants/Constants';
import StarRating,{ StarRatingDisplay } from 'react-native-star-rating-widget';


import ItemCard from './ItemCard';

const { width, height } = Dimensions.get('window');

const ItemsDashboard = () => {
    const [customServices, setCustomServices] = useState([]);
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const route = useRoute();
    const [allShop, setAllShop] = useState(route.params?.allShop || null);
    const { role } = route.params || {};
    const [rating, setRating] = useState(0);
    console.log('Role:', role, 'allShop:', allShop); // Debugging log

    // Compute rating properly
    const shopRating = customServices.length > 0 ? customServices[0].rating : null;

    const getAllItems = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.replace('Signin');
                return;
            }

            let url;
            if (role === "mechanic") {
                url = allShop
                    ? `http://10.0.2.2:5000/api/shop/get-services/${allShop}`
                    : "http://10.0.2.2:5000/api/shop/all/services";
            } else if (role === "seller") {
                url = allShop
                    ? `http://10.0.2.2:5000/api/get-products/${allShop}`
                    : "http://10.0.2.2:5000/api/all/products";
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Response:', response.data);
            setCustomServices(response.data.Items || []);
        } catch (error) {
            console.log('Error fetching services:', error);
        }
    };

    const handleRating = async (newRating) => {
        setRating(newRating);
        console.log(`User rated: ${newRating}`);
    
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Authentication Error", "Please sign in first.");
                navigation.replace("Signin");
                return;
            }
    
            const response = await axios.post(
                "http://10.0.2.2:5000/api/save-rating",
                {
                    shop_owner: allShop, // Correct field name
                    rating: newRating,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log(response.data.message);
        } catch (error) {
            console.error("Error saving rating:", error);
        }
    };

const getStarColor = (rating) => {
    if (rating <= 2) return COLORS.weakColor; // Red for weak ratings
    if (rating <= 4) return COLORS.averageColor; // Yellow for average ratings
    return COLORS.strongColor; // Green for strong ratings
  };
    useFocusEffect(
        useCallback(() => {
            getAllItems();
        }, [role, allShop])
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={[
                styles.primaryContainer,
                { backgroundColor: colorScheme === 'dark' ? COLORS.darkColor : COLORS.white }
            ]}>
                {allShop && customServices.length > 0 && (
                    <View style={styles.textContainer}>
                        <Text style={styles.userName}>
                            {customServices[0]?.full_name} {role === "seller" ? "Product Shops" : "Mechanic Shops"}
                        </Text>
                        <Text style={styles.userEmail}>{customServices[0]?.email}</Text>

                        {/* Rating Section */}
                        <View style={styles.ratingContainer}>
                            <StarRatingDisplay rating={shopRating || 0} starSize={20} color={COLORS.warning} />
                            <Text style={styles.ratingText}>
                                {shopRating ? `${shopRating.toFixed(1)} / 5` : "No Ratings Yet"}
                            </Text>
                        </View>
                    </View>
                )}

                {customServices.length > 0 ? (
                    <FlatList
                        data={customServices}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item }) => (
                            <ItemCard
                                service={item}
                                role={role}
                                setAllShop={setAllShop}
                                disableScrollViewPanResponder={true}
                            />
                        )}
                        contentContainerStyle={{ paddingTop: 30 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    />
                ) : (
                    <View style={styles.noServiceContainer}>
                        <Text style={[
                            styles.noServiceText,
                            { color: colorScheme === 'dark' ? COLORS.white : COLORS.dark }
                        ]}>
                            No Service Available!
                        </Text>
                    </View>
                )}
                {/* Rate Us Section */}
               {allShop && <TouchableOpacity style={styles.rateUsContainer} >
                    <Text style={styles.rateUsText}>Rate Us</Text>
                    <StarRating
                                rating={rating}
                                onChange={handleRating}
                                enableSwiping={true}
                                color={getStarColor(rating)}
                              />
                </TouchableOpacity>
        }
            
        </SafeAreaView>
        </TouchableWithoutFeedback >
    );
};


export default ItemsDashboard;

const styles = StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: COLORS.white
    },

    searchContainer: {
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.03
    },

    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: width * 0.02,
        paddingHorizontal: width * 0.03
    },

    searchInputField: {
        paddingHorizontal: width * 0.03,
        fontFamily: FONTS.semiBold,
        width: width * 0.65
    },

    searchIcon: {
        marginRight: width * 0.01
    },

    serviceContainer: {
        paddingVertical: height * 0.01
    },
    textContainer: {
        alignItems: "center",
        paddingVertical: height * 0.02,
        backgroundColor: COLORS.lightDark
    },
    userName: {
        fontSize: width * 0.05,
        fontFamily: FONTS.bold,
        color: COLORS.warning,
    },
    userEmail: {
        fontSize: width * 0.04,
        fontFamily: FONTS.medium,
        color: COLORS.white,
        marginVertical: height * 0.005,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: height * 0.01,
    },
    ratingText: {
        fontSize: width * 0.04,
        fontFamily: FONTS.medium,
        marginLeft: width * 0.02,
        color: COLORS.white,
    },
    noServiceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.25
    },

    noServiceText: {
        fontFamily: FONTS.semiBold,
        fontSize: width * 0.05,
        textAlign: 'center'
    },
    rateUsContainer: {
        marginTop: height * 0.03,
        backgroundColor: COLORS.lightDark,
        paddingVertical: height * 0.0015,
        paddingHorizontal: width * 0.40,
        flexDirection: "row",
        alignSelf: "center",
      },
      rateUsText: {
        color: COLORS.white,
        fontSize: width * 0.05,
        fontFamily: FONTS.bold,
        textAlign: "center",
      },
});

