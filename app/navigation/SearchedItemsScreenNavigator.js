import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchedItemScreen from '../screens/SearchedItemsScreen';
import ItemDetailScreenNavigator from './ItemDetailScreenNavigator';

const Stack = createStackNavigator();

function SearchedItemsScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="SearchedItemsScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="SearchedItemsScreen" component={SearchedItemScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreenNavigator} />
        </Stack.Navigator>
    );
}

export default SearchedItemsScreenNavigator; 