import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions, Image } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import colors from "../config/colors";
import firebase from "firebase/compat";
import Loading from "../components/Loading";
import AppButton from "../components/AppButton";
import { AuthContext } from "../services/auth/AuthContext";
import { FlatList } from "react-native-gesture-handler";
import OrderItem from "../components/OrderItem";
import RowView from "../components/RowView";
import AppIcon from "../components/AppIcon";
import { Avatar } from "react-native-paper";
import { Ionicons , Entypo} from '@expo/vector-icons';

function BuyerProfileScreen() {
  const authContext = useContext(AuthContext);
  const [orders, setOrders] = useState(null);
  const [items, setItems] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const dimensions = useWindowDimensions();

  useEffect(() => {
    async function getUserDetails() {
      try {
        const currentUser = firebase.auth().currentUser;
        const docRef = firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid);
        const doc = await docRef.get();

        if (doc.exists) {
          console.log("User document data:", doc.data());
          setUserDetails(doc.data());
        } else {
          console.log("No such document");
          return null;
        }
      } catch (error) {
        console.error("Error fetching current user's document:", error);
      }
    }
    getUserDetails();
  }, []);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const ordersRef = firebase.firestore().collection("orders").doc(user.uid);
      // Listen for real-time updates with .onSnapshot()
      const unsubscribe = ordersRef.onSnapshot(
        (doc) => {
          if (doc.exists) {
            console.log("Got the orders document");
            let allOrders = doc.data()["orders"];
            // Assuming each order has a 'createdAt' timestamp field
            // Order all orders by recency
            allOrders = allOrders.sort((a, b) => b.createdAt - a.createdAt);
            setOrders(allOrders);

            // flatMap is used instead of map followed by flat.
            // flatMap first maps each element using the mapping function, then flattens the result into a new array. It's more efficient than doing a separate map and flat.
            // Map each order to a new array of items, each with the status property added,
            // then flatten the resulting array of arrays into a single array of items.
            const allItemsWithStatus = allOrders.flatMap((order) =>
              order.items.map((item) => ({
                ...item, // Spread operator to copy all properties of the item
                status: order.status, // Add the status property from the order
                arrivingBy: order.arrivingBy,
              }))
            );

            setItems(allItemsWithStatus);
            console.log(`orders: ${JSON.stringify(orders)}`);
            //   console.log(`orders.length: ${orders.length}`)
          } else {
            console.log("No such document");
            setOrders([]); // Clear order items if the document doesn't exist
            console.log(`orders: ${JSON.stringify(orders)}`);
            //  console.log(`orders.length: ${orders.length}`)
          }
        },
        (error) => {
          console.error("Error fetching order items: ", error);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, []);

  if (userDetails !== null) {
    return (
      <Screen style={styles.screen}>
        {/* <View style={styles.UserCardHeader}>
                    <UserCard
                    image={{uri: userDetails.image}}
                    title={userDetails.full_name}
                    subTitle={userDetails.username}
                    userCardStyle={styles.userCardStyle}
                    imageStyle = {styles.imageStyle}
                    />
                </View> */}
        <RowView style={{ justifyContent: "space-between", marginBottom: 10 }}>
          <RowView style={{ flex: 1 }}>

            <Ionicons name="person-circle" size={80} color={colors.grey} />
            <View>
            <AppText type={"mediumExtraBold"}>{userDetails.full_name}</AppText>
            <AppText type={"smallBold"}>{userDetails.email}</AppText>
            </View>

          </RowView>
          <AppButton
            width={80}
            height={40}
            onPress={() => authContext.onLogout()}
            icon="logout"
            text="Logout"
          />
        </RowView>

        <AppText type={"h3Bold"} >Orders</AppText>
        {items?.length && items?.length > 0 ? (
          <View style={{marginBottom:220, flexDirection:"row"}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={items}
            keyExtractor={(item) => `${item.image}${Math.random()}`}
            renderItem={({ item }) => (
              <OrderItem
                item={item}
                onUpdateQuantity={() => {}}
                onRemoveItem={() => {}}
                style={{ width: "5" }}
              />
            )}
          />
          </View>
        ) : (
          <View >
          <AppText>You've not placed any orders yet.</AppText>
          </View>
        )}
      </Screen>
    );
  } else {
    return <Loading />;
  }
}

const styles = StyleSheet.create({
    noOrders:{
      justifyContent: "center",
      alignItems: "center",
      height: '75%'
    },
    ordersCSS:{
        textAlign: "center"
    },
    profileCard:{ 
        justifyContent: "space-between",
         marginBottom: 16,
         backgroundColor: colors.white,
         padding: 15,
         borderRadius: 25 ,
         borderWidth:2,
        },
  headingContainer: {
    marginVertical: 10,
    padding: 10,
    justifyContent: "center",
  },
  heading: {
    color: colors.primaryText,
    fontWeight: "bold",
    justifyContent: "center",
    fontSize: 24,
  },

  userCardStyle: {
    flexDirection: "column",
  },
  screen: {
    padding: 5,
  },
  UserCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  UserDescription: {
    marginBottom: 5,
    justifyContent: "space-around",
  },
   imageStyle:{
    height: 75,
    width: 75,
    borderRadius: 50,
    backgroundColor:colors.black,
    margin: 10,
    justifyContent: "center",
    alignItems:"center"
   }
});

export default BuyerProfileScreen;
