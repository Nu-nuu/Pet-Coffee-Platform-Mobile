import React from 'react';
import { Modal, View, StyleSheet, Text, Pressable } from 'react-native';
import { COLORS, SIZES } from '../../../constants';
import LottieView from 'lottie-react-native';

const ErrorReservation = ({ showErrorModal, setShowErrorModal, errorMsg, onBackHome }) => {

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
                    </View>
                    <View style={styles.item}>
                        <Pressable style={styles.cancelButton} onPress={onBackHome}>
                            <Text style={styles.confirmText}>Trở lại</Text>
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
        justifyContent: 'center',
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

export default ErrorReservation;
