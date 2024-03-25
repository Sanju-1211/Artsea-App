import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AppText from "../components/AppText";
import { Feather } from '@expo/vector-icons';
import ItemListing from "../components/ItemListing";
import Following from "../components/Following";
// Import firebase 
import firebase from "firebase/compat"
import Loading from "../components/Loading";

function WishListScreen({navigation}) {

    const [wishList, setWishList] = useState(null);
    const userId = firebase.auth().currentUser.uid
    const wishListRef = firebase.firestore().collection('wishlist').doc(userId)
    useEffect(() => {
        const unsubscribe = wishListRef.onSnapshot(wishListDoc => {
            if (wishListDoc.exists) {
                setWishList(wishListDoc.data());
            } else {
              console.log("No such document");
            }
          }, error => {
            console.error('Error fetching Wish List: ', error);
          });
      
          // Cleanup subscription on unmount
          return () => unsubscribe();
    }, []);

	if (wishList){
		return (
			<Screen>
				<View >

                    <AppText style={styles.headerStyle}>Wish List</AppText>
				</View>

					<View style={{marginBottom:100, flexDirection:"row"}}>
						<ItemListing 
							navigation={navigation} 
							numOfColumns={2} 
							showIcons={true} 
							listStyle={styles.listStyle}
							items={wishList.items}/>
					</View>

			</Screen>
		  );
	} else {
		return(
			<Loading/>
		)
	}
}

const styles = StyleSheet.create({
	screen: {
		padding: 2,
	},
	logo: {
		width: 100,
		height: 40,
		resizeMode: "contain",

	},
	headerStyle: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 15,
		marginLeft: 1,
		marginRight: 10,
        fontWeight: "bold",
        fontSize:20,
        alignContent:"center",
        textAlign:"center"
	},
	headerFilter: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "baseline",
		flex:0.65
	},
    headerFilter2: {
		flex:0.1
	},
	headerFilterStyle: {
		fontWeight: "bold",
		fontSize: 16,
		color: colors.grey
	},
	headerFilterStyleHighlight: {
		fontWeight: "bold",
		fontSize: 16,
        borderBottomWidth: 1,
        paddingBottom:2
	},
	listStyle:{
		flex: 0.5, 
		padding: 2, 
	}
});

export default WishListScreen;