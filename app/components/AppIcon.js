import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  SimpleLineIcons,
  Fontisto,
  Feather,
  Entypo,
  EvilIcons,
} from "@expo/vector-icons";

function AppIcon({ iconSet, iconName, iconSize, style, ...props }) {
  if (iconSet == "AntDesign") {
    return (
      <AntDesign
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "MaterialCommunityIcons") {
    return (
      <MaterialCommunityIcons
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "MaterialIcons") {
    return (
      <MaterialIcons
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "Ionicons") {
    return (
      <Ionicons
        name={iconName}
        style={[styles.icon, style]}
        {...props}
        size={iconSize ? iconSize : 24}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "FontAwesome") {
    return (
      <FontAwesome
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "FontAwesome5") {
    return (
      <FontAwesome5
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "SimpleLineIcons") {
    return (
      <SimpleLineIcons
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "Fontisto") {
    return (
      <Fontisto
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "Feather") {
    return (
      <Feather
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if (iconSet == "Entypo") {
    return (
      <Entypo
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  } else if ((iconSet = "EvilIcons")) {
    return (
      <EvilIcons
        name={iconName}
        size={iconSize ? iconSize : 24}
        style={[styles.icon, style]}
        {...props}
        suppressHighlighting={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {}, // Size, Layout, Boundaries, Fill, etc.
  icon: {
    // marginHorizontal: 5,
  },
});

export default AppIcon;
