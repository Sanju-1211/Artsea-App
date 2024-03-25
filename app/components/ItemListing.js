import React from "react";
import { FlatList, View } from "react-native";
import ItemCard from "../components/ItemCard";

const listings = [
    {
      id: 1,
      title: "Red jacket for sale",
      price: 100,
      image: require("../assets/jacket.jpg"),
    },
    {
      id: 2,
      title: "Couch in great condition",
      price: 1000,
      image: require("../assets/couch.jpg"),
    },
    {
      id: 3,
      title: "Red jacket for sale",
      price: 100,
      image: require("../assets/jacket.jpg"),
    },
    {
      id: 4,
      title: "Couch in great condition",
      price: 1000,
      image: require("../assets/couch.jpg"),
    },
    {
      id: 5,
      title: "Red jacket for sale",
      price: 100,
      image: require("../assets/jacket.jpg"),
    },
    {
      id: 6,
      title: "Couch in great condition",
      price: 1000,
      image: require("../assets/couch.jpg"),
    },
    {
      id: 7,
      title: "Couch in great condition",
      price: 1000,
      image: require("../assets/couch.jpg"),
    },
    {
      id: 8,
      title: "Couch in great condition",
      price: 1000,
      image: require("../assets/couch.jpg"),
    },    
];

function ItemListing({navigation, numOfColumns, showIcons, itemCardStyle, imageStyle, listStyle, 
items}) {
  // Changes Made: 
  // 1. Added item prop to ItemListing 
  // 2. Changed data from listings to items 
  // 3. Changed keyExtractor id to image url (it's unique)
  // 4. 
    return (
        <FlatList
        showsVerticalScrollIndicator={false}
          	numColumns={numOfColumns}
          	data={items}
         	keyExtractor={(item, index) => item.image.toString()}
          	renderItem={({ item, index }) => {
              	const lastItem = index === items.length - 1;
              	return (
              		<View style={listStyle} >
                  		<ItemCard
							cardStyle ={itemCardStyle}
							showIcons = {showIcons}
							title={item.item_name}
							subTitle={"₹" + item.price}
							image={item.image}
							imageStyle={imageStyle}
                            item={item}
              onPress={() => {
                console.log(`Sending ${JSON.stringify(item)} to ItemDetails Screen`)
                navigation.navigate("ItemDetails", { item: item })
              }}
                  		/>
              		</View>                
              	)
            }}
        />
    );
}

export default ItemListing;