import * as React from 'react';
import firebase from 'firebase/compat';
import { initializeApp } from "firebase/app";
import { AuthContextProvider } from './app/services/auth/AuthContext';
import { Navigation } from './app/navigation';
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3m28DiRR_HabqgqxYVenreLgZOl8qUTM",
  authDomain: "artsea-de735.firebaseapp.com",
  projectId: "artsea-de735",
  storageBucket: "artsea-de735.appspot.com",
  messagingSenderId: "954205249394",
  appId: "1:954205249394:web:2c1ca8961edad6105f87eb"
};

// Initialize Firebase
if (firebase.apps.length === 0) {
  // Initialize App with Persisting Logins.
  const Artsea = firebase.initializeApp(firebaseConfig);
 
  initializeAuth(Artsea, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export default function App() {
    return (
      <AuthContextProvider>
        <Navigation/>
        </AuthContextProvider>
    );
}


