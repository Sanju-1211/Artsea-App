// import React , {useState} from "react";
// import { View, StyleSheet, ImageBackground, Switch } from "react-native";
// import Logo from "../components/Logo";
// import * as Yup from "yup";
// import colors from "../config/colors";
// import {
//   AppForm as Form,
//   AppFormField as FormField,
//   SubmitButton,
// } from "../components/forms";
// import AppText from "../components/AppText";

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required().label("Name"),
//   email: Yup.string().required().email().label("Email"),
//   password: Yup.string().required().min(4).label("Password"),

// });

// function RegisterScreen({navigation}) {
//     const registerClicked = () => {
//         navigation.navigate("App")
//     };  

//     const [isEnabled, setIsEnabled] = useState(false);
//     const toggleSwitch = () => setIsEnabled(previousState => !previousState);

//     return (
//         <ImageBackground
//             blurRadius={30}
//             style={styles.background}
//             source={require("../assets/Welcome_Background.jpg")}>
//             <Logo/>
//             <Form
//                 initialValues={{ name: "", email: "", password: "" }}
//                 onSubmit={(values) => console.log(values)}
//                 validationSchema={validationSchema}
//             >
//                 <FormField
//                     autoCorrect={false}
//                     icon="account"
//                     name="name"
//                     placeholder="Name"
//                 />
//                 <FormField
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     icon="email"
//                     keyboardType="email-address"
//                     name="email"
//                     placeholder="Email"
//                     textContentType="emailAddress"
//                 />
//                 <FormField
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     icon="lock"
//                     name="password"
//                     placeholder="Password"
//                     secureTextEntry
//                     textContentType="password"
//                 />
//                 <View style={styles.switchContainer}>
//                     <AppText style={styles.switchLabel}>Are you Seller?</AppText>
//                     <View style={styles.switch}>
//                         <AppText style={styles.switchText}>No</AppText>
//                         <Switch 
//                             trackColor={{false: '#767577', true: '#81b0ff'}}
//                             thumbColor={isEnabled ? '#01A082' : '#f4f3f4'}
//                             ios_backgroundColor="#3e3e3e"
//                             value={isEnabled}
//                             onValueChange={toggleSwitch}
//                         />
//                         <AppText style={styles.switchText}>Yes</AppText>
//                     </View>
//                 </View>
//                 <View style={styles.buttonsContainer}>
//                     <SubmitButton title="Register" 
//                                 buttonStyle={styles.button} 
//                                 buttonTextStyle={styles.buttonTextStyle}
//                                 onPress={registerClicked}
//                                 />
//                 </View>        
//             </Form>
//         </ImageBackground>
//     );
// }

// const styles = StyleSheet.create({

//     background: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     }, 
//     button: {
//         backgroundColor: colors.buttonSecondary,
//         padding: 15,
//         margin: 10,
//         width: 300
//     },
//     buttonTextStyle: {
//         fontSize: 18,
//         color: colors.buttonTextSecondary
//     },   
//     switch:{
//         alignItems:"center",
//         flexDirection:"row",
//         flex: 0.5,

//     },
//     switchLabel:{
//         flex: 0.5,
//         color:colors.white,
//         fontWeight: "bold",
//         fontSize:18,
        
//     },
//     switchText:{
//         color:colors.white,
        
//     },
//     switchContainer: {
//         flexDirection: "row",
//         alignItems:"center",
//         marginLeft: 5,
//     }
// });

// export default RegisterScreen;

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
            blurRadius={30}
            style={styles.background}
            source={require("../assets/Welcome_Background.jpg")}
        >
            <Logo/>

      {/* Full Name Text Input */}
      <AppTextInput
        placeholder="Full Name"
        label="Full Name"
        value={fullName}
        keyboardType="name"
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
        <AppText type="mediumBold" style={{ color: colors.white }}>
          Already have an account?{" "}
          <AppText
            type="mediumExtraBold"
            style={{ color: colors.primary }}
            onPress={() => {
              props.navigation.navigate("Login");
            }}
          >
            Log In
          </AppText>
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

