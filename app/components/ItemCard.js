import React, { useState, useEffect, } from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { Entypo  } from '@expo/vector-icons';

import AppText from "./AppText";
import colors from "../config/colors";
import firebase from 'firebase/compat';

function ItemCard({ title, subTitle, image, imageStyle, onPress,  cardStyle, item
	// showIcons,
}) {
	console.log("Rendering Item Card")
    console.log(item);
    const [wishList, setWishList] = useState(null);
    const userId = firebase.auth().currentUser.uid
    const wishListRef = firebase.firestore().collection('wishlist').doc(userId)
    const [itemLiked,setItemLiked] = useState(false);
    useEffect(() => {
        const unsubscribe = wishListRef.onSnapshot(wishListDoc => {
            if (wishListDoc.exists) {
                setWishList(wishListDoc.data());
                let wishlistItems = wishListDoc.data().items || []

                const itemIndex = wishlistItems.findIndex(function(i){
                    return i.image === item.image
                })
                if (itemIndex > -1){
                  setItemLiked(true);
                }
            } else {
              console.log("No such document");
              return null;
            }
        }, error => {
            console.error('Error fetching order items: ', error);
        });
      
          // Cleanup subscription on unmount
        return () => unsubscribe();

    }, []);
   
    const clickedHeart = () => {
        if(!itemLiked){
            console.log('add');
            addToWishList(item);
        }
        else{
            console.log('remove');
            removeFromWishlist(item.image);
        }
        setItemLiked(!itemLiked);
    };
 
    async function addToWishList(item){
        console.log("Adding  to wishlist")

        try {
            await firebase.firestore().runTransaction(async function(transaction) {
                if (wishList){
                    let updatedItemsInWishList = wishList.items || []

                    const itemIndex = updatedItemsInWishList.findIndex(function(i){
                        return i.image === item.image
                    })

                    if (itemIndex > -1){
                        console.log("Current Item is Already In wishlist.")
                    } else {
                        console.log("Current Item is not in wishlist.")
                        
                        updatedItemsInWishList.push({
                            ...item, 
                            userId
                        })
                    }
                    transaction.update(wishListRef, {items:updatedItemsInWishList})
                } else {
                    console.log("The wishlist document for the current user does not exist. Adding wishlist.")
                    transaction.set(wishListRef, {items: [{...item, userId}]})
                }
            })

        } catch (error){
            // If an error occurs during the transaction, log the error message. 
            console.error("Failed to add item to wishlist: ", error)
        }
    }

    async function removeFromWishlist(itemImage) {
        try {
            await firebase.firestore().runTransaction(async (transaction) => {
                if (!wishList) {
                    throw new Error("Document does not exist!");
                }
                const updatedItems = wishList.items.filter(item => item.image !== itemImage);
                console.log(updatedItems);
                transaction.update(wishListRef, { items: updatedItems });
            });
        } catch (error) {
            console.error("Error removing item:", error);
        }
    }

  	return (
      	<View style={[styles.card,cardStyle]}>
			<TouchableHighlight underlayColor={colors.light} onPress={onPress}>
				<View style={styles.imageBorder}>
					<Image style={[styles.image,imageStyle]} source={{uri: image}} />
				</View>
			</TouchableHighlight>
			<View style={styles.detailsContainer}>
				<AppText type={"mediumBold"}>{title}</AppText>
				<View style={styles.iconContainer}>
					<AppText type={"smallNormal"}>{subTitle}</AppText>  
					<View style = {styles.iconsRow}>
						{itemLiked ? 
						<Entypo name="heart" size={24} color="#E34290" style={styles.icon} onPress={()=>clickedHeart()}/>:
						<Entypo name="heart-outlined" size={24} color={colors.button} style={styles.icon} onPress={()=>clickedHeart()} />
						}
					</View>                       
				</View>
			</View>
      	</View>
  	);
}

const styles = StyleSheet.create({
  	card: {
    	backgroundColor: colors.secondryBackground,
    	overflow: "hidden",
    	borderWidth: 1,
    	borderColor: "#eed7c5",
    	borderRadius:10,
	},
	detailsContainer:{
		marginLeft:8,
		marginTop: 8,
		marginBottom: 4,
	},
  	iconsRow:{
    	flexDirection: "row"
  	},
  	imageBorder:{
    //borderBottomWidth: 1,
    //borderColor:"#eed7c5",
  	},
  	image: {
    	width: "100%",
    	height: 150,
  	},
  	icon:{
    	paddingRight: 10,
  	},
  	iconContainer:{
   		flexDirection: "row",
    	justifyContent: "space-between"
  	},
  	subTitle: {
    	color: colors.primaryText,
    	fontSize: 13
  	},
  	title: {
    	color: colors.secondaryText,
    	marginBottom: 7,
  	},
});

export default ItemCard;
