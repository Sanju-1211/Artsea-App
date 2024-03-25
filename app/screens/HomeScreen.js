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

function HomeScreen({navigation}) {
  	const [highlightExplore, setHighlightExlore] = useState(true);
  	const [highlightFollowing, sethighlightFollowing] = useState(false);
	// Add state variable to keep track of new items uploaded for selling
	const [artItems, setArtItems] = useState(null)

    useEffect(() => {
      const userRef = firebase.firestore().collection("art");
      const unsubscribe = userRef.onSnapshot(
        (querySnapshot) => {
			let artItemsData = [];
			querySnapshot.forEach((doc) => {
			  artItemsData.push(doc.data());
			});
			setArtItems(artItemsData);
        },
        (error) => {
          console.error("Error fetching user document: ", error);
        }
      );
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

  	const exploreClicked = () => {
      	setHighlightExlore(true);
      	sethighlightFollowing(false);
  	};
  	const followingClicked = () => {
      	sethighlightFollowing(true);
      	setHighlightExlore(false);
  	};  

	// Changes Made: 
	// 1. Added item prop to <ItemListing>
	if (artItems){
		return (
			<Screen>
				<View style={styles.headerStyle}>
					<Image style={[styles.logo]} source={require("../assets/AppLogoBlack.png")} />
					<View style={styles.headerFilter}>
						<TouchableOpacity onPress={exploreClicked}>
							{
							highlightExplore ?
							<AppText style={styles.headerFilterStyleHighlight}>Explore</AppText> :
							<AppText style={styles.headerFilterStyle}>Exlpore</AppText>
							}
						</TouchableOpacity>
						<TouchableOpacity onPress={followingClicked}>
							{
							highlightFollowing ?
							<AppText style={styles.headerFilterStyleHighlight}>Following</AppText> :
							<AppText style={styles.headerFilterStyle}>Following</AppText> 
							}
						</TouchableOpacity>
					</View>
	                <View style={styles.headerFilter2}></View>

				</View>
				{ 
					highlightExplore &&  
					<View style={{marginBottom:100, flexDirection:"row"}}>
						<ItemListing 
							navigation={navigation} 
							numOfColumns={2} 
							showIcons={true} 
							listStyle={styles.listStyle}
							items={artItems}/>
					</View>
				}
				{ 
					highlightFollowing && <Following navigation={navigation}/>
				}
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
		marginBottom: 10,
		marginLeft: 1,
		marginRight: 10,
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

export default HomeScreen;
