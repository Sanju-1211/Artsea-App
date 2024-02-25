import React,{useState} from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ItemListing from "../components/ItemListing";

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

function OrdersScreen({navigation}) {
    const [highlightPending, setHighlightPending] = useState(true);
    const [highlightCompleted, sethighlightCompleted] = useState(false);
    const pendingClicked = () => {
        setHighlightPending(true);
        sethighlightCompleted(false);
    };
    const completedClicked = () => {
        sethighlightCompleted(true);
        setHighlightPending(false);
    };    
    return (
        <Screen>
          <AppText style={styles.cartHeader}>Orders</AppText>
          
          <View style={styles.headerFilter}>
          <TouchableOpacity onPress={pendingClicked}>
            {
            highlightPending ?
            <AppText style={styles.headerFilterStyleHighlight}>Pending</AppText> :
            <AppText style={styles.headerFilterStyle}>Pending</AppText>
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={completedClicked}>
            {
            highlightCompleted ?
            <AppText style={styles.headerFilterStyleHighlight}>Completed</AppText> :
            <AppText style={styles.headerFilterStyle}>Completed</AppText> 
            }
          </TouchableOpacity>
          </View>

          { highlightPending &&           
            <View style={{marginBottom:180, flexDirection:"row"}}>
				<ItemListing 
                    navigation={navigation}
					numOfColumns={1} 
					showIcons={false} 
					imageStyle={styles.itemImageStyle} 
					itemCardStyle={styles.cardStyle}
				/>
			</View>
          }
          { highlightCompleted &&           
            <View style={{marginBottom:180, flexDirection:"row"}}>
				<ItemListing 
                    navigation={navigation}
					numOfColumns={1} 
					showIcons={false} 
					imageStyle={styles.itemImageStyle} 
					itemCardStyle={styles.cardStyle}
				/>
			</View>
          }
        </Screen>
    );
}

const styles = StyleSheet.create({
    cartHeader:{
        fontSize: 20,
        textAlign:"center",
        marginTop: 10,
        marginBottom: 10
    },
    buyButton:{
        marginRight: 5,
        height: 40,
        marginBottom:10,
        padding: 8,
    },  
    headerFilter: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "baseline",
        marginTop: 5,
        marginBottom: 10
    },
    headerFilterStyle: {
        fontWeight: "bold",
        fontSize: 16,
        color: colors.shade
    },
    headerFilterStyleHighlight: {
        fontWeight: "bold",
        fontSize: 16,
    }       ,
    itemImageStyle: {
        width: 100,
        height: 100,
    },
    cardStyle:{
        flexDirection:"row",
        marginBottom: 2
    }, 
});
export default OrdersScreen;