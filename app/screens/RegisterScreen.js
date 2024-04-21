import React, { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Switch, View } from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import RowView from "../components/RowView";
import AppIcon from "../components/AppIcon";
import colors from "../config/colors";
import { AuthContext } from "../services/auth/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import Logo from "../components/Logo";
import { Colors } from "react-native/Libraries/NewAppScreen";

function RegisterScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isArtist, setIsArtist] = useState(false); 

  // Password Regex
  // At least 6 characters
  // At least 1 letter
  // At least 1 number or special character
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*0-9])[a-zA-Z0-9!@#$%^&*]{6,}$/;

  const buttonDisabled =
    email === "" ||
    password === "" ||
    fullName == "" ||
    !passwordRegex.test(password);

  const authContext = useContext(AuthContext);

  // Clear the authentication error when the component is mounted.
  useEffect(() => {
    // console.log("RegisterScreen: Clearing Errors on Focus ");
    authContext.authError = "";
  }, []);

  // Clear the authentication error when the component comes back into focus.
  useFocusEffect(() => {
    authContext.authError = "";
  });

  return (
    
      <ImageBackground
            blurRadius={100}
            style={styles.background}
            source={require("../assets/Welcome_Background.jpg")}
        >
            <Logo/>

      {/* Full Name Text Input */}
      <AppTextInput
        placeholder="Full Name"
        label="Full Name"
        value={fullName}

        onChangeText={function (fn) {
          setFullName(fn);
        }}
        containerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
      />

      {/* Email Text Input */}
      <AppTextInput
        placeholder="Email"
        label="Email"
        value={email}
        textContentType="emailAddress"
        keyboardType="email-address"
        onChangeText={function (e) {
          setEmail(e);
        }}
        containerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
      />

      {/* Password Text Input */}
      <AppTextInput
        placeholder="Password"
        label="Password"
        value={password}
        textContentType="password"
        secureTextEntry
        onChangeText={function (p) {
          setPassword(p);
        }}
        containerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
      />

      {/* Button */}
      <AppButton
        buttonDisabled={buttonDisabled}
        onPress={function () {
            console.log("after sign up register clicked")
          if (!buttonDisabled) {
            console.log("before sign up register clicked")
            authContext.onSignUp(email, password, fullName, isArtist);
          }
        }}
        text="Register"
      />

      {/* Error Container */}
      {authContext.authError && (
        <RowView style={styles.errorContainer}>
          <AppIcon
            iconName={"error-outline"}
            iconSet="MaterialIcons"
            color={colors.red}
            style={styles.errorIcon}
          />
          <AppText
            type="mediumNormal"
            color={colors.red}
            style={{ flex: 1, flexWrap: "wrap" }}
          >
            {authContext.authError}
          </AppText>
        </RowView>
      )}


      {/* Footer to Log In */}
      <View style={styles.footer}>
    
          
          <AppText
            type="largeBold"
            style={{ color: colors.white, borderBottomWidth:1,borderBottomColor:colors.white }}
            onPress={() => {
              props.navigation.navigate("Login");
            }}
          >
            Login
          </AppText>
        
      </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    // Size
    // Layout
    alignItems: "center",
    // Boundaries
    // Fill
  },
  background: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    
  },
  inputContainerStyle: { height: 50, padding: 8 },
  inputStyle: { padding: 8 },
  image: {
    width: 200,
    height: 70,
    resizeMode: "contain",
    marginTop: 80,
    marginBottom: 20,
    
  },
  errorContainer: {
    width: 350,
    alignSelf: "center",
  },
  errorIcon: {
    paddingRight: 20,
  },
  footer: {
    // Size
    width: "100%",
    height: 70,
    // Layout
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    // Border
    borderTopColor: colors.lightgrey,
    borderWidth: 1,

    // Fill
  },
});

export default RegisterScreen;

