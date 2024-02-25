import React, { useState } from "react";
import {  StyleSheet,  View } from "react-native";
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";
import Screen from "../components/Screen";

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

const SearchScreen = ({navigation}) => {
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

            <View style={styles.CategoryContainer}>
                {categories.map((category) => {
                    return (
                    <View>
                        <CategoryCard 
                            categoryName={category.categoryName} 
                            categoryImage={category.categoryImage} 
                            onPress={() => navigation.navigate("SearchedItems")} />
                    </View>
                    );
                })}
            </View>      
        </Screen>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({

  CategoryContainer:{
    flexDirection: "row",
    flexWrap: "wrap"
  },

});