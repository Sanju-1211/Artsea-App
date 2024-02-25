import ProfileScreen from '../screens/ProfileScreen';
import React from 'react';
import { Platform, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import colors from '../config/colors';
import HomeScreenNavigator from './HomeScreenNavigator';

const Tab = createBottomTabNavigator();

function LandingScreenNavigator() {
  return (
    <Tab.Navigator  screenOptions={({route}) => ({
                                    tabBarHideOnKeyboard: true,
                                    tabBarStyle: {
                                      backgroundColor: colors.tabBackground,
                                      height:40,
                                    },
                                    tabBarShowLabel: false,
                                    headerShown: false,
                                  })}>

      <Tab.Screen name="HomeScreen" 
                  component={HomeScreenNavigator}
                  options={{
                    tabBarIcon: ({focused}) => (
                      <View
                        style={{
                          top: Platform.OS === 'ios' ? 10 : 0,
                        }}>
                        <MaterialCommunityIcons name="home" size={24} color={colors.tabText} />
                      </View>
                    ),
                  }} 
                  />
      <Tab.Screen name="Cart" 
                  component={HomeScreenNavigator} 
                  options={{
                    tabBarIcon: ({focused}) => (
                      <View
                        style={{
                          top: Platform.OS === 'ios' ? 10 : 0,
                        }}>
                        <MaterialCommunityIcons name="cart-variant" size={24} color={colors.tabText} />
                      </View>
                    ),
                  }} 
                  />
      <Tab.Screen name="Message" 
                  component={HomeScreenNavigator} 
                  options={{
                    tabBarIcon: ({focused}) => (
                      <View
                        style={{
                          top: Platform.OS === 'ios' ? 10 : 0,
                        }}>
                        <MaterialCommunityIcons name="facebook-messenger" size={24} color={colors.tabText}  />
                      </View>
                    ),
                  }} 
                  />      
      <Tab.Screen name="Profile" 
                  component={ProfileScreen} 
                  options={{
                    tabBarIcon: ({focused}) => (
                      <View
                        style={{
                          top: Platform.OS === 'ios' ? 10 : 0,
                        }}>
                        <Ionicons name="person-circle" size={24} color={colors.tabText} />
                      </View>
                    ),
                  }} 
                  />       
    </Tab.Navigator>
  );
}

export default LandingScreenNavigator; 


