import React from 'react';
import { Modal, View, StyleSheet, Text, Pressable } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import Coin from '../Wallet/coin';
import LottieView from 'lottie-react-native';

const ConfirmModal = ({ showConfirmModal, setShowConfirmModal, confirmMsg, onConfirm, coin }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
        >
            <View style={styles.modal}>
                <View style={styles.modalContent}>
                    <View style={{ alignItems: 'center' }}>
                        <LottieView
                            source={require('../../../assets/images/question.json')}
                            autoPlay
                            style={{ width: 100, height: 100 }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ padding: SIZES.s }}>
                            {confirmMsg}
                        </Text>
                        {coin &&
                            <Coin coin={coin} size='mid' />
                        }
                    </View>
                    <View style={styles.item}>
                        <Pressable style={styles.cancelButton} onPress={() => setShowConfirmModal(false)}>
                            <Text style={styles.cancelText}>Hủy</Text>
                        </Pressable>
                        <Pressable style={styles.cancelButton} onPress={onConfirm}>
                            <Text style={styles.confirmText}>Xác nhận</Text>
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

export default ConfirmModal;
