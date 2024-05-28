import React from 'react';
import { Modal, View, StyleSheet, Text, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { NativeBaseProvider } from 'native-base';
import { ALERTS, COLORS, SIZES } from '../../../constants';

export default function Success({ isModal }) {
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
                            <LottieView
                                source={require('../../../../assets/images/success.json')}
                                autoPlay
                                style={{ width: 100, height: 100 }}
                            />
                            <Text style={{ color: COLORS.primary }}>{ALERTS.success}</Text>
                        </View>
                    </View>
                </Modal>
            ) : (
                <View style={styles.modalContent}>
                    <Image alt='loading' source={require('../../../../assets/shops.png')} style={{
                        height: SIZES.height / 8,
                        width: SIZES.height / 8,
                        alignSelf: 'center',
                    }} />
                    <Text style={{ color: COLORS.primary }}>{ALERTS.thanks}</Text>
                    <Text style={{ color: COLORS.primary }}>{ALERTS.thanks2}</Text>
                    <LottieView
                        source={require('../../../../assets/images/success.json')}
                        autoPlay
                        style={{
                            height: SIZES.height / 11,
                            width: SIZES.height / 8,
                            marginBottom: SIZES.xl
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: SIZES.height / 4.5,
        width: SIZES.width / 3,
    },
});
