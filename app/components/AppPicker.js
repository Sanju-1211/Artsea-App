import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Button, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "./AppText";
import Screen from "./Screen";
import defaultStyles from "../config/styles";
import PickerItem from "./PickerItem";

function AppPicker({ icon, items, onSelectItem, placeholder, selectedItem }) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <View style={styles.container}>
                {icon && (
                    <MaterialCommunityIcons
                    name={icon}
                    size={20}
                    color={defaultStyles.colors.medium}
                    style={styles.icon}
                    />
                )}
                {selectedItem ? (
                    <AppText style={styles.text}>{selectedItem.label}</AppText>
                ) : (
                    <AppText style={styles.placeholder}>{placeholder}</AppText>
                )}

                <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={defaultStyles.colors.medium}
                />
            </View>
        </TouchableWithoutFeedback>
        <Modal visible={modalVisible} animationType="slide">
            <Screen>
            <View style={styles.flatListContainer}>
            <Button title="Close" onPress={() => setModalVisible(false)} color={colors.button}/>
            <FlatList
                data={items}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                    <PickerItem
                        item={item}
                        onPress={() => {
                        setModalVisible(false);
                        onSelectItem(item);
                    }}
                />
                )}
            />
            </View>
            </Screen>
        </Modal>
        </>
    );
}

const styles = StyleSheet.create({
  	container: {
    	backgroundColor: defaultStyles.colors.light,
    	borderRadius: 25,
    	flexDirection: "row",
    	width: "100%",
    	padding: 15,
    	marginVertical: 10,
  	},
  	icon: {
    	marginRight: 10,
  	},
  	placeholder: {
   		color: defaultStyles.colors.medium,
    	flex: 1,
    	fontSize: 18,
  	},
  	text: {
   		flex: 1,
    	color: colors.black,
    	fontSize: 18,
	},
	flatListContainer:{
		marginBottom:100
	}
});

export default AppPicker;
