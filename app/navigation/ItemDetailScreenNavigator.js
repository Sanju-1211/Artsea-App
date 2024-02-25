import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ItemDetailScreen from '../screens/ItemDetailScreen';

const Stack = createStackNavigator();

function ItemDetailScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="Item Details" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="Item Details Screen" component={ItemDetailScreen} />
        </Stack.Navigator>
    );
}
  
export default ItemDetailScreenNavigator; 