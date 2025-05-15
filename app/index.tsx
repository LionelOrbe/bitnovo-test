import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { Colors } from '../constants/Colors';
import { CustomText, CustomTextInput } from './_layout';

export default function CreatePaymentScreen() {
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [loading, setLoading] = useState(false);

  type RootStackParamList = {
    PaymentShareScreen: { webUrl: string; identifier: string; amount: string; currency: string };
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
          style={[styles.picker]}
        >
          <CustomText style={styles.pickerText}>{currency}</CustomText>
          <Ionicons name="chevron-down" size={16} color={Colors.primary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      ),
    });
  }, [currency, navigation, handleSetCurrency]);

  const createPayment = async () => {
    setLoading(true);
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
          amount,
          currency: currencySymbols[currency]?.suffix || currencySymbols[currency]?.prefix ||'',
        });
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
    setLoading(false);
  };

  const currencySymbols: Record<string, { prefix: string; suffix: string }> = {
    EUR: { prefix: '', suffix: ' €' },
    USD: { prefix: '$ ', suffix: '' },
    GBP: { prefix: '£ ', suffix: '' },
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <CurrencyInput
          style={[styles.currencyInput, amount ? { color: Colors.primary } : { color: '#C0CCDA' }]}
          value={parseFloat(amount) || 0}
          onChangeValue={(value) => setAmount(value?.toString() || '')}
          prefix={currencySymbols[currency]?.prefix || ''}
          suffix={currencySymbols[currency]?.suffix || ''}
          delimiter=" "
          separator=","
          precision={2}
        />

        <CustomText style={styles.label}>Concepto</CustomText>
        <CustomTextInput
          style={[styles.input]}
          value={concept}
          onChangeText={setConcept}
          placeholder="Añade descripción del pago"
          placeholderTextColor={styles.placeHolder.color}
          maxLength={140}
          multiline
        />
        {
          concept.length > 0 ?
            <CustomText style={{ alignSelf: 'flex-end', color: Colors.text, fontSize: 12 }}>
              {concept.length}/140 caracteres
            </CustomText> : null
        }
      </View>

      <TouchableOpacity style={[styles.customButton, !!amount && !loading ? {} : { backgroundColor: '#EAF3FF' }]} onPress={createPayment} disabled={!amount && !loading}>
        {loading ? <ActivityIndicator size={24} color={Colors.primary} /> :
          <CustomText style={[styles.customButtonText, !!amount && !loading ? {} : { color: '#71B0FD' }]}>Continuar</CustomText>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.tint,
    fontWeight: 'bold',
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
    paddingVertical: 60
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginRight: 10,
    backgroundColor: '#D3DCE64D',
    width: 70,
    height: 28,
    borderRadius: 50,
  },
  pickerText: {
    color: Colors.tint,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 2,
  },
  customButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
