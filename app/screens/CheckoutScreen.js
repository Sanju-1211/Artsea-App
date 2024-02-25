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
import { View, FlatList, StyleSheet } from 'react-native';
import CartItem from '../components/CartItem';
import firebase from 'firebase/compat';
import AppButton from '../components/AppButton';
import AddressForm from '../components/AddressForm';
import AppText from '../components/AppText';
import Screen from '../components/Screen';
import { ScrollView } from 'react-native-gesture-handler';

const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

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
    const platformFee = 20; // Flat fee for example
    const shippingFee = cartTotal > 500 ? 0 : 50; // Free shipping for orders over ₹500
    const discount = cartTotal * 0.1; // 10% discount for example
  
    return {
      cartTotal,
      platformFee,
      shippingFee,
      discount,
      finalTotal: cartTotal + platformFee + shippingFee - discount,
    };
  };

  const [totals, setTotals] = useState({
    cartTotal: 0,
    platformFee: 0,
    shippingFee: 0,
    discount: 0,
    finalTotal: 0,
  });
  
  useEffect(() => {
    const newTotals = calculateTotals(cartItems);
    setTotals(newTotals);
  }, [cartItems]);

  return (
    <Screen style={styles.container}>
    <ScrollView style={styles.container}>
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
      <AppText>Cart Total: {totals.cartTotal}</AppText>
      <AppText>Platform Fee: {totals.platformFee}</AppText>
      <AppText>Shipping Fee: {totals.shippingFee}</AppText>
      <AppText>Discount: -{totals.discount}</AppText>
      <AppText>Final Total: {totals.finalTotal}</AppText>
    </View>
      <AppButton text="Place Order" onPress={placeOrder} style={{padding: 16}}/>
    </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container:{
    padding: 16,
  }
});

export default CheckoutScreen;
