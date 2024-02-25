import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import AppNavigator from './AppNavigator';

const Stack = createStackNavigator();

function LoginScreenNavigator() {
    return (
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="App" component={AppNavigator} />
        </Stack.Navigator>
    );
}
  
export default LoginScreenNavigator; 