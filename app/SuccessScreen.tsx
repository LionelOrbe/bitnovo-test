import { Colors } from '@/constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CustomText } from './_layout';

export default function SuccessScreen() {
    const navigation = useNavigation<NavigationProp<{ index: undefined; }>>();

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/payLogo.png')} style={styles.payLogo} resizeMode='none' />
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/success.png')}
                    style={{ width: 200, height: 160, marginBottom: 20 }} />
                <CustomText style={styles.message}>Pago recibido</CustomText>
                <CustomText style={styles.text}>El pago se ha confirmado con éxito</CustomText>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('index')} >
                    <CustomText style={styles.customButtonText}>Finalizar</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
    },
    message: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.active,
    },
    text: {
        fontSize: 14,
        color: Colors.active
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    customButton: {
        backgroundColor: Colors.inactive,
        height: 56,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        gap: 15,
    },
    payLogo: {
        position: 'absolute',
        width: '30%',
        top: 15,
        left: '50%',
        transform: [{ translateX: '-35%' }],
    },
});