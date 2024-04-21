// AddressForm.js 
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AppTextInput from './AppTextInput';
import AppButton from './AppButton';

const AddressForm = ({ onSave }) => {
  const [address, setAddress] = useState('');

  return (
    <View style={styles.container}>
      <AppTextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your address"
        style={styles.input}
      />
      <AppButton buttonDisabled={address===''} text="Save Address" onPress={() => onSave(address)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add your styling here
  },
  input: {
    // Add your styling here
  },
});

export default AddressForm;
