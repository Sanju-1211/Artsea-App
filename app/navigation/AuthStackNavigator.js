import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreenNavigator from "./LoginScreenNavigator";
import RegisterScreenNavigator from "./RegisterScreenNavigator";

const Stack = createStackNavigator();

export default function AuthStackNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown:false}}>      
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreenNavigator} />
          <Stack.Screen name="Register" component={RegisterScreenNavigator} />
        </Stack.Navigator>
    );
} 