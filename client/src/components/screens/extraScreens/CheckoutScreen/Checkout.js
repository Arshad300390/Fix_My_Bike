/* eslint-disable curly */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
import { View, Text, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, ScrollView, Keyboard, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Checkout = ({ route }) => {
    const navigation = useNavigation();

    const { shopOwnerId, userId, trackingId, items, total } = route.params || {};

    // State for payment selection
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [bankName, setBankName] = useState("");
    const [transactionId, setTransactionId] = useState("");

 

    // Function to handle proceed button
    const handleProceed = async () => {
        if (!selectedPayment) {
            Alert.alert("Payment Error", "Please select a payment type.");
            return;
        }
    
        let paymentDetails = {};
    
        if (selectedPayment === "wallet") {
            if (!selectedWallet || !transactionId) {
                Alert.alert("Payment Error", "Please select a digital wallet and enter the transaction ID.");
                return;
            }
            paymentDetails = {
                paymentType: "Digital Wallet",
                walletType: selectedWallet,
                transactionId: transactionId,
            };
        } else if (selectedPayment === "bank") {
            if (!bankName || !transactionId) {
                Alert.alert("Payment Error", "Please enter both bank name and transaction ID.");
                return;
            }
            paymentDetails = {
                paymentType: "Bank Account",
                bankName: bankName,
                transactionId: transactionId,
            };
        }
    
        const checkoutData = {
            userId,
            shopOwnerId,
            trackingId,
            totalAmount: total,
            cartItems: items,
            ...paymentDetails,
        };
    
        
    
        try {
            const token = await AsyncStorage.getItem('token');
    
            if (!token) {
                navigation.replace('Signin');
                return;
            }
    
            const response = await fetch("http://10.0.2.2:5000/api/checkout/create", { // Fixed server IP
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Fixed Authorization header
                },
                body: JSON.stringify(checkoutData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                Alert.alert("Checkout Success", "Your order has been placed successfully.");
                
                let cart = await AsyncStorage.getItem(`cart_${userId}`);
                cart = cart ? JSON.parse(cart) : {};
    
                if (cart[shopOwnerId]) {
                    delete cart[shopOwnerId]; // Remove only this shop owner's data
                }
    
                await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
               navigation.navigate('Home');
            } else {
                Alert.alert("Checkout Failed", data.error || "Something went wrong.");
                console.error("❌ Server Error:", data);
            }
        } catch (error) {
            Alert.alert("Network Error", "Failed to connect to the server.");
            console.error("❌ Network Error:", error);
        }
    };
    
    

    return (
        <>
          <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
    >
         <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.cartTitle}>Checkout Page</Text>
                </View>

                {/* Payment Type Selection */}
                <View style={styles.paymentContainer}>
                    <Text style={styles.sectionTitle}>Payment Type</Text>

                    {/* Digital Wallet Option */}
                    <Pressable 
                        style={styles.radioContainer} 
                        onPress={() => setSelectedPayment("wallet")}
                    >
                        <MaterialCommunityIcons 
                            name={selectedPayment === "wallet" ? "radiobox-marked" : "radiobox-blank"} 
                            size={24} 
                            color={COLORS.primary} 
                        />
                        <Text style={styles.radioLabel}>Digital Wallet</Text>
                    </Pressable>

                    {/* Show Digital Wallet Options if selected */}
                    {selectedPayment === "wallet" && (
                        <View style={styles.walletOptions}>
                            {["JazzCash", "EasyPaisa", "UfonePay"].map((wallet) => (
                                <Pressable 
                                    key={wallet} 
                                    style={styles.radioContainer} 
                                    onPress={() => setSelectedWallet(wallet)}
                                >
                                    <MaterialCommunityIcons 
                                        name={selectedWallet === wallet ? "radiobox-marked" : "radiobox-blank"} 
                                        size={22} 
                                        color={COLORS.secondary} 
                                    />
                                    <Text style={styles.radioLabel}>{wallet}</Text>
                                </Pressable>
                            ))}

                            {/* Show Transaction ID input if a wallet is selected */}
                            {selectedWallet && (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Transaction ID"
                                    value={transactionId}
                                    onChangeText={setTransactionId}
                                />
                            )}
                        </View>
                    )}

                    {/* Bank Account Option */}
                    <Pressable 
                        style={styles.radioContainer} 
                        onPress={() => {
                            setSelectedPayment("bank");
                            setSelectedWallet(null); // Reset wallet selection
                        }}
                    >
                        <MaterialCommunityIcons 
                            name={selectedPayment === "bank" ? "radiobox-marked" : "radiobox-blank"} 
                            size={24} 
                            color={COLORS.primary} 
                        />
                        <Text style={styles.radioLabel}>Bank Account</Text>
                    </Pressable>

                    {/* Show Bank Inputs if Bank Account is selected */}
                    {selectedPayment === "bank" && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Bank Name"
                                value={bankName}
                                onChangeText={setBankName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Transaction ID"
                                value={transactionId}
                                onChangeText={setTransactionId}
                            />
                        </>
                    )}
                </View>
            </View>
            </ScrollView>
            {/* Proceed Button */}
            <View style={styles.bottomContainer}>
                <Pressable style={styles.proceedButton} onPress={handleProceed}>
                    <Text style={styles.proceedText}>Proceed</Text>
                </Pressable>
            </View>
            </KeyboardAvoidingView>
        </>
    );
};

export default Checkout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8'
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    cartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    paymentContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioLabel: {
        fontSize: 16,
        marginLeft: 10,
    },
    walletOptions: {
        marginLeft: 20,
        marginTop: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    proceedButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 10,
    },
    proceedText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
