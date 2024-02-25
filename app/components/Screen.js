import React from "react";
import { StatusBar, SafeAreaView, StyleSheet,Platform } from "react-native";

export default function Screen(props) {
  return (
    <SafeAreaView style={[styles.container, props.style]}>
      {props.children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
