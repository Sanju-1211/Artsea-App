import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import RowView from '../components/RowView';
import { useNavigation } from '@react-navigation/native';


const AddressesScreen = (props) => {
  const addresses = props.route.params?.addresses
  const navigation = useNavigation()
  console.log(`Addresses Screen: ${JSON.stringify(addresses)}`)
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
              <View>
            <AppText type="mediumBold">{address.alias}</AppText>
            <AppText>{address.name}</AppText>
            <AppText>{address.address}</AppText>
            <AppText>{address.city}</AppText>
            <AppText>{address.pincode}</AppText>
            <AppText>Mobile: {address.mobile}</AppText>
            <View style={styles.separator}></View>
            </View> 

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
