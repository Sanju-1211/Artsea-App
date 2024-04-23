import React, { useEffect } from 'react';
import {StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import AppText from '../components/AppText';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';

const OrderConfirmationScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('CheckoutScreen'); 
    }, 10000); 

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [navigation]); // Include navigation in the dependency array


  return (
    <Screen style={styles.container}>
        <LottieView
          loop
          autoPlay
          resizeMode="cover"
          source={require('../assets/watermelon.json')}
          style={{flex:0.7}}
        />
        <AppText type={"h3Bold"} style={{alignSelf: "center"}}>Your order is confirmed. </AppText>
        <AppText type={"mediumNormal"}>We will email you before dispatching the order.</AppText>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderConfirmationScreen;
