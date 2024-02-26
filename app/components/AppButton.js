// import React from "react";
// import { StyleSheet, Text, TouchableOpacity } from "react-native";

// import colors from "../config/colors";
// import AppText from "./AppText";

// function AppButton({ title, onPress, buttonStyle, buttonTextStyle}) {
//     return (
//         <TouchableOpacity
//             style={[styles.button, buttonStyle]}
//             onPress={onPress}
//         >
//             <AppText style={[styles.text, buttonTextStyle]}>{title}</AppText>
//         </TouchableOpacity>
//     );
// }

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: colors.button,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 5,
//   },
//   text: {
//     color: colors.buttonText,
//     fontWeight: "bold",
//   },
// });

// export default AppButton;
// TODO: Might help if you use Pressable from basic react native components. Easier to manipulate and
// understand. Basically, it should work for all buttons of Duolingo, AirBnB and Instagram.

// TODO: It's very easy to create the auto-completion type of custom component as long as
// I mention it in the props.
import React from "react";
import { StyleSheet, Pressable, Text, TouchableOpacity, Platform } from "react-native";
import { Button } from "react-native-paper";
import colors from "../config/colors";

// export default function AppButton({
//   width,
//   height,
//   buttonColor,
//   textColor,
//   labelStyle,
//   style,
//   buttonDisabled = false,
//   children,
//   ...props
// }) {
//   return (
//     <Button
//       width={width ? width : 350}
//       height={height ? height : 50}
//       buttonColor={buttonColor ? buttonColor : colors.primary}
//       textColor={textColor ? textColor : colors.white}
//       labelStyle={[styles.labelStyle, labelStyle]}
//       style={[
//         { ...styles.buttonStyle, opacity: buttonDisabled ? 0.7 : 1 },
//         style,
//       ]}
//       {...props}
//     >
//       {children}
//     </Button>
//   );
// }

export default function AppButton({
  width,
  height,
  borderRadius, 
  buttonColor,
  textColor,
  labelStyle,
  style,
  buttonDisabled = false,
  children,
  ...props
}) {
  return (
    <TouchableOpacity
      style={[
        // Default style
        styles.duoButtonContainer,
        // Set custom width, height, and opacity according to props
        // Set the background color based on whether or not the button
        // is disabled and what button color props have been passed
        {
          width: width ? width : 350,
          height: height ? height : 50,
          opacity: buttonDisabled ? 0.7 : 1,
          backgroundColor: buttonColor ? buttonColor : colors.primaryLight,
          borderRadius: borderRadius? borderRadius : 10,
        },
        style,
      ]}
      onPress={props.onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.duoButtonText,
          {
            ...labelStyle,
            color: textColor ? textColor : colors.white,
          },
        ]}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  duoButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  duoButtonText: {
    fontFamily: Platform.OS == "android" ? "Roboto" : "Avenir",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonStyle: {
    margin: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  labelStyle: {
    fontFamily: Platform.OS == "android" ? "Roboto" : "Avenir",
    fontSize: 16,
    textAlign: "center",
  },
});
