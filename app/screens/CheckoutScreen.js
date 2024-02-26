// import React from "react";
// import { View, StyleSheet } from "react-native";

// import Screen from "../components/Screen";
// import AppText from "../components/AppText";
// import AppButton from "../components/AppButton";
// import ItemListing from "../components/ItemListing";

// const listings = [
//     {
//       id: 1,
//       title: "Red jacket for sale",
//       price: 100,
//       image: require("../assets/jacket.jpg"),
//     },
//     {
//       id: 2,
//       title: "Couch in great condition",
//       price: 1000,
//       image: require("../assets/couch.jpg"),
//     },
//     {
//       id: 3,
//       title: "Red jacket for sale",
//       price: 100,
//       image: require("../assets/jacket.jpg"),
//     },
//     {
//       id: 4,
//       title: "Couch in great condition",
//       price: 1000,
//       image: require("../assets/couch.jpg"),
//     },
//     {
//       id: 5,
//       title: "Red jacket for sale",
//       price: 100,
//       image: require("../assets/jacket.jpg"),
//     },
//     {
//       id: 6,
//       title: "Couch in great condition",
//       price: 1000,
//       image: require("../assets/couch.jpg"),
//     },
//     {
//       id: 7,
//       title: "Couch in great condition",
//       price: 1000,
//       image: require("../assets/couch.jpg"),
//     },
//     {
//       id: 8,
//       title: "Couch in great condition",
//       price: 1000,
//       image: require("../assets/couch.jpg"),
//     },    
// ];

// function CheckoutScreen({navigation}) {
//     return (
//         <Screen>
// 			<AppText style={styles.cartHeader}>Cart</AppText>
// 			<AppButton text="Proceed To Buy" 
// 				onPress={()=>console.log("Message button pressed")} 
// 				buttonStyle={styles.buyButton}
// 			/>  
//           	<View style={{marginBottom:200, flexDirection:"row"}}>
// 				<ItemListing 
//                     navigation={navigation}
// 					numOfColumns={1} 
// 					showIcons={false} 
// 					imageStyle={styles.itemImageStyle} 
// 					itemCardStyle={styles.cardStyle}
// 				/>
// 			</View>
//         </Screen>
//     );
// }

// const styles = StyleSheet.create({
//     cartHeader:{
// 		fontSize: 20,
// 		textAlign:"center",
// 		marginTop: 10,
// 		marginBottom: 10
//     },
//     cardStyle:{
// 		flexDirection:"row",
// 		marginBottom: 2
//     },
//     buyButton:{
// 		marginRight: 5,
// 		height: 40,
// 		marginBottom:10,
// 		padding: 8,
// 	},  
// 	itemImageStyle: {
// 		width: 100,
// 		height: 100,
// 	},

// });
// export default CheckoutScreen;


import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import CartItem from '../components/CartItem';
import firebase from 'firebase/compat';
import AppButton from '../components/AppButton';
import AddressForm from '../components/AddressForm';
import AppText from '../components/AppText';
import Screen from '../components/Screen';
import { ScrollView } from 'react-native-gesture-handler';
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { useFocusEffect } from '@react-navigation/native';

// STRIPE
// const API_URL = "http://192.168.1.4:3000";
// // const PUBLISHABLE_KEY =
// //   "pk_test_51MY8orSJTJQgHNK3rd2vWgnaOUuCxL1kDycYjfiS0rDECssrhOyVyrQZJ6u3G0bAW9AqdHnzWKIErdTyU8FKmyJN00b2iCtrnI";
// const PUBLISHABLE_KEY = "pk_live_51MY8orSJTJQgHNK3doioI6IIGFnZI2SnsDg4ckp89cj9JjBPRGSge5HSgAMPJB5nhUHKAF9hwm115RcJCrn9JFCa0017TczqfA"

