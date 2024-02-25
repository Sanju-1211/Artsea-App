import React from "react";
import { StyleSheet, ImageBackground, View,} from "react-native";
import * as Yup from "yup";
import colors from "../config/colors";
import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton, AppFormPicker } from "../components/forms";
import AppText from "../components/AppText";
import ItemImagePicker from "../components/ItemImagePicker";


const validationSchema = Yup.object().shape({
  Title: Yup.string().required().label("Title"),
  description: Yup.string().required().label("Description"),
  price: Yup.string().required().label("Price")
});

const categories = [
  { label: "Paintings", value: 1 },
  { label: "Sculpture", value: 2 },
  { label: "Glass Art", value: 3 }
];

function AddItemScreen() {
  return (
    <Screen>
      	<AppText style={styles.addItemHeader}>Item Details</AppText>
      	<AppForm
        	initialValues={{ title: "", 
            description: "", 
            price: "" , 
            category: null,
            images: []}}
        	onSubmit={(values) => console.log(values)}
        	validationSchema={validationSchema}
      	>
        	<AppFormField
          		autoCapitalize="none"
          		autoCorrect={false}
           		name="title"
          		placeholder="Title"
          		textContentType="name"
        	/>
			<AppFormField
				autoCapitalize="none"
				autoCorrect={false}
				name="description"
				placeholder="Description"
				textContentType="name"
			/>
			<AppFormPicker 
				items={categories} 
				name="category" 
				placeholder="Category" 
			/>
			<AppFormField
				autoCapitalize="none"
				autoCorrect={false}
				name="price"
				placeholder="Price"
				inputMode = "decimal"
			/>
			<ItemImagePicker></ItemImagePicker>
			<View style={styles.buttonsContainer}>
			<SubmitButton title="Add Item" 
							buttonStyle={styles.button} 
							buttonTextStyle={styles.buttonTextStyle}
							//onPress={() => navigation.navigate("App")}  
							/>
			</View>
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  	button: {
    	backgroundColor: colors.buttonSecondary,
    	padding: 10,
    	margin: 10,
    	width: 300,
	},
	buttonsContainer:{
    	marginTop: 10,
    	alignItems:"center"
  	},
  	buttonTextStyle: {
    	fontSize: 18,
    	color: colors.buttonTextSecondary
  	},
  	addItemHeader:{
    	fontSize: 20,
    	textAlign:"center",
    	marginTop: 10
  	},
});

export default AddItemScreen;
