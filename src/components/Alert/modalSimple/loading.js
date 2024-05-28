import React from 'react';
import { Modal, View, StyleSheet, Text, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { NativeBaseProvider } from 'native-base';
import { ALERTS, COLORS, SIZES } from '../../../constants';

export default function Loading({ isModal }) {
    return (
        <NativeBaseProvider>
            {isModal ? (
                <Modal
                    visible={true}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Image alt='loading' source={require('../../../../assets/shops.png')} style={{
                                height: SIZES.height / 8,
                                width: SIZES.height / 8,
                                alignSelf: 'center',
                            }} />
                            <Text style={{ color: COLORS.primary }}>{ALERTS.loading}</Text>
                            <Text style={{ color: COLORS.primary }}>{ALERTS.loading2}</Text>
                            <LottieView
                                source={require('../../../../assets/images/loading.json')}
                                autoPlay
                                style={{
                                    height: SIZES.height / 11,
                                    width: SIZES.height / 8,
                                    marginBottom: SIZES.xl
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            ) : (
                <View style={styles.container}>

                    <Image alt='loading' source={require('../../../../assets/shops.png')} style={{
                        height: SIZES.height / 8,
                        width: SIZES.height / 8,
                        alignSelf: 'center',
                    }} />
                    <Text style={{ color: COLORS.primary }}>{ALERTS.loading}</Text>
                    <LottieView
                        source={require('../../../../assets/images/loading.json')}
                        autoPlay
                        style={{
                            height: SIZES.height / 8,
                            width: SIZES.height / 8,
                        }}
                    />
                </View>
            )}
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: SIZES.height / 6,
        width: SIZES.width / 3,
        backgroundColor: '#fff',
        position: 'absolute',
        top: SIZES.height / 2 - SIZES.height / 6 / 2,
        right: SIZES.width / 2 - SIZES.width / 3 / 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: SIZES.xxl
    },
});
