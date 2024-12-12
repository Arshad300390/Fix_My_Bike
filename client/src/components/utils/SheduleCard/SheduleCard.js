import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Card = ({ notShedule, navigation }) => {
  const handleGetScheduled = () => {
    navigation.navigate('Shedule_Booking');
  };
console.log('count',notShedule);
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>
        {notShedule === 1 ? (
          <>
            <Text style={styles.number}>{notShedule}</Text>
            <Text> Booking is </Text>
          </>
        ) : (
          <>
            <Text style={styles.number}>{notShedule}</Text>
            <Text> Bookings are </Text>
          </>
        )}
        {' remaining to schedule'}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity  style={styles.button} onPress={handleGetScheduled}>
          <Text style={styles.buttonText}>
            Shedule
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  number: {
    color: 'red', 
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default Card;
