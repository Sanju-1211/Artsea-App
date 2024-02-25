import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ArtisanScreen from '../screens/ArtisanScreen';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';
const Stack = createStackNavigator();

function ArtisanScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="ArtisanDetailScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="ArtisanDetailScreen" component={ArtisanScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
        </Stack.Navigator>
    );
}
  
export default ArtisanScreenNavigator; 