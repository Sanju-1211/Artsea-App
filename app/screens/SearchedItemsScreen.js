import React, { useState } from "react";
import {  StyleSheet,  View } from "react-native";
import SearchBar from "../components/SearchBar";
import Screen from "../components/Screen";
import ItemListing from "../components/ItemListing";
const categories = [
  {
    id: 1,
    categoryName:"Category1",
    categoryImage:require("../assets/jacket.jpg"),
  },
  {
    id: 2,
    categoryName:"Category2",
    categoryImage:require("../assets/jacket.jpg"),
  },
  {
    id: 3,
    categoryName:"Category3",
    categoryImage:require("../assets/jacket.jpg"),
  },
  {
    id: 4,
    categoryName:"Category4",
    categoryImage:require("../assets/jacket.jpg"),
  },
  {
    id: 5,
    categoryName:"Category5",
    categoryImage:require("../assets/jacket.jpg"),
  },
  {
    id: 6,
    categoryName:"Category6",
    categoryImage:require("../assets/jacket.jpg"),
  },
  {
    id: 7,
    categoryName:"Category7",
    categoryImage:require("../assets/jacket.jpg"),
  },
  {
    id: 8,
    categoryName:"Category8",
    categoryImage:require("../assets/jacket.jpg"),
  },

];

const SearchedItemScreen = ({navigation}) => {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);

    return (
        <Screen>
            <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                clicked={clicked}
                setClicked={setClicked}
            />
			<View style={{marginBottom:180, flexDirection:"row"}}>
            	<ItemListing 
					navigation={navigation} 
					numOfColumns={2} 
          			showIcons={true} 
               		listStyle={styles.listStyle}
	        	/>    
		  	</View>  
        </Screen>
    );
};

export default SearchedItemScreen;

const styles = StyleSheet.create({
    listStyle:{
        flex: 0.5, 
        padding: 2, 
    }
});