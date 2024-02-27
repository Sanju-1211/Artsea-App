import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import AppText from '../components/AppText';
import firebase from 'firebase/compat';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../config/colors';

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

function AddAddressScreen() {
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [alias, setAlias] = useState('')

    const saveAddressToFirestore = async () => {
        const user = firebase.auth().currentUser;
    
        if (user) {
          const userRef = firebase.firestore().collection('users').doc(user.uid);
          try {
            // Here, 'update' will add the new address to the 'addresses' array in the user document
            await userRef.update({
              addresses: firebase.firestore.FieldValue.arrayUnion({
                name: toTitleCase(formData.name),
                mobile: formData.mobileNumber,
                pincode: formData.pinCode,
                address: toTitleCase(formData.address),
                city: toTitleCase(formData.city),
                alias: toTitleCase(formData.alias)
              })
            });
            console.log('Address saved successfully');
          } catch (error) {
            console.error('Error saving address: ', error);
          }
        } else {
          console.log('No user logged in');
        }
      };

    const [formData, setFormData] = useState({
        mobileNumber: '',
        pinCode: '',
        city: '',
        address: '',
        name: '',
        alias: ''
      });
      const [errors, setErrors] = useState({});
    
      const validateForm = () => {
        let valid = true;
        let newErrors = {};
    
        // Mobile Number Validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobileNumber)) {
          valid = false;
          newErrors.mobileNumber = 'Enter a valid mobile number.';
        }
    
        // Indian Pincode Validation
        const pinCodeRegex = /^[1-9][0-9]{5}$/;
        if (!pinCodeRegex.test(formData.pinCode)) {
          valid = false;
          newErrors.pinCode = 'Enter a valid Indian pincode.';
        }
    
        // Required Fields Validation
        const requiredFields = ['alias', 'city', 'address', 'name'];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            valid = false;
            newErrors[field] = `${toTitleCase(field)} cannot be empty.`;
          }
        });
    
        setErrors(newErrors);
        return valid;
      };
    
      
  const handleSubmit = () => {
    if (validateForm()) {
      saveAddressToFirestore();
      console.log('Form data submitted', formData);
    }
  };
    
      const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        // If there's an error on this field, remove it from the errors object
        if (errors[name]) {
          setErrors({ ...errors, [name]: null });
        }
      };
    
      const renderError = () => {
        return Object.keys(errors).map(key => {
          return <Text key={key} style={styles.errorText}>{errors[key]}</Text>;
        });
      };

  return (
    <Screen>
        <ScrollView showsVerticalScrollIndicator={false}>
    <View>
      <AppText type={"mediumBold"}>Contact Details</AppText>
      <AppTextInput
        placeholder="Name"
        iconName="account"
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <AppTextInput
        placeholder="Mobile No"
        iconName="phone"
        keyboardType="phone-pad"
        value={formData.mobileNumber}
        onChangeText={(text) => handleInputChange('mobileNumber', text)}
      />
      <AppText type={"mediumBold"}>Address</AppText>
      <AppTextInput
        placeholder="Pin Code"
        iconName="map-marker"
        keyboardType="numeric"
        value={formData.pinCode}
        onChangeText={(text) => handleInputChange('pinCode', text)}
      />
      <AppTextInput
        placeholder="Address (House No, Building, Street, Area)"
        iconName="home"
        value={formData.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />
      <AppTextInput
        placeholder="City / District"
        iconName="city"
        value={formData.city}
        onChangeText={(text) => handleInputChange('city', text)}
      />
      <AppTextInput
        placeholder="Alias:"
        iconName="office-building"
        value={formData.alias}
        onChangeText={(text) => handleInputChange('alias', text)}
      />
      
      <AppButton text="Add Address" onPress={handleSubmit} />
      <View style={styles.errorContainer}>
        {Object.values(errors).map((error, index) => {
          if (error) {
            return (
              <AppText color={colors.red} key={index} type='smallNormal'>- {error}</AppText>
            );
          }
          return null;
        })}
      </View>
    </View>
    </ScrollView>
  </Screen>
  );
}

const styles = StyleSheet.create({
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});

export default AddAddressScreen;
