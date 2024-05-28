import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Text, Pressable } from 'react-native';
import ItemCard from '../../components/Wallet/itemCard';
import { BUTTONS, COLORS, SIZES, TEXTS } from '../../constants';
import Coin from '../../components/Wallet/coin';
import { useDispatch, useSelector } from 'react-redux';
import { allItemsSelector, walletSelector } from '../../store/sellectors';
import { createItemsTransactionThunk, getAllTransactionThunk } from '../../store/apiThunk/transactionThunk';
import Loading from '../../components/Alert/modalSimple/loading';
import Success from '../../components/Alert/modalSimple/success';
import ConfirmModal from '../../components/Alert/confirmModal';
import ReloadBalance from '../../components/Wallet/reloadBalance';
import { useNavigation } from '@react-navigation/native';
import ErrorItems from '../../components/Alert/modalSimple/errorItems';
import { getWalletThunk } from '../../store/apiThunk/walletThunk';
import ErrorReservation from '../../components/Alert/modalSimple/errorReservation';
import { getAllItemsThunk } from '../../store/apiThunk/itemThunk';
import { PLATFORMS } from '../../constants/variable';

const Items = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const itemsData = useSelector(allItemsSelector);
    const walletData = useSelector(walletSelector);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showErrorReservationModal, setShowErrorReservationModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleReload = async () => {
        await dispatch(getWalletThunk());
        await dispatch(getAllTransactionThunk({ type: null }))
    }
    const handleContinue = () => {
        setShowErrorReservationModal(false)
        handleReload();
    }

    const handleBack = () => {
        navigation.goBack()
    }

    useEffect(() => {
        if (!itemsData) {
            dispatch(getAllItemsThunk())
                .unwrap()
                .then(() => setLoading(false))
                .catch(() => setLoading(false));
        }
    }, []);
    useEffect(() => {
        if (!walletData) {
            dispatch(getWalletThunk())
                .unwrap()
                .then(() => setLoading(false))
                .catch(() => setLoading(false));
        }
    }, []);


    const updateAmount = (price) => {
        setAmount(prevAmount => prevAmount + price);
    };

    const handleQuantityChange = (item, quantity) => {
        const selected = [...selectedItems];
        const index = selected.findIndex(i => i.itemId === item.itemId);

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
        {
            amount > walletData.balance ? (
                setShowErrorModal(true)
            ) :
                (
                    setShowConfirmModal(true)
                )
        }

    };

    const handleConfirmBuy = async () => {
        setShowConfirmModal(false);
        setLoading(true);

        const items = selectedItems.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity
        }));

        dispatch(createItemsTransactionThunk({ items }))
            .unwrap()
            .then((response) => {
                setAmount(0);
                setSelectedItems([]);
                handleReload();

                setLoading(false);
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 2000);

            })
            .catch(error => {
                setErrorMsg(error.message)
                setLoading(false);
                setShowErrorReservationModal(true);
            });
    };
    //loading balance
    const handleReloadBalance = (isLoading) => {
        setIsLoadingBalance(isLoading);
    };

    const handleErrorBuy = () => {
        navigation.navigate('Topup')
    }
    return (
        <View style={styles.container}>
            {showConfirmModal && (
                <ConfirmModal
                    showConfirmModal={showConfirmModal}
                    setShowConfirmModal={setShowConfirmModal}
                    confirmMsg="Xác nhận mua quà với "
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
                    onReservation={handleContinue}
                    onBackHome={handleBack} />

            )}
            <View style={{ alignItems: "center", paddingTop: SIZES.s }}>
                <Image style={styles.itemsImage} source={require('../../../assets/items.png')} />
            </View>
            {isLoadingBalance ? (
                <Loading isModal={false} />
            ) : (
                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', padding: SIZES.s / 2 - 1, }}>
                    <Text style={{ color: COLORS.primary, fontSize: 24, fontWeight: 'bold' }} >Số dư: </Text>
                    <Coin coin={walletData.balance} size='mid' />
                </View>
            )}
            <View style={[styles.items]}>
                <FlatList
                    data={itemsData.items}
                    numColumns={3}
                    ListEmptyComponent={
                        <View style={{
                            alignItems: 'center', justifyContent: 'center',
                            padding: SIZES.m,
                            marginLeft: SIZES.width / 6,
                        }}>
                            <Text style={TEXTS.content} >{PLATFORMS.noItems}</Text>
                            <Image alt='noInfo rmation' source={require('../../../assets/noinfor.png')} style={{
                                height: SIZES.height / 6,
                                width: SIZES.height / 6,
                                alignSelf: 'center',
                            }} />
                        </View>
                    }
                    renderItem={({ item }) => (
                        <ItemCard
                            item={item}
                            shop={true}
                            updateAmount={updateAmount}
                            resetQuantity={showSuccessModal}
                            onQuantityChange={(quantity) => handleQuantityChange(item, quantity)}
                        />
                    )}
                    keyExtractor={item => item.itemId.toString()}
                />
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: SIZES.m }}>
                <View>
                    <Coin size='mid' coin={amount} />
                </View>
                <Pressable
                    onPress={handleBuyPress}
                    disabled={amount === 0}
                    style={[BUTTONS.recMax, { alignItems: 'center', justifyContent: 'center', backgroundColor: amount === 0 ? COLORS.gray1 : COLORS.primary }]}>
                    <Text style={[TEXTS.content, { fontWeight: '500', color: amount === 0 ? COLORS.black : COLORS.white }]}>Mua</Text>
                </Pressable>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.m,
        backgroundColor: COLORS.bgr,
    },
    itemsImage: {
        height: 120,
        width: 120,
    },
    items: {
        alignItems: 'center',
        height: '68%',
    },
    buyButton: {
        width: '50%',
        borderRadius: SIZES.s,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.tertiary,
    },
    buyButtonText: {
        fontSize: SIZES.m,
        fontWeight: 'bold',
    },
});

export default Items;
