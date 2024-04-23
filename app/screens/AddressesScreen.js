import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import RowView from "../components/RowView";
import { useNavigation } from "@react-navigation/native";
import colors from "../config/colors";
import firebase from "firebase/compat";
import AppIcon from "../components/AppIcon";

const AddressesScreen = (props) => {
  const userId = firebase.auth().currentUser.uid;
  const userDocRef = firebase.firestore().collection("users").doc(userId);
  const [addresses, setSavedAddresses] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    if (userDocRef) {
      const unsubscribe = userDocRef.onSnapshot(
        (doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const addresses = userData.addresses || []; 
            setSavedAddresses(addresses);
            setSelectedValue(
              addresses.find((address) => address.selected === true)
            );
          } else {
            console.log("User document doesn't exist");
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

  const navigation = useNavigation();

  async function updateSelectedAddress() {
    const cartRef = firebase.firestore().collection("carts").doc(userId);
    if (selectedValue) {
      try {
        await firebase.firestore().runTransaction(async function (transaction) {
          if (cartRef) {
            transaction.update(cartRef, { address: selectedValue });
          } else {
            console.log(
              "The Cart document for the current user does not exist."
            );
          }

          const updatedAddresses = addresses.map((address) => ({
            ...address,
            selected: address === selectedValue,
          }));

          transaction.update(userDocRef, { addresses: updatedAddresses });
        });
      } catch (error) {
        // If an error occurs during the transaction, log the error message.
        console.error("Failed to update selected address: ", error);
      }
    }
    navigation.navigate("CheckoutScreen");
  }

  async function handleRemoveItem(removedAddress) {
    if (!userId) {
      console.error("No user logged in");
      return;
    }

    const cartDocRef = firebase.firestore().collection("carts").doc(userId);

    try {
      await firebase.firestore().runTransaction(async (transaction) => {
        const cartDoc = await transaction.get(cartDocRef);

        if (!cartDoc.exists) {
          throw new Error("Document does not exist!");
        }

        const cart = cartDoc.data();

        const cartAddressStr = JSON.stringify(
          cart.address,
          Object.keys(cart.address).sort()
        );
        const removedAddressStr = JSON.stringify(
          removedAddress,
          Object.keys(removedAddress).sort()
        );

        if (cartAddressStr === removedAddressStr) {
          transaction.update(cartDocRef, { address: {} });
        }else {
            console.log("Cart address not matching withs selected address");
        }
        
        
        const updatedAddresses = addresses.filter(
        (address) => address !== removedAddress
        );

        setSavedAddresses(updatedAddresses);

        transaction.update(userDocRef, { addresses: updatedAddresses });
        
      });
    } catch (error) {
      console.error("Error removing address:", error);
    }
  }
  if (addresses) {
    return (
      <Screen>
        <ScrollView>
          <AppText type={"h3Bold"}>Saved Addresses</AppText>

          <View style={styles.separator}></View>
          {addresses.length > 0 ? (
            addresses.map(function (address) {
              return (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedValue(address);
                    }}
                    key={address}
                    style={{
                      backgroundColor:
                        selectedValue === address
                          ? colors.primaryLight
                          : colors.white,
                      padding: 8,
                      borderRadius: 10,
                    }}
                  >
                    <RowView style={{ justifyContent: "space-between" }}>
                      <AppText type="mediumBold">{address.alias}</AppText>
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <AppIcon
                          iconSet={"Entypo"}
                          iconName={"trash"}
                          iconSize={20}
                          onPress={() => handleRemoveItem(address)}
                        />
                      </View>
                    </RowView>

                    <AppText>{address.name}</AppText>
                    <AppText>{address.address}</AppText>
                    <AppText>{address.city}</AppText>
                    <AppText>{address.pincode}</AppText>
                    <AppText>Mobile: {address.mobile}</AppText>
                  </TouchableOpacity>

                  <View style={styles.separator}></View>
                </>
              );
            })
          ) : (
            <View></View>
          )}
          <AppButton
            text="Use Selected Address"
            onPress={() => {
              updateSelectedAddress();
            }}
          />
          <AppButton
            text="Add New Address"
            onPress={() => {
              navigation.navigate("AddAddressScreen");
            }}
          />
        </ScrollView>
      </Screen>
    );
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
});

export default AddressesScreen;
