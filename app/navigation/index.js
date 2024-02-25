import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./AuthStackNavigator";
import AppNavigator from "./AppNavigator";
import firebase from "firebase/compat";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Navigation() {
  // Uncomment the following line to log out right now
  //   AsyncStorage.clear();
  const [loggedIn, setLoggedIn] = useState(false);
  // const [isLoaded, setIsLoaded] = useState(false)

  useEffect(function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
        setLoggedIn(false);
        // setIsLoaded(true)
      } else {
        setLoggedIn(true);
        // setIsLoaded(true)
      }
      console.log(user? `There is a user: ${JSON.stringify(user)}` : `There is no user: ${JSON.stringify(user)}`)
    });
    
  }, []);

  return (
    <NavigationContainer>
      {loggedIn ? <AppNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}
