import { FlatList, Image, Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopupCard from '../../components/Topup/topupCard';
import { BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../constants';
import { createTopupThunk } from '../../store/apiThunk/topupThunk';
import { useDispatch, useSelector } from 'react-redux';
import formatCoin from './../../components/Wallet/formatCoin';
import ConfirmModal from '../../components/Alert/confirmModal';
import Loading from '../../components/Alert/modalSimple/loading';
import Success from '../../components/Alert/modalSimple/success';
import Coin from '../../components/Wallet/coin';
import ReloadBalance from '../../components/Wallet/reloadBalance';
import { walletSelector } from '../../store/sellectors';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getWalletThunk } from '../../store/apiThunk/walletThunk';
import LoadingMin from '../../components/Alert/modalSimple/loadingMin';
import { useNavigation } from '@react-navigation/native';
import { getAllTransactionThunk } from '../../store/apiThunk/transactionThunk';

const Topup = () => {
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const walletDatas = useSelector(walletSelector);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [walletData, setWalletData] = useState(walletDatas)
    const [showWebView, setShowWebView] = useState(false);
    const [url, setUrl] = useState('');
    const navigation = useNavigation()

    useEffect(() => {
        setIsLoadingBalance(true)
        dispatch(getWalletThunk())
            .unwrap()
            .then((res) => {
                setWalletData(res)
            })
            .catch((err) => console.log(err))
            .finally(() =>
                setIsLoadingBalance(false)
            )
    }, [showWebView])

    const handleAmountSelection = (price) => {
        setAmount(price);
    };

    const handlePayment = async () => {
        if (amount > 0) {
            try {
                const data = {
                    paymentContent: "Nạp tiền vào ví",
                    requiredAmount: amount
                };
                setShowConfirmModal(false)
                setLoading(true);
                dispatch(createTopupThunk(data))
                    .unwrap()
                    .then((response) => {
                        setLoading(false);
                        setUrl(response?.url);
                        setShowWebView(true);
                    })
                    .catch(error => {
                        console.error('Error creating topup:', error);
                        setLoading(false);
                    });
            } catch (error) {
                console.error("Topup failed:", error);
                setLoading(false);
            }
        }
    };
    const topupData = [
        {
            id: 1,
            price: 20000,
            coin: 2000,
            bonus: 0,
        },
        {
            id: 2,
            price: 50000,
            coin: 5000,
            bonus: 0,
        },
        {
            id: 3,
            price: 100000,
            coin: 10000,
            bonus: 60,
        },
        {
            id: 4,
            price: 200000,
            coin: 20000,
            bonus: 155,
        },
        {
            id: 5,
            price: 500000,
            coin: 50000,
            bonus: 450,
        },
        {
            id: 6,
            price: 750000,
            coin: 75000,
            bonus: 775,
        },
        {
            id: 7,
            price: 1000000,
            coin: 100000,
            bonus: 1975,
        },
        {
            id: 8,
            price: 1500000,
            coin: 150000,
            bonus: 1975,
        },
        {
            id: 9,
            price: 2000000,
            coin: 200000,
            bonus: 1975,
        },
        {
            id: 10,
            price: 3000000,
            coin: 300000,
            bonus: 1975,
        },
        {
            id: 11,
            price: 4000000,
            coin: 400000,
            bonus: 1975,
        },
        {
            id: 12,
            price: 5000000,
            coin: 500000,
            bonus: 1975,
        },
    ];
    const handleConfirm = () => {
        setShowConfirmModal(true)
    }

    const handleBack = () => {
        setShowWebView(false)
    }

    const handleNavigationChange = async (navState) => {
        if (navState.url === "https://pet-coffee-platform.vercel.app/transferStatus") {
            setTimeout(() => {
                setShowWebView(false);
                setAmount(0)
                navigation.navigate('Lịch sử giao dịch');

            }, 2200);
        }
    };

    return (
        <View style={styles.container}>
            {showConfirmModal && (
                <ConfirmModal
                    showConfirmModal={showConfirmModal}
                    setShowConfirmModal={setShowConfirmModal}
                    confirmMsg="Xác nhận nạp "
                    coin={amount}
                    onConfirm={handlePayment}
                />
            )}
            {loading && (
                <Loading isModal={true} />
            )}
            {showSuccessModal && (
                <Success isModal={true} />
            )}
            {showWebView ? (
                <View style={{ flex: 1, position: 'relative', backgroundColor: COLORS.primary }}>
                    <WebView
                        source={{ uri: url }}
                        onNavigationStateChange={handleNavigationChange}
                    />
                    <TouchableOpacity
                        onPress={handleBack}
                        style={[BUTTONS.cub, {
                            position: 'absolute',
                            top: '1%',
                            left: '1%',
                            paddingVertical: SIZES.s,
                            backgroundColor: COLORS.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: SIZES.s
                        }]}
                    >
                        <Ionicons name='arrow-back-circle' size={ICONS.m} color={COLORS.white} />
                    </TouchableOpacity>

                </View>
            ) : (
                <View style={{
                    backgroundColor: COLORS.bgr,
                }}>
                    <View style={{ alignItems: "center", paddingTop: SIZES.s, }}>
                        <Image style={styles.itemsImage} source={require('../../../assets/items.png')} />
                    </View>
                    {isLoadingBalance ? (
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', padding: SIZES.s / 2 - 1, }}>
                            <Text style={{ color: COLORS.primary, fontSize: 24, fontWeight: 'bold' }} >Số dư: </Text>
                            <View >
                                <LoadingMin />
                            </View>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', padding: SIZES.s / 2 - 1, }}>
                            <Text style={{ color: COLORS.primary, fontSize: 24, fontWeight: 'bold' }} >Số dư: </Text>
                            <Coin coin={walletData.balance} size='mid' />
                        </View>
                    )
                    }
                    <View
                        style={[
                            styles.items,
                        ]}
                    >
                        <FlatList
                            data={topupData}
                            numColumns={3}
                            renderItem={({ item }) => <TopupCard item={item} onSelect={handleAmountSelection} selectedPrice={amount} />}
                            keyExtractor={(item) => item.id.toString()}
                        />
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <Text>Giá trị quy đổi: 1,000 VNĐ = </Text>
                            <Coin coin={100} size='min' />
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: SIZES.m }}>
                        <View>
                            <Text style={TEXTS.title}>{formatCoin(amount)} VNĐ</Text>
                        </View>
                        <Pressable
                            onPress={handleConfirm}
                            disabled={amount === 0}
                            style={[BUTTONS.recMax, { alignItems: 'center', justifyContent: 'center', backgroundColor: amount === 0 ? COLORS.gray1 : COLORS.primary }]}>
                            <Text style={[TEXTS.content, { fontWeight: '500', color: amount === 0 ? COLORS.black : COLORS.white }]}>Thanh toán</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View >
    )
}

export default Topup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgr
    },
    itemsImage: {
        height: 120,
        width: 120,
    },
    items: {

        alignItems: 'center',
        height: '68%'
    },
    buyButton: {
        padding: SIZES.m,
        borderRadius: SIZES.s,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
    },

    buyButtonText: {
        fontSize: SIZES.m,
        fontWeight: 'bold',
        color: COLORS.white,
    },
})