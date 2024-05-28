import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { ALERTS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Coin from '../../components/Wallet/coin';
import formatTimeTransaction from '../../components/Wallet/formatTimeTransaction';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getTransactionDetailThunk } from '../../store/apiThunk/transactionThunk';
import SkeletonArea from '../../components/Alert/skeletonArea';
import { NativeBaseProvider } from 'native-base';
import { getPromotionFromShopThunk } from '../../store/apiThunk/promotionThunk';
import { getPetCoffeeShopDetailThunk } from '../../store/apiThunk/petCoffeeShopThunk';
import { getPetDetailThunk } from '../../store/apiThunk/petThunk';
import { set } from 'date-fns';

const TransactionDetail = ({ route }) => {
    const { transaction } = route.params;

    const [transactionData, setTransactionData] = useState(transaction)

    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [reserve, setReserve] = useState(false)
    const [petData, setPetData] = useState(null)

    useEffect(() => {
        setLoading(true)
        dispatch(getTransactionDetailThunk(transaction.id))
            .unwrap()
            .then((res) => {
                setLoading(false)
                setTransactionData(res)
                if (res.transactionType === 'Reserve') {
                    dispatch(getPetCoffeeShopDetailThunk({
                        id: res.shop.id,
                        latitude: 100,
                        longitude: 10,
                    }))
                        .unwrap()
                        .then(() => setReserve(true))
                        .catch(() => setReserve(false))
                }
                if (res.transactionType === 'Donate') {
                    dispatch(getPetDetailThunk(res.petId))
                        .unwrap()
                        .then((response) => {
                            setPetData(response)
                            setReserve(true)
                        })
                        .catch(() => setReserve(false))
                }
            })
            .catch((err) => console.log(err))
    }, [])

    const renderIcon = () => {
        switch (transaction.transactionType) {
            case 'Reserve':
                return 'cafe-outline';
            case 'TopUp':
                return 'cash-outline';
            case 'BuyItem':
                return 'diamond-outline';
            case 'Donate':
                return 'gift-outline';
            case 'Refund':
                return 'refresh-circle-outline';
            case 'AddProducts':
                return 'bag-add-outline';
            case 'RemoveProducts':
                return 'bag-remove-outline';
            default:
                return 'alert-circle-outline';
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Chi tiết giao dịch',
            headerLeft: () => (
                <Pressable style={{ paddingRight: SIZES.xxl }} onPress={() => {
                    navigation.goBack()
                    navigation.navigate('Lịch sử giao dịch', { res: true })
                }}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </Pressable>
            ),
            //về home
            headerRight: () => (
                <Pressable style={{ paddingRight: SIZES.m }} onPress={() => {
                    navigation.navigate('TabGroup', { screen: 'Customer' })
                }}>
                    <Ionicons name="home" size={24} color={COLORS.black} />
                </Pressable>
            ),
        });
    }, []);

    const statusMap = {
        Done: { text: ALERTS.success, color: COLORS.success },
        Cancel: { text: ALERTS.cancel, color: COLORS.error },
        Processing: { text: ALERTS.processing, color: COLORS.yellow },
        Return: { text: ALERTS.return, color: COLORS.primary }

    };
    const status = statusMap[transaction.transactionStatus] || { text: '', color: COLORS.black }

    return (
        <NativeBaseProvider>
            <ScrollView style={styles.container}>
                <View style={{
                    minHeight: SIZES.height - SIZES.height / 6.5
                }}>
                    <View style={{
                        padding: SIZES.m,
                        flexDirection: 'column',
                        gap: SIZES.s,
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: SIZES.l, color: COLORS.black }}>{transaction.content}</Text>
                        <View style={{
                            borderWidth: 1,
                            borderColor: COLORS.gray1,
                            borderRadius: SIZES.s,
                            padding: SIZES.m,
                            backgroundColor: COLORS.white,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: SIZES.s,
                            }}>
                                <View style={{ backgroundColor: COLORS.primary100, borderRadius: 36, width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons name={renderIcon()} size={ICONS.l} color={COLORS.primary} />
                                </View>
                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: 5,
                                    width: SIZES.width - SIZES.m * 4 - 72 - SIZES.s,
                                }}>
                                    <Text style={[{ color: COLORS.black, fontSize: SIZES.l, alignItems: 'center', }]}>
                                        {transaction.transactionType === 'TopUp' && `${transaction.content} ${transaction.creator.fullName}`}
                                        {transaction.transactionType === 'Reserve' && `${transaction.content} tại quán ${transaction.shop.name}`}
                                        {transaction.transactionType === 'AddProducts' && `${transaction.content} tại quán ${transaction.shop.name}`}
                                        {transaction.transactionType === 'RemoveProducts' && `${transaction.content} `}
                                        {transaction.transactionType === 'BuyItem' && `${transaction.content} thú cưng`}
                                        {transaction.transactionType === 'Donate' && `${transaction.content} ${transaction.petName}`}
                                        {transaction.transactionType === 'Refund' && `${transaction.content} `}
                                    </Text>
                                    <View style={styles.column}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <Coin size='mid' coin={transaction.amount} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* ======================Thời gian====================== */}
                            <View style={{
                                paddingTop: SIZES.s,
                                flexDirection: 'column',
                                gap: SIZES.s / 2,
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Trạng thái</Text>
                                    <Text style={[TEXTS.content, { color: status.color, fontWeight: '500' }]}>{status.text}</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Thời gian</Text>
                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{formatTimeTransaction(transaction.createdAt)}</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Mã giao dịch</Text>
                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transaction.referenceTransactionId}</Text>
                                </View>
                            </View>
                            <View>
                            </View>
                        </View>
                        {/* ======================Thông tin cá nhân====================== */}
                        <View style={{
                            borderWidth: 1,
                            borderColor: COLORS.gray1,
                            borderRadius: SIZES.s,
                            padding: SIZES.m,
                            backgroundColor: COLORS.white,
                        }}>
                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>
                                Thông tin người dùng
                            </Text>
                            <View style={{
                                paddingTop: SIZES.s,
                                flexDirection: 'column',
                                gap: SIZES.s / 2,
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Tên người dùng</Text>
                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transaction.creator.fullName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Email</Text>
                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transaction.creator.email}</Text>
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Số điện thoại</Text>
                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transaction.creator.phoneNumber}</Text>
                                </View>
                            </View>
                            <View>
                            </View>
                        </View>
                        {loading ? (
                            <SkeletonArea />
                        ) : (
                            <>
                                {/* ======================Thông tin đặt chỗ====================== */}
                                {transactionData?.transactionType === 'Reserve' && (
                                    <View style={{
                                        borderWidth: 1,
                                        borderColor: COLORS.gray1,
                                        borderRadius: SIZES.s,
                                        padding: SIZES.m,
                                        backgroundColor: COLORS.white,
                                    }}>
                                        <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>
                                            Thông tin đặt chỗ
                                        </Text>
                                        <View style={{
                                            paddingTop: SIZES.s,
                                            flexDirection: 'column',
                                            gap: SIZES.s / 2,
                                        }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black, }]}>Địa điểm</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.name}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Email</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.email}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Số điện thoại</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.phone}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Mã đặt chỗ</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.reservation.code}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Mô tả</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.reservation.bookingSeat} người, Tầng {transactionData?.reservation?.areaResponse?.order}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}></Text>
                                                <Pressable
                                                    onPress={() => {
                                                        navigation.navigate('TabGroup', {
                                                            screen: 'ReservationHistory', params: {
                                                                code: transactionData?.reservation.code
                                                            }
                                                        })
                                                    }}
                                                    style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s, paddingTop: SIZES.s }}>
                                                    <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' }]}>
                                                        Xem thông tin đặt chỗ
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View>
                                        </View>
                                    </View>
                                )}
                                {/* ======================Thông tin đặt đồ uống====================== */}
                                {transactionData?.transactionType === 'AddProducts' && (
                                    <View style={{
                                        borderWidth: 1,
                                        borderColor: COLORS.gray1,
                                        borderRadius: SIZES.s,
                                        padding: SIZES.m,
                                        backgroundColor: COLORS.white,
                                    }}>
                                        <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>
                                            Thông tin đặt đồ uống
                                        </Text>
                                        <View style={{
                                            paddingTop: SIZES.s,
                                            flexDirection: 'column',
                                            gap: SIZES.s / 2,
                                        }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black, }]}>Địa điểm</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.name}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Email</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.email}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Số điện thoại</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.phone}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Mã đặt chỗ</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.reservation.code}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Mô tả</Text>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>Đặt thêm {transactionData?.reservation?.products?.length} đồ uống</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black }]}></Text>
                                                <Pressable onPress={() => {
                                                    navigation.navigate('TabGroup', {
                                                        screen: 'ReservationHistory', params: {
                                                            code: transactionData?.reservation.code
                                                        }
                                                    })
                                                }}
                                                    style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s, paddingTop: SIZES.s }}>
                                                    <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' }]}>
                                                        Xem thông tin đặt chỗ
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View>
                                        </View>
                                    </View>
                                )}
                                {/* ======================Thông tin mua quà tặng====================== */}
                                {transactionData?.transactionType === 'BuyItem' && (
                                    <View style={{
                                        borderWidth: 1,
                                        borderColor: COLORS.gray1,
                                        borderRadius: SIZES.s,
                                        padding: SIZES.m,
                                        backgroundColor: COLORS.white,
                                    }}>
                                        <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>
                                            Thông tin mua quà tặng
                                        </Text>
                                        <View style={{
                                            paddingTop: SIZES.s,
                                            flexDirection: 'column',
                                            gap: SIZES.s / 2,
                                        }}>
                                            {transactionData?.transactionItems.map((item, index) => (
                                                <View key={index} style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={[TEXTS.content, { color: COLORS.black, }]}>{item.itemName}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '30%' }}>
                                                        <Coin coin={item.price} size='min' />
                                                        <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>x{item.totalItem}</Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                        <View>
                                        </View>
                                    </View>
                                )}
                                {/* ======================Thông tin tặng quà cho thú cưng====================== */}
                                {transactionData?.transactionType === 'Donate' && (
                                    <>
                                        {/* ======================Thông tin thú cưng====================== */}
                                        <View style={{
                                            borderWidth: 1,
                                            borderColor: COLORS.gray1,
                                            borderRadius: SIZES.s,
                                            padding: SIZES.m,
                                            backgroundColor: COLORS.white,
                                        }}>
                                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>
                                                Thông tin thú cưng nhận quà
                                            </Text>
                                            <View style={{
                                                paddingTop: SIZES.s,
                                                flexDirection: 'column',
                                                gap: SIZES.s / 2,
                                            }}>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={[TEXTS.content, { color: COLORS.black, }]}>Thú cưng</Text>
                                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.petName}</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={[TEXTS.content, { color: COLORS.black, }]}>Thú cưng của</Text>
                                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.name}</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Email</Text>
                                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.email}</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Số điện thoại</Text>
                                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{transactionData?.shop.phone}</Text>
                                                </View>
                                            </View>
                                            <View>
                                            </View>
                                        </View>
                                        {/* ======================Thông tin tặng quà====================== */}
                                        <View style={{
                                            borderWidth: 1,
                                            borderColor: COLORS.gray1,
                                            borderRadius: SIZES.s,
                                            padding: SIZES.m,
                                            backgroundColor: COLORS.white,
                                        }}>
                                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>
                                                Thông tin quà đã tặng
                                            </Text>
                                            <View style={{
                                                paddingTop: SIZES.s,
                                                flexDirection: 'column',
                                                gap: SIZES.s / 2,
                                            }}>
                                                {transactionData?.transactionItems?.map((item, index) => (
                                                    <View key={index} style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text style={[TEXTS.content, { color: COLORS.black, }]}>{item.itemName}</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '30%' }}>
                                                            <Coin coin={item.price} size='min' />
                                                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>x{item.totalItem}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                            <View>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </>
                        )}

                    </View>
                </View>
                {/* ======================Nạp thêm====================== */}
                {transaction.transactionType === 'TopUp' && (
                    <View style={styles.cancel}>
                        <Pressable style={{
                            width: SIZES.width - SIZES.s * 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: SIZES.s,
                        }}
                            onPress={() => { navigation.navigate('Topup') }}>
                            <View
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recFull]}
                            >
                                <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Nạp thêm</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
                {/* ======================Đặt tiếp chỗ====================== */}
                {transaction.transactionType === 'Reserve' && (
                    <View style={styles.cancel}>
                        <Pressable
                            disabled={!reserve}
                            style={{
                                width: SIZES.width - SIZES.s * 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: SIZES.s,
                            }} onPress={() => {

                                navigation.navigate('Reservation', {
                                    areaId: transaction.reservation.areaResponse.areaId,
                                    price: transaction.reservation.areaResponse.pricePerHour,
                                    order: transaction.reservation.areaResponse.order,
                                    areaDatas: transaction.reservation.areaResponse
                                });
                            }}>
                            <View
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: !reserve ? COLORS.gray1 : COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recFull]}
                            >
                                <Text style={{ fontSize: SIZES.m, color: !reserve ? COLORS.black : COLORS.white, fontWeight: '500' }}>Đặt tiếp</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
                {/* ======================Đặt tiếp đồ uống====================== */}
                {transaction.transactionType === 'AddProducts' && (
                    <View style={styles.cancel}>
                        <Pressable
                            style={{
                                width: SIZES.width - SIZES.s * 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: SIZES.s,
                            }}
                            onPress={() => navigation.navigate('Lịch sử giao dịch')}>
                            <View
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recFull]}
                            >
                                <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Trở về</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
                {/* ======================Mua thêm quà tặng====================== */}
                {transaction.transactionType === 'BuyItem' && (
                    <View style={styles.cancel}>
                        <Pressable style={{
                            width: SIZES.width - SIZES.s * 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: SIZES.s,
                        }}
                            onPress={() => { navigation.navigate('Items') }}>
                            <View
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recFull]}
                            >
                                <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Mua thêm</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
                {/* ======================Tặng quà tặng====================== */}
                {transaction.transactionType === 'Donate' && (
                    <View style={styles.cancel}>
                        <Pressable
                            disabled={!reserve}
                            style={{
                                width: SIZES.width - SIZES.s * 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: SIZES.s,
                            }} onPress={() => {
                                navigation.navigate('PetDetail', {
                                    id: transaction.petId,
                                    petDatas: petData,
                                });
                            }}>
                            <View
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: !reserve ? COLORS.gray1 : COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recFull]}
                            >
                                <Text style={{ fontSize: SIZES.m, color: !reserve ? COLORS.black : COLORS.white, fontWeight: '500' }}>Tặng tiếp</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
                {/* ======================Refurn====================== */}
                {transaction.transactionType === 'Refund' && (
                    <View style={styles.cancel}>
                        <Pressable style={{
                            width: SIZES.width - SIZES.s * 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: SIZES.s,
                        }}
                            onPress={() => navigation.goBack()}>
                            <View
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recFull]}
                            >
                                <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Trở về</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
                {/* ======================Refurn đồ uống====================== */}
                {transaction.transactionType === 'RemoveProducts' && (
                    <View style={styles.cancel}>
                        <Pressable style={{
                            width: SIZES.width - SIZES.s * 2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: SIZES.s,
                        }}
                            onPress={() => navigation.goBack()}>
                            <View
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recFull]}
                            >
                                <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Trở về</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.bgr,
        flex: 1,
    },
    cancel: {
        height: SIZES.height / 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SIZES.s,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray1,
    },
});

export default TransactionDetail;
