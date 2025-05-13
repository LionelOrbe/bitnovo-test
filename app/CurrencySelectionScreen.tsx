import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const currencies = [
  { label: 'EUR', value: 'EUR' },
  { label: 'USD', value: 'USD' },
  { label: 'GBP', value: 'GBP' },
];

type CurrencySelectionScreenRouteProp = RouteProp<{ params: { setCurrency: (currency: string) => void, currency: string } }, 'params'>;

export default function CurrencySelectionScreen() {
    const route = useRoute<CurrencySelectionScreenRouteProp>();    
  const navigation = useNavigation(); 
  const setCurrency = route?.params?.setCurrency || (() => {});
  const currency = route?.params?.currency || 'EUR';

  const handleCurrencySelect = (currency: string) => {
    setCurrency(currency);    
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Select Currency - {currency}</Text>
      <FlatList
        data={currencies}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.currencyItem} onPress={() => handleCurrencySelect(item.value)}>
            <Text style={styles.currencyText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  currencyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  currencyText: {
    fontSize: 18,
  },
});