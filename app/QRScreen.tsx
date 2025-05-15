import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { formatAmount } from './PaymentShareScreen';
let QRlogo = require('@/assets/images/qr-icon.png');

type QRScreenProps = RouteProp<{ params: { webUrl: string; amount: string; currency: string } }, 'params'>

export default function QRScreen() {
    const route = useRoute<QRScreenProps>();
    const navigation = useNavigation<NavigationProp<{ Success: undefined; QRScreen: { webUrl: string; amount: string; currency: string } }>>();
    const { webUrl, amount, currency } = route.params;

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={18} color={Colors.text} style={styles.backButtonIcon} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                <Ionicons name="alert" size={20} color={Colors.icon} style={styles.logo} />
                <Text style={{ fontSize: 12, lineHeight: 20, color: Colors.active, marginLeft: 15, maxWidth: '80%' }}>Escanea el QR y serás redirigido a la pasarela de pago de Bitnovo Pay.</Text>
            </View>
            <View style={styles.logoContainer}>
                <QRCode value={webUrl || ''} size={340} logo={QRlogo} logoSize={50} />
            </View>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', marginVertical: 20 }}>{formatAmount(amount)} {currency}</Text>
            <Text style={{ fontSize: 14, color: 'white' }}>Esta pantalla se actualizará automáticamente</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,       
        alignItems: 'center',
        backgroundColor: Colors.primary,
    },
    backButtonIcon: {
        backgroundColor: Colors.inactive,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 50,
        width: 30,
        height: 30,
    },
    logo: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        textAlign: 'center',
        textAlignVertical: 'center',
        
    },
    logoContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',        
        backgroundColor: Colors.inactive,
        padding: 20,
        marginVertical: 24,
        borderRadius: 10,
    },
});