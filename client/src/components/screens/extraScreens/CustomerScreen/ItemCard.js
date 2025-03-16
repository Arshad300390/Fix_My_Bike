/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Modal, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../../../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ItemCard = ({ service, role, setAllShop, userId, handleAddToCart, }) => {
  console.log(service);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  
 

  // const getUserId = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       const encodedPayload = token.split(".")[1]; // JWT payload
  //       const decodedBytes = base64.decode(encodedPayload);
  //       const decodedText = utf8.decode(decodedBytes);
  //       const decodedObject = JSON.parse(decodedText);
  //       const id = decodedObject?.user?.id;
  //       setUserId(id);
  //     }
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //   }
  // };

  const handleBooking = () => {
    navigation.navigate('Service_Booking', {
      service_image: service.service_image,
      service_name: service.service_name,
      service_description: service.service_description,
      service_price: String(service.service_price),
      service_id: service.service_id,
    });
  };
  



  let imageUrl = 'https://';
  if (role === 'mechanic') {
    imageUrl = "https://img.freepik.com/premium-photo/motorcycle-set-tuning-customizing-shop_1098-7606.jpg";

    if (service.service_name?.toLowerCase().includes("oil change")) {
      imageUrl = "https://media.istockphoto.com/id/1174788025/photo/the-process-of-pouring-new-oil-into-the-motorcycle-engine.jpg?s=612x612&w=0&k=20&c=IQHgBZ4SdLc6urAyfY-srbXaXeTxBZpWvbEUMPlj2_U=";
    } else if (service.service_name?.toLowerCase().includes("tyre change")) {
      imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2dC1oSGcqSdmccoXHsSbh_0Rs1qoC4vKwY3K6r9uP5zVR7qQJsEOpihapFg6OXqxD9jc&usqp=CAU";
    } else if (service.service_name?.toLowerCase().includes("head light change")) {
      imageUrl = "https://www.shutterstock.com/shutterstock/photos/329460197/display_1500/stock-photo-headlight-and-wheel-of-an-old-motorcycle-329460197.jpg";
    }
  } else {
    imageUrl = `http://10.0.2.2:8081/src/assets/shop/${service.product_name}.jpg`;
  }

  return (
    <SafeAreaView style={styles.primaryContainer}>
      {/* Card Clickable to Open Modal */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                onError={(e) => console.log("Image failed to load:", e.nativeEvent.error)}
              />
            </View>

            <View style={styles.productDetails}>
              <Text style={styles.serviceName}>
                {role === "mechanic" ? service.service_name : service.product_name}
              </Text>
              <Text style={styles.servicePrice}>
                Price: ${role === 'mechanic' ? service.service_price : service.product_price}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>

      {/* Modal for Showing Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Image source={{ uri: imageUrl }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{service.service_name}</Text>
              <Text style={styles.modalPrice}>Price: ${service.service_price}</Text>
              <Text style={styles.modalText}>Model: {service.service_model}</Text>
              <Text style={styles.modalText}>Engine Power: {service.engine_power}</Text>
              <Text style={styles.modalText}>Description: {service.service_description}</Text>

              {/* Fake Reviews */}
              <Text style={styles.reviewTitle}>Customer Reviews</Text>
              <View style={styles.reviewContainer}>
                <Text style={styles.reviewText}>⭐ 4.5 - "Great service, highly recommended!"</Text>
                <Text style={styles.reviewText}>⭐ 4.0 - "Fast and efficient, worth the price!"</Text>
                <Text style={styles.reviewText}>⭐ 5.0 - "Amazing experience, will book again!"</Text>
              </View>

              {/* Buttons for Booking & Visiting Shop */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => {
                    if (role === "mechanic") {
                      handleBooking();
                    } else if (role === "seller") {
                      handleAddToCart(userId, service,);
                      console.log("I am click");
                    }
                  }}
                >
                  <Text style={styles.buttonText}>{role === 'mechanic' ? 'Book Service' : 'Add to Cart'}</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={styles.visitButton}
                  onPress={() => {
                    console.log('Visiting single shop...');
                    setAllShop(service.shop_owner);
                    setModalVisible(false); // Close modal
                    //navigation.navigate('Shop', { role: role, allShop: service.shop_owner });
                  }}
                >
                  <Text style={styles.buttonText}>Visit Shop</Text>
                </TouchableOpacity>
              </View>

              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  card: {
    width: width * 0.9,
    borderRadius: 12,
    padding: width * 0.025,
    shadowColor: COLORS.white,
    shadowOffset: { width: width * 0.012, height: height * 0.012 },
    shadowOpacity: 0.2,
    shadowRadius: width * 0.008,
    elevation: 2,
    backgroundColor: COLORS.lightDark,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: height * 0.25,
    overflow: 'hidden',
    borderRadius: width * 0.02,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productDetails: {
    alignItems: 'center',
    paddingVertical: height * 0.015,
  },
  serviceName: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    marginTop: height * 0.01,
    textAlign: 'center',
    color: COLORS.white,
  },
  servicePrice: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: width * 0.05,
    borderRadius: width * 0.025,
    marginHorizontal: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',

  },
  modalImage: {
    width: width * 0.65,
    height: height * 0.2,
    borderRadius: width * 0.025,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: height * 0.012,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: width * 0.045,
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalText: {
    fontSize: width * 0.04,
    marginVertical: height * 0.001,
    textAlign: 'center',
  },
  reviewTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: height * 0.015,
    textAlign: 'center',
  },
  reviewContainer: {
    backgroundColor: '#f2f2f2',
    padding: width * 0.025,
    borderRadius: width * 0.025,
    marginTop: height * 0.012,
  },
  reviewText: {
    fontSize: width * 0.035,
    marginBottom: height * 0.005,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.015,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    padding: width * 0.025,
    borderRadius: width * 0.015,
    flex: 1,
    marginRight: width * 0.012,
    alignItems: 'center',
  },
  visitButton: {
    backgroundColor: COLORS.darkColor,
    padding: width * 0.025,
    borderRadius: width * 0.015,
    flex: 1,
    marginLeft: width * 0.012,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: width * 0.035,
  },
  closeButton: {
    backgroundColor: COLORS.lightGray,
    padding: width * 0.025,
    borderRadius: width * 0.015,
    marginTop: height * 0.012,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: width * 0.04,
    color: COLORS.darkColor,
  },
});


export default ItemCard;
