import React, { useState, useEffect, } from "react";
import { View, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";
import firebase from "firebase/compat";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../config/colors";
import { useNavigation } from "@react-navigation/native";
import { Rating } from "react-native-ratings";

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function AddReviewScreen(props) {
    const navigation = useNavigation();
    const [userDetails, setUserDetails] = useState(null);
    let item = props.route.params?.item;

    useEffect(() => {
        async function getUserDetails() {
            try {
                const currentUser = firebase.auth().currentUser;
                const docRef = firebase.firestore().collection("users").doc(currentUser.uid);
                const doc = await docRef.get();

                if (doc.exists) {
                    console.log("User document data:", doc.data());
                    setUserDetails(doc.data());
                } else {
                    console.log("No User document");
                    return null;
                }
            } catch (error) {
                console.error("Error fetching current user's document:", error);
            }
        }
        getUserDetails();
    }, []);

    const saveReviewToFirestore = async () => {
        const now = new Date();
        const reviewDate = now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const artItemsRef = firebase.firestore().collection("art").where('image', '==', item.image)
        artItemsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                artItem = doc.data();

                const newReview = {
                    rating: formData.rating,
                    review_text: formData.review_text,
                    buyer_image: userDetails.image,
                    buyer_name: userDetails.full_name,
                    review_date: reviewDate
                };

                let artReview = artItem.reviews ? artItem.reviews : [];
                
                artReview.push(newReview);

                artItem.reviews = artReview;

                let avgRating = 0;
                artReview.forEach((review) => { 
                    avgRating = avgRating + review.rating;
                });
                artItem.rating = (avgRating/artReview.length).toFixed(2);;
                console.log(artItem.rating);
                doc.ref.update(artItem);
                
            });
        });
    };

    const [formData, setFormData] = useState({
        rating: 0,
        review_text: "",
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let valid = true;
        let newErrors = {};
        console.log('on validate form')
        // Required Fields Validation
        const requiredFields = ["rating", "review_text"];
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                valid = false;
                newErrors[field] = `${toTitleCase(field)} cannot be empty.`;
            }
        });
        //console.log(newErrors)
        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            saveReviewToFirestore();
            console.log("Form data submitted", formData);
            navigation.navigate("BuyerProfileScreen");
        }

    };

    const handleInputChange = (name, value) => {

        setFormData({ ...formData, [name]: value });

        // If there's an error on this field, remove it from the errors object
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const renderError = () => {
        return Object.keys(errors).map((key) => {
            return (
                <Text key={key} style={styles.errorText}>
                    {errors[key]}
                </Text>
            );
        });
    };

    return (
        <Screen>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <AppText type={"h3Bold"} style={{ marginBottom: 8 }}>
                        Add Review
                    </AppText>
                    <Rating type='heart'
                        showRating={true}
                        jumpValue={0.5}
                        fractions={1}

                        onFinishRating={(userRating) => handleInputChange("rating", userRating)}>
                    </Rating>

                    <AppTextInput
                        placeholder="Type here..."
                        multiline={true}
                        numberOfLines={10}
                        value={formData.review_text}
                        onChangeText={(text) => handleInputChange("review_text", text)}
                    />

                    <AppButton text="Submit" onPress={handleSubmit} />
                    <View style={styles.errorContainer}>
                        {Object.values(errors).map((error, index) => {
                            if (error) {
                                return (
                                    <AppText color={colors.red} key={index} type="smallNormal">
                                        - {error}
                                    </AppText>
                                );
                            }
                            return null;
                        })}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    addressTypeContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
    },
});

export default AddReviewScreen;
