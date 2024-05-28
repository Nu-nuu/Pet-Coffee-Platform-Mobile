import React from 'react';
import { Modal, View, StyleSheet, Text, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { NativeBaseProvider } from 'native-base';
import { ALERTS, COLORS, SIZES } from '../../../constants';

export default function LoadingMin({ isModal }) {
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
                                source={require('../../../../assets/images/loading.json')}
                                autoPlay
                                style={{
                                    height: SIZES.height / 10,
                                    width: SIZES.height / 10,
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            ) : (
                <View style={styles.container}>
                    <LottieView
                        source={require('../../../../assets/images/loading.json')}
                        autoPlay
                        style={{
                            height: SIZES.width / 3 - SIZES.s * 8,
                            width: SIZES.width / 3 - SIZES.s * 4,
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
        width: SIZES.width / 3.4,
        backgroundColor: '#fff',
        position: 'absolute',
        top: SIZES.height / 2 - SIZES.height / 12,
        right: SIZES.width / 2 - SIZES.width / 6.8,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
