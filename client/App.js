import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {COLORS} from './src/components/constants/Constants';
import Splash from './src/components/shared/Splash';
import Signin from './src/components/shared/Signin';
import Signup from './src/components/shared/Signup';
import ChangePassword from './src/components/shared/ChangePassword';
import ForgotPassword from './src/components/shared/ForgotPassword';
import BottomNavigator from './src/components/navigation/BottomNavigator';
import DetailProfileScreen from './src/components/screens/extraScreens/ProfileUpdate/DetailProfileScreen';
import CustomerCare from './src/components/screens/extraScreens/CustomerCare/CustomerCare';
import ServiceCenterLocator from './src/components/screens/extraScreens/ServiceCenterLocator/ServiceCenterLocator';
import EmergencyAssistance from './src/components/screens/extraScreens/EmergencyAssistance/EmergencyAssistance';
import ChatBot from './src/components/screens/extraScreens/CustomerCare/ChatBot';
import AddBikes from './src/components/screens/extraScreens/BikeManagement/AddBikes';
import MyBikes from './src/components/screens/extraScreens/BikeManagement/MyBikes';
import TopNavigator from './src/components/navigation/TopNavigator';
import BikeDetailed from './src/components/screens/extraScreens/BikeManagement/BikeDetailed';
import Bookings from './src/components/screens/extraScreens/Bookings/Bookings';
import Services from './src/components/screens/extraScreens/Bookings/Services';
import ServiceBooking from './src/components/screens/extraScreens/Bookings/ServiceBooking';
import SheduleBooking from './src/components/screens/extraScreens/Bookings/BookingsToShedule';
import AddProduct from './src/components/screens/extraScreens/SellerScreens/ProductForm';
import EditProduct from './src/components/screens/extraScreens/SellerScreens/EditForm';
import AddService from './src/components/screens/extraScreens/MechanicScreens/ServiceForm';
import EditService from './src/components/screens/extraScreens/MechanicScreens/EditForm';

const Stack = createNativeStackNavigator();

const App = () => {
  const [statusBarColor, setStatusBarColor] = useState(COLORS.primary);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={statusBarColor} barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        <Stack.Screen name="Splash">
          {props => <Splash {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Signin">
          {props => <Signin {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Signup">
          {props => <Signup {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Change_Password">
          {props => (
            <ChangePassword {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Forgot_Password">
          {props => (
            <ForgotPassword {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Main">
          {props => (
            <BottomNavigator {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Edit_Profile">
          {props => (
            <DetailProfileScreen
              {...props}
              setStatusBarColor={setStatusBarColor}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Customer_Care">
          {props => (
            <CustomerCare {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Emergency_Assistance">
          {props => (
            <EmergencyAssistance {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Service_Center_Locator">
          {props => (
            <ServiceCenterLocator {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Chat_Bot">
          {props => (
            <ChatBot {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="My_Bikes">
          {props => (
            <TopNavigator {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Add_Bikes">
          {props => (
            <AddBikes {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Get_Bikes">
          {props => (
            <MyBikes {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Bike_Detailed">
          {props => (
            <BikeDetailed {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
        <Stack.Screen name="My_Bookings">
          {props => (
            <Bookings {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Services">
          {props => (
            <Services {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Service_Booking">
          {props => (
            <ServiceBooking {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Shedule_Booking">
          {props => (
            <SheduleBooking {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Add_Product">
          {props => (
            <AddProduct {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Edit_Product">
          {props => (
            <EditProduct {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Add_Service">
          {props => (
            <AddService {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Edit_Service">
          {props => (
            <EditService {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
