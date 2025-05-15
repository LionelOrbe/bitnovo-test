import React, { useEffect, useState } from 'react';
import { Image, Linking, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import CountryPicker from 'react-native-country-picker-modal';
import { Country, CountryCode } from '../assets/types';
import ModalScreen from './ModalScreen';

type PaymentShareScreenRouteProp = RouteProp<{ params: { webUrl: string; identifier: string; amount: string; currency: string } }, 'params'>;

export const formatAmount = (amount: string): string => {
    return amount?.replace(/\./g, ',');
};

const shareViaEmail = async (webUrl: string) => {
    try {
        await Share.share({
            message: `Por favor, realiza el pago en el siguiente enlace: ${webUrl}`,
            title: 'Solicitud de pago',
            url: `mailto:?subject=Solicitud%20de%20pago&body=Por%20favor,%20realiza%20el%20pago%20en%20el%20siguiente%20enlace:%20${encodeURIComponent(webUrl)}`,
        });
    } catch (error) {
        console.error('Error sharing via email:', error);
    }
};

export default function PaymentShareScreen() {
    const route = useRoute<PaymentShareScreenRouteProp>();
    const navigation = useNavigation<NavigationProp<{ index: undefined; SuccessScreen: undefined; QRScreen: { webUrl: string; amount: string; currency: string } }>>();
    const { webUrl, identifier, amount, currency } = route.params;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [sending, setSending] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>('AR')
    const [country, setCountry] = useState<Country>()
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const socket = new WebSocket(`wss://payments.pre-bnvo.com/ws/merchant/${identifier}`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status === 'Completed') {
                navigation.navigate('SuccessScreen');
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
                message: `Por favor, realiza el pago en el siguiente enlace: ${webUrl}`,
            });
        } catch (error) {
            console.error('Error sharing payment link:', error);
        }
    };

    const onCountrySelect = (country: Country) => {
        setCountryCode(country.cca2)
        setCountry(country)
    }

    const sendWhatsAppMessage = () => {
        if (!phoneNumber) {
            console.error('Número de teléfono no ingresado');
            return;
        }

        const message = `Por favor, realiza el pago en el siguiente enlace: ${webUrl}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        Linking.openURL(whatsappUrl)
            .then(() => {
                setShowModal(true)
            })
            .catch((err) => {
                console.error('Error opening WhatsApp:', err);
            });
        setSending(false);
    };

    const handleNewRequest = () => {
        navigation.navigate('index');
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <Image source={require('../assets/images/PayIcon.png')} style={{ width: 58, height: 58, marginRight: 8 }} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 14 }}>Solicitud de pago</Text>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{formatAmount(amount)} {currency}</Text>
                    </View>
                </View>
                <Text style={styles.status}>Comparte el enlace de pago con el cliente</Text>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.linkContainer}>

                    <View style={[styles.buttons, { width: '80%' }]}>
                        <Ionicons name="link" size={25} color={Colors.primary} style={styles.buttonIcon} />
                        <Text style={[styles.buttonText, { paddingRight: 70 }]} numberOfLines={1} ellipsizeMode="tail">{webUrl}</Text>
                    </View>
                    <Ionicons
                        name="qr-code-outline"
                        size={40}
                        color={Colors.primary}
                        style={{ marginLeft: 20 }}
                        onPress={() => navigation.navigate('QRScreen', { webUrl, amount, currency })}
                    />
                </View>
                <TouchableOpacity onPress={() => shareViaEmail(webUrl)} style={styles.buttons}>
                    <Ionicons name="mail" size={25} color={Colors.primary} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Compartir por correo electrónico</Text>
                </TouchableOpacity>
                {sending ?
                    <>
                        <View style={styles.countryCodeContainer}>
                            <Ionicons name="chevron-down" size={20} color={Colors.primary} style={[styles.buttonIcon, {
                                marginLeft: 5, marginRight: 0, marginTop: 5
                            }]} />
                            <View style={{ marginBottom: 10 }}>
                                <CountryPicker
                                    countryCode={countryCode}
                                    onSelect={onCountrySelect}
                                    withFlag
                                    withCallingCode
                                    withModal
                                    withFilter
                                    translation='spa'
                                    visible={sending}
                                    filterProps={{ placeholder: 'Buscar...' }}
                                    containerButtonStyle={{ width: 25, height: 25, marginRight: 5 }}

                                />
                            </View>
                            <Text style={{ marginTop: 2 }}>+{country?.callingCode}</Text>
                        </View>
                        <TextInput
                            style={[styles.buttons, { paddingLeft: 120, paddingRight: 80 }]}
                            placeholder="Ingresa el número..."
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                        <TouchableOpacity style={[styles.customButton, !!phoneNumber ? {} : { backgroundColor: '#EAF3FF' }]} onPress={sendWhatsAppMessage} disabled={!phoneNumber}>
                            <Text style={[styles.customButtonText, !!phoneNumber ? {} : { color: '#71B0FD' }]}>Enviar</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <TouchableOpacity onPress={() => setSending(true)} style={styles.buttons}>
                        <Ionicons name="logo-whatsapp" size={25} color={Colors.primary} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Enviar a número de WhatsApp</Text>
                    </TouchableOpacity>

                }
                <TouchableOpacity onPress={sharePaymentLink} style={styles.buttons}>
                    <Ionicons name="share" size={25} color={Colors.primary} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Compartir con otras aplicaciones</Text>
                </TouchableOpacity>
            </View>            
            <TouchableOpacity style={styles.newRequestButton} onPress={handleNewRequest}>
                <Text style={styles.newRequestButtonText}>Nueva Solicitud</Text>
                <MaterialCommunityIcons name="wallet-plus" size={25} color={Colors.primary} style={styles.buttonIcon} />
            </TouchableOpacity>
            <ModalScreen visible={showModal} onClose={() => setShowModal(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    status: {
        fontSize: 14,
    },
    card: {
        width: '100%',
        marginTop: 16,
        alignItems: 'center', backgroundColor: '#F9FAFC',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 16,
    },
    buttons: {
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: '#D3DCE6',
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'row',
        gap: 8,
    },
    buttonText: {
        fontSize: 14,
        color: '#71B0FD',
    },
    buttonIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
        marginLeft: 20
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#D3DCE6',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    customButton: {
        position: 'absolute',
        right: 5,
        top: 180,
        backgroundColor: Colors.primary,
        width: 60,
        height: 30,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    countryCodeContainer: {
        position: 'absolute',
        left: 2,
        top: 180,
        zIndex: 1,
        flexDirection: 'row',
    },
    newButton: {
        backgroundColor: Colors.inactive,
        height: 56,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
      },
      newButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    newRequestButton: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: Colors.inactive,
        height: 56,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    newRequestButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});