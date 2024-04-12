// // OrderItem.js
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import AppButton from './AppButton';
// import AppText from './AppText';

// const OrderItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
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

// export default OrderItem;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import Screen from "./Screen";
import AppIcon from "./AppIcon";
import { useNavigation } from "@react-navigation/native";
import AppText from "./AppText";
import AppButton from "./AppButton";
import RowView from "./RowView";
import * as Linking from "expo-linking"
import AddReviewScreen from "../screens/AddReviewScreen";

function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}
function OrderItem({ item, style}) {
	console.log(item.status);
  	const navigation = useNavigation()
  	const WIDTH = useWindowDimensions().width
  	return (
    	<View
      		style={{
        		...styles.container,
        		width: WIDTH - 32,
        		height: 215,
        		marginVertical: 8,
        		...style
      		}}
    	>
      		{/* Image */}
      		<Image style={styles.image} source={{uri: item.images[0]}} onPress={() => navigation.navigate("ItemDetails", { item: item })}/>

      		<View style={{flex: 0.6, marginLeft: 8}}>
        		<RowView style={{justifyContent: "space-between"}}>
					<AppText type={"mediumBold"}  >{item.item_name}</AppText>
					<View style={{width: 30, height: 30, justifyContent: "center", alignItems: "center"}}>
					</View>
            	</RowView>

				<RowView style={{justifyContent: "space-between",  width: "50%"}}>
					<AppText type="mediumBold">Qty: {item.quantity}</AppText>  
				</RowView>
				<View>
					<AppText type="mediumSemiBold" style={{marginBottom: 8}}>
						₹ {item.price*item.quantity}
					</AppText>
					<RowView style={{marginBottom: 8}}>
						<AppIcon
						iconSet={"FontAwesome"}
						iconName={"phone"}
						style={{marginRight: 8}}
						iconSize={24}
						/>
						<TouchableOpacity 
							onPress={()=>{
                            item.customer_service_phone?    
                            Linking.openURL(`tel:${item.customer_service_phone}`):
							Linking.openURL(`tel:${+919899829771}`)
							}}
						>
							<AppText style={{textDecorationLine: "underline"}} type="mediumNormal">Get Help</AppText>
						</TouchableOpacity>
					</RowView>

					<RowView >
						{item.status == 'pending'? 
						(
							<>
							<AppIcon
								iconSet={"MaterialCommunityIcons"}
								iconName={"clock"}
								style={{marginRight: 8}}
								iconSize={12}
							/>
							<AppText type="extraSmallLight">
							Arriving By {item.arrivingBy}</AppText>
							</>
						)
						:
						(
							<>
							<AppIcon
							iconSet={"MaterialCommunityIcons"}
							iconName={"check-circle"}
							style={{marginRight: 8}}
							iconSize={20}
							/>
							<AppText type="extraSmallExtraBold">Delivered</AppText>
							</>
						)
						}
					</RowView>
					<RowView>
					{item.status != 'pending' &&
					<AppButton text="Write Review" width={100} height={30} borderRadius={10}
										onPress={()=>{navigation.navigate("AddReview", { item: item })}}

                                        
							/>
							
					}
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

export default OrderItem;
