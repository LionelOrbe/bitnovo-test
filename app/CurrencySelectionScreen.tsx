import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const currencies = [
    { label: 'Euro', value: 'EUR', flag: require('../assets/images/eu-flag.png') },
    { label: 'Dólar Estadounidense', value: 'USD', flag: require('../assets/images/us-flag.png') },
    { label: 'Libra Esterlina', value: 'GBP', flag: require('../assets/images/uk-flag.png') },
];

type CurrencySelectionScreenRouteProp = RouteProp<{ params: { setCurrency: (currency: string) => void, currency: string } }, 'params'>;

export default function CurrencySelectionScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredCurrencies = currencies.filter(currency =>
        currency.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const route = useRoute<CurrencySelectionScreenRouteProp>();
    const navigation = useNavigation();
    const setCurrency = route?.params?.setCurrency || (() => { });
    const currency = route?.params?.currency || 'EUR';

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={18} color={Colors.text} style={styles.backButtonIcon} />
                </TouchableOpacity>
            ),
        });
    }, [currency, navigation]);

    const handleCurrencySelect = (currency: string) => {
        setCurrency(currency);
        navigation.goBack();
    };


    return (
        <View style={styles.container}>
            <View>
                <Ionicons name="search-sharp" size={30} color={'grey'} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredCurrencies}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.currencyItem} onPress={() => handleCurrencySelect(item.value)}>
                        <Image source={item.flag} style={styles.flag} />
                        <View style={styles.currencyInfo}>
                            <Text style={styles.currencyLabelText}>{item.label}</Text>
                            <Text style={styles.currencyText}>{item.value}</Text>
                        </View>
                        {
                            currency === item.value ?
                                <Ionicons name="checkmark-circle" size={28} color={Colors.primary} style={styles.chevronIcon} /> :
                                <Ionicons name="chevron-forward" size={25} color={'grey'} style={styles.chevronIcon} />
                        }
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

    },
    backButtonIcon: {
        backgroundColor: Colors.inactive,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 50,
        width: 30,
        height: 30,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    currencyItem: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        width: 36,
        height: 36,
        marginRight: 14,
    },
    currencyInfo: {
        flexDirection: 'column',
    },
    currencyText: {
        fontSize: 12,
        color: Colors.text
    },
    currencyLabelText: {
        color: Colors.primary,
        fontWeight: 'bold'
    },
    searchBar: {
        flex: 1,
        minHeight: 48,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 45,
        marginBottom: 30,
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 1,
    },
    chevronIcon: {
        position: 'absolute',
        right: 10,
        top: 20,
        zIndex: 1,
    },

});