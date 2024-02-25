import React from "react";
import {  View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import colors from "../config/colors";

function ProfileScreen() {
    return (
        <Screen style={styles.screen}>
            <View style={styles.headingContainer}>
                <AppText style={styles.heading}>Profile</AppText>
            </View>

            <View style={styles.UserCardHeader}>
                <UserCard
                image={require("../assets/mosh.jpg")}
                title="Mosh Hamedani"
                subTitle="@mosh"
                userCardStyle={styles.userCardStyle}
                imageStyle = {styles.imageStyle}
                />
            </View>
            <View >
                <AppText style={styles.UserDescription}>
                    Email : 
                </AppText>  
                <AppText style={styles.UserDescription}>
                    Password : 
                </AppText>                               
            </View> 
                               
        </Screen>
    );
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

export default ProfileScreen;
