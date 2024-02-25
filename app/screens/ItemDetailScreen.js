import React, { useState } from "react";
import { View, StyleSheet, ScrollView} from "react-native";
import ItemCard from "../components/ItemCard";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import UserCard from "../components/UserCard";
import firebase from "firebase/compat";

import { useRoute } from "@react-navigation/native";

export default function ItemDetailScreen(props) {
    // Change Made: Got item from item prop 
    let item = props.route.params?.item; 
    console.log(`item`, item)

    const seller=false;
    const [qtyCounter, setQtyCounter] = useState(0);
    const increaseQtyCount = () => {
        console.log(qtyCounter);
        setQtyCounter(qtyCounter+1);
    };     
    const decreaseQtyCount = () => {
        console.log(qtyCounter);
        if (qtyCounter>0){
            setQtyCounter(qtyCounter-1);
        }
    };  

    // This is an asynchronous function to add an item and it's quantity to the current user's cart. 
    // 'async' indicates that this function can perform asynchronous operations like database calls. 
    async function addToCart(item, quantity){
        console.log("Adding items to cart")
        // Get the current user's ID 
        const userId = firebase.auth().currentUser.uid
        // Create a reference to a potential cart document in the 'cart' collection in Firestore, 
        // specifically for our current user. 
        const cartRef = firebase.firestore().collection('carts').doc(userId)

        // Let's add a try-catch block to catch any errors if we fail to implement 
        // any of the following steps. 
        try {
            // Here, wer are starting a 'Firestore Transaction'. This just ensures that 
            // either all the operations in the following block will be completed successfully
            // or none of it will be. 
            // We don't want the cart to be updated multiple times in the same time,
            // so this just avoids confusion. 
            await firebase.firestore().runTransaction(async function(transaction) {
                // Let's try to retrieve the current user's cart document. 
                const cartDoc = await transaction.get(cartRef)

                // Check if the card document exists.
                if (cartDoc.exists){
                    console.log("Cart Document for Current User Exists!")
                    // If the cart document exists, get the current items array 
                    // in the user's cart. If there is no data, get an empty array. 
                    // Name this updatedItemsInCart as we're going to use this to
                    // update the current cart. 
                    let updatedItemsInCart = cartDoc.data().items || []

                    // Check if the item we are adding already exists in the cart. 
                    // We will do this by comparing each items's image (that's in the cart)
                    // to the image of the item to be added. 
                    // The findIndex will return -1 if the item is not found. 
                    // If the item exists, it'll return the index of the item in the array of items. 
                    const itemIndex = updatedItemsInCart.findIndex(function(i){
                        return i.image === item.image
                    })

                    if (itemIndex > -1){
                        console.log("Current Item is Already In Cart. Changing it's quantity.")
                        // If the item exists, update it's quantity in the cart 
                        updatedItemsInCart[itemIndex].quantity += quantity
                    } else {
                        // If the item doesn't exist, add it to the cart with the 
                        // specified quantity. 
                        console.log("Current Item is NOT already In Cart. Adding it.")
                        updatedItemsInCart.push({
                            // This ... means to "extend an object". Basically if 
                            // item = {'a': 1, 'b': 2} and quantity = 5, then: 
                            // {...item, quantity} is going to be: 
                            // {'a': 1, 'b': 2, quantity: 5}
                            ...item, 
                            quantity
                        })
                    }
                    
                    // Update the cart document with the new items array
                    // This is where we're going to make the change in the 
                    // cart document of the current user. 
                    // This is beneficial as either all the operations: 
                    // - Getting the Cart Document
                    // - Checking if the current Item Exists in The Cart 
                    // - Updating the Cart 
                    // are ALL executed. If we fail at any, we won't be updating the
                    // firestore document. 
                    console.log("Updating the Cart.")
                    transaction.update(cartRef, {items:updatedItemsInCart})
                } else {
                    // If the cart doesn't exist, create a new cart document for the current user
                    // with the first item. 
                    console.log("The cart document for the current user does not exist. Adding cart item.")
                    transaction.set(cartRef, {items: [{...item, quantity}]})
                }
            })

            // Log a message if the item is successfully added to the cart. 
            console.log("Item added to the cart successfully.")
        } catch (error){
            // If an error occurs during the transaction, log the error message. 
            console.error("Failed to add item to cart: ", error)
        }
    }
    



    return (
        <Screen style={styles.screen}>
        <ScrollView>
            <ItemCard
                title = {item.item_name}
                image = {item.image}
                subTitle = {item.description}
                imageStyle = {styles.imageStyle}
            />
            {!seller &&
            <View>
                <View style={styles.qtyButtonRow}>
                    <View style={styles.quantity}>
                        <AppText style={styles.quantityLabel}>Qty</AppText> 
                    </View>
                    <AppButton text="-" 
                            onPress={()=>decreaseQtyCount()} 
                            style={styles.button}
                            labelStyle={styles.buttonText}
                            />   

                    <View style={styles.quantity}>
                        <AppText style={styles.quantityLabel}>{qtyCounter}</AppText>
                    </View>
                    <AppButton text="+" 
                            onPress={()=>increaseQtyCount()} 
                            style={styles.button}
                            labelStyle={styles.buttonText}/>    
                </View>
                <View style={styles.addToCartContainerStyle}>
                    <AppButton 
                    buttonDisabled={qtyCounter === 0}
                    text="Add to Cart" buttonStyle={styles.addToCartStyle}
                    onPress={() => addToCart(item, qtyCounter)}/>
                </View>
            </View>
            }
            <View >
                <View style={styles.userContainer}>
                    <UserCard title="samantha123" subTitle="@samantha padukone" image = {require("../assets/mosh.jpg")}></UserCard>
                </View>                    
                <AppText style={styles.productDetailHeading}>Product Details</AppText> 
                <AppText style={styles.productDetail}>
                    Test Description
                </AppText>
            </View>
            </ScrollView>            
        </Screen>
    );
  }
  

  const styles = StyleSheet.create({
    button: {
      width: 30,
      height: 30,
      borderRadius: 0,
      padding: 5
    },
    imageStyle:{
        height: 400,
    },
    buttonText:{
        fontSize: 15,
    },
    userContainer:{
        flexDirection: 'row',
        alignItems:"center",
        justifyContent: "space-between"
    },
    messageStyle:{
        height: 30,
        width:80
    },
    addToCartStyle:{
        height: 40,
        width:"100%"
    },
    quantityLabel:{
        fontWeight: "bold",
        padding: 10,
    },
    productDetailHeading:{
        fontWeight: "bold",
        padding: 10,
    },
    productDetail:{
        padding: 10,
        paddingBottom: 30
    },        
    quantity:{
        justifyContent: "center",
        alignItems: "center",        
    },
    qtyButtonRow:{
        marginTop: 10,
        flexDirection: 'row',
        marginBottom: 5,
        alignItems:"center"
    },
    screen: {
        padding: 16, 
    },
})