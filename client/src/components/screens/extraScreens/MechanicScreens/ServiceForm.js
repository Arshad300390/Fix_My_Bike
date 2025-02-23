import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, FONTS } from "../../../constants/Constants";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width } = Dimensions.get("window");

const ServiceForm = ({ onSubmit }) => {
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceModel, setServiceModel] = useState("");
  const [enginePower, setEnginePower] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!serviceName || !servicePrice || !serviceModel || !enginePower || !serviceDescription) {
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

      const serviceData = {
        service_name: serviceName,
        service_price: parseFloat(servicePrice),
        service_model: serviceModel,
        engine_power: enginePower,
        service_description: serviceDescription,
      };

      const response = await axios.post("http://10.0.2.2:5000/api/shop/services", 
        serviceData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Service added successfully!");
        setServiceName("");
        setServicePrice("");
        setServiceModel("");
        setEnginePower("");
        setServiceDescription("");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error adding service:", error);
      Alert.alert("Error", "Failed to add service. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Service Form</Text>

      <TextInput placeholder="Service Name" value={serviceName} onChangeText={setServiceName} style={styles.input} />
      <TextInput placeholder="Service Price" value={servicePrice} onChangeText={setServicePrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Model/Company" value={serviceModel} onChangeText={setServiceModel} style={styles.input} />
      <TextInput placeholder="Engine Power (CC)" value={enginePower} onChangeText={setEnginePower} keyboardType="numeric" style={styles.input} />
      <TextInput 
        placeholder="Service Description" 
        value={serviceDescription} 
        onChangeText={setServiceDescription} 
        multiline 
        numberOfLines={4} 
        style={styles.input} 
      />

      <TouchableOpacity style={styles.addService} onPress={handleSubmit}>
        <Text style={styles.serviceText}>Add Service</Text>
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
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  addService: {
    backgroundColor: COLORS.primary,
    margin: 10,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  serviceText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },
});

export default ServiceForm;
