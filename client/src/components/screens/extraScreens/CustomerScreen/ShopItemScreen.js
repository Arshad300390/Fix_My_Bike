import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet,  Alert, Dimensions, Text} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS, FONTS } from "../../../constants/Constants";
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get("window");
import { useRoute } from "@react-navigation/native";
import ProductCard from "./ProductCard";

const ShopItemScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const userId = route.params?.user;
    const name = route.params?.name;
    const email = route.params?.email;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Authentication Error", "Please sign in first.");
              navigation.replace("Signin");
              return;
            }
      
            const response = await axios.get(`http://10.0.2.2:5000/api/get-products/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            setProducts(response.data.Products);
          } catch (error) {
            console.error("Error fetching products:", error);
            Alert.alert("Error", "Failed to fetch products. Please try again.");
          } finally {
            setLoading(false);
          }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <View style={styles.screen}>
            <View style={styles.textContainer}>
                <Text style={styles.userName}>
                  {name} Auto Spare Parts Shop
                </Text>
                <Text style={styles.userEmail}>{email}</Text>
              </View>
           <FlatList
          data={products}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) =>
            <ProductCard product={item}
              
            />}
          contentContainerStyle={styles.listContainer}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.white,
    },
    textContainer: {
        marginLeft: 10,
        paddingVertical: 10,
      },
      userName: {
        fontSize: width * 0.045,
        fontFamily: FONTS.extraBold,
        color: COLORS.primary,
        textAlign: "center",
      },
      userEmail: {
        fontSize: width * 0.04,
        fontFamily: FONTS.regular,
        color: COLORS.dark,
        textAlign: "center",
        borderBottomColor: COLORS.primary,
        borderBottomWidth: 4,
        paddingBottom: 5,
      },
    
});

export default ShopItemScreen;
