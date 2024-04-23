import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ArtisanScreenNavigator from './ArtisanScreenNavigator';
import ItemDetailScreen from '../screens/ItemDetailScreen';

const Stack = createStackNavigator();

function HomeScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ArtisanDetail" component={ArtisanScreenNavigator} />
          <Stack.Screen name="ItemDetails" component={ItemDetailScreen} />
        </Stack.Navigator>
    );
}
  
export default HomeScreenNavigator; 