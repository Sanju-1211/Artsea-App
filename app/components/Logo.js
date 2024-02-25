import React from "react";
import { StyleSheet,  View, Text, Image } from "react-native";
import colors from "../config/colors";

function Logo({logoContainerStyle,logoStyle,hideTagline}) {
    return (
        <View style={[styles.logoContainer,logoContainerStyle]}>
            <Image style={[styles.logo,logoStyle]} source={require("../assets/AppLogoWhite_big.png")} />
            { !hideTagline && <Text style={styles.tagline}>See Art , Buy Art , Sell Art</Text> }
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 300,
        height: 100,
    },
    logoContainer: {
      position: "absolute",
      top: 70,
      alignItems: "center",
    },
    tagline: {
        fontSize: 18,
        paddingVertical: 2,
        color: colors.white
    },
});

export default Logo;
