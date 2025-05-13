import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SuccessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Payment Successful!</Text>
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
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
});