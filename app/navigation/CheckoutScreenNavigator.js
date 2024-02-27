import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CheckoutScreen from '../screens/CheckoutScreen';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';
import AddressesScreen from '../screens/AddressesScreen';
import AddAddressScreen from '../screens/AddAddressScreen';

const Stack = createStackNavigator();

function CheckoutScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="CheckoutScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
          <Stack.Screen name="AddressesScreen" component={AddressesScreen}/>
          <Stack.Screen name="AddAddressScreen" component={AddAddressScreen}/>
        </Stack.Navigator>
    );
}
  
export default CheckoutScreenNavigator; 