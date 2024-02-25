import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddItemScreen from '../screens/AddItemScreen';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';

const Stack = createStackNavigator();

function AddItemScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="AddItemScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="AddItemScreen" component={AddItemScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
        </Stack.Navigator>
    );
}
  
export default AddItemScreenNavigator; 