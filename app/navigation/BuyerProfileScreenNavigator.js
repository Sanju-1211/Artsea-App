import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BuyerProfileScreen from '../screens/BuyerProfileScreen';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';
import AddReviewScreen from '../screens/AddReviewScreen';

const Stack = createStackNavigator();

function BuyerProfileScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="BuyerProfileScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="BuyerProfileScreen" component={BuyerProfileScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
          <Stack.Screen name="AddReview" component={AddReviewScreen} />
        </Stack.Navigator>
    );
}
  
export default BuyerProfileScreenNavigator; 