import { NavigationProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function CreatePaymentScreen() {
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [currency, setCurrency] = useState('EUR');

  type RootStackParamList = {
    PaymentShareScreen: { webUrl: string; identifier: string };
    CurrencySelectionScreen: { setCurrency: (currency: string) => void, currency: string };
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSetCurrency = useCallback((currency: string): void => {
    setCurrency(currency);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.setOptions({
              setCurrency: handleSetCurrency,
            });
            navigation.navigate({
              name: 'CurrencySelectionScreen',
              params: { setCurrency: handleSetCurrency, currency },
            });
          }}
          style={{ marginRight: 10 }}
        >
          <Text style={{ fontSize: 16 }}>{currency}</Text>
        </TouchableOpacity>
      ),
    });
  }, [currency, navigation, handleSetCurrency]);

  const createPayment = async () => {
    try {
      const response = await axios.post('https://payments.pre-bnvo.com/api/v1/orders/', {
        "identifier": "string",
        "reference": "string",
        "payment_uri": "string",
        "web_url": "http://example.com",
        "address": "string",
        "tag_memo": "string",
        "expected_input_amount": amount,
        "expected_output_amount": amount,
        "rate": 0,
        "notes": concept,
        "fiat": currency,
        "language": "ES"
      }, {
        headers: {
          'X-Device-Id': 'd497719b-905f-4a41-8dbe-cf124c442f42',
        },
      });
      if (response.data && response.data.web_url && response.data.identifier) {
        navigation.navigate('PaymentShareScreen', {
          webUrl: response.data.web_url,
          identifier: response.data.identifier,
        });
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const currencySymbols: Record<string, { prefix: string; suffix: string }> = {
    EUR: { prefix: '', suffix: ' €' },
    USD: { prefix: '$ ', suffix: '' },
    GBP: { prefix: '£ ', suffix: '' },
  };

  return (
    <View style={styles.container}>
      <CurrencyInput
        style={[styles.currencyInput, amount ? {} : { color: '#C0CCDA' }]}
        value={parseFloat(amount) || 0}
        onChangeValue={(value) => setAmount(value?.toString() || '')}
        prefix={currencySymbols[currency]?.prefix || ''}
        suffix={currencySymbols[currency]?.suffix || ''}
        delimiter=" "
        separator=","
        precision={2}
      />

      <Text style={styles.label}>Concepto</Text>
      <TextInput
        style={[styles.input]}
        value={concept}
        onChangeText={setConcept}
        placeholder="Añade descripción del pago"
        placeholderTextColor={styles.placeHolder.color}
        maxLength={140}
        multiline
      />
      <Text style={{ alignSelf: 'flex-end', color: Colors.light.text, fontSize: 12 }}>
        {concept.length}/140 caracteres
      </Text>

      <Button title="Continuar" onPress={createPayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 18,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 16,

  },
  placeHolder: {
    color: '#647184'
  },
  currencyInput: {
    textAlign: 'center',
    fontSize: 40,
    lineHeight: 50,
    fontWeight: 'bold',
    color: Colors.light.primary,
    paddingVertical: 60
  },
  picker: {
    marginBottom: 16,
  },
});
