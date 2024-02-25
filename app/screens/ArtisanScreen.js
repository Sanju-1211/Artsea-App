import React from "react";
import {  View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import ItemListing from "../components/ItemListing";

const listings = [
    {
      id: 1,
      title: "Red jacket for sale",
      price: 100,
      image: require("../assets/jacket.jpg"),
    },
    {
      id: 2,
      title: "Couch in great condition",
      price: 1000,
      image: require("../assets/couch.jpg"),
    },
    {
      id: 3,
      title: "Red jacket for sale",
      price: 100,
      image: require("../assets/jacket.jpg"),
    },
    {
      id: 4,
      title: "Couch in great condition",
      price: 1000,
      image: require("../assets/couch.jpg"),
    },
    {
      id: 5,
      title: "Red jacket for sale",
      price: 100,
      image: require("../assets/jacket.jpg"),
    },
    {
      id: 6,
      title: "Couch in great condition",
      price: 1000,
      image: require("../assets/couch.jpg"),
    },
];

function ArtisanScreen({navigation}) {
    const noOfPosts = 500;    
    const noOfFollowers = "10k";
    return (
        <Screen style={styles.screen}>
            <View style={styles.UserCardHeader}>
                <UserCard
					image={require("../assets/mosh.jpg")}
					title="Mosh Hamedani"
					subTitle="5 Listings"
					userCardStyle={styles.userCardStyle}
					imageStyle = {styles.imageStyle}
                />
                <View style={styles.CountParent}>
                  	<View style={styles.CountContainer}>
                    	<AppText style={styles.CountStyle}>{noOfPosts}</AppText>
                      	<AppText style={styles.CountTextStyle}>Posts</AppText>
                  	</View>
                  	<View style={styles.CountContainer}>
                      	<AppText style={styles.CountStyle}>{noOfFollowers}</AppText>
                      	<AppText style={styles.CountTextStyle}>Followers</AppText>
                  	</View>
                </View>
            </View>
            <View style={styles.UserDescription}>
                <AppText >
                    Description
                </AppText>                
            </View> 
            <View style={styles.UserCardButton}>
                <AppButton  title="Follow" 
                            onPress={()=>console.log("Message button pressed")} 
                            buttonStyle={styles.messageStyle}
                />  
            </View>   
			<View style={{marginBottom:480, flexDirection:"row"}}>
            	<ItemListing 
					navigation={navigation} 
					numOfColumns={2} 
          			showIcons={true} 
               		listStyle={styles.listStyle}
	        	/>    
		  	</View>                                    
        </Screen>
    );
}

const styles = StyleSheet.create({
  CountContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  CountStyle: {
    color: colors.primaryText,
    fontWeight: "bold",
    fontSize: 15
  },
  CountTextStyle: {
    color: colors.primaryText,
    fontSize: 15,
    
  }, 
  CountParent:{
    flex:1, 
    flexDirection:"row", 
    justifyContent:"space-around"
  },
  userCardStyle:{
    flexDirection: "column",
  },
  screen: {
    padding: 2,
  },
  UserCardHeader:{
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: "space-between",
    marginBottom: 10
  },
  UserDescription:{
    marginBottom: 10
  },
  UserCardButton:{
    flexDirection: "row",
    marginBottom: 5,
  },
  messageStyle:{
    marginRight: 5,
    height: 35,
    flex: 1
  },
  imageStyle:{
    height:100,
    width: 100,
    borderRadius: 50,
    
  },
  listStyle:{
	flex: 0.5, 
	padding: 2, 
  }
});

export default ArtisanScreen;
