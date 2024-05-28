import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { useCodeScanner } from 'react-native-vision-camera';
import { COLORS, SIZES, TEXTS } from '../../../constants';

const ScanReservation = () => {
    const device = useCameraDevice('back')
    const navigation = useNavigation();
    const [codeResult, setCodeResult] = useState('');

    useEffect(() => {
        checkCameraPermission();
        setCodeResult('')
    }, []);

    const checkCameraPermission = async () => {
        const cameraPermission = await Camera.requestCameraPermission();
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            if (codes.length > 0) {
                setCodeResult(codes[0].value);
            }
        },
    });

    if (device == null) return <ActivityIndicator size="large" />;


    const handleReservationCode = () => {
        navigation.navigate('TabGroup', {
            screen: 'Reservation', params: {
                code: codeResult
            }
        })
    }

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
            {codeResult !== '' ? (
                <TouchableOpacity style={styles.codeContainer} onPress={handleReservationCode}>
                    <Text style={styles.codeText}>{codeResult}</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.codeContainer}>
                    <Text style={styles.codeText}>Quét mã QR Mã đặt chỗ</Text>
                </View>
            )}
            <View style={{
                position: 'absolute',
                borderRadius: 10,
            }}>
                <View style={{
                    width: SIZES.width / 1.5,
                    height: SIZES.width / 1.5,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{
                            borderTopWidth: 5,
                            borderLeftWidth: 5,
                            padding: SIZES.s,
                            borderColor: COLORS.white,
                            width: SIZES.m
                        }} />
                        <View style={{
                            borderTopWidth: 5,
                            borderLeftWidth: 5,
                            padding: SIZES.s,
                            borderColor: COLORS.white,
                            width: SIZES.m,
                            transform: [{ rotate: '90deg' }]
                        }} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', transform: [{ rotate: '180deg' }] }}>
                        <View style={{
                            borderTopWidth: 5,
                            borderLeftWidth: 5,
                            padding: SIZES.s,
                            borderColor: COLORS.white,
                            width: SIZES.m
                        }} />
                        <View style={{
                            borderTopWidth: 5,
                            borderLeftWidth: 5,
                            padding: SIZES.s,
                            borderColor: COLORS.white,
                            width: SIZES.m,
                            transform: [{ rotate: '90deg' }]
                        }} />
                    </View>
                </View>
            </View>
            <View style={{
                position: 'absolute',
                borderRadius: 10,
                top: 50,
            }}><Text style={TEXTS.titleL}>
                    Quét mã
                </Text></View>

        </View>
    );
};

export default ScanReservation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeContainer: {
        position: 'absolute',
        bottom: 200,
        backgroundColor: '#FFFFFFA0',
        padding: 20,
        borderRadius: 10,
    },
    codeText: {
        fontSize: 18,
    },
});
