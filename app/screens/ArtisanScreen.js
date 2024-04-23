import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import ItemListing from "../components/ItemListing";
import firebase from "firebase/compat";

function ArtisanScreen(props) {

  let artistUserId = props.route.params?.artistUserId;
  const artistUserRef = firebase.firestore().collection("users").doc(artistUserId);
  const [artistUser, setUserDetails] = useState(null);
  
  const currUserId = firebase.auth().currentUser.uid;
  const currUserRef = firebase.firestore().collection("users").doc(currUserId);
  const [currUser, setCurrUserDetails] = useState(null);

  const [artistFollowersCount, setartistFollowersCount] = useState(0);

  const [followAction, setfollowAction] = useState(true);

  useEffect(() => {
    async function getUserDetails() {
      try {
        const artistUserDoc = await artistUserRef.get();
        if (artistUserDoc.exists) {
          setUserDetails(artistUserDoc.data());
          if(artistUserDoc.data().followers){
            setartistFollowersCount(artistUserDoc.data().followers.length);
          }
        } else {
          console.log("No User document");
          return null;
        }
        const currUserDoc = await currUserRef.get();
        if (currUserDoc.exists) {
            setCurrUserDetails(currUserDoc.data());
            const itemIndex = currUserDoc.data().following.findIndex(function (i) {
                return i.uid === artistUserId;
            });
            if (itemIndex > -1) {
                setfollowAction(false);
            }            
        } else {
            console.log("No User document");
            return null;
        }
      } catch (error) {
        console.error("Error fetching current user's document:", error);
      }
    }
    getUserDetails();
  }, []);

  const [artItems, setArtItems] = useState(null);
  useEffect(() => {
    const artItemsRef = firebase.firestore().collection("art").where("artist_uid", "==", artistUserId);
    artItemsRef.get().then((querySnapshot) => {
        let artItemsData = [];
        querySnapshot.forEach((doc) => {
          artItemsData.push(doc.data());
        });
        setArtItems(artItemsData);
      })
      .catch((error) => {
        console.error("Error fetching art items: ", error);
      });
  }, []);

  const onClickFollow = () => {
    followArtist(artistUser,currUser);
  };

  const onClickUnFollow = () => {
    unfollowArtist(artistUser,currUser);
  };
  
  async function followArtist(artistUser,currUser) {
    try {
      await firebase.firestore().runTransaction(async function (transaction) {

        if (currUser) {
          let currUserFollowingList = currUser.following || [];
          const itemIndex = currUserFollowingList.findIndex(function (i) {
            return i.uid === artistUserId;
          });

          if (itemIndex > -1) {
            console.log("Current User is Already Following Artist.");
          } else {
            currUserFollowingList.push({
              ...artistUser,
            });
          }
          transaction.update(currUserRef, { following: currUserFollowingList });
        }
        if (artistUser) {
          let followersList = artistUser.followers || [];
          const itemIndex = followersList.findIndex(function (i) {
            return i.uid === currUserId;
          });
          const newfollower = {
            uid: currUserId,
          };
          if (itemIndex > -1) {
            console.log("Current User is already in Artist's Follower List.");
          } else {
            followersList.push({
              ...newfollower,
            });
          }
          transaction.update(artistUserRef, { followers: followersList });
        }
        setfollowAction(false);
      }); 
    }catch (error) {
      console.error("Transaction failed: ", error);
    }
  }

  async function unfollowArtist(artistUser,currUser) {
    try {
      await firebase.firestore().runTransaction(async function (transaction) {
        if (currUser) {
          let currUserFollowingList = currUser.following || [];
          const currUserFollowingUpdateList = currUserFollowingList.filter(usr => usr.uid !== artistUserId);
          transaction.update(currUserRef, { following: currUserFollowingUpdateList });
        }
        if (artistUser) {
          let followersList = artistUser.followers || [];
          const followersUpdateList = followersList.filter(usr => usr.uid !== currUserId);
          transaction.update(artistUserRef, { followers: followersUpdateList });
        }
        setfollowAction(true);
      }); 
    }catch (error) {
      console.error("Failed to unfollow Artist: ", error);
    }
  }
  //const noOfPosts = 500;

  if (artItems) {
    return (
      <Screen style={styles.screen} >
      <ScrollView contentContinaerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.UserCardHeader} >
          <UserCard
            image={artistUser.image}
            title={artistUser.full_name}
            subTitle={artistUser.username}
          />
          <View style={styles.CountParent}>

            <View style={styles.CountContainer}>
              <AppText style={styles.CountStyle}>{artistFollowersCount}</AppText>
              <AppText style={styles.CountTextStyle}>Followers</AppText>
            </View>
          </View>
        </View>
        <View style={styles.UserDescription}>
          <AppText>{artistUser.bio}</AppText>
        </View>
        <View style={styles.UserCardButton}>
          {followAction ? <AppButton text="Follow" onPress={() => onClickFollow()} /> :
          <AppButton text="Unfollow" onPress={() => onClickUnFollow()}/>}
        </View>
        <View style={{ marginBottom: 400, flexDirection: "row" }}>
          <ItemListing
            navigation={props.navigation}
            numOfColumns={2}
            showIcons={true}
            listStyle={styles.listStyle}
            items={artItems}
          />
        </View>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  CountContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  CountStyle: {
    color: colors.primaryText,
    fontWeight: "bold",
    fontSize: 15,
  },
  CountTextStyle: {
    color: colors.primaryText,
    fontSize: 15,
  },
  CountParent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  userCardStyle: {
    flexDirection: "column",
  },
  screen: {
    padding: 2,
  },
  UserCardHeader: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  UserDescription: {
    marginBottom: 10,
  },
  UserCardButton: {
    flexDirection: "row",
    marginBottom: 5,
  },
  messageStyle: {
    marginRight: 5,
    height: 35,
    flex: 1,
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  listStyle: {
    flex: 0.5,
    padding: 2,
  },
});

export default ArtisanScreen;
