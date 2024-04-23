import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Image,
  Text,
  TouchableHighlight,
} from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import firebase from "firebase/compat";
import RowView from "../components/RowView";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { FlatList } from "react-native-gesture-handler";
import AppIcon from "../components/AppIcon";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export default function ItemDetailScreen(props) {
  let item = props.route.params?.item;
  console.log(`item`, item);

  const WIDTH = useWindowDimensions().width;

  const [qtyCounter, setQtyCounter] = useState(1);
  const increaseQtyCount = () => {
    console.log(qtyCounter);
    setQtyCounter(qtyCounter + 1);
  };
  const decreaseQtyCount = () => {
    console.log(qtyCounter);
    if (qtyCounter > 0) {
      setQtyCounter(qtyCounter - 1);
    }
  };

  // This is an asynchronous function to add an item and it's quantity to the current user's cart.
  async function addToCart(item, quantity) {
    console.log("Adding items to cart");
    // Get the current user's ID
    const userId = firebase.auth().currentUser.uid;
    // Create a reference to a potential cart document in the 'cart' collection in Firestore,
    // specifically for our current user.
    const cartRef = firebase.firestore().collection("carts").doc(userId);

    try {
      await firebase.firestore().runTransaction(async function (transaction) {
        // Let's try to retrieve the current user's cart document.
        const cartDoc = await transaction.get(cartRef);

        if (cartDoc.exists) {

          let updatedItemsInCart = cartDoc.data().items || [];

          // Check if the item we are adding already exists in the cart.
          const itemIndex = updatedItemsInCart.findIndex(function (i) {
            return i.image === item.image;
          });

          if (itemIndex > -1) {
            console.log(
              "Current Item is Already In Cart. Changing it's quantity."
            );
            // If the item exists, update it's quantity in the cart
            updatedItemsInCart[itemIndex].quantity += quantity;
          } else {
            // If the item doesn't exist, add it to the cart with the
            // specified quantity.
            console.log("Current Item is NOT already In Cart. Adding it.");
            updatedItemsInCart.push({
              ...item,
              quantity,
            });
          }
          // Update the cart document with the new items array
          transaction.update(cartRef, { items: updatedItemsInCart });
        } else {
          // If the cart doesn't exist, create a new cart document for the current user
          // with the first item.
          console.log(
            "The cart document for the current user does not exist. Adding cart item."
          );
          transaction.set(cartRef, { items: [{ ...item, quantity }] });
        }
      });
    } catch (error) {
      // If an error occurs during the transaction, log the error message.
      console.error("Failed to add item to cart: ", error);
    }
  }

  return (
    <Screen style={{ ...styles.container, width: WIDTH }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContinaerStyle={{ flexGrow: 1 }}
      >
        <FlatList
          data={item.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="normal"
          pagingEnabled
          keyExtractor={function (item) {
            return item;
          }}
          renderItem={function ({ item }) {
            return (
              <View
                style={{
                  width: WIDTH - 70,
                  marginHorizontal: 10,
                }}
              >
                <Image
                  style={{
                    width: WIDTH,
                    height: ((WIDTH - 70) * 2) / 3,
                    aspectRatio: 3 / 2,
                    resizeMode: "contain",
                    borderRadius: 15,
                  }}
                  source={{ uri: item }}
                />
              </View>
            );
          }}
          snapToInterval={useWindowDimensions().width - 50}
        />

        {/* Section: Title, Rating and Origin of Item */}
        <View style={styles.section}>
          <AppText type="h1Normal">{item.item_name}</AppText>
          <View style={styles.row}>
            <AppIcon
              iconSet={"Entypo"}
              iconName="star"
              iconSize={18}
              style={styles.icon}
              color="black"
            />
            <AppText type="mediumLight">
              {item.rating} · {item.area_name}, {item.location}
            </AppText>
          </View>
        </View>

        <View style={styles.separator}></View>

        {/* Description */}
        <View style={styles.section}>
          <AppText type="h3Bold" style={{ marginVertical: 8, color: "black" }}>
            What It's Like
          </AppText>
          <AppText type="mediumNormal">{item.description}</AppText>
        </View>
        <RowView style={{ marginBottom: 8 }}>
          <AppIcon
            iconSet={"Entypo"}
            iconName={"ruler"}
            style={{ marginRight: 8 }}
          />
          <AppText type="mediumNormal">
            {item.dimensions[0]}l X {item.dimensions[1]}b X {item.dimensions[2]}
            h inches
          </AppText>
        </RowView>

        <RowView style={{ marginBottom: 8 }}>
          <AppIcon
            iconSet={"Entypo"}
            iconName={"palette"}
            style={{ marginRight: 8 }}
          />
          <AppText type="mediumNormal">
            {item.materials_used.map(function (material, i) {
              console.log("i: ", i, "material:", material);
              if (i == item.materials_used.length - 1) {
                return `${material}`;
              } else {
                return `${material}, `;
              }
            })}
          </AppText>
        </RowView>

        <RowView style={{ marginBottom: 8 }}>
          <AppIcon
            iconSet={"FontAwesome6"}
            iconName={"weight-scale"}
            style={{ marginRight: 8 }}
          />
          <AppText type="mediumNormal">{item.weight} KG</AppText>
        </RowView>
        <View style={styles.separator}></View>

        {/* Section: About The Artist */}
        <View style={styles.section}>
          <RowView>
            <AppText
              type="h3Bold"
              style={{ marginVertical: 8, color: "black" }}
            >
              Made by {item.artist}
            </AppText>
            <TouchableHighlight
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                borderColor: "lightgrey",
                borderWidth: 1,
                marginRight: 20,
                margin: 16,
                position: "absolute",
                right: 5,
              }}
              onPress={() => {
                props.navigation.navigate("ArtisanDetail", {
                  screen: "ArtisanDetailScreen",
                  params: { artistUserId: item.artist_uid },
                });
              }}
            >
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                }}
                source={{ uri: item.artist_image }}
              />
            </TouchableHighlight>
          </RowView>
          <AppText type="mediumNormal" style={{ marginTop: 16 }}>
            {item.artist_bio}
          </AppText>
        </View>

        <View style={styles.separator}></View>

        {/* Section: Location */}
        <View style={styles.section}>
          <AppText type="h3Bold" style={{ marginVertical: 8, color: "black" }}>
            Where They're From
          </AppText>
          <View pointerEvents="none" style={{ marginVertical: 10 }}>
            <MapView
              initialRegion={{
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
            >
              <Marker
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
              />
            </MapView>
          </View>

          <AppText type="mediumBold">
            {item.area_name}, {item.location}
          </AppText>
        </View>

        <View style={styles.separator}></View>

        {/* Section: Item Reviews */}
        {item.reviews ? (
          <View style={styles.section}>
            <RowView style={{ marginBottom: 8 }}>
              <AppIcon
                iconSet={"Entypo"}
                iconName={"star"}
                iconSize={18}
                style={styles.icon}
              />
              <AppText
                type="h3Bold"
                style={{ marginVertical: 8, color: "black" }}
              >
                {item.rating} · {item.reviews.length}{" "}
                {item.reviews.length > 1 ? "reviews" : "review"}
              </AppText>
            </RowView>
            <RowView>
              <FlatList
                data={item.reviews}
                horizontal
                keyExtractor={function (review) {
                  return `${review.buyer_name}:${review.reviewText}`;
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={function ({ item: review }) {
                  return (
                    <View
                      style={{
                        width: WIDTH - 80,
                        marginRight: 10,
                        height: 250,
                        borderWidth: 1,
                        borderColor: "lightgrey",
                        borderRadius: 10,
                        padding: 10,
                        shadowColor: "lightgrey",
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.2,
                        shadowRadius: 1.41,

                        elevation: 2,
                      }}
                    >
                      <RowView
                        style={{
                          justifyContent: "space-between",
                          marginRight: 5,
                        }}
                      >
                        <RowView>
                          <Image
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 25,
                              borderColor: "lightgrey",
                              borderWidth: 1,
                              marginRight: 20,
                              marginVertical: 10,
                            }}
                            source={{ uri: review.buyer_image }}
                          />
                          <View>
                            <AppText type="mediumBold">
                              {review.buyer_name}
                            </AppText>
                            <AppText type="smallNormal">
                              {review.review_date}
                            </AppText>
                          </View>
                        </RowView>
                        <RowView>
                          <AppIcon
                            iconSet={"Entypo"}
                            iconName={"star"}
                            iconSize={13}
                            style={styles.icon}
                          />
                          <AppText
                            style={{ marginVertical: 8, color: "black" }}
                          >
                            {review.rating}
                          </AppText>
                        </RowView>
                      </RowView>
                      <AppText type="mediumNormal" numberOfLines={6}>
                        {review.review_text}
                      </AppText>
                    </View>
                  );
                }}
              />
            </RowView>
          </View>
        ) : (
          <View></View>
        )}

        <View style={styles.separator}></View>
        <View style={{ ...styles.section, marginBottom: 100 }}>
          <AppText type="h3Bold" style={{ marginVertical: 8, color: "black" }}>
            When Will I Get It
          </AppText>
          <RowView style={{ marginBottom: 8 }}>
            <AppIcon
              iconSet={"MaterialCommunityIcons"}
              iconName={"clock"}
              style={{ marginRight: 8 }}
            />
            <AppText type="mediumNormal">{item.delivery_details.time}</AppText>
          </RowView>
          <RowView style={{ marginBottom: 8 }}>
            <AppIcon
              iconSet={"MaterialCommunityIcons"}
              iconName={"truck-delivery"}
              style={{ marginRight: 8 }}
            />
            <AppText type="mediumNormal">{item.delivery_details.fee}</AppText>
          </RowView>
          <RowView style={{ marginBottom: 8 }}>
            <AppIcon
              iconSet={"FontAwesome"}
              iconName={"undo"}
              style={{ marginRight: 8 }}
            />
            <AppText type="mediumNormal">
              {item.delivery_details.refund}
            </AppText>
          </RowView>
        </View>
        <View style={styles.separator}></View>
      </ScrollView>
      <RowView style={styles.footer}>
        <AppText type={"h3Normal"}>₹{item.price}</AppText>

        <RowView
          style={{
            alignItems: "center",
            justifyContent: "space-evenly",
            width: WIDTH / 2.5,
          }}
        >
          <AppButton
            text="-"
            onPress={() => decreaseQtyCount()}
            width={30}
            height={30}
            borderRadius={5}
          />
          <AppText type="mediumBold"> {qtyCounter} </AppText>
          <AppButton
            text="+"
            onPress={() => increaseQtyCount()}
            width={30}
            borderRadius={5}
            height={30}
          />
        </RowView>

        <AppButton
          width={WIDTH / 3}
          buttonDisabled={qtyCounter === 0}
          text="Add to Cart"
          onPress={() => addToCart(item, qtyCounter)}
        />
      </RowView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }, // Size, Layout, Boundaries, Fill, etc.
  detailsView: { margin: 20 },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 10,
    alignSelf: "center",
  },
  section: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  h1: { fontSize: 25, fontWeight: "600", lineHeight: 37.5 },
  h2: { fontSize: 22, fontWeight: "500", lineHeight: 33 },
  h3: { fontSize: 20, fontWeight: "500", lineHeight: 30 },
  h4: { fontSize: 18, fontWeight: "600", lineHeight: 27 },
  normal: { fontSize: 16, fontWeight: "300", lineHeight: 24 },
  small: { fontSize: 14, fontWeight: "300", lineHeight: 21 },
  icon: { width: 20, marginRight: 5 },
  map: {
    width: "100%",
    aspectRatio: 3 / 2,
    borderRadius: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    padding: 10,
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
    elevation: 5,
    backgroundColor: "white",
  },
  button: {
    width: 150,
    height: 40,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    borderRadius: 10,
    backgroundColor: "#FF385C",
  },
  buttonLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 0,
    padding: 5,
  },
  imageStyle: {
    height: 400,
  },
  buttonText: {
    fontSize: 15,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageStyle: {
    height: 30,
    width: 80,
  },
  addToCartStyle: {
    height: 40,
    width: "100%",
  },
  quantityLabel: {
    fontWeight: "bold",
    padding: 10,
  },
  productDetailHeading: {
    fontWeight: "bold",
    padding: 10,
  },
  productDetail: {
    padding: 10,
    paddingBottom: 30,
  },
  quantity: {
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonRow: {
    marginTop: 10,
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  screen: {
    padding: 16,
  },
});
