import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import CartItem from "../components/CartItem";
import firebase from "firebase/compat";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import RowView from "../components/RowView";
import colors from "../config/colors";

const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  console.log(`currentAddress: ${currentAddress}`);
  const navigation = useNavigation();

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const cartRef = firebase.firestore().collection("carts").doc(user.uid);
      // Listen for real-time updates with .onSnapshot()
      const unsubscribe = cartRef.onSnapshot(
        (doc) => {
          if (doc.exists) {
            setCartItems(doc.data().items);
            if(doc.data().address){
            setCurrentAddress(
                doc.data().address
            );
            }
          } else {
            console.log("No such document");
            setCartItems([]); // Clear cart items if the document doesn't exist
          }
        },
        (error) => {
          console.error("Error fetching cart items: ", error);
        }
      );

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
    const cartDocRef = firebase
      .firestore()
      .collection("carts")
      .doc(currentUser.uid);

    try {
      await firebase.firestore().runTransaction(async (transaction) => {
        const cartDoc = await transaction.get(cartDocRef);

        if (!cartDoc.exists) {
          throw new Error("Document does not exist!");
        }

        const cartData = cartDoc.data();
        const itemIndex = cartData.items.findIndex(
          (item) => item.image === itemImage
        );

        if (itemIndex < 0) {
          throw new Error("Item not found in cart!");
        }

        cartData.items[itemIndex].quantity = newQuantity;

        transaction.update(cartDocRef, cartData);
        setCartItems(cartData.items);
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

    const cartDocRef = firebase
      .firestore()
      .collection("carts")
      .doc(currentUser.uid);

    try {
      await firebase.firestore().runTransaction(async (transaction) => {
        const cartDoc = await transaction.get(cartDocRef);

        if (!cartDoc.exists) {
          throw new Error("Document does not exist!");
        }

        const cartData = cartDoc.data();
        const updatedItems = cartData.items.filter(
          (item) => item.image !== itemImage
        );

        transaction.update(cartDocRef, { items: updatedItems });
        setCartItems(updatedItems);
      });

      console.log("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  const placeOrder = async () => {
    const user = firebase.auth().currentUser;

    if (user && cartItems.length > 0) {
      const orderRef = firebase.firestore().collection("orders").doc(user.uid);
      const cartRef = firebase.firestore().collection("carts").doc(user.uid);
      const now = new Date();
      const timestamp = firebase.firestore.Timestamp.fromDate(now);
      // Calculate the arrivingBy date by adding 7 days to the current date
      const arrivingByDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      // Format the arrivingBy date in a readable format, e.g., "Aug 7"
      const arrivingByFormatted = arrivingByDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      try {
        await firebase.firestore().runTransaction(async (transaction) => {
          const ordersDoc = await transaction.get(orderRef);
          const newOrder = {
            userId: user.uid,
            items: cartItems,
            status: "pending",
            createdAt: timestamp,
            arrivingBy: arrivingByFormatted, // Use the formatted date
            deliveryAddress: currentAddress,
          };

          if (!ordersDoc.exists) {
            transaction.set(orderRef, {
              // If the user's order document doesn't exist, create it and initialize the 'orders' array
              orders: [newOrder],
            });
          } else {
            // If it exists, append the new order to the 'orders' array
            transaction.update(orderRef, {
              orders: firebase.firestore.FieldValue.arrayUnion(newOrder),
            });
          }

          // Clear the cart items
          transaction.update(cartRef, {
            items: [],
          });

          console.log("Order placed and cart cleared successfully");
        });

        // Update local state to clear the displayed cart
        setCartItems([]);
        setCartTotal(0);

        // Optionally, set orderPlaced to true if you're using it to show a confirmation screen
        setOrderPlaced(true);
        navigation.navigate("OrderConfirmationScreen");
      } catch (error) {
        console.error("Error placing order or clearing cart: ", error);
      }
    } else {
      console.log("No items in the cart or no user logged in");
    }
  };

  // get the list of addresses of the user
  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const userRef = firebase.firestore().collection("users").doc(user.uid);
      const unsubscribe = userRef.onSnapshot(
        (doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const addresses = userData.addresses || []; 
            console.log(addresses);
            setSavedAddresses(addresses);
          } else {
            console.log("User document doesn't exist");
            // Handle case where user document doesn't exist
          }
        },
        (error) => {
          console.error("Error fetching user document: ", error);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  const calculateTotals = (items) => {
    const cartTotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return cartTotal;
  };

  useEffect(() => {
    if (cartItems?.length > 0) {
      const newTotal = calculateTotals(cartItems);
      setCartTotal(newTotal);
    }
  }, [cartItems]);

  if (savedAddresses && cartItems) {
    console.log(
      `savedAddresses is not null: ${JSON.stringify(savedAddresses)}`
    );
    console.log(`cartItems is not null: ${JSON.stringify(cartItems)}`);
    return (
      <Screen style={styles.container}>
        <ScrollView style={styles.container} contentContinaerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            {savedAddresses.length > 0 && currentAddress.name!=null ? (
              <RowView style={{ justifyContent: "space-between" }}>
                
                
                <View>
                  <AppText type={"smallNormal"}>
                    Deliver To:
                    <AppText type={"smallBold"}>
                      {" "}
                      {currentAddress.name},{currentAddress.pincode}
                    </AppText>
                  </AppText>
                  <AppText type={"smallLight"} numberOfLines={1}>
                    {currentAddress.address}
                  </AppText>
                </View>
                <AppButton
                  text="Change"
                  width={100}
                  height={40}
                  borderRadius={10}
                  onPress={() => {
                    navigation.navigate("AddressesScreen", {
                      addresses: savedAddresses,
                    });
                  }}
                />
                
              </RowView>
            ) : (
              <View style={{ alignItems: "center" }}>
                
                <AppButton
                  text="Select a Delivery Address"
        
                  height={40}
                  borderRadius={10}
                  onPress={() => {
                    navigation.navigate("AddressesScreen", {
                      addresses: savedAddresses,
                    });
                  }}
                />
              </View>
            )}
          </View>

          <View style={styles.separator}></View>

          <View style={styles.section}>
            {cartItems.length > 0 ? (
                <FlatList
                data={cartItems}
                keyExtractor={(item) => item.image.toString()}
                renderItem={({ item }) => (
                  <CartItem
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    style={{ width: "5" }}
                  />
                )}
              />
            ) : (
              <View>
                <AppText>There are no items in your cart yet.</AppText>
              </View>
            )}
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
              <AppText type="mediumNormal">
                ₹ {cartTotal + cartTotal * 0.18}
              </AppText>
            </RowView>
          </View>

          <View style={styles.separator}></View>

          {cartItems.length == 0 || currentAddress == null || 
          (currentAddress != null && currentAddress.name==null) ?
          <AppButton
            buttonDisabled="true"
            text="Order & Pay on Delivery"
          />:
          <AppButton
            text="Order & Pay on Delivery"
            onPress={placeOrder}
          />
          }
        </ScrollView>
      </Screen>
    );
  } else {
    <Loading />;
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
