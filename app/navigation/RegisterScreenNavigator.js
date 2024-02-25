import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './AppNavigator';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

function RegisterScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="RegisterScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="App" component={AppNavigator} />
        </Stack.Navigator>
    );
}
  
export default RegisterScreenNavigator; 