/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
import React from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../../../constants/Constants";

const { width } = Dimensions.get("window");

const ProductCard = ({ product, onEdit, onDelete}) => {
  
console.log("Product img:", product.img); // Log the product for debugging
  

  return (
    <View style={styles.card}>
      <Image 
         source={
          product.img
            ? { uri: product.img }
            : require('./../../../../assets/shop/default_img.png') // make sure this path is correct
        }
        style={styles.productImage} 
        resizeMode="cover"
        onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)} 
      />

      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.product_name}</Text>
        <Text style={styles.productPrice}>Price: ${product.product_price}</Text>
        <Text style={styles.productCompany}>Company: {product.product_company_name}</Text>
        <Text style={styles.productDescription}>Description: {product.product_description}</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(product)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(product._id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", 
    backgroundColor: COLORS.lightDark,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: "center", 
  },
  productImage: {
    width: width * 0.35, 
    height: width * 0.35, 
    borderRadius: 8,
    marginRight: 15, 
  },
  productDetails: {
    flex: 1, 
    width: "100%",
    alignItems: "center",
  },
  productName: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  productPrice: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  productCompany: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  productDescription: {
    fontSize: width * 0.03,
    fontFamily: FONTS.regular,
    color: COLORS.warning,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "start",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: COLORS.errorColor,
    paddingVertical: 2,
    paddingHorizontal:10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal:5
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
  },
});

export default ProductCard;
