import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert, Dimensions, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS, FONTS } from "../../../constants/Constants";
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get("window");

const ShopsDashboard = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please sign in first.");
        return;
      }

      // Fetch data based on role
      const response = await axios.get(`http://10.0.2.2:5000/api/users/get-${role}s`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.Sellers);
    } catch (error) {
      console.error(`Error fetching ${role}s:`, error);
      Alert.alert("Error", `Failed to fetch ${role}s. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>
        {role === "seller" ? "Product Shops" : "Mechanic Shops"}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => navigation.navigate("ShopItem", { user: item._id, name:item. full_name, email: item.email })} 
            >
              <View style={styles.textContainer}>
                <Text style={styles.userName}>
                  {item.full_name} Auto Spare Parts Shop
                </Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
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
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 4,
    borderColor: COLORS.primary,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: width * 0.045,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    textAlign: "center",
  },
  userEmail: {
    fontSize: width * 0.04,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    textAlign: "center",
  },
});

export default ShopsDashboard;
