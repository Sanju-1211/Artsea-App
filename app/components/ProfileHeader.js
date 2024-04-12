// Need to separate out the profile header for the FlatList to scroll along with the header.
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from "react-native";
import AppText from "./AppText";
import RowView from "./RowView";
import { Avatar } from "react-native-paper";
import AppButton from "./AppButton";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../services/auth/AuthContext";
import firebase from "firebase/compat";
import { getAvatarUri } from "../services/helper/getAvatarUri";
import { getUserDetails } from "../services/auth/getUserDetails";
import Loading from "./Loading";

function ProfileHeader(props) {
  const authContext = useContext(AuthContext);
  const currentUser = authContext.userDetails;
  const [userDetails, setUserDetails] = useState()

  const navigation = useNavigation();

  if (userDetails){
    return (
        <View style={styles.container}>
          {/* Header for Username */}
          <RowView>
            <AppText type={"h1ExtraBold"}>{userDetails.full_name}</AppText>
          </RowView>
          {/* User Summary with Avatar, Favourites, and Following*/}
          <RowView style={[styles.marginV16, styles.profileSummary]}>
            <Avatar.Image
              source={{
                uri: getAvatarUri(userDetails.image, userDetails),
              }}
              size={90}
              style={styles.avatar}
              backgroundColor={colors.white}
            />
            <RowView
              style={{
                flex: 1,
                justifyContent: "space-evenly",
              }}
            >
              <View style={styles.center}>
                <AppText type="largeBold">{userDetails.numFavourites}</AppText>
                <AppText type="smallNormal">Favourties</AppText>
              </View>
    
              <Pressable
                style={styles.center}
                onPress={function () {
                  navigation.navigate("User Follow", {
                    screen: `${userDetails.numFollowers} Followers`,
                    userId: userDetails.uid,
                    userDetails: userDetails,
                  });
                }}
              >
                <AppText type="largeBold">{userDetails.numFollowers}</AppText>
                <AppText type="smallNormal">Followers</AppText>
              </Pressable>
    
              <Pressable
                style={styles.center}
                onPress={function () {
                  navigation.navigate("User Follow", {
                    screen: `${userDetails.numFollowing} Following`,
                    userId: userDetails.uid,
                    userDetails: userDetails,
                  });
                }}
              >
                <AppText type="largeBold">{userDetails.numFollowing}</AppText>
                <AppText type="smallNormal">Following</AppText>
              </Pressable>
            </RowView>
          </RowView>
          {/* Name */}
          <View>
            <AppText type="smallBold">{userDetails.name}</AppText>
          </View>
          {/* Bio */}
          <View>
            <AppText type="smallNormal">{userDetails.bio}</AppText>
          </View>
    
          {userDetails.uid == currentUser.uid ? (
            <RowView
              style={{
                justifyContent: "space-around",
              }}
            >
              <AppButton
                width={useWindowDimensions().width / 2.3}
                height={45}
                buttonColor={colors.whitegrey}
                textColor={colors.black}
                labelStyle={{ fontWeight: "bold" }}
                style={{
                  borderRadius: 10,
                }}
                onPress={goToEditProfileScreen}
                text="Edit Profile"
              />
              <AppButton
                width={useWindowDimensions().width / 2.3}
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
            </RowView>
          ) : (
            <AppText></AppText>
          )}
        </View>
      )
  } else {
    return (<Loading/>)
}
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  marginV16: {
    marginVertical: 16,
  },
  profileSummary: {
    justifyContent: "space-between",
  },
  center: { justifyContent: "center", alignItems: "center" },
  avatar: { marginRight: 30 },
});

export default ProfileHeader;
