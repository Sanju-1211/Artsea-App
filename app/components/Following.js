import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import UserCard from "../components/UserCard";

const followingUsers = [
  {
    id: 1,
    title: "Mosh Hamedani",
    subTitle: "@Mosh",
    image: require("../assets/mosh.jpg")
  },
  {
    id: 2,
    title: "Mosh Hamedani",
    subTitle: "@Mosh",
    image: require("../assets/mosh.jpg")
  },
  {
    id: 3,
    title: "Mosh Hamedani",
    subTitle: "@Mosh",
    image: require("../assets/mosh.jpg")
  },
  {
    id: 4,
    title: "Mosh Hamedani",
    subTitle: "@Mosh",
    image: require("../assets/mosh.jpg")
  },
  {
    id: 5,
    title: "Mosh Hamedani",
    subTitle: "@Mosh",
    image: require("../assets/mosh.jpg")
  },
  {
    id: 6,
    title: "Mosh Hamedani",
    subTitle: "@Mosh",
    image: require("../assets/mosh.jpg")
  },
  {
    id: 7,
    title: "Mosh Hamedani",
    subTitle: "@Mosh",
    image: require("../assets/mosh.jpg")
  },
];

function Following({navigation}) {
    return (
        <FlatList
        data={followingUsers}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item, index }) => {
            const lastItem = index === followingUsers.length - 1;
            return (
                <UserCard
                    image={item.image}
                    title={item.title}
                    subTitle={item.subTitle}
                    userCardStyle={styles.userCardStyle}
                    onPress={() => navigation.navigate("ArtisanDetail")}
                />                      
            )
        }}
        />
    );
}

const styles = StyleSheet.create({
    userCardStyle:{
        marginTop: 10,
        marginBottom: 10
    }
});

export default Following;
