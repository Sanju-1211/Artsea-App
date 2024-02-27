import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import RowView from '../components/RowView';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import colors from '../config/colors';
import firebase from 'firebase/compat';

const AddressesScreen = (props) => {
  const addresses = props.route.params?.addresses
  const selectedAddress = addresses.find(address => address.selected === true)
  console.log(selectedAddress)
  const [selectedValue, setSelectedValue] = useState(selectedAddress);

  const navigation = useNavigation()

  useEffect(() => {
    // If a selectedValue exists 
    if (selectedValue) {
      // Construct the new addresses array with the updated selected values
      // For each address, update the selected value based on whether or not 
      // the selected value matches the address
      const updatedAddresses = addresses.map(address => ({
        ...address,
        selected: address === selectedValue,
      }));
  
      // Update the current user's firestore document
      const user = firebase.auth().currentUser
      const userDocRef = firebase.firestore().collection('users').doc(user.uid);

      // We will update the `addresses` value in the document with the 
      // updatedAddresses
      userDocRef.update({
        addresses: updatedAddresses,
      })
      .then(() => {
        console.log('Addresses updated successfully!');
      })
      .catch(error => {
        console.error('Error updating addresses:', error);
      });
    }
  }, [selectedValue]);

  return (
      <Screen>
        <ScrollView>
        <AppText type={"h3Bold"}>
          Saved Addresses
        </AppText>

      
        <View style={styles.separator}></View>        
        {
          (addresses.length > 0)? addresses.map(function(address){
            return(
              <>
              <TouchableOpacity
                onPress={()=>{setSelectedValue(address)}}
                key={address}
                style={{
                  backgroundColor: selectedValue === address? colors.primaryLight : colors.white, 
                  padding: 8,
                  borderRadius: 10,
                  }}
                  
              >
            <AppText type="mediumBold">{address.alias}</AppText>
            <AppText>{address.name}</AppText>
            <AppText>{address.address}</AppText>
            <AppText>{address.city}</AppText>
            <AppText>{address.pincode}</AppText>
            <AppText>Mobile: {address.mobile}</AppText>
            </TouchableOpacity> 

            <View style={styles.separator}></View>
            </>
            )
          })
          : 
          (<View></View>)
        }
        <AppButton
          text="ADD NEW ADDRESS"
          onPress={()=>{
            navigation.navigate("AddAddressScreen")
          }}
        />
        </ScrollView>
      </Screen>
  );
};

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 10,
    alignSelf: "center",
  },
});

export default AddressesScreen;
