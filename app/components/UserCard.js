import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";
import { Avatar } from "react-native-paper";

function UserCard({
    title,
    subTitle,
    image,
    userCardStyle,
    imageStyle,
    onPress,
}) {
    return (
        <TouchableHighlight underlayColor={colors.lightgrey} onPress={onPress}>
            <View style={[styles.container,userCardStyle]}>
                {image && <Image style={[styles.image, imageStyle]} source={{uri:image}} />}

                <View style={styles.detailsContainer}>
                    <AppText style={styles.title}>{title}</AppText>
                    {subTitle && <AppText style={styles.subTitle}>{subTitle}</AppText>}
                </View>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        
        flexDirection: "row",
        backgroundColor: colors.primaryBackground,
    },
    detailsContainer: {
        justifyContent: "center",
        padding: 10
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    subTitle: {
        color: colors.secondaryText,
    },
    title: {
        color: colors.primaryText,
        fontWeight: "bold",
    },
});

export default UserCard;
