/* eslint-disable quotes */
// this is the new method get token 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';

import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
const messaging = getMessaging(getApp());

export const requestUserPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                    title: "Notification Permission",
                    message: "This app needs access to send you notifications.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await getFcmToken();  // ✅ Only if permission granted
                return true;
            } else {
                console.log("Notification permission denied");
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    } else {
        // If the platform is not Android 13+ (either older Android versions or iOS), no need to ask for permission
        console.log('No need to request permission on this platform');
        await getFcmToken();
        return true;
    }
};
//get token fcm
 export const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    console.log('token', fcmToken);
    if (!fcmToken) {
        try {
            const fcmToken = await getToken(messaging);
            if (fcmToken) {
                console.log('new gen token', fcmToken);
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        } catch (error) {
            console.log(error, 'error in fcm token');
        }
    }
}
