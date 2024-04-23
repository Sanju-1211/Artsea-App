import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import { AuthContext } from "../services/auth/AuthContext"
import RowView from "../components/RowView";
import AppIcon from "../components/AppIcon";
import { useFocusEffect } from "@react-navigation/native";
import Logo from "../components/Logo";

function LoginScreen(props) {
  // Keep track of email
  const [email, setEmail] = useState("");

  // Keep track of password
  const [password, setPassword] = useState("");

  // Is the Sign In Button disabled?
  const buttonDisabled = email === "" || password === "";

  const authContext = useContext(AuthContext);
  console.log(`authContext: ${authContext}`)

  // Clear the authentication error when the component is mounted.
  useEffect(() => {
    authContext.authError = "";
  }, []);

  // Clear the authentication error when the component comes back into focus.
  useFocusEffect(() => {
    authContext.authError = "";
  });

  // Get access to AuthContext value to use onSignIn function
  return (
          
      <ImageBackground
            blurRadius={100}
            style={styles.background}
            source={require("../assets/Welcome_Background.jpg")}
      >
      <Logo/>
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
          if (!buttonDisabled) {
            authContext.onLogIn(email, password);
          }
        }}
        text="Log In"
      />

      {/* Error Container */}
      {authContext?.authError && (
        <RowView style={styles.errorContainer}>
          <AppIcon
            iconName={"error-outline"}
            iconSet="MaterialIcons"
            color={colors.red}
            style={styles.errorIcon}
          />
          <AppText
            type="mediumBold"
            color={colors.red}
            style={{ flex: 1, flexWrap: "wrap" }}
          >
            {authContext.authError}
          </AppText>
        </RowView>
      )}

      {/* Footer to Sign Up */}
      <View style={styles.footer}>
        <RowView >
        
          <AppText
            type="largeBold"
            style={styles.loginLinks}
            onPress={() => {
              props.navigation.navigate("Register");
            }}
          >
            Register
          </AppText>
          <AppText style={{marginRight:10,paddingRight:10,}}></AppText>
          <AppText
            type="largeBold"
            style={{ color:colors.white ,borderBottomWidth:1,borderBottomColor:colors.white}}
            
            onPress={() => {
              authContext.onPasswordResetRequest(email, props.navigation);
            }}
          >
            Reset Password
          </AppText>
          
          </RowView>
      </View>
      </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
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
    bottom: 10,
    // Border
    borderTopColor: colors.white,
    borderTopWidth: 1,
    
  },
  
  loginLinks: { 
    color: colors.white,
    borderBottomWidth:1,
    borderBottomColor:colors.white
  },
            
  pasword: {justifyContent:"space-between"}
});

export default LoginScreen;
