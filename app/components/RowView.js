import React from "react";
import { View, Text, StyleSheet } from "react-native";

function RowView(props) {
  return <View style={[styles.container, props.style]}>{props.children}</View>;
}

const styles = StyleSheet.create({
  container: {
    // Size, Layout, Boundaries, Fill, etc.

    flexDirection: "row",
    alignItems: "center",
  },
});

export default RowView;
