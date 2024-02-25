import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";

function CategoryCard({
    categoryName,
    categoryImage,
    onPress,
}) {
    return (
        <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
            <View style={styles.container}>
                {categoryImage && <Image style={styles.image} source={categoryImage} />}
                <View style={styles.detailsContainer}>
                    <AppText style={styles.name}>{categoryName}</AppText>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        padding: 15,
        alignItems: "center"
    },
    detailsContainer: {
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    name: {
        alignItems: "center",
        fontWeight: "500",
        color: colors.black
    },
});

export default CategoryCard;
