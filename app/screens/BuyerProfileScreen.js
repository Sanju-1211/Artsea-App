import React, { useContext, useEffect, useState } from "react";
import {  View, StyleSheet, useWindowDimensions } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import colors from "../config/colors";
import firebase from "firebase/compat";
import Loading from "../components/Loading";
import AppButton from "../components/AppButton";
import { AuthContext } from "../services/auth/AuthContext";
import { FlatList } from "react-native-gesture-handler";

function BuyerProfileScreen() {
    const authContext = useContext(AuthContext);
    const [orderItems, setOrderItems] = useState(null);

    const [userDetails, setUserDetails] = useState(null)
    const dimensions = useWindowDimensions()


    useEffect(()=>{
        async function getUserDetails(){
            try{
                const currentUser = firebase.auth().currentUser
                const docRef = firebase.firestore().collection("users").doc(currentUser.uid)
                const doc = await docRef.get()

                if (doc.exists){
                    console.log("User document data:", doc.data())
                    setUserDetails(doc.data())
                } else {
                    console.log("No such document")
                    return null
                }
                
            } catch(error){
                console.error("Error fetching current user's document:", error)
            }
        }
        getUserDetails()
    },[])

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
          const ordersRef = firebase.firestore().collection('orders').doc(user.uid);
          // Listen for real-time updates with .onSnapshot()
          const unsubscribe = ordersRef.onSnapshot(doc => {
            if (doc.exists) {
              setOrderItems(doc.data().items);
            } else {
              console.log("No such document");
              setOrderItems([]); // Clear order items if the document doesn't exist
            }
          }, error => {
            console.error('Error fetching order items: ', error);
          });
      
          // Cleanup subscription on unmount
          return () => unsubscribe();
        }
      }, []);

    if (userDetails){
        return (
            <Screen style={styles.screen}>
                <View style={styles.headingContainer}>
                    <AppText style={styles.heading}>Profile</AppText>
                </View>
    
                <View style={styles.UserCardHeader}>
                    <UserCard
                    image={{uri: userDetails.image}}
                    title={userDetails.full_name}
                    subTitle={userDetails.username}
                    userCardStyle={styles.userCardStyle}
                    imageStyle = {styles.imageStyle}
                    />
                </View>
                <View >
                    <AppText style={styles.UserDescription}>
                        User Type : {userDetails.type}
                    </AppText>                             
                </View> 

                          <AppButton
            width={dimensions.width / 2.3}
            height={45}
            buttonColor={colors.whitegrey}
            textColor={colors.black}
            labelStyle={{ fontWeight: "bold" }}
            style={{
              borderRadius: 10,
            }}
            onPress={() => authContext.onLogout()}
            text="Logout"
          />     
          {(orderItems.length > 0)? (<FlatList
          data={orderItems}
          keyExtractor={(item) => item.image.toString()}
          renderItem={({ item }) => (
            <orderItem
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              style={{width: "5"}}
            />
          )}
        />):(<View><AppText>
        There are no items in your order yet. 
     </AppText></View>)}  
            </Screen>
        );
    } else {
        return (<Loading/>)
    }
}

const styles = StyleSheet.create({
    headingContainer: {
        marginVertical: 10,
        padding: 10,
        justifyContent: "center"
        
    },
    heading: {
        color: colors.primaryText,
        fontWeight: "bold",
        justifyContent: "center",
        fontSize: 24
    },  
    
	userCardStyle:{
		flexDirection: "column"
	},
	screen: {
		padding: 5,
	},
	UserCardHeader:{
		flexDirection: 'row',
		justifyContent: "space-between",
		marginBottom: 10
	},
	UserDescription:{
		marginBottom: 5,
		justifyContent: "space-around"
	},
	imageStyle:{
		height:100,
		width: 100,
		borderRadius: 50
	}
});

export default BuyerProfileScreen;
