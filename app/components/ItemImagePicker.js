import React, { useState} from 'react';
import {  Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppButton from './AppButton';

export default function ItemImagePicker() {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <AppButton text="Upload Item Image" onPress={pickImage}  />      
            <View style={styles.image}>
                {image && <Image source={{ uri: image }}  style={styles.image}/>}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent: 'center' 
    },
    image: {
        width: "100%",
        height: 250,
        marginTop: 10
    }
})