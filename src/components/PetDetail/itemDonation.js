import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { walletSelector } from '../../store/sellectors';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ItemCard from '../Wallet/itemCard';
import { BUTTONS, COLORS, SIZES } from '../../constants';
import ConfirmModal from '../Alert/confirmModal';
import Loading from '../Alert/modalSimple/loading';
import Success from '../Alert/modalSimple/success';
import ErrorItems from '../Alert/modalSimple/errorItems';
import ErrorReservation from '../Alert/modalSimple/errorReservation';
import Coin from '../Wallet/coin';

const ItemDonation = ({ isVisible, onClose, itemData }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [amount, setAmount] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const walletData = useSelector(walletSelector);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showErrorReservationModal, setShowErrorReservationModal] = useState(false);


    useEffect(() => {
        setAmount(0)
    }, [onClose]);

    const renderItem = ({ item }) => (
        <ItemCard
            item={item}
            updateAmount={updateAmount}
            resetQuantity={showSuccessModal}
            onQuantityChange={(quantity) => handleQuantityChange(item, quantity)}
        />
    );

    const updateAmount = (price) => {
        setAmount(prevAmount => prevAmount + price);
    };

    const handleQuantityChange = (item, quantity) => {
        const selected = [...selectedItems];
        const index = selected.findIndex(i => i.id === item.id);

        if (quantity === 0 && index !== -1) {
            selected.splice(index, 1);
        } else if (quantity > 0 && index === -1) {
            selected.push({ ...item, quantity });
        } else if (quantity > 0 && index !== -1) {
            selected[index].quantity = quantity;
        }

        setSelectedItems(selected);
    };

    const handleBuyPress = async () => {
        if (amount > walletData.balance) {
            setShowErrorModal(true);
        } else {
            setShowConfirmModal(true);
        }
    };

    const handleConfirmBuy = async () => {

    };


    const handleErrorBuy = () => {
        navigation.navigate('Topup');
    };
    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContent}>
                <View style={{
                    position: 'absolute',
                    bottom: -SIZES.height,
                }}>
                    <View style={{
                        padding: SIZES.m - 2,
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: SIZES.xxl - SIZES.s,
                        backgroundColor: COLORS.white,
                        shadowOffset: { width: 1, height: 1 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                        elevation: 3,
                    }}>
                        <Pressable
                            onPress={() => onClose()}
                            style={{}}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                        </Pressable>
                        <Text style={{ fontWeight: '500', fontSize: SIZES.l, color: COLORS.black }}>Menu của quán </Text>
                    </View>
                    <View style={{
                        padding: SIZES.m,
                        flexDirection: 'column',
                        gap: SIZES.s,
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: SIZES.l, color: COLORS.black }}>Danh sách đồ uống</Text>
                    </View>
                    <FlatList
                        data={itemData}
                        keyExtractor={(item) => item.itemId.toString()}
                        renderItem={renderItem}
                        numColumns={3}
                        contentContainerStyle={{ padding: SIZES.m }}
                    />
                    {showConfirmModal && (
                        <ConfirmModal
                            showConfirmModal={showConfirmModal}
                            setShowConfirmModal={setShowConfirmModal}
                            confirmMsg="Xác nhận đặt thêm nước với "
                            coin={amount}
                            onConfirm={handleConfirmBuy}
                        />
                    )}
                    {loading && (
                        <Loading isModal={true} />
                    )}
                    {showSuccessModal && (
                        <Success isModal={true} />
                    )}
                    {showErrorModal && (
                        <ErrorItems
                            showErrorModal={showErrorModal}
                            setShowErrorModal={setShowErrorModal}
                            errorMsg="Không đủ số dư trong ví, cần thêm "
                            coin={amount}
                            wallet={walletData.balance}
                            onError={handleErrorBuy} />
                    )}
                    {showErrorReservationModal && (
                        <ErrorReservation
                            showErrorModal={showErrorReservationModal}
                            setShowErrorModal={setShowErrorReservationModal}
                            errorMsg={errorMsg}
                            onBackHome={handleBack} />
                    )}
                    <View style={{
                        borderTopWidth: 1,
                        borderColor: COLORS.gray1,
                        padding: SIZES.s,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.white,
                    }}>
                        <Coin coin={amount} size='mid' />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[{
                                paddingVertical: SIZES.s,
                                backgroundColor: COLORS.gray1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                gap: SIZES.s
                            }, BUTTONS.recMax]}
                            onPress={onClose}>
                            <Text style={styles.cancelText}>Hủy</Text>
                        </Pressable>
                        <Pressable
                            style={[{
                                paddingVertical: SIZES.s,
                                backgroundColor: amount === 0 ? COLORS.gray1 : COLORS.primary,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                gap: SIZES.s
                            }, BUTTONS.recMax]}
                            disabled={amount === 0}
                            onPress={handleBuyPress}>
                            <Text style={{ fontSize: SIZES.m, color: amount === 0 ? COLORS.black : COLORS.white, fontWeight: '500' }}>Đặt ngay</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ItemDonation

const styles = StyleSheet.create({})