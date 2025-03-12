/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../../../constants/Constants";

const { width } = Dimensions.get("window");

const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceName}>{service.service_name}</Text>
        <Text style={styles.serviceDetail}>Model/Company: {service.service_model}</Text>
        <Text style={styles.serviceDetail}>Engine Power: {service.engine_power} CC</Text>
        <Text style={styles.servicePrice}>Price: ${service.service_price}</Text>
        <Text style={styles.serviceDescription}>{service.service_description}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(service)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(service._id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
    color: 'red',
  },
  serviceDetail: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
  },
  servicePrice: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  serviceDescription: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: COLORS.errorColor,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
  },
});

export default ServiceCard;