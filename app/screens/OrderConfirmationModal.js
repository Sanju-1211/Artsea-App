// OrderConfirmationModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import AppText from '../components/AppText';

const OrderConfirmationModal = ({ visible, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <AppText style={styles.modalText}>Order placed successfully! You will be receiving confirmation email. </AppText>
          <AppButton
            title="OK"
            onPress={onConfirm}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  // Add other styles you might need
});

export default OrderOrderConfirmationModal;
