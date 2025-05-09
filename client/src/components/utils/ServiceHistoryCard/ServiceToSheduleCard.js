import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Constants';

const ServiceToSheduleCard = ({ item, role, onShowInProgress, onComplete, status, onSchedule }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  //console.log('role', role);
  //console.log('dated', item.scheduleDate);

  return (
    <TouchableOpacity onPress={toggleExpand} style={styles.card}>
      <Text style={styles.serviceName}>Service Name: {item.serviceName}</Text>
      <Text style={styles.mechanicName}>Mechanic Name: {item.mechanicName}</Text>
      <Text style={styles.details}>Bike: {item.bikeName}</Text>
      <Text style={styles.details}>Comments: {item.comments}</Text>
      <Text style={styles.price}>Total Price: ${item.totalPrice}</Text>
      <Text
        style={[
          styles.status,
          { color: /^completed$/i.test(item.status) ? COLORS.success : COLORS.warning },
        ]}
      >
        Status: {item.status}
      </Text>
      <Text style={styles.timestamp}>
        ScheduleDate: {item.scheduleDate ? new Date(item.scheduleDate).toLocaleString() : 'Not Scheduled Yet'}
      </Text>

      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.showInProgressButton}
          onPress={() => onSchedule(item._id, 'completed')}
        >
          <Text style={styles.showInProgressButtonText}>Schedule Date</Text>
        </TouchableOpacity>
      )}

      {/* Conditional rendering for additional information */}
      {expanded && (
        <View style={styles.additionalInfo}>
          <Text style={styles.details}>Bike Company: {item.bikeCompanyName}</Text>
          <Text style={styles.details}>Bike Model: {item.bikeModel}</Text>
          <Text style={styles.details}>Bike Registration: {item.bikeRegNumber}</Text>
          <Text style={styles.details}>Service Location: {item.dropOff}</Text>
          <Text style={styles.details}>Address: {item.address}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  mechanicName: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: COLORS.darkColor,
  },
  details: {
    fontSize: 14,
    color: COLORS.dark,
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.dark,
    marginTop: 4,
  },
  additionalInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 26,
  },
  showInProgressButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignSelf: 'flex-end', // Position the button on the right side
  },
  showInProgressButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  completeButton: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.success, // Adjust color as needed
    borderRadius: 5,
    alignSelf: 'flex-end', // Position the button on the right side
  },
  completeButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
});

export default ServiceToSheduleCard;
