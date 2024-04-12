import React, { useEffect, useRef } from "react";
import { View, TextInput, StyleSheet, Keyboard, Platform } from "react-native";
import colors from "../config/colors";
import AppIcon from "./AppIcon";

function AppTextInput({
  placeholder,
  containerStyle,
  inputStyle,
  iconName,
  iconSet,
  iconColor,
  iconSize,
  error,
  children,
  focus,
  ...otherProps
}) {
  // Takes In:
  // - icon
  // - any other props you provide for the React Native Text Input
  // Returns:
  // - A row view with an icon and a text input field.
  const textInputRef = useRef(null);

  useEffect(() => {
    if (focus) {
      // Focus on the text input when the screen is rendered
      textInputRef.current.focus();
    }
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {iconName && (
        <AppIcon
          iconName={iconName}
          iconSet={iconSet}
          size={iconSize ? iconSize : 20}
          color={iconColor ? iconColor : styles.grey}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholder={placeholder}
        ref={textInputRef}
        placeholderTextColor={colors.grey}
        style={[styles.textInputStyle, inputStyle]}
        {...otherProps}
      >
        {children}
      </TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    flexDirection: "row",
    backgroundColor: colors.offwhite,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.lightgrey,
    padding: 5,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginLeft: 30,
    marginRight: 10,
  },
  textInputStyle: {
    width: "100%",
    height: 50,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    color: colors.black,
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 16,
  },
});

export default AppTextInput;
