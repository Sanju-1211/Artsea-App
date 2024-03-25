import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Image,
  ViewabilityConfig,
} from "react-native";
// import { Image } from "expo-image";
import { Video } from "expo-av";
import RowView from "./RowView";
import { Avatar } from "react-native-paper";
import AppText from "./AppText";
import AppIcon from "./AppIcon";
import colors from "../config/colors";
import DoubleClick from "react-native-double-tap-without-opacity";
import firebase from "firebase/compat";
import { useNavigation } from "@react-navigation/native";
import UsernameToProfileText from "./UsernameToProfileText";
import * as Haptics from "expo-haptics";
import { getAvatarUri } from "../services/helper/getAvatarUri";
import { AuthContext } from "../services/auth/AuthContext";

function FeedPost(props) {
  // State variables
  const [post, setPost] = useState(props.post);
  const [isLiked, setIsLiked] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  // Props
  const isVisible = props.isVisible;
  const isMuted = props.isMuted;
  const setIsMuted = props.setIsMuted;
  // Refs
  const videoRef = useRef(null);
  // Constants //
  // width
  const WIDTH = useWindowDimensions().width;
  // navigation
  const navigation = useNavigation();
  // userDetails
  const authContext = useContext(AuthContext);
  const userDetails = authContext.userDetails;
  // Firebase
  const db = firebase.firestore();
  const usersRef = db.collection("users");
  const postsRef = db.collection("posts");
  const userId = firebase.auth().currentUser.uid;


  useEffect(() => {
    // If the current userDetails are loaded
    if (userDetails) {
      // console.log("Getting to know which posts the user likes.");
      // Get access to the post object in firestore
      const query = postsRef.where("id", "==", post.id);
      const unsubscribeFromSnapshot = query.onSnapshot(function (
        querySnapshot
      ) {
        // console.log(`Feed Post: Snapshot Triggered.`);
        querySnapshot.forEach(function (doc) {
          // Get post object's data
          const data = doc.data();
          setPost(data);
          const likes = data.likes;
          // console.log(likes);
          if (likes.includes(userDetails.username)) {
            setIsLiked(true);
          }
        });
      });

      // // Return the unsubscribe function to clean up the listener
      // return () => {
      //   console.log("unsuscribing from", post.caption);
      //   unsubscribeFromSnapshot();
      // };
    }
  }, []);

  useEffect(() => {
    // If the current userDetails are loaded
    if (userDetails) {
      // console.log("Getting to know which posts the user likes.");
      // Get access to the post object in firestore
      const query = postsRef.where("id", "==", post.id);
      query.onSnapshot(function (querySnapshot) {
        // console.log(`Feed Post: Snapshot Triggered.`);
        querySnapshot.forEach(function (doc) {
          // Get post object's data
          const data = doc.data();
          setPost(data);
          const likes = data.likes;
          // console.log(likes);
          if (likes.includes(userDetails.username)) {
            setIsLiked(true);
          }
        });
      });
    }
  }, []);

  async function updateLikes() {
    if (userDetails) {
      const query = postsRef.where("id", "==", post.id);
      const docsSnapshot = await query.get();

      for (const doc of docsSnapshot.docs) {
        // Get post object's data
        const data = doc.data();

        if (isLiked) {
          if (data.likes.includes(userDetails.username) == false) {
            // Add the username of the current user to the `likes` of the post
            data.likes.push(userDetails.username);
            // Add the uid of the current user to the `likesUids` of the post
            data.likesUids.push(userDetails.uid);
            // If there were no likes on this photo, and this is the first like,
            // then add the current user's profile picture to the `userLikedProfilePicture`
            // of this post.
            if (data.nLikes == 0) {
              data.userLikedProfilePicture = userDetails.profilePicture;
            }
          }
        } else {
          // If the post was unliked, remove the current user's userame from
          // the post's `likes`
          data.likes = data.likes.filter(function (username) {
            return username !== userDetails.username;
          });

          // If the post was unliked, remove the current user's uid from
          // the post's `likesUids`
          data.likesUids = data.likesUids.filter(function (uid) {
            return uid !== userDetails.uid;
          });

          // If this was the only like on the post
          // remove the current user's profile Picture
          if (data.nLikes == 1) {
            data.userLikedProfilePicture = "";
          }
        }

        // Update the number of likes on the post
        data.nLikes = data.likes.length;
        await postsRef.doc(doc.id).update(data);
      }
    }
  }

  useEffect(() => {
    // console.log(`FeedPost: isLiked: ${isLiked}`);
    updateLikes()
      .then(() => "Likes updated successfully")
      .catch(() => console.error("Error editing likes."));
  }, [isLiked]);

  async function handleVideoPlayback() {
    if (videoRef.current !== null) {
      try {
        const status = await videoRef.current.getStatusAsync();
        // if we go the status
        if (status) {
          // and the status tells us that the video is not playing
          if (status.isPlaying == false) {
            // we play the video
            try {
              console.log("Playing Video");
              await videoRef.current.playAsync();
            } catch (error) {
              console.log("Error playing video:", error);
            }
          } else if (status.isPlaying == true) {
            try {
              console.log("Stopping Video");
              await videoRef.current.stopAsync();
            } catch (error) {
              console.log("Error stopping video:", error);
            }
          }
        }
      } catch (error) {
        console.log("Error getting video status:", error);
      }
    } else {
      // console.log("No video in post:", post.caption);
    }
  }

  async function unloadVideo() {
    if (videoRef.current != null) {
      // get to know the current status of the video: is it playing?
      try {
        const status = await videoRef.current.getStatusAsync();
        // if the we got the status
        if (status) {
          // and the status tells us that the video is not playing currently
          if (status.isPlaying == true) {
            // we play the videro
            try {
              console.log("Unloading Video");
              await videoRef.current.unloadAsync();
            } catch (error) {
              console.log("Error unloading video:", error);
            }
          }
        }
      } catch (error) {
        console.log("Error getting video status:", error);
      }
    } else {
      // console.log("No video in post:", post.caption);
    }
  }

  // useEffect(() => {
  //   // return () => {
  //   //   stopVideo();
  //   //   unloadVideo();
  //   // };
  //   console.log("Component: ", post.caption, "is in focus.");
  //   return async () => {
  //     console.log("Component: ", post.caption, "is out of focus.");
  //     if (videoRef.current !== null) {
  //       await videoRef.current.stopAsync();
  //     }

  //     // unloadVideo();
  //   };
  // }, [isFocussed]);

  // useEffect(() => {
  //   return () => {
  //     if (videoRef.current !== null) {
  //       unloadVideo().then(() => {
  //         console.log("Video unloaded successfully");
  //       });
  //     }
  //   };
  // }, []);

  useEffect(() => {
    // if (isVisible == true) {
    //   console.log(props.id, "is visible.");
    // }
    handleVideoPlayback();
  }, [isVisible]);

  function renderMedia(mediaItem) {
    // console.log(media);
    if (mediaItem.type == "image") {
      return (
        <DoubleClick
          doubleTap={function () {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsLiked(!isLiked);
          }}
          delay={0}
        >
          <Image
            source={{ uri: mediaItem.uri }}
            style={{ ...styles.mediaItem, width: WIDTH }}
            resizeMode="cover"
          />
        </DoubleClick>
      );
    } else {
      return (
        <DoubleClick
          doubleTap={function () {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsLiked(!isLiked);
          }}
          singleTap={() => setIsMuted(!isMuted)}
          delay={0}
        >
          <Video
            source={{ uri: mediaItem.uri }}
            style={{
              ...styles.mediaItem,
              width: WIDTH,
            }}
            resizeMode="cover"
            isLooping={true}
            shouldPlay={isVisible}
            isMuted={isMuted}
            useNativeControls={false}
            ref={videoRef}
          />
          <View
            style={{
              backgroundColor: colors.darkgrey,
              borderRadius: 25,
              position: "absolute",
              bottom: 10,
              right: 10,
              padding: 5,
              opacity: 0.8,
            }}
          >
            <AppIcon
              iconName={isMuted ? "volume-mute-sharp" : "volume-medium"}
              iconSet={"Ionicons"}
              iconSize={14}
              color={colors.white}
            />
          </View>
        </DoubleClick>
      );
    }
  }

  // Definining the viewability config.
  const viewabilityConfig = {
    // The threshold for an item to be visible is set to 51, which means that an item is considered visible
    // if at least 51% of it's area is visible on the screen.
    itemVisiblePercentThreshold: 51,
  };

  // Define a useRef hook named `onViewableItemsChanged`.
  const onViewableItemsChanged = useRef(function ({ viewableItems }) {
    // This is a function that'll get called when the vieable items in a list change.
    // It takes an argument: `viewableItems` which represents a list of currently viewable
    // items.
    // console.log("Viewable Posts Changed");
    if (viewableItems.length > 0) {
      setActiveMediaIndex(viewableItems[0].item.id);
    }
  });

  return (
    <View style={[{ width: WIDTH, backgroundColor: "white" }, styles.marginV8]}>
      {/* Username Header */}
      <RowView style={styles.marginH8}>
        <Avatar.Image
          source={{
            uri: getAvatarUri(post.userProfilePicture, post),
          }}
          size={30}
          style={styles.avatar}
          backgroundColor={colors.white}
        />
        <AppText
          type="smallBold"
        >
          {post.username}
        </AppText>
      </RowView>

      {/* Content */}
      {/* If the number of media in post.media is === 1: render a single post. 
      Else, render a horizontal flat lis with all the images in it. */}
      <View style={{ marginVertical: 5 }}>
        <DoubleClick
          doubleTap={function () {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsLiked(!isLiked);
          }}
          delay={0}
        >
          {post.media.length == 1 ? (
            renderMedia(post.media[0])
          ) : (
            <FlatList
              data={post.media}
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              snapToInterval={WIDTH}
              snapToAlignment="center"
              decelerationRate='fast'
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderMedia(item)}
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={onViewableItemsChanged.current}
              // Configurations for Horizontal FlatList
            />
          )}
        </DoubleClick>
      </View>

      {/* Post Footer */}
      <View style={styles.marginH8}>
        {/* Reaction Bar */}
        <RowView style={styles.marginV4}>
          <AppIcon
            style={styles.icon}
            iconName={isLiked ? "heart" : "hearto"}
            iconSet="AntDesign"
            color={isLiked ? colors.red : colors.black}
            onPress={() => setIsLiked(!isLiked)}
          />
          
          {post.media.length > 1 && (
            <RowView
              style={{ flex: 1, position: "absolute", left: WIDTH / 2.3 }}
            >
              {post.media.map(function (_, index) {
                return (
                  <View
                    key={index}
                    style={{
                      width: 6,
                      aspectRatio: 1,
                      backgroundColor:
                        activeMediaIndex == index ? colors.primary : "#d5d3d3",
                      borderRadius: 3,
                      margin: 3,
                      alignContent: "center",
                    }}
                  />
                );
              })}
            </RowView>
          )}
        </RowView>

        {/* Like Summary */}
        {post.nLikes > 0 ? (
          <RowView style={styles.marginV4}>
            <Avatar.Image
              source={{
                uri: getAvatarUri(post.userLikedProfilePicture, post),
              }}
              // source={require(post.userLikedProfilePicture)}
              // source={post.userLikedProfilePicture}
              size={20}
              style={styles.avatar}
              backgroundColor={colors.white}
            />
            <AppText>
              Liked by{" "}
              <UsernameToProfileText
                type="smallBold"
                username={post.likes[0]}
                uid={post.likesUids[0]}
              />
              {post.nLikes == 2 ? (
                <AppText
                  type="smallBold"
                  onPress={() => navigation.navigate("Likes", { post: post })}
                >
                  {" "}
                  and 1 other
                </AppText>
              ) : (
                <View></View>
              )}
              {post.nLikes > 2 ? (
                <AppText
                  type="smallBold"
                  onPress={() => navigation.navigate("Likes", { post: post })}
                >
                  {" "}
                  and {post.nLikes - 1} others
                </AppText>
              ) : (
                <View></View>
              )}
            </AppText>
          </RowView>
        ) : (
          <View></View>
        )}

        {/* Caption */}
        <AppText>
          <UsernameToProfileText
            type="smallBold"
            username={post.username}
            uid={post.userUid}
          />{" "}
          {post.caption}
        </AppText>

        {/* Comments */}
        {post.nComments > 0 ? (
          <AppText
            style={{ color: colors.grey }}
            onPress={() =>
              navigation.navigate("Comments", { post, userDetails })
            }
          >
            View all {post.nComments} comments
          </AppText>
        ) : (
          <AppText
            style={{ color: colors.grey }}
            onPress={() =>
              navigation.navigate("Comments", {
                post,
                userDetails,
                isCommenting: true,
              })
            }
          >
            Add a comment
          </AppText>
        )}      

        {/* Date */}
        <AppText style={{ color: colors.grey }}>{post.createdAt}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Size
    // Layout
    // Boundaries
    // Fill
  },
  mediaItem: {
    //Size
    aspectRatio: 1,
  },
  icon: {
    marginRight: 15,
  },
  marginH8: { marginHorizontal: 8 },
  marginV4: { marginVertical: 4 },
  marginV8: { marginVertical: 8 },
  avatar: { marginRight: 5, backgroundColor: "transparent" },
});

export default FeedPost;
