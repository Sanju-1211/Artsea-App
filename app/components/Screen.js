import React from "react";
import { StatusBar, SafeAreaView, StyleSheet, Platform, View } from "react-native";

export default function Screen(props) {
  return (
    <SafeAreaView style={[styles.container, props.style]}>
      <View style={{margin: 16}}>
      {props.children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "white",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
