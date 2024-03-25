import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";
import firebase from "firebase/compat";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../config/colors";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function AddAddressScreen() {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [alias, setAlias] = useState("");
  const navigation = useNavigation();

  const saveAddressToFirestore = async () => {
    // Get the current user
    const user = firebase.auth().currentUser;

    // if the user exists
    if (user) {
      // get their user document from firestore
      const userRef = firebase.firestore().collection("users").doc(user.uid);
      const cartRef = firebase.firestore().collection('carts').doc(user.uid)
      try {
        // Let's start an transaction in the background
        await firebase.firestore().runTransaction(async (transaction) => {
          // Get the current user's document
          const userDoc = await transaction.get(userRef);

          // If the current user's document doesn't exist
          // raise an error
          if (!userDoc.exists) {
            throw "User document does not exist!";
          }

          // Get the data within the user's document
          const userData = userDoc.data();

          // Save the new address to a variable
          const newAddress = {
            name: toTitleCase(formData.name),
            mobile: formData.mobileNumber,
            pincode: formData.pinCode,
            address: toTitleCase(formData.address),
            city: toTitleCase(formData.city),
            alias: toTitleCase(formData.alias),
            selected: true,
          };

          // If there are existing addresses, set their 'selected' to false
          let updatedAddresses = userData.addresses
            ? userData.addresses.map((address) => ({
                ...address,
                selected: false,
              }))
            : [];
          // Add the new address to the updated Addresses
          updatedAddresses.push(newAddress);

          // Update the document within the transaction
          transaction.update(userRef, { addresses: updatedAddresses });
          console.log("Addresses saved successfully");

          if (cartRef) {
            transaction.update(cartRef, {address:newAddress})
          
          } else {
            console.log("The Cart document for the current user does not exist.")
            //transaction.set(cartRef, {items: [{...item, userId}]})
          }
        });
        
      } catch (error) {
        console.error("Error saving address: ", error);
      }
    } else {
      console.log("No user logged in");
    }
  };

  const [formData, setFormData] = useState({
    mobileNumber: "",
    pinCode: "",
    city: "",
    address: "",
    name: "",
    alias: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // Mobile Number Validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      valid = false;
      newErrors.mobileNumber = "Enter a valid mobile number.";
    }

    // Indian Pincode Validation
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    if (!pinCodeRegex.test(formData.pinCode)) {
      valid = false;
      newErrors.pinCode = "Enter a valid Indian pincode.";
    }

    // Required Fields Validation
    const requiredFields = ["alias", "city", "address", "name"];
    requiredFields.forEach((field) => {
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
      console.log("Form data submitted", formData);
      navigation.navigate("CheckoutScreen");
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
    return Object.keys(errors).map((key) => {
      return (
        <Text key={key} style={styles.errorText}>
          {errors[key]}
        </Text>
      );
    });
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <AppText type={"h3Bold"} style={{ marginBottom: 8 }}>
            Add Address
          </AppText>
          <AppText type={"mediumBold"}>Contact Details</AppText>
          <AppTextInput
            placeholder="Name"
            iconName="account"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <AppTextInput
            placeholder="Mobile No"
            iconName="phone"
            keyboardType="phone-pad"
            value={formData.mobileNumber}
            onChangeText={(text) => handleInputChange("mobileNumber", text)}
          />
          <AppText type={"mediumBold"}>Address</AppText>
          <AppTextInput
            placeholder="Pin Code"
            iconName="map-marker"
            keyboardType="numeric"
            value={formData.pinCode}
            onChangeText={(text) => handleInputChange("pinCode", text)}
          />
          <AppTextInput
            placeholder="Address (House No, Building, Street, Area)"
            iconName="home"
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
          />
          <AppTextInput
            placeholder="City / District"
            iconName="city"
            value={formData.city}
            onChangeText={(text) => handleInputChange("city", text)}
          />
          <AppTextInput
            placeholder="Alias:"
            iconName="office-building"
            value={formData.alias}
            onChangeText={(text) => handleInputChange("alias", text)}
          />

          <AppButton text="Add Address" onPress={handleSubmit} />
          <View style={styles.errorContainer}>
            {Object.values(errors).map((error, index) => {
              if (error) {
                return (
                  <AppText color={colors.red} key={index} type="smallNormal">
                    - {error}
                  </AppText>
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
});

export default AddAddressScreen;
