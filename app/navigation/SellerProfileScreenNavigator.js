import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';
import SellerProfileScreen from '../screens/SellerProfileScreen';

const Stack = createStackNavigator();

function SellerProfileScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="SellerProfileScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="SellerProfileScreen" component={SellerProfileScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
        </Stack.Navigator>
    );
}
  
export default SellerProfileScreenNavigator; 