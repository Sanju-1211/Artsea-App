//import ProfileScreen from '../screens/ProfileScreen';
import React from 'react';
import { Platform, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons , Entypo} from '@expo/vector-icons';
import colors from '../config/colors';
import HomeScreenNavigator from './HomeScreenNavigator';
import CheckoutScreenNavigator from './CheckoutScreenNavigator';
import BuyerProfileScreenNavigator from './BuyerProfileScreenNavigator';
import WishListScreenNavigator from './WishListScreenNavigator';

const Tab = createBottomTabNavigator();
const seller=false;

function AppNavigator() {
    return (
        <Tab.Navigator  screenOptions={({route}) => ({
                                        tabBarHideOnKeyboard: true,
                                        tabBarStyle: {
                                        backgroundColor: colors.white,
                                        },
                                        tabBarShowLabel: false,
                                        headerShown: false,
                                    })}>

        <Tab.Screen name="HomeScreen" 
                    component={HomeScreenNavigator}
                    options={{
                        tabBarIcon: ({focused}) => (
                            focused? (
                                <View>
                            <MaterialCommunityIcons name="home" size={28} color={colors.black} />
                        </View>
                            ) : (
                                <View>
                            <MaterialCommunityIcons name="home-outline" size={28} color={colors.black} />
                        </View>
                            )
                        ),
                    }} 
                    />
      
            <Tab.Screen name="Cart" 
                    component={CheckoutScreenNavigator} 
                    options={{
                        tabBarIcon: ({focused}) => (
                        <View
                            >
                                {focused?(
                                    <Ionicons name="cart" size={28} color={colors.black} />
                                ) : (
                                    <Ionicons name="cart-outline" size={28} color={colors.black} />
                                )}
                            
                        </View>
                        ),
                    }} 
                    />         

            <Tab.Screen name="WishList" 
                        component={WishListScreenNavigator} 
                        options={{
                            tabBarIcon: ({focused}) => (
                            <View
                                >
                                    {focused?(
                                        <Entypo name="heart" size={24} color="#E34290" />
                                                                       
                                    ) : (
                                        
                                        <Entypo name="heart-outlined" size={24} color={colors.black} /> 
                                    )}
                                    
						            
                            </View>
                            ),
                        }} 
                        />   

            <Tab.Screen name="BuyerProfile" 
                        component={BuyerProfileScreenNavigator} 
                        options={{
                            tabBarIcon: ({focused}) => (
                            <View
                                >
                                    {focused?(
                                        <Ionicons name="person-circle" size={28} color={colors.black} />
                                    ) : (
                                        <Ionicons name="person-circle-outline" size={28} color={colors.black} />
                                    )}
                                
                            </View>
                            ),
                        }} 
                        />              
                           
        </Tab.Navigator>
        
    );
}

export default AppNavigator; 


