import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrdersScreen from '../screens/OrdersScreen';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';

const Stack = createStackNavigator();

function OrderScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="OrdersScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
        </Stack.Navigator>
    );
}
  
export default OrderScreenNavigator; 