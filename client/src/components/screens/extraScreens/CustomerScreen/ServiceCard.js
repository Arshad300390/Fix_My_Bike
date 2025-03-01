import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../../../constants/Constants';

const { width } = Dimensions.get('window');

const ProductCard = ({ service }) => {
  return (
    <View style={styles.card}>
      <View style={styles.productDetails}>
        <Text style={styles.serviceName}>{service.service_name}</Text>
        <Text style={styles.servicePrice}>Price: ${service.service_price}</Text>
        <Text style={styles.serviceText}>Model: {service.service_model}</Text>
        <Text style={styles.serviceText}>Engine Power: {service.engine_power}</Text>
        <Text style={styles.serviceText}>description: {service.service_description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    elevation: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  servicePrice: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  productText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.bold,
  },
});

export default ProductCard;
