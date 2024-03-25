import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import UserCard from "../components/UserCard";
import firebase from "firebase/compat";
import { Avatar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

function Following({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    async function getUserDetails() {
      try {
        const currentUser = firebase.auth().currentUser;
        const docRef = firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid);
        const doc = await docRef.get();

        if (doc.exists) {
          console.log("User document data:", doc.data().following);
          setUserDetails(doc.data());
        } else {
          console.log("No such document");
          return null;
        }
      } catch (error) {
        console.error("Error fetching current user's document:", error);
      }
    }
    getUserDetails();
  }, []);
  if (userDetails) {
    return (
      <FlatList
        data={userDetails.following}
        keyExtractor={(item, index) => item.uid.toString()}
        renderItem={({ item, index }) => {
          console.log(userDetails);
          console.log(item);
          const lastItem = index === userDetails.following.length - 1;
          return (
            <View style={{paddingBottom:5,paddingTop:5}}>
                <UserCard
                image={item.image}
                title={item.full_name}
                subTitle={item.username}
                onPress={() => {
                    navigation.navigate("ArtisanDetail", {
                    screen: "ArtisanDetailScreen",
                    params: { artistUserId: item.uid },
                    });
                }}
                />
            </View>
          );
        }}
      />
    );
  }
}

const styles = StyleSheet.create({});

export default Following;
