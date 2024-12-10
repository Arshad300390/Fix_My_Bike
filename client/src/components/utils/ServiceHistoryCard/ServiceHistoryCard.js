// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import { COLORS, FONTS } from '../../constants/Constants';

// const { width, height } = Dimensions.get('window');

// const ServiceHistoryCard = ({ item }) => {
//   return (
//     <View style={styles.card}>
//       <Text style={styles.serviceName}>Service: {item.serviceName}</Text>
//       <Text style={styles.details}>Bike: {item.bikeName}</Text>
//       <Text style={styles.details}>Comments: {item.comments}</Text>
//       <Text style={styles.price}>Total Price: ${item.totalPrice}</Text>
//       <Text
//         style={[
//           styles.status,
//           { color: item.status === 'done' ? COLORS.success : COLORS.warning },
//         ]}
//       >
//         Status: {item.status}
//       </Text>
//       <Text style={styles.timestamp}>
//         Date: {new Date(item.timestamp).toLocaleString()}
//       </Text>
//     </View>
//   );
// };

// export default ServiceHistoryCard;

// const styles = StyleSheet.create({
//   card: {
//     width: width * 0.9,
//     borderRadius: 12,
//     backgroundColor: COLORS.lightDark,
//     padding: 15,
//     marginBottom: height * 0.03,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   serviceName: {
//     fontSize: width * 0.05,
//     fontFamily: FONTS.bold,
//     color: COLORS.primary,
//     marginBottom: 10,
//   },
//   details: {
//     fontSize: width * 0.04,
//     fontFamily: FONTS.regular,
//     color: COLORS.white,
//     marginBottom: 5,
//   },
//   price: {
//     fontSize: width * 0.045,
//     fontFamily: FONTS.medium,
//     color: COLORS.primary,
//     marginTop: 10,
//   },
//   status: {
//     fontSize: width * 0.045,
//     fontFamily: FONTS.medium,
//     marginTop: 10,
//   },
//   timestamp: {
//     fontSize: width * 0.035,
//     fontFamily: FONTS.light,
//     color: COLORS.grey,
//     marginTop: 5,
//   },
// });


import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/Constants';

const ServiceHistoryCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpand} style={styles.card}>
      <Text style={styles.serviceName}>Service Name: {item.serviceName}</Text>
      <Text style={styles.details}>Bike: {item.bikeName}</Text>
      <Text style={styles.details}>Comments: {item.comments}</Text>
      <Text style={styles.price}>Total Price: ${item.totalPrice}</Text>
      <Text
        style={[
          styles.status,
          { color: /^done$/i.test(item.status)  ? COLORS.success : COLORS.warning },
        ]}
      >
        Status: {item.status}
      </Text>
      <Text style={styles.timestamp}>
        Date: {new Date(item.timestamp).toLocaleString()}
      </Text>

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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
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
});

export default ServiceHistoryCard;
