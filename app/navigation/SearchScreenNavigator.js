import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import SearchedItemsScreenNavigator from './SearchedItemsScreenNavigator';

const Stack = createStackNavigator();

function SearchScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="SearchScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="SearchedItems" component={SearchedItemsScreenNavigator} />
        </Stack.Navigator>
    );
}

export default SearchScreenNavigator; 