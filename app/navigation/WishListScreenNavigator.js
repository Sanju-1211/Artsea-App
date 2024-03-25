import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';
import WishListScreen from '../screens/WishListScreen';

const Stack = createStackNavigator();

function WishListScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="WishListScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="WishListScreen" component={WishListScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
        </Stack.Navigator>
    );
}
  
export default WishListScreenNavigator; 