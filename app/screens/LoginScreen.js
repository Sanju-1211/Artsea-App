// import React from "react";
// import { StyleSheet, ImageBackground, View,} from "react-native";
// import * as Yup from "yup";
// import colors from "../config/colors";
// import Logo from "../components/Logo";
// import { AppForm, AppFormField, SubmitButton } from "../components/forms";

// const validationSchema = Yup.object().shape({
//   email: Yup.string().required().email().label("Email"),
//   password: Yup.string().required().min(4).label("Password"),
// });

// function LoginScreen({navigation}) {
//   return (
//         <ImageBackground
//             blurRadius={30}
//             style={styles.background}
//             source={require("../assets/Welcome_Background.jpg")}
//         >
//             <Logo/>
//             <AppForm
//                 initialValues={{ email: "", password: "" }}
//                 onSubmit={(values) => console.log(values)}
//                 validationSchema={validationSchema}
//             >
//                 <AppFormField
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     icon="email"
//                     keyboardType="email-address"
//                     name="email"
//                     placeholder="Email"
//                     textContentType="emailAddress"
//                 />
//                 <AppFormField
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     icon="lock"
//                     name="password"
//                     placeholder="Password"
//                     secureTextEntry
//                     textContentType="password"
//                 />
//                 <View style={styles.buttonsContainer}>
//                     <SubmitButton title="Login" 
//                                 buttonStyle={styles.button} 
//                                 buttonTextStyle={styles.buttonTextStyle}
//                                 onPress={() => navigation.navigate("App")}  
//                                 />
//                 </View>
//             </AppForm>
//         </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
  
//   button: {
//     backgroundColor: colors.buttonSecondary,
//     padding: 15,
//     margin: 10,
//     width: 300
//   },
//   buttonTextStyle: {
//     fontSize: 18,
//     color: colors.buttonTextSecondary
//   }
// });

// export default LoginScreen;

// Change Made: 
import React, { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
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
    // console.log("LoginScreen: Clearing Errors on Focus ");
    authContext.authError = "";
  }, []);

  // Clear the authentication error when the component comes back into focus.
  useFocusEffect(() => {
    authContext.authError = "";
  });

  // Get access to AuthContext value to use onSignIn function
  return (
    
      
      <ImageBackground
            blurRadius={30}
            style={styles.background}
            source={require("../assets/Welcome_Background.jpg")}
        >
            <Logo/>
      {/* Email Text Input */}
      <AppTextInput
        placeholder="Email"
        label="Email"
        value={email}
        textContentType="email"
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
        <AppText type="mediumBold" style={{ color: colors.white }}>
          Don't have an account?{"   "}
          <AppText
            type="mediumExtraBold"
            style={{ color: colors.primary }}
            onPress={() => {
              props.navigation.navigate("Register");
            }}
          >
            Register
          </AppText>
        </AppText>
      </View>
      </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  // container: {
  //   // Size
  //   // Layout
  //   alignItems: "center",
  //   margin: 0, 
  //   padding: 0
  //   // Boundaries
  //   // Fill
  // },
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
});

export default LoginScreen;
