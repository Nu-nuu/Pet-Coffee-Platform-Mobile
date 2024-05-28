import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { walletSelector } from '../../store/sellectors';
import { useNavigation } from '@react-navigation/native';
import { createInvoiceReservationThunk, getAllReservationThunk, getReservationDetailThunk } from '../../store/apiThunk/reservationThunk';
import ProductCard from './productCard';
import ConfirmModal from '../Alert/confirmModal';
import Loading from '../Alert/modalSimple/loading';
import Success from '../Alert/modalSimple/success';
import ErrorItems from '../Alert/modalSimple/errorItems';
import { BRS, BUTTONS, COLORS, RESERVATIONS, SIZES, TEXTS } from '../../constants';
import Coin from '../Wallet/coin';
import { FlatList } from 'react-native';
import ErrorReservation from '../Alert/modalSimple/errorReservation';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MenuProduct = ({ isVisible, onClose, shopData, productData, shop, reservationId, onPress }) => {
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
        <ProductCard
            item={item}
            shop={shop}
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

    const handleBuyPress = () => {
        if (amount > walletData.balance) {
            setShowErrorModal(true);
        } else {
            setShowConfirmModal(true);
        }
    };

    const handleConfirmBuy = async () => {
        setShowConfirmModal(false);
        setLoading(true);

        const products = selectedItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        try {
            dispatch(createInvoiceReservationThunk({ id: reservationId, data: { products } }))
                .unwrap()
                .then(() => {
                    dispatch(getAllReservationThunk({
                        searchQuery: null,
                        status: null,
                    }))
                    dispatch(getReservationDetailThunk(reservationId))
                        .then(() => {
                            setLoading(false)
                            setShowSuccessModal(true);
                            setTimeout(() => {
                                setShowSuccessModal(false);
                                onPress()
                                onClose()
                            }, 3000)
                        })

                }
                )
                .catch((error) => {
                    setLoading(false)
                    setErrorMsg(error.message);
                    setLoading(false);
                    setShowErrorReservationModal(true)
                })
            setAmount(0)
            setSelectedItems([]);
        } catch (error) {
            setErrorMsg(error.message);
            setLoading(false);
            setShowErrorReservationModal(true);
        }
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
                <View style={{ flex: 1 }}>
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
                        <Text style={{ fontWeight: '500', fontSize: SIZES.l, color: COLORS.black }}>Menu của quán {shopData.name}</Text>
                    </View>
                    <View style={{
                        padding: SIZES.m,
                        flexDirection: 'column',
                        gap: SIZES.s,
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: SIZES.l, color: COLORS.black }}>Danh sách đồ uống</Text>
                    </View>
                    <View style={{
                        alignItems: 'center'
                    }}>
                    <FlatList
                        data={productData}
                        numColumns={2}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        style={{
                        }}
                    />
                    </View>

                    {showConfirmModal && (
                        <ConfirmModal
                            showConfirmModal={showConfirmModal}
                            setShowConfirmModal={setShowConfirmModal}
                            confirmMsg={RESERVATIONS.confirmProduct}
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
                            errorMsg={RESERVATIONS.errorOrder}
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
                </View>
                {/* <View style={{
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
                </View> */}
                <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: SIZES.m }}>
                    <View>
                        <Coin size='mid' coin={amount} />
                    </View>
                    <Pressable
                        onPress={handleBuyPress}
                        disabled={amount === 0}
                        style={[BUTTONS.recMax, { alignItems: 'center', justifyContent: 'center', backgroundColor: amount === 0 ? COLORS.gray1 : COLORS.primary }]}>
                        <Text style={[TEXTS.content, { fontWeight: '500', color: amount === 0 ? COLORS.black : COLORS.white }]}>Thanh toán</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};


export default MenuProduct;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: SIZES.width,
        height: SIZES.height,
        // width: SIZES.width - SIZES.m * 2,
        // maxHeight: SIZES.height - SIZES.height / 5 - SIZES.m * 2,
        // margin: SIZES.m,
        // borderRadius: BRS.out,
        // shadowOffset: { width: 1, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 2,
        // elevation: 3,
        // position: 'absolute',
        // top: SIZES.height / 10,
        backgroundColor: COLORS.bgr,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonContainer: {
        height: SIZES.height / 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SIZES.s,
        backgroundColor: COLORS.white,
        borderBottomStartRadius: BRS.out,
        borderBottomEndRadius: BRS.out,
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
