import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Screen from "./Screen";
import colors from "../config/colors";

function Loading(props) {
  return (
    <Screen style={styles.loading}>
      <ActivityIndicator size={50} color={colors.primary} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "white",
    width: "100%", 
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default Loading;
