import React from 'react';
import { Modal, View, StyleSheet, Text, Pressable } from 'react-native';
import { COLORS, SIZES } from '../../../constants';
import LottieView from 'lottie-react-native';
import Coin from '../../Wallet/coin';

const ErrorItems = ({ showErrorModal, setShowErrorModal, errorMsg, onError, coin, wallet }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showErrorModal}
            onRequestClose={() => setShowErrorModal(false)}
        >
            <View style={styles.modal}>
                <View style={styles.modalContent}>
                    <View style={{ alignItems: 'center' }}>
                        <LottieView
                            source={require('../../../../assets/images/error.json')}
                            autoPlay
                            style={{ width: 100, height: 100 }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ padding: SIZES.s }}>
                            {errorMsg}
                        </Text>
                        <Coin coin={coin - wallet} size='mid' />
                    </View>
                    <View style={styles.item}>
                        <Pressable style={styles.cancelButton} onPress={() => setShowErrorModal(false)}>
                            <Text style={styles.cancelText}>Trở lại</Text>
                        </Pressable>
                        <Pressable style={styles.cancelButton} onPress={onError}>
                            <Text style={styles.confirmText}>Nạp tiền</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.xl,
    },
    cancelButton: {
        marginTop: 20,
        padding: SIZES.s,
        alignItems: 'center',
        backgroundColor: COLORS.quaternary,
        borderRadius: SIZES.s
    },
    cancelText: {
        color: COLORS.gray3,
        fontSize: 16,
    },
    confirmText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default ErrorItems;
