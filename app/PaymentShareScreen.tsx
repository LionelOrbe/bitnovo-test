import React, { useEffect, useState } from 'react';
import { Button, Share, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type PaymentShareScreenRouteProp = RouteProp<{ params: { webUrl: string; identifier: string } }, 'params'>;

export default function PaymentShareScreen() {
  const route = useRoute<PaymentShareScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<{ Success: undefined }>>();
  const { webUrl, identifier } = route.params;
  const [paymentStatus, setPaymentStatus] = useState('Pending');

  useEffect(() => {
    const socket = new WebSocket(`wss://payments.pre-bnvo.com/ws/merchant/${identifier}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status) {
        setPaymentStatus(data.status);
        if (data.status === 'Completed') {
          navigation.navigate('Success');
        }
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [identifier, navigation]);

  const sharePaymentLink = async () => {
    try {
      await Share.share({
        message: `Pay here: ${webUrl}`,
      });
    } catch (error) {
      console.error('Error sharing payment link:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Payment Status: {paymentStatus}</Text>
      <QRCode value={webUrl || ''} size={200} />
      <Button title="Share Payment Link" onPress={sharePaymentLink} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  status: {
    fontSize: 18,
    marginBottom: 16,
  },
});