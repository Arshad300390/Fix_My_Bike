/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, FlatList, Dimensions,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../../constants/Constants';
import { jwtDecode } from "jwt-decode";
import base64 from 'base-64';
import utf8 from 'utf8';

const { width, height } = Dimensions.get('window');

const NotificationsManager = () => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [notifications, setNotifications] = useState([]); // Store all notifications
  const [userId, setUserId] = useState(null);


  // Show and Hide Date Picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    const dt = new Date(selectedDate);
    const formattedDate = `${dt.getDate().toString().padStart(2, "0")}-${(dt.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dt.getFullYear()}`;
    setDate(formattedDate);
    hideDatePicker();
  };

  // Show and Hide Time Picker
  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleTimeConfirm = (ctime) => {
    const dt = new Date(ctime);
    const formattedTime = dt.toLocaleTimeString("en-GB", { hour12: false }); // 24-hour format
    setTime(formattedTime);
    hideTimePicker();
  };

  // Ensure Notification Channel Exists
  PushNotification.createChannel(
    {
      channelId: "local_notifications",
      channelName: "Local Notifications",
      channelDescription: "Notifications for local messages",
      importance: 4, // HIGH priority
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`)
  );

  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const encodedPayload = token.split(".")[1]; // JWT payload
        const decodedBytes = base64.decode(encodedPayload);
        const decodedText = utf8.decode(decodedBytes);
        const decodedObject = JSON.parse(decodedText);
        const id = decodedObject?.user?.id;
        setUserId(id);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const saveNotificationsToStorage = async (newNotifications) => {
    try {
      if (!userId) {
        console.error("User ID is missing!");
        return;
      }

      const userNotificationsKey = `notifications_${userId}`;
      await AsyncStorage.setItem(userNotificationsKey, JSON.stringify(newNotifications));
      console.log(`Notifications saved for user: ${userId}`);
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  };

  const loadNotificationsFromStorage = async () => {
    try {

      if (!userId) {
        console.error("User ID is missing!");
        return [];
      }
      const notiKey = `notifications_${userId}`;

      const storedNotifications = await AsyncStorage.getItem(notiKey);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    getUserId();
    loadNotificationsFromStorage();
  }, []);

  const setNotificationHandler = async (heading, details, scheduleDate) => {
    console.log("Scheduling Notification for:", scheduleDate);

    PushNotification.localNotificationSchedule({
      channelId: "local_notifications",
      title: heading,
      message: details,
      date: scheduleDate, // Schedule time
      allowWhileIdle: true, // Ensure it triggers in Doze mode
    });

    console.log("Notification Scheduled!");
    Alert.alert("✅ Notification Set", `Your notification is set for ${date} at ${time}`);

    const newNotification = {
      id: Date.now(),
      title: heading,
      message: details,
      date,
      time,
    };

    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    await saveNotificationsToStorage(updatedNotifications);
  };

  const handleSetNotification = () => {
    if (!title.trim()) {
      Alert.alert("⚠️ Error", "Please enter a title for the notification.");
      return;
    }

    if (!message.trim()) {
      Alert.alert("⚠️ Error", "Please enter a message for the notification.");
      return;
    }

    if (!date || !time) {
      Alert.alert("⚠️ Error", "Please select a date and time before setting the notification.");
      return;
    }

    const [day, month, year] = date.split("-");
    const [hours, minutes] = time.split(":");

    const scheduleDate = new Date(year, month - 1, day, hours, minutes, 0);

    setNotificationHandler(title, message, scheduleDate);
  };

  const deleteNotification = async (id) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
    await saveNotificationsToStorage(updatedNotifications);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formStyle}>
        <Text style={styles.title}>Schedule a Notification:</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter notification title"
          placeholderTextColor={COLORS.white}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter notification message"
          placeholderTextColor={COLORS.white}
          value={message}
          onChangeText={setMessage}
        />

        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
            <Text style={styles.buttonText}>Select Date</Text>
          </TouchableOpacity>

          <Text style={styles.selectedDate}>{date ? date : "No date selected"}</Text>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>

        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={showTimePicker} style={styles.dateButton}>
            <Text style={styles.buttonText}>Select Time</Text>
          </TouchableOpacity>

          <Text style={styles.selectedDate}>{time ? time : "No time selected"}</Text>

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />
        </View>

        <TouchableOpacity onPress={handleSetNotification} style={[styles.dateButton, styles.setNotificationButton]}>
          <Text style={styles.buttonText}>Set Notification</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>My Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text>{item.message}</Text>
            <Text>{item.date} at {item.time}</Text>
            <TouchableOpacity onPress={() => deleteNotification(item.id)} style={styles.deleteButton}>
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationsManager;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  formStyle: {
    justifyContent: 'center',
    backgroundColor: COLORS.lightDark,
    padding: width * 0.05,
    marginBottom: 20,
    borderRadius: width * 0.02,
  },
  title: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: COLORS.dark,
    backgroundColor: COLORS.white,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dateButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    color: COLORS.white,
    fontWeight: "bold",
  },
  selectedDate: {
    color: COLORS.white,
  },
  setNotificationButton: {
    marginVertical: 10,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
  },
});