const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartTotal, setCartTotal] = useState(0)

  // Stripe
  // const [ready, setReady] = useState(false);
  // const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();
  // async function fetchPaymentSheetParams() {
  //   const response = await fetch(`${API_URL}/create-payment-intent`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       totalPrice: cartTotal,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   const { paymentIntent, ephemeralKey, customer } = await response.json();

  //   return {
  //     paymentIntent,
  //     ephemeralKey,
  //     customer,
  //   };
  // }
  // async function initialisePaymentSheet() {
  //   console.log("Initialising Payment Sheet")
  //   const { paymentIntent, ephemeralKey, customer, publishableKey } =
  //     await fetchPaymentSheetParams();
  //   const paymentSheet = await initPaymentSheet({
  //     merchantDisplayName: "Artsea, Inc.",
  //     customerId: customer,
  //     customerEphemeralKeySecret: ephemeralKey,
  //     paymentIntentClientSecret: paymentIntent,
  //     allowsDelayedPaymentMethods: true,
  //     defaultBillingDetails: {
  //       name: "Rishabh Chopra",
  //     },
  //     googlePay:{
  //       merchantCountryCode:"IN",
  //       testEnv:true,
  //       currencyCode:"inr"
  //     },
  //     returnURL:"stripe-example://stripe-redirect",
  //   });
  //   if (paymentSheet.error) {
  //     Alert.alert(`Error code: ${error.code}, ${error.message}`);
  //   } else {
  //     console.log("Payment Sheet Initialised");
  //     setReady(true);
  //   }
  // }

  // useEffect(() => {
  //   initialisePaymentSheet();
  // }, [cartTotal]);

  // async function openPaymentSheet() {
  //   console.log("Open Payment Sheet");
  //   const { error } = await presentPaymentSheet();

  //   if (error) {
  //     Alert.alert(`Error code: ${error.code}`, error.message);
  //   } else {
  //     Alert.alert("Success", "Your reservation is confirmed!");
  //     setReady(false);
  //   }
  // }

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const cartRef = firebase.firestore().collection('carts').doc(user.uid);
      // Listen for real-time updates with .onSnapshot()
      const unsubscribe = cartRef.onSnapshot(doc => {
        if (doc.exists) {
          setCartItems(doc.data().items);
        } else {
          console.log("No such document");
          setCartItems([]); // Clear cart items if the document doesn't exist
        }
      }, error => {
        console.error('Error fetching cart items: ', error);
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);
  

  async function handleUpdateQuantity(itemImage, newQuantity) {
    const currentUser = firebase.auth().currentUser;
  
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }
  
    // Assuming cart items are stored as an array in the cart document
    const cartDocRef = firebase.firestore().collection('carts').doc(currentUser.uid);
  
    try {
      await firebase.firestore().runTransaction(async (transaction) => {
        const cartDoc = await transaction.get(cartDocRef);
  
        if (!cartDoc.exists) {
          throw new Error("Document does not exist!");
        }
  
        const cartData = cartDoc.data();
        const itemIndex = cartData.items.findIndex(item => item.image === itemImage);
  
        if (itemIndex < 0) {
          throw new Error("Item not found in cart!");
        }
  
        cartData.items[itemIndex].quantity = newQuantity;
        
  
        transaction.update(cartDocRef, cartData);
        setCartItems(cartData.items)
      });
  
      console.log("Item quantity updated");
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  }

  async function handleRemoveItem(itemImage) {
    const currentUser = firebase.auth().currentUser;
  
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }
  
    const cartDocRef = firebase.firestore().collection('carts').doc(currentUser.uid);
  
    try {
      await firebase.firestore().runTransaction(async (transaction) => {
        const cartDoc = await transaction.get(cartDocRef);
  
        if (!cartDoc.exists) {
          throw new Error("Document does not exist!");
        }
  
        const cartData = cartDoc.data();
        const updatedItems = cartData.items.filter(item => item.image !== itemImage);
  
        transaction.update(cartDocRef, { items: updatedItems });
        setCartItems(updatedItems)
      });
  
      console.log("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  const placeOrder = async () => {
    const user = firebase.auth().currentUser;
    
    if (user && cartItems.length > 0) {
      const orderRef = firebase.firestore().collection('orders').doc();
      const cartRef = firebase.firestore().collection('carts').doc(user.uid);
  
      try {
        await firebase.firestore().runTransaction(async (transaction) => {
          // Create a new order document
          transaction.set(orderRef, {
            userId: user.uid,
            items: cartItems,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
  
          // Clear the cart items
          transaction.update(cartRef, {
            items: [],
          });
  
          console.log('Order placed and cart cleared successfully');
        });
  
        // Update local state to clear the displayed cart
        setCartItems([]);
  
        // Optionally, set orderPlaced to true if you're using it to show a confirmation screen
        setOrderPlaced(true);
        
      } catch (error) {
        console.error('Error placing order or clearing cart: ', error);
      }
    } else {
      console.log('No items in the cart or no user logged in');
    }
  };
  
  
  const saveAddressToFirestore = async (address) => {
    const user = firebase.auth().currentUser;
  
    if (user) {
      const userRef = firebase.firestore().collection('users').doc(user.uid);
  
      try {
        // Here, 'set' with merge: true will update the user document with the new address
        // without overwriting other fields.
        await userRef.set({ address: address }, { merge: true });
        console.log('Address saved successfully');
      } catch (error) {
        console.error('Error saving address: ', error);
      }
    } else {
      console.log('No user logged in');
    }
  };
  

  const calculateTotals = (items) => {
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return cartTotal
  };
  
  useEffect(() => {
    const newTotal = calculateTotals(cartItems);
    setCartTotal(newTotal)
  }, [cartItems]);


  return (
    // <StripeProvider publishableKey={PUBLISHABLE_KEY}>
    <Screen style={styles.container}>
    <ScrollView style={styles.container}>
      {/* <AppText>Ready: {JSON.stringify(ready)}</AppText> */}
      <AddressForm onSave={saveAddressToFirestore} />
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.image.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        )}
      />
      <View style={styles.orderSummary}>
      <AppText>Cart Total: {cartTotal}</AppText>
    </View>
      <AppButton text="Place Order" onPress={placeOrder} style={{padding: 16}}/>
    </ScrollView>
    </Screen>
    // </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container:{
    padding: 16,
  }
});

export default CheckoutScreen;
