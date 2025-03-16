/* eslint-disable curly */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
import { View, Text, FlatList, StyleSheet, Dimensions, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import base64 from 'base-64'
import utf8 from 'utf8'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../../constants/Constants';
const { width, height } = Dimensions.get("window");
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';


const Checkout = () => {
        const navigation = useNavigation();
    
  

    return (
        <>
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <View style={styles.middleContainer}>
                        <Text style={styles.cartTitle}> Checkout Page</Text>
                       
                    </View>

                </View>

              

            </View>
            <View style={styles.bottomContainer} >
                
                    <Pressable >
                        <Text >Proceed</Text>
                    </Pressable>
                   
                
            </View>
        </>
    );
};
export default Checkout;


const styles = StyleSheet.create({
  
})
