import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS} from '../../../constants/Constants';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const EmergencyAssistance = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
        },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
          <Feather
            name="chevron-left"
            size={30}
            color={colorScheme === 'dark' ? COLORS.white : COLORS.dark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text
          style={[
            styles.headerTitleText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Emergency Assistance
        </Text>
        <Text
          style={[
            styles.headerDescriptionText,
            {color: colorScheme === 'dark' ? COLORS.white : COLORS.dark},
          ]}>
          Talk With Our Mechanics for Emergency Assistance.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={[
            styles.cardContainer,
            colorScheme === 'dark' ? COLORS.darkColor : COLORS.white,
          ]}>
          

          <View
            style={[
              styles.contactCard,
              {
                backgroundColor:
                  colorScheme === 'dark' ? COLORS.lightDark : COLORS.white,
              },
            ]}>
            <View style={styles.contactContainer}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  <Feather
                    name="phone-call"
                    size={25}
                    style={[
                      styles.icon,
                      {
                        color:
                          colorScheme === 'dark'
                            ? COLORS.white
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.045,
                      marginLeft: 10,
                      fontWeight: 'bold',
                    }}>
                    Contact With Us!
                  </Text>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.04,
                      marginLeft: 10,
                      marginTop: 5,
                    }}>
                   M Ali:
                  </Text>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.04,
                      marginLeft: 10,
                      marginTop: 5,
                    }}>Phone: (048) 3657832
                  </Text>
                  <Text
                    style={{
                      color:
                        colorScheme === 'dark' ? COLORS.white : COLORS.dark,
                      fontSize: width * 0.04,
                      marginLeft: 10,
                      marginTop: 5,
                    }}>
                    Email: fixmybike@gmail.com
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmergencyAssistance;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
  },

  scrollContainer: {
    paddingTop: height * 0.025,
  },

  headerTextContainer: {
    marginTop: height * 0.12,
    marginLeft: width * 0.05,
  },

  headerTitleText: {
    fontSize: width * 0.09,
    color: COLORS.dark,
    fontFamily: FONTS.bold,
  },

  headerDescriptionText: {
    color: COLORS.dark,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    left: width * 0.01,
  },

  cardContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.02,
    gap: 20,
  },

  EmergencyAssistanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
    gap: 20,
  },

  EmergencyAssistanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: width * 0.9,
    gap: 10,
    marginVertical: 10,
  },

  contactContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },

  icon: {
    color: COLORS.dark,
  },
});
