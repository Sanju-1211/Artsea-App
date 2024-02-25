import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreenNavigator from './app/navigation/RegisterScreenNavigator';
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreenNavigator from './app/navigation/LoginScreenNavigator';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';

// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat';
import { initializeApp } from "firebase/app";
import { AuthContextProvider } from './app/services/auth/AuthContext';
import { Navigation } from './app/navigation';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3m28DiRR_HabqgqxYVenreLgZOl8qUTM",
  authDomain: "artsea-de735.firebaseapp.com",
  projectId: "artsea-de735",
  storageBucket: "artsea-de735.appspot.com",
  messagingSenderId: "954205249394",
  appId: "1:954205249394:web:2c1ca8961edad6105f87eb"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

export default function App() {
    return (
      <AuthContextProvider>
        <Navigation/>
        </AuthContextProvider>
    );
}


