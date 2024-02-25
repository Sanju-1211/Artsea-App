// CartItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import AppText from './AppText';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <View style={styles.container}>
      <AppText>{item.item_name}</AppText>
      <AppText>{`Quantity: ${item.quantity}`}</AppText>
      <AppButton text="+" onPress={() => onUpdateQuantity(item.image, item.quantity + 1)} />
      <AppButton text="-" onPress={() => item.quantity > 1 && onUpdateQuantity(item.image, item.quantity - 1)} />
      <AppButton text="Remove" onPress={() => onRemoveItem(item.image)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add your styling here
  },
});

export default CartItem;
