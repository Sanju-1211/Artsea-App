// // CartItem.js
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import AppButton from './AppButton';
// import AppText from './AppText';

// const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
//   return (
//     <View style={styles.container}>
//       <AppText>{item.item_name}</AppText>
//       <AppText>{`Quantity: ${item.quantity}`}</AppText>
//       <AppButton text="+" onPress={() => onUpdateQuantity(item.image, item.quantity + 1)} />
//       <AppButton text="-" onPress={() => item.quantity > 1 && onUpdateQuantity(item.image, item.quantity - 1)} />
//       <AppButton text="Remove" onPress={() => onRemoveItem(item.image)} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // Add your styling here
//   },
// });

// export default CartItem;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Screen from "./Screen";
import AppIcon from "./AppIcon";
import { useNavigation } from "@react-navigation/native";
import AppText from "./AppText";
import AppButton from "./AppButton";
import RowView from "./RowView";

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
function CartItem({ item, onUpdateQuantity, onRemoveItem}) {
  const navigation = useNavigation()
  const WIDTH = useWindowDimensions().width
  return (
    <View
      style={{
        ...styles.container,
        width: WIDTH - 32,
        height: 185,
      }}
      
    >
      {/* Image */}
      <Image style={styles.image} source={{uri: item.images[0]}} onPress={() => navigation.navigate("ItemDetails", { item: item })}/>

      <View style={{flex: 0.6, marginLeft: 8}}>
        <RowView style={{justifyContent: "space-between"}}>
          <AppText type={"mediumBold"}  >{item.item_name}</AppText>
          <View style={{width: 30, height: 30, justifyContent: "center", alignItems: "center"}}>
          <AppIcon
          iconSet={"Entypo"}
              iconName={"trash"}
              iconSize={20}
              onPress={() => onRemoveItem(item.image)} />
          </View>
            
        </RowView>
        <AppText type="extraSmallLight" numberOfLines={2}>
          {toTitleCase(item.type)} by {item.artist}
        </AppText>
        <RowView style={{justifyContent: "space-between",  width: "50%"}}>
        <AppButton text="-" 
                            onPress={() => item.quantity > 1 && onUpdateQuantity(item.image, item.quantity - 1)} 
                            width={20}
                            height={20}
                            borderRadius={3}
                            />   
                        <AppText type="mediumBold">   {item.quantity}   </AppText>  
                    <AppButton text="+" 
                            onPress={() => onUpdateQuantity(item.image, item.quantity + 1)} 
                            width={20}
                            borderRadius={3}
                            height={20}
                            />   
        </RowView>
        
        <View>
          <AppText type="mediumSemiBold" style={{marginBottom: 8}}>
          ₹ {item.price*item.quantity}
          </AppText>
          <RowView >
          <AppIcon
                  iconSet={"FontAwesome"}
                  iconName={"undo"}
                  style={{marginRight: 8}}
                  iconSize={12}
              />
          <AppText type="extraSmallLight">{item.delivery_details.refund}</AppText>
          </RowView>
          <RowView >
        <AppIcon
               iconSet={"MaterialCommunityIcons"}
               iconName={"clock"}
               style={{marginRight: 8}}
               iconSize={12}
            />
        <AppText type="extraSmallLight">{item.delivery_details.time}</AppText>
        </RowView>
          
        </View>
                      
                

      </View>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    // Layout
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems:"flex-start",
    // alignItems: "center",
    // Boundaries
    padding: 10,
    borderRadius: 10,
    borderColor: "lightgrey",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Fill
    backgroundColor: "white",
    width: 10,
  }, // Size, Layout, Boundaries, Fill, etc.
  image: {
    // Size
    flex: 0.6,
    aspectRatio: 1,
    resizeMode: "contain",
    // Boundaries
    borderRadius: 10,
    margin: 5,
  },
  detailsContainer: {
    // flexShrink: 1,
    // marginVertical: 16,
  },
  bedrooms: {
    // Boundaries
    margin: 5,
    color: "#5c5c5c",
    fontSize: 12,
  },
  description: {
    margin: 8,
  },
  prices: {
    margin: 5,
    fontSize: 14,
  },
  oldPrice: {
    color: "#5b5b5b",
    textDecorationLine: "line-through",
  },
  newPrice: {
    fontWeight: "bold",
  },
});

export default CartItem;
