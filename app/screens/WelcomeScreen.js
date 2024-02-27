import React from "react";
import { ImageBackground, StyleSheet, View, } from "react-native";
import AppButton from "../components/AppButton";
import Logo from "../components/Logo";
import colors from "../config/colors";

function WelcomeScreen({navigation}) {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/Welcome_Background.jpg")}
    >
      <Logo/>
      <View style={styles.buttonsContainer}>
        <AppButton text="Login" 
                   buttonStyle={styles.button} 
                   buttonTextStyle={styles.buttonTextStyle}
                   onPress={() => navigation.navigate("Login")}
                   />
        <AppButton text="Register" 
                   buttonStyle={styles.button} 
                   buttonTextStyle={styles.buttonTextStyle}
                   onPress={() => navigation.navigate("Register")}
                   />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    buttonsContainer: {
        padding: 20,
        width: "100%",
        bottom: 50,
    },
    button: {
        borderWidth: 2,
        borderColor: colors.white,
        backgroundColor: "transparent",
        padding: 15,
        margin: 10,
    },
    buttonTextStyle: {
        fontSize: 18,
    }
});

export default WelcomeScreen;
