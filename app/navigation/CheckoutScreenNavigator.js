import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CheckoutScreen from '../screens/CheckoutScreen';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';

const Stack = createStackNavigator();

function CheckoutScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="CheckoutScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
        </Stack.Navigator>
    );
}
  
export default CheckoutScreenNavigator; 