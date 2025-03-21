import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { COLORS, FONTS } from "../../../constants/Constants";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width } = Dimensions.get("window");

const ProductForm = ({ onSubmit }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCompanyName, setProductCompanyName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!productName || !productPrice || !productCompanyName || !productDescription) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please sign in first.");
        navigation.replace("Signin");
        return;
      }

      const productData = {
        product_name: productName,
        product_price: parseFloat(productPrice),
        product_company_name: productCompanyName,
        product_description: productDescription,
      };

      const response = await axios.post("http://10.0.2.2:5000/api/add-product", 
        productData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Product added successfully!");
        setProductName("");
        setProductPrice("");
        setProductCompanyName("");
        setProductDescription("");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Form</Text>
      <Text style={styles.label}>Select Product</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={productName} onValueChange={(itemValue) => setProductName(itemValue)} style={styles.picker}>
          <Picker.Item label="Select Product" value="" />
          <Picker.Item label="Filter" value="filter" />
          <Picker.Item label="Chain" value="chain" />
          <Picker.Item label="Oil" value="oil" />
          <Picker.Item label="Tyre" value="tyre" />
          <Picker.Item label="Headlight" value="headlight" />
          <Picker.Item label="Meter" value="meter" />
          <Picker.Item label="Battery" value="battery" />
        </Picker>
      </View>
      <TextInput placeholder="Price" value={productPrice} onChangeText={setProductPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Company Name" value={productCompanyName} onChangeText={setProductCompanyName} style={styles.input} />
      <TextInput placeholder="Product Description" value={productDescription}
       onChangeText={setProductDescription} multiline numberOfLines={4} style={styles.input} />
      <TouchableOpacity style={styles.addProduct} onPress={handleSubmit}>
        <Text style={styles.productText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    paddingVertical: 10,
    color: COLORS.primary,
    fontSize: width * 0.055,
    fontFamily: FONTS.bold,
    textAlign: "center",
  },
  label: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  addProduct: {
    backgroundColor: COLORS.primary,
    margin: 10,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  productText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },
});

export default ProductForm;
