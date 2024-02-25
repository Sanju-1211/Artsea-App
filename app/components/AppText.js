// import React from "react";
// import { Text, StyleSheet, Platform } from "react-native";
// import colors from "../config/colors";

// function AppText({ children, style }) {
//     return <Text style={[styles.text, style]}>{children}</Text>;
// }

// const styles = StyleSheet.create({
//     text: {
//         fontSize: 15,
//         color: colors.primaryText,
//         fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
//     },
// });

// export default AppText;

import React from "react";
import { Text, StyleSheet, Platform } from "react-native";

function AppText({ type = "smallNormal", color, style, children, ...props }) {
  // We are using 3 props explicitly: type, style, and ofcourse,
  // children.
  // Any other Text props we use, like onPress? We need to assume
  // that they are {...props}.
  const textColor = color ? color : "black";
  return (
    <Text
      style={[styles.base, styles[type], { color: textColor }, style]}
      suppressHighlighting={true}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: Platform.OS == "android" ? "Roboto" : "Helvetica Neue",
  },
  // Heading 1
  h1Light: { fontSize: 25, fontWeight: "300", lineHeight: 37.5 },
  h1Normal: { fontSize: 25, fontWeight: "400", lineHeight: 37.5 },
  h1Bold: { fontSize: 25, fontWeight: "600", lineHeight: 37.5 },
  h1ExtraBold: { fontSize: 25, fontWeight: "800", lineHeight: 37.5 },
  // Heading 2
  h2Light: { fontSize: 22, fontWeight: "300", lineHeight: 33 },
  h2Normal: { fontSize: 22, fontWeight: "400", lineHeight: 33 },
  h2Bold: { fontSize: 22, fontWeight: "600", lineHeight: 33 },
  h2ExtraBold: { fontSize: 22, fontWeight: "800", lineHeight: 33 },
  // Heading 3
  h3Light: { fontSize: 20, fontWeight: "300", lineHeight: 30 },
  h3Normal: { fontSize: 20, fontWeight: "400", lineHeight: 30 },
  h3Bold: { fontSize: 20, fontWeight: "600", lineHeight: 30 },
  h3ExtraBold: { fontSize: 20, fontWeight: "800", lineHeight: 30 },
  // Large Text
  largeLight: { fontSize: 18, fontWeight: "300", lineHeight: 27 },
  largeNormal: { fontSize: 18, fontWeight: "400", lineHeight: 27 },
  largeSemiBold: { fontSize: 18, fontWeight: "500", lineHeight: 27 },
  largeBold: { fontSize: 18, fontWeight: "600", lineHeight: 27 },
  largeExtraBold: { fontSize: 18, fontWeight: "800", lineHeight: 27 },
  // Medium Text
  mediumLight: { fontSize: 16, fontWeight: "300", lineHeight: 24 },
  mediumNormal: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  mediumSemiBold: { fontSize: 16, fontWeight: "500", lineHeight: 24 },
  mediumBold: { fontSize: 16, fontWeight: "600", lineHeight: 24 },
  mediumExtraBold: { fontSize: 16, fontWeight: "800", lineHeight: 24 },
  // Small Text
  smallLight: { fontSize: 14, fontWeight: "300", lineHeight: 21 },
  smallNormal: { fontSize: 14, fontWeight: "400", lineHeight: 21 },
  smallSemiBold: { fontSize: 14, fontWeight: "500", lineHeight: 21 },
  smallBold: { fontSize: 14, fontWeight: "600", lineHeight: 21 },
  smallExtraBold: { fontSize: 14, fontWeight: "800", lineHeight: 21 },
  // Extra Small Text
  extraSmallLight: { fontSize: 12, fontWeight: "300", lineHeight: 18 },
  extraSmallNormal: { fontSize: 12, fontWeight: "400", lineHeight: 18 },
  extraSmallSemiBold: { fontSize: 12, fontWeight: "500", lineHeight: 18 },
  extraSmallBold: { fontSize: 12, fontWeight: "600", lineHeight: 18 },
  extraSmallExtraBold: { fontSize: 12, fontWeight: "800", lineHeight: 18 },
  // Extra Extra Small Text
  extraExtraSmallLight: { fontSize: 10, fontWeight: "300", lineHeight: 15 },
  extraExtraSmallNormal: { fontSize: 10, fontWeight: "400", lineHeight: 15 },
  extraExtraSmallSemiBold: { fontSize: 10, fontWeight: "500", lineHeight: 15 },
  extraExtraSmallBold: { fontSize: 10, fontWeight: "600", lineHeight: 15 },
  extraExtraSmallExtraBold: { fontSize: 10, fontWeight: "800", lineHeight: 15 },
});

export default AppText;
