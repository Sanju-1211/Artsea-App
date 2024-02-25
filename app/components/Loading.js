import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Screen from "./Screen";

function Loading(props) {
  return (
    <Screen style={styles.loading}>
      <ActivityIndicator size={50} color={"blue"} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default Loading;
