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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import RowView from '../components/RowView';
import colors from '../config/colors';

// STRIPE
// const API_URL = "http://192.168.1.4:3000";
// // const PUBLISHABLE_KEY =
// //   "pk_test_51MY8orSJTJQgHNK3rd2vWgnaOUuCxL1kDycYjfiS0rDECssrhOyVyrQZJ6u3G0bAW9AqdHnzWKIErdTyU8FKmyJN00b2iCtrnI";
// const PUBLISHABLE_KEY = "pk_live_51MY8orSJTJQgHNK3doioI6IIGFnZI2SnsDg4ckp89cj9JjBPRGSge5HSgAMPJB5nhUHKAF9hwm115RcJCrn9JFCa0017TczqfA"

const CheckoutScreen = () => {

  const [cartItems, setCartItems] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartTotal, setCartTotal] = useState(0)
  const [savedAddresses, setSavedAddresses] = useState(null);
  const [currentAddress, setCurrentAddress] = useState({})
  console.log(`currentAddress: ${currentAddress}`)
  const navigation = useNavigation()


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
      const orderRef = firebase.firestore().collection('orders').doc(user.uid);
      const cartRef = firebase.firestore().collection('carts').doc(user.uid);
      const now = new Date();
      const timestamp = firebase.firestore.Timestamp.fromDate(now)
       // Calculate the arrivingBy date by adding 7 days to the current date
       const arrivingByDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
       // Format the arrivingBy date in a readable format, e.g., "Aug 7"
       const arrivingByFormatted = arrivingByDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      try {
        await firebase.firestore().runTransaction(async (transaction) => {
          const ordersDoc = await transaction.get(orderRef)
          const newOrder = {
            userId: user.uid,
            items: cartItems,
            status: 'pending',
            createdAt: timestamp,
            arrivingBy: arrivingByFormatted, // Use the formatted date
          }

          if (!ordersDoc.exists){
            transaction.set(orderRef, {
              // If the user's order document doesn't exist, create it and initialize the 'orders' array
              orders: [newOrder]
            })
          } else {
            // If it exists, append the new order to the 'orders' array 
            transaction.update(orderRef, {
              orders: firebase.firestore.FieldValue.arrayUnion(newOrder)
            })
          }
  
          // Clear the cart items
          transaction.update(cartRef, {
            items: [],
          });
  
          console.log('Order placed and cart cleared successfully');
        });
  
        // Update local state to clear the displayed cart
        setCartItems([]);
        setCartTotal(0)
  
        // Optionally, set orderPlaced to true if you're using it to show a confirmation screen
        setOrderPlaced(true);
        
      } catch (error) {
        console.error('Error placing order or clearing cart: ', error);
      }
    } else {
      console.log('No items in the cart or no user logged in');
    }
  };
  
  // get the list of addresses of the user 
  useEffect(() => {
    const user = firebase.auth().currentUser;
  
    if (user) {
      const userRef = firebase.firestore().collection('users').doc(user.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        if (doc.exists) {
          const userData = doc.data();
          const addresses = userData.addresses || []; // assuming 'addresses' is an array property of the user document
          // Do something with the addresses, like setting state
          console.log(addresses);
          setSavedAddresses(addresses)
          setCurrentAddress(addresses.find(address => address.selected === true))
          console.log(`currentAddress: ${JSON.stringify(currentAddress)}`)
        } else {
          console.log("User document doesn't exist");
          // Handle case where user document doesn't exist
        }
      }, error => {
        console.error('Error fetching user document: ', error);
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);
  
  

  const calculateTotals = (items) => {
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return cartTotal
  };
  
  useEffect(() => {
    if (cartItems?.length > 0){
      const newTotal = calculateTotals(cartItems);
      setCartTotal(newTotal)
    }
  }, [cartItems]);


  // if (!cartItems){
  //   return <Screen>
  //     <AppText>
  //       There are no items in your cart yet. 
  //     </AppText>
  //   </Screen>
  // } 
  // if saved address and cart items are not null
  if (savedAddresses && cartItems){
    console.log(`savedAddresses is not null: ${JSON.stringify(savedAddresses)}`)
    console.log(`cartItems is not null: ${JSON.stringify(cartItems)}`)
    return (
      // <StripeProvider publishableKey={PUBLISHABLE_KEY}>
      <Screen style={styles.container}>
      <ScrollView style={styles.container}>
        {/* <AppText>Ready: {JSON.stringify(ready)}</AppText> */}
        {/* <AddressForm onSave={saveAddressToFirestore} /> */}
        <View style={styles.section}>
        {(savedAddresses.length > 0)? (
          <RowView style={{justifyContent: "space-between"}}>
        <View>
          <AppText type={"smallNormal"}>Deliver To:
            <AppText type={"smallBold"}> {currentAddress.name},{currentAddress.pincode}</AppText>
          </AppText>
          <AppText type={"smallLight"} numberOfLines={1}>
            {currentAddress.address}
          </AppText>
          </View>
          <AppButton text="Change" width={100} height={40} borderRadius={10}
           onPress={()=>{
            navigation.navigate("AddressesScreen", {addresses: savedAddresses})
          }}
          />
          </RowView>
          ):(<View style={{alignItems: "center"}}>
            <AppText type={"smallBold"}>You have no address saved.</AppText>
            <AppButton text="Add Address" width={200} height={50} borderRadius={10}
              onPress={()=>{
                navigation.navigate("AddressesScreen", {addresses: savedAddresses})
              }}
            />
            </View>)}
          </View>
  
    <View style={styles.separator}></View>
          
    <View style={styles.section}>
      {(cartItems.length > 0)? (<FlatList
          data={cartItems}
          keyExtractor={(item) => item.image.toString()}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              style={{width: "5"}}
            />
          )}
        />):(<View><AppText>
        There are no items in your cart yet. 
     </AppText></View>)}
        </View>

      <View style={styles.separator}></View>
  
      <View style={styles.section}>
          <AppText type="h3Bold">Your total</AppText>
      </View>
      
      <View style={styles.section}>
        <RowView style={styles.checkoutRow}>
          <AppText type="mediumNormal">Items Total</AppText>
          <AppText type="mediumNormal">₹ {cartTotal}</AppText>
        </RowView>
  
      <RowView style={styles.checkoutRow}>
        <AppText
          type="mediumNormal"
          style={{ textDecorationLine: "underline" }}
        >
          Taxes
        </AppText>
  
        <AppText type="mediumNormal">
        ₹ {Math.floor(cartTotal * 0.18)}
        </AppText>
        
      </RowView>
  
      <RowView style={styles.checkoutRow}>
        <AppText type="mediumSemiBold">Total</AppText>
        <AppText type="mediumNormal">₹ {cartTotal + cartTotal*0.18}</AppText>
      </RowView>
    </View>
  
            <View style={styles.separator}></View>
  
        <AppButton buttonDisabled={cartItems.length == 0 || !currentAddress} text="Order & Pay on Delivery" onPress={placeOrder} style={{padding: 16}}/>
      </ScrollView>
      
    
      </Screen>
      // </StripeProvider>
    );
  } else {
    <Loading/>

  }


  
};

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 10,
    alignSelf: "center",
  },
  section: {
    marginVertical: 10,
  },
  checkoutRow: {
    justifyContent: "space-between",
  },
});

export default CheckoutScreen;
