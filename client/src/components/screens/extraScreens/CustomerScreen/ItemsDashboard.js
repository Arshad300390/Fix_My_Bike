/* eslint-disable curly */
/* eslint-disable comma-dangle */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
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
    Pressable,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../../constants/Constants';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import base64 from 'base-64';
import utf8 from 'utf8';
import ItemCard from './ItemCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');

const ItemsDashboard = () => {
    const [customServices, setCustomServices] = useState([]);
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const route = useRoute();
    const { role } = route.params || {};
    const [allShop, setAllShop] = useState(route.params?.allShop || null);
    const [rating, setRating] = useState(0);
    const [cartCount, setCartCount] = useState(0); // Ensuring accurate count
    const [userId, setUserId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            getAllItems();
        }, [role, allShop])
    );
    useFocusEffect(
        useCallback(() => {
            const fetchCart = async () => {
                const id = await getUserId();
                if (id) {
                    await updateCartCount(id); // Ensure cart count updates when navigating back
                }
            };
            fetchCart();
        }, [])
    );

    useEffect(() => {
        const fetchUserData = async () => {
            const id = await getUserId();
            if (id) {
                await updateCartCount(id); // Fetch cart count only when ID is retrieved
            }
        };
        fetchUserData();
    }, []); // Runs only once on mount

    const getAllItems = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.replace('Signin');
                return;
            }

            let url = role === "mechanic"
                ? (allShop ? `http://10.0.2.2:5000/api/shop/get-services/${allShop}` : "http://10.0.2.2:5000/api/shop/all/services")
                : (allShop ? `http://10.0.2.2:5000/api/get-products/${allShop}` : "http://10.0.2.2:5000/api/all/products");

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCustomServices(response.data.Items || []);
        } catch (error) {
            console.log('Error fetching services:', error);
        }
    };

    const getUserId = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const decodedObject = JSON.parse(utf8.decode(base64.decode(token.split(".")[1])));
                const id = decodedObject?.user?.id;
                if (id) {
                    setUserId(id);
                    return id;
                }
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
        return null;
    };

    const updateCartCount = async (id) => {
        try {
            console.log('Fetching cart count for user:', id);
            
            let cart = await AsyncStorage.getItem(`cart_${id}`);
            console.log('🛒 Raw Cart Data:', cart);
    
            cart = cart ? JSON.parse(cart) : {};
    
            let count = 0;
    
            // Loop through each shopOwner in the cart
            Object.values(cart).forEach(shop => {
                // Ensure we're accessing the 'products' field correctly
                const products = shop.products; // Access products from the shop object
                if (products) {
                    // Now loop through the products and count their quantities
                    Object.values(products).forEach(product => {
                        console.log('📦 Counting Product:', product);
                        count += product.quantity || 0; // Ensure quantity is a valid number
                    });
                }
            });
    
            console.log('🔄 Updated Cart Count:', count);
            setCartCount(count); // Ensure `setCartCount` is updating state correctly
        } catch (error) {
            console.error("❌ Error updating cart count:", error);
        }
    };
    
    
    
    
    const handleAddToCart = async (service) => {
        console.log('service',service);
        try {
            if (!userId) return;
    
            let cart = await AsyncStorage.getItem(`cart_${userId}`);
            cart = cart ? JSON.parse(cart) : {};
    
            const shopOwnerId = service.shop_owner;
            const productId = service._id;
    
            // ✅ Ensure shopOwner exists in cart
            if (!cart[shopOwnerId]) {
                const timestamp = new Date().toISOString(); // Generate datetime
                const trackingId = `${timestamp}:${userId}:${shopOwnerId}`; // Create tracking ID
                console.log('shop owner', shopOwnerId, 'tracking id', trackingId);
                cart[shopOwnerId] = {
                    trackingId, // Set tracking ID only once
                    products: {}, // Initialize products container
                };
            }
    
            // ✅ Ensure products object exists before accessing it
            if (!cart[shopOwnerId].products) {
                cart[shopOwnerId].products = {}; 
            }
    
            // ✅ Add or update product in the cart
            if (cart[shopOwnerId].products[productId]) {
                console.log(`Updating quantity for product ${productId}`);
                cart[shopOwnerId].products[productId].quantity += 1;
            } else {
                console.log(`Adding new product ${productId} to cart`);
                cart[shopOwnerId].products[productId] = {
                    product_image: `http://10.0.2.2:8081/src/assets/shop/${encodeURIComponent(service.product_name)}.jpg`,
                    product_name: service.product_name,
                    product_price: service.product_price,
                    product_id: service._id,
                    quantity: 1,
                };
            }
    
            // Save updated cart
            await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    
            // Fetch updated cart count immediately after adding an item
            await updateCartCount(userId);
    
            console.log("✅ Cart updated:", cart);
        } catch (error) {
            console.error("❌ Error adding product to cart:", error);
        }
    };
    
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={[
                styles.primaryContainer,
                { backgroundColor: colorScheme === 'dark' ? COLORS.darkColor : COLORS.white }
            ]}>
                {allShop && customServices.length > 0 ? (
                    <View style={styles.textContainer}>
                        <Text style={styles.userName}>
                            {customServices[0]?.full_name} {role === "seller" ? "Auto Spare Parts Shops" : "Auto Mechanic Shops"}
                        </Text>
                        <View style={styles.middleContainer}>
                            <Text style={styles.userEmail}>{customServices[0]?.email}</Text>
                            {role === 'seller' && 
                                <Pressable onPress={() => navigation.navigate('Cart')}>
                                    <View style={styles.cartContainer}>
                                        <MaterialCommunityIcons name="cart" size={24} color="white" />
                                        <Text style={styles.countText}>{cartCount}</Text>
                                    </View> 
                                </Pressable>
                            }
                        </View>
                    </View>
                ) : (
                    <View style={styles.textContainer}>
                        <View style={styles.middleContainer}>
                            <Text style={[{ fontSize: 30 }, styles.userEmail]}>
                                {role === 'seller' ? 'Product Dashboard' : 'Services Dashboard'}
                            </Text>
                            {role === 'seller' && 
                            <Pressable onPress={() => navigation.navigate('Cart')}>
                                <View style={styles.cartContainer}>
                                    <MaterialCommunityIcons name="cart" size={24} color="white" />
                                    <Text style={styles.countText}>{cartCount}</Text>
                                </View>
                                </Pressable>
                            }
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
                                handleAddToCart={() => handleAddToCart(item)}
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

            </SafeAreaView>
        </TouchableWithoutFeedback>
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
    middleContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Aligns items vertically
        width: '100%', // Takes full width
        paddingHorizontal: 10,
    },
    userEmail: {
        flex: 1, // Takes available space, centering it
        textAlign: 'center',
        color: COLORS.white,
    },
    cartContainer: {
        flexDirection: 'row', // Places icon and count side by side
        alignItems: 'center', // Aligns them properly
        gap: 3, // Adds spacing between icon and count
        marginRight: 2,
        borderRadius: 50, // Ensures rounded borders
        borderColor: COLORS.lightGray,
        borderWidth: 4,
        padding: 5,
    },
    
    countText: {
        color: COLORS.white,
        fontSize: 16,
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

