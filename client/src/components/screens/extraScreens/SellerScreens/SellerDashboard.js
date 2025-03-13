/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProductCard from "./ProductCard"; // Adjust the path based on your file structure

const { width } = Dimensions.get('window');

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please sign in first.");
        navigation.replace("Signin");
        return;
      }

      const response = await axios.get("http://10.0.2.2:5000/api/get-products", {
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
    fetchProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleEdit = (product) => {
    navigation.navigate("Edit_Product", { product });
  };

  const handleDelete = async (productId) => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Authentication Error", "Please sign in first.");
              navigation.replace("Signin");
              return;
            }
            await axios.delete(`http://10.0.2.2:5000/api/remove-product/${productId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            Alert.alert("Success", "Product deleted successfully!");
            fetchProducts();
          } catch (error) {
            console.error("Delete failed:", error);
            Alert.alert("Error", "Failed to delete product.");
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Seller Dashboard</Text>

      {/* Products and Add Product Button in the Same Row */}
      <View style={styles.headerRow}>
        <Text style={styles.productsText}>Products</Text>
        <TouchableOpacity style={styles.addProduct} onPress={() => navigation.navigate("Add_Product")}>
          <Text style={styles.productText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) =>
            <ProductCard product={item}
              onEdit={handleEdit} onDelete={handleDelete}
            />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  header: {
    fontSize: width * 0.06,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  productsText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  listContainer: {
    paddingBottom: 20,
  },
  addProduct: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  productText: {
    color: COLORS.white,
    fontSize: width * 0.04,
    fontFamily: FONTS.bold,
  },
});

export default SellerDashboard;
