import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import formatTimeReservation from '../../components/Reservation/formatTimeReservation';
import formatDayReservation from '../../components/Reservation/formatDayReservation';
import { petCoffeeShopDetailSelector, productFromShopSelector, reservationDetailSelector } from '../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import Coin from '../../components/Wallet/coin';
import { ALERTS, AVATARS, BUTTONS, COLORS, ICONS, RESERVATIONS, SIZES, TEXTS } from '../../constants';
import ProductCard from '../../components/Reservation/productCard';
import { getProductFromShopThunk } from '../../store/apiThunk/productThunk';
import Loading from '../../components/Alert/modalSimple/loading';
import MenuProduct from '../../components/Reservation/menuProduct';
import { deleteInvoiceReservationThunk, getAllReservationThunk, getReservationDetailThunk, rateReservationThunk, refundReservationThunk } from '../../store/apiThunk/reservationThunk';
import ConfirmModal from '../../components/Alert/confirmModal';
import Success from '../../components/Alert/modalSimple/success';
import ErrorReservation from '../../components/Alert/modalSimple/errorReservation';
import { useNavigation } from '@react-navigation/native';
import { getWalletThunk } from '../../store/apiThunk/walletThunk';
import AntDesign from 'react-native-vector-icons/AntDesign';

import QRCodeGenerator from './QRCodeGenerator';

const ReservationDetail = ({ route }) => {
    const { reservationData, userData, shopData, areaData, reservationNew, shop } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const productData = useSelector(productFromShopSelector);
    const reservationDataProduct = useSelector(reservationDetailSelector)
    const [modalVisible, setModalVisible] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoice, setInvoice] = useState(reservationData.products);
    const [totalPrice, setTotalPrice] = useState(reservationData.totalPrice);

    const [showArea, setShowArea] = useState(false);
    const [check, setCheck] = useState(false)
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showConfirmProductModal, setShowConfirmProductModal] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [reload, setReload] = useState(false);
    const [product, setProduct] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [showErrorReservationModal, setShowErrorReservationModal] = useState(false);
    const [reservationStatus, setReservationStatus] = useState(reservationData.status)
    const maxRate = [1, 2, 3, 4, 5];
    const [defaultRate, setDefaultRate] = useState(reservationData.rate != null ? reservationData.rate : 0);
    const [showRating, setShowRating] = useState(false)
    const [disableRate, setDisableRate] = useState(reservationData.rate != null ? true : false)

    useEffect(() => {
        handleReload()
        setReservationStatus('Returned')
    }, [reload])

    useEffect(() => {
        if (product) {
            setInvoice(reservationDataProduct.products)
            setTotalPrice(reservationDataProduct.totalPrice)
            setReservationStatus(reservationDataProduct.status)
        } else {
            setInvoice(reservationData.products)
            setTotalPrice(reservationData.totalPrice)
            setReservationStatus(reservationData.status)
        }

    }, [product, reservationData])


    const handleReload = async () => {
        await dispatch(getWalletThunk());
        await dispatch(getAllReservationThunk({
            searchQuery: null,
            status: null,
        }))
        await dispatch(getReservationDetailThunk(reservationData.id))
    }

    const CustomRatingBar = () => {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SIZES.s / 2,
                paddingLeft: SIZES.s,
            }}>
                {maxRate.map(item => {
                    return (
                        <TouchableOpacity
                            disabled={disableRate}
                            activeOpacity={0.7}
                            style={{}}
                            key={item}
                            onPress={() => [setDefaultRate(item), handleRate(item)]}>
                            <AntDesign
                                name={item <= defaultRate ? 'star' : 'staro'}
                                color={COLORS.yellow}
                                size={ICONS.l}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    useLayoutEffect(() => {
        {
            reservationNew && (
                navigation.setOptions({
                    headerTitle: 'Chi tiết đặt chỗ',
                    headerLeft: () => (
                        <Pressable style={{ paddingRight: SIZES.xxl - SIZES.s }} onPress={() => {
                            navigation.navigate('TabGroup', { screen: 'ReservationHistory', params: { reloadGoHome: true } });
                        }}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                        </Pressable>
                    ),
                })
            )
        }

    }, [])

    const handleCancelInvoice = async () => {
        const priceProduct = invoice?.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        setLoading(true);
        setShowConfirmProductModal(false);
        await dispatch(deleteInvoiceReservationThunk(reservationData.id))
            .then(() => {
                setReload(!reload)
                setLoading(false);
                setInvoice([])
                setTotalPrice(totalPrice - priceProduct)
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 3000)
            })
    };

    const handleCancel = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        dispatch(refundReservationThunk(reservationData.id))
            .unwrap()
            .then((response) => {
                if (response?.message != '') {
                    setReload(!reload)
                    setLoading(false)
                    setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 2000)
                    setCheck(true)
                } else {
                    setErrorMsg(response?.message);
                    setLoading(false);
                    setShowErrorReservationModal(true);
                }
            })
            .catch((error) => {
                setErrorMsg(error.message);
                setLoading(false);
                setShowErrorReservationModal(true);
            });
    };
    const handleRate = async (item) => {
        setLoading(true);
        const data = {
            rate: item,
            comment: '',
        }
        await dispatch(rateReservationThunk({ id: reservationData.id, data }))
            .unwrap()
            .then((response) => {
                if (response?.message != '') {
                    setLoading(false)
                    setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 2000)
                    setDisableRate(true)
                    dispatch(getReservationDetailThunk(reservationData.id))
                } else {
                    setErrorMsg(response?.message);
                    setLoading(false);
                    setShowErrorReservationModal(true);
                }
            })
            .catch((error) => {
                setErrorMsg(error.message);
                setLoading(false);
                setShowErrorReservationModal(true);
            });
    }
    const handleBack = () => {
        setShowErrorReservationModal(false)
        setReservationStatus('Returned')
    };

    const handleGoHome = () => {
        navigation.navigate('TabGroup', { screen: 'ReservationHistory' })
    }
    const handleCheck = () => {
        navigation.navigate('TabGroup', { screen: 'ReservationHistory' })
    }
    const handleConfirm = async () => {
        setShowConfirmModal(true);
    };

    const handleConfirmProduct = async () => {
        setShowConfirmProductModal(true);
    };

    const handleShowInvoice = () => {
        setShowInvoice(!showInvoice)
    };
    const calculateHourDifference = (start, end) => {
        let hour = 0;
        if (start && end) {
            const starts = new Date(start).getUTCHours();
            const ends = new Date(end).getUTCHours();
            hour = ends - starts;
        }
        return hour
    };

    const handlePressMenu = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };


    useEffect(() => {
        dispatch(getProductFromShopThunk(shopData.id))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, []);

    const renderReservationProducts = (reservationData) => {
        return reservationData.map((product, index) => (
            <View key={index} style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', }}>
                <Text style={[TEXTS.subContent, { color: COLORS.black }]}>{product.name} x{product.quantity}</Text>
                <Coin coin={product.quantity * product.price} size='min' />
            </View>
        ));
    };


    const renderReservationInvoice = (reservationData) => {
        return reservationData.map((product, index) => (
            <View key={index}>
                <ProductCard item={product}
                    shop={false}
                />
            </View>

        ));
    };

    const reTotal = areaData.pricePerHour * reservationData.bookingSeat * calculateHourDifference(reservationData.startTime, reservationData.endTime)
    const percent = (reservationData.discount / reTotal) * 100


    const statusMap = {
        Success: { text: ALERTS.orderSuccess, color: COLORS.success },
        Returned: { text: ALERTS.orderRefund, color: COLORS.error },
        Overtime: { text: ALERTS.orderOvertime, color: COLORS.error },
    };

    const status = statusMap[reservationData.status] || { text: '', color: COLORS.black }

    const reservationStartDate = new Date(reservationData.startTime);
    const currentStartDate = new Date();
    currentStartDate.setHours(0, 0, 0, 0);
    reservationStartDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(currentStartDate.getTime() + 24 * 60 * 60 * 1000);
    const oneDay = nextDay < reservationStartDate;

    const confirmMess = reservationData.isTotallyRefund
        ? RESERVATIONS.cancelOrderFull
        : shop
            ? RESERVATIONS.cancelOrderShop
            : !oneDay
                ? RESERVATIONS.cancelOrder60
                : RESERVATIONS.cancelOrder100;

    return (
        <View style={styles.container}>
            {showConfirmModal && (
                <ConfirmModal
                    showConfirmModal={showConfirmModal}
                    setShowConfirmModal={setShowConfirmModal}
                    confirmMsg={confirmMess}
                    onConfirm={handleCancel}
                />
            )}
            {showConfirmProductModal && (
                <ConfirmModal
                    showConfirmModal={showConfirmProductModal}
                    setShowConfirmModal={setShowConfirmProductModal}
                    confirmMsg={RESERVATIONS.cancelInvoice}
                    onConfirm={handleCancelInvoice}
                />
            )}
            {loading && (
                <Loading isModal={true} />
            )}
            {showSuccessModal && (
                <Success isModal={true} />
            )}
            {showErrorReservationModal && (
                <ErrorReservation
                    showErrorModal={showErrorReservationModal}
                    setShowErrorModal={setShowErrorReservationModal}
                    errorMsg={errorMsg}
                    onBackHome={handleBack} />
            )}
            <ScrollView style={{
                backgroundColor: COLORS.bgr,
                flexGrow: 1,
            }}>
                <View style={{
                    padding: SIZES.m,
                    flexDirection: 'column',
                    gap: SIZES.s,
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.l, color: COLORS.black }}>
                        {shop ? 'Thông tin chỗ đã đặt' : 'Thông tin đã đặt chỗ của bạn'}
                    </Text>
                    <View style={{
                        borderWidth: 1,
                        borderColor: COLORS.gray1,
                        borderRadius: SIZES.s,
                        padding: SIZES.m,
                        backgroundColor: COLORS.white,
                    }}>
                        {/* ===============Thông tin quán================ */}
                        <View style={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: SIZES.s,
                            borderBottomWidth: 1,
                            borderColor: COLORS.gray1,
                            paddingBottom: SIZES.s,
                        }}>
                            <View style={{
                                height: SIZES.height / 6,
                                width: SIZES.height / 6,
                                alignSelf: 'center',
                            }}>
                                <QRCodeGenerator data={reservationData.code} />
                            </View>
                            {shop ? (
                                <>
                                    <Text style={[{ color: COLORS.black, fontSize: SIZES.xl, alignItems: 'center', fontWeight: 'bold' }]}>{userData.fullName}</Text>
                                    <Text style={[TEXTS.subContent, { color: COLORS.gray3 }]}>{userData.email}</Text>
                                    <Text style={[TEXTS.subContent, { color: COLORS.gray3 }]}>{userData.address}</Text>
                                    <Text style={[TEXTS.subContent, { color: COLORS.gray3 }]}>{userData.phoneNumber}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={[{ color: COLORS.black, fontSize: SIZES.xl, alignItems: 'center', fontWeight: 'bold' }]}>{shopData.name}</Text>
                                    <Text style={[TEXTS.subContent, { color: COLORS.gray3 }]}>{shopData.location}</Text>
                                </>
                            )}
                        </View>
                        {/* ===============Ngày giờ================ */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            gap: SIZES.m * 2,
                            paddingTop: SIZES.s,
                            borderBottomWidth: 1,
                            borderColor: COLORS.gray1,
                            paddingBottom: SIZES.s,
                        }}>
                            <View style={{
                                flexDirection: 'column',
                                gap: 5,
                            }}>
                                <Text style={[TEXTS.subContent, { color: COLORS.blackBold, fontWeight: '500' }]}>Ngày</Text>
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{formatDayReservation(reservationData.startTime)}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'column',
                                gap: 5,
                                borderLeftWidth: 1,
                                borderColor: COLORS.gray1,
                                paddingLeft: SIZES.m,
                            }}>
                                <Text style={[TEXTS.subContent, { color: COLORS.blackBold, fontWeight: '500' }]}>Thời gian</Text>
                                <View style={{
                                    justifyContent: 'space-between',
                                    width: SIZES.width / 5,
                                    flexDirection: 'row',
                                    alignItems: 'flex-end'
                                }}>
                                    <Text style={[TEXTS.subContent, { color: COLORS.gray3 }]}>Từ</Text>
                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{formatTimeReservation(reservationData.startTime)}</Text>
                                </View>
                                <View style={{
                                    justifyContent: 'space-between',
                                    width: SIZES.width / 5,
                                    flexDirection: 'row',
                                    alignItems: 'flex-end'
                                }}>
                                    <Text style={[TEXTS.subContent, { color: COLORS.gray3 }]}>Đến</Text>
                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{formatTimeReservation(reservationData.endTime)}</Text>
                                </View>
                            </View>
                        </View>
                        {/* ===============Bạn đã chọn================ */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',

                            paddingVertical: SIZES.s,
                            borderBottomWidth: 1,
                            borderColor: COLORS.gray1,
                        }}>
                            <View style={{
                                flexDirection: 'column',
                                gap: 5,
                            }}>
                                <Text style={[TEXTS.subContent, { color: COLORS.blackBold, fontWeight: '500' }]}>
                                    {shop ? 'Thông tin đặt chỗ' : 'Bạn đã chọn:'}
                                </Text>
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{reservationData.bookingSeat} người, Tầng {areaData.order}</Text>
                            </View>
                            <Pressable
                                onPress={() => setShowArea(!showArea)}
                            >
                                <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' }]}>
                                    {showArea ? 'Ẩn bớt' : 'Xem thông tin khu vực'}
                                </Text>
                            </Pressable>
                        </View>
                        {/* ===============Thông tin khu vực================ */}
                        {showArea && (
                            <View>
                                <View style={[{
                                    width: '100%',
                                    height: 168,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: SIZES.s,
                                    borderRadius: 18,
                                    justifyContent: 'space-between',
                                }]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        gap: SIZES.s,
                                        alignItems: 'center',
                                    }}>
                                        {areaData.image ? (<Image source={{ uri: areaData.image }} style={[{ width: 132, height: 132, borderRadius: 10 }]} />)
                                            : (<View style={[{ width: 132, height: 132, backgroundColor: COLORS.gray1, borderRadius: 10 }]}></View>)}
                                        <View style={{
                                        }}>
                                            <View style={{
                                                height: '100%',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                gap: 5,
                                                paddingTop: SIZES.s / 2,
                                                width: SIZES.width / 2
                                            }}>
                                                <Text numberOfLines={1} style={[TEXTS.content, { color: COLORS.black, fontWeight: 'bold' }]}>Tầng {areaData.order}</Text>
                                                {areaData?.pets != null ? (
                                                    <View>
                                                        <Text style={[TEXTS.subContent]}>Thú cưng</Text>
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            gap: 3
                                                        }}>
                                                            {areaData.pets.map((pet, index) => (
                                                                (pet.avatar != null ? (
                                                                    <Image key={index} source={{ uri: pet.avatar }} style={AVATARS.mini} />
                                                                ) : (
                                                                    <View key={index} style={AVATARS.mini}></View>
                                                                ))
                                                            ))}
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={[TEXTS.subContent]}>Tầng chưa có Thú cưng</Text>
                                                    </View>
                                                )}
                                                <Text numberOfLines={3} style={[TEXTS.subContent]}>{areaData.description}</Text>
                                                <View
                                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                    <Text style={[TEXTS.subContent]}>Giá: </Text>
                                                    <Coin coin={areaData.pricePerHour} size='min' />
                                                    <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>/1h</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                        {/* ===============Thông tin cá nhân================ */}
                        {!shop && (
                            <View style={{
                                paddingTop: SIZES.s,
                                borderTopWidth: 1,
                                borderColor: COLORS.gray1,
                                flexDirection: 'column',
                                gap: 5,
                            }}>
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{userData.fullName}</Text>
                                <Text style={[TEXTS.subContent, { color: COLORS.black }]}>{userData.email}</Text>
                                <Text style={[TEXTS.subContent, { color: COLORS.black }]}>{userData.address}</Text>
                                <Text style={[TEXTS.subContent, { color: COLORS.black }]}>{userData.phoneNumber}</Text>
                            </View>
                        )}
                    </View>
                    {/* ===============Đặt đồ uống================ */}
                    {invoice?.length > 0 ? (
                        <View style={{
                            borderWidth: 1,
                            borderColor: COLORS.gray1,
                            borderRadius: SIZES.s,
                            padding: SIZES.m,
                            backgroundColor: COLORS.white,
                        }}>
                            <Pressable onPress={handleShowInvoice} style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s }}>
                                {!showInvoice ? (
                                    <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>
                                        {shop ? 'Danh sách đồ uống  ' : "Đồ uống bạn đã đặt  "}
                                        <Text style={[TEXTS.content, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>(Ẩn bớt)</Text>
                                    </Text>
                                ) :
                                    (<Text style={[TEXTS.content, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>
                                        {shop ? 'Xem danh sách đồ uống' : "Xem đồ uống đã đặt"}
                                    </Text>)}
                                <Ionicons name="cafe" size={ICONS.m} color={COLORS.primary} />
                            </Pressable>
                            {!showInvoice && (
                                <>
                                    <View style={{
                                        flexDirection: 'row',
                                        width: SIZES.width,
                                        alignItems: 'center',
                                        paddingTop: SIZES.s,
                                    }}>
                                        <View style={{
                                            width: SIZES.width / 2 - SIZES.m,
                                            alignItems: 'flex-start'
                                        }}>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Đồ uống</Text>
                                        </View>
                                        <View style={{
                                            width: (SIZES.width / 2 - SIZES.m) / 6,
                                            alignItems: 'flex-start'
                                        }}>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black }]}>SL</Text>
                                        </View>
                                        <View style={{
                                            width: ((SIZES.width / 2 - SIZES.m) - (SIZES.width / 2 - SIZES.m) / 6) - SIZES.m,
                                            alignItems: 'center'
                                        }}>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Thành tiền</Text>
                                        </View>
                                    </View>
                                    {renderReservationInvoice(invoice)}
                                    {!shop && (
                                        <>
                                            {reservationData.status === 'Success' && (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}>
                                                    <View>
                                                        <Pressable onPress={handlePressMenu} style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s, paddingTop: SIZES.s }}>
                                                            <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' }]}>
                                                                Bạn có muốn đặt thêm?
                                                            </Text>
                                                            <Ionicons name="cafe" color={COLORS.primary} size={ICONS.s} />
                                                        </Pressable>
                                                        <MenuProduct onPress={() => setProduct(!product)} isVisible={modalVisible} onClose={handleCloseModal} shopData={shopData} productData={productData} shop={true} reservationId={reservationData.id} />
                                                    </View>
                                                    <View>
                                                        <Pressable onPress={handleConfirmProduct} style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s, paddingTop: SIZES.s }}>
                                                            <Text style={[TEXTS.subContent, { color: COLORS.gray3, fontWeight: '500', textDecorationLine: 'underline' }]}>
                                                                Hủy đặt đồ uống?
                                                            </Text>
                                                        </Pressable>
                                                    </View>
                                                </View>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </View>
                    ) :
                        (
                            <>
                                {!shop && (
                                    <View style={{
                                        borderWidth: 1,
                                        borderColor: COLORS.gray1,
                                        borderRadius: SIZES.s,
                                        padding: SIZES.m,
                                        backgroundColor: COLORS.white,
                                    }}>
                                        <Pressable onPress={handlePressMenu} style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s }}>
                                            <Text style={[TEXTS.content, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>
                                                Bạn có muốn đặt trước đồ uống không?
                                            </Text>
                                            <Ionicons name="cafe" size={ICONS.m} color={COLORS.primary} />
                                        </Pressable>
                                        <MenuProduct onPress={() => setProduct(!product)} isVisible={modalVisible} onClose={handleCloseModal} shopData={shopData} productData={productData} shop={true} reservationId={reservationData.id} />
                                    </View>
                                )}
                            </>
                        )
                    }
                    {/* ===============Ghi chú================ */}
                    {reservationData.note != null && (
                        <View style={{
                            borderWidth: 1,
                            borderColor: COLORS.gray1,
                            borderRadius: SIZES.s,
                            padding: SIZES.m,
                            backgroundColor: COLORS.white,
                        }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: SIZES.s }}>
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>
                                    {shop ? 'Ghi chú' : 'Ghi chú của bạn'}
                                </Text>
                                <Text
                                    style={{
                                        borderBottomWidth: 1,
                                        borderColor: COLORS.gray1,
                                        paddingBottom: SIZES.s / 2,
                                    }}
                                >{reservationData.note}</Text>
                            </View>

                        </View>
                    )}
                    {/* ===============Tổng cộng================ */}
                    <View style={{
                        borderWidth: 1,
                        borderColor: COLORS.gray1,
                        borderRadius: SIZES.s,
                        padding: SIZES.xl,
                        backgroundColor: COLORS.white,
                    }}>
                        <View style={{
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={[{
                                fontSize: SIZES.xl,
                                fontWeight: 'bold',
                                color: status.color
                            }]}>{status.text}</Text>
                            <View style={{
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                            }}>
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>Tổng cộng</Text>
                                <Text style={styles.totalPrice}><Coin coin={totalPrice} size='xl' /></Text>
                            </View>
                        </View>
                        {/* ===============Chi tiết giá================ */}
                        <View style={{
                            borderBottomWidth: 1,
                            borderColor: COLORS.gray1,
                            paddingBottom: SIZES.s / 2,
                        }}>
                            <Pressable style={{
                                paddingBottom: SIZES.s / 2
                            }}
                                onPress={() => setShowDetail(!showDetail)}
                            >
                                <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>
                                    {showDetail ? 'Ẩn bớt' : 'Xem chi tiết giá'}
                                </Text>
                            </Pressable>
                            {showDetail &&
                                (
                                    <View style={{
                                        flexDirection: 'column',
                                        gap: 5,
                                    }}>
                                        <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>Giá đặt chỗ</Text>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Giá khu vực:</Text>
                                            <Coin coin={areaData.pricePerHour} size='min' />
                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Số người:</Text>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black, fontWeight: '500' }]}>x{reservationData.bookingSeat}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderColor: COLORS.gray1, paddingBottom: 5 }}>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Số giờ:</Text>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black, fontWeight: '500' }]}>{calculateHourDifference(reservationData.startTime, reservationData.endTime)}h</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderColor: COLORS.gray1, paddingBottom: 5 }}>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Tạm tính</Text>
                                            <Coin coin={reTotal} size='min' />
                                        </View>
                                        {invoice?.length > 0 && (
                                            <View style={{
                                                borderBottomWidth: 0.5, borderColor: COLORS.gray1, paddingBottom: 5
                                            }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>Giá đồ uống</Text>
                                                {renderReservationProducts(invoice)}
                                            </View>
                                        )}
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500', paddingBottom: 5 }]}>Giảm giá</Text>

                                        </View>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Ưu đãi {percent}% từ {shopData.name}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={[{ fontWeight: 'bold', fontSize: 16, color: COLORS.primary }]}>- </Text>
                                                <Coin coin={reservationData.discount} size='min' />
                                            </View>
                                        </View>
                                    </View>
                                )}
                        </View>
                    </View>
                </View>
            </ScrollView >
            {reservationStatus === 'Success' && (
                <>
                    {reservationNew ? (
                        <View style={styles.cancel}>
                            <Pressable
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: COLORS.gray1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recMax]}
                                onPress={handleConfirm}>
                                <Text style={{ fontSize: SIZES.m, color: COLORS.black, fontWeight: '500' }}>Hủy đặt</Text>
                            </Pressable>
                            <Pressable
                                style={[{
                                    paddingVertical: SIZES.s,
                                    backgroundColor: COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: SIZES.s
                                }, BUTTONS.recMax]}
                                onPress={handleGoHome}>
                                <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Trở về</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.cancel}>
                            <Pressable style={{
                                width: SIZES.width - SIZES.s * 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: SIZES.s,
                            }} onPress={handleConfirm}>
                                <View
                                    style={[{
                                        paddingVertical: SIZES.s,
                                        backgroundColor: COLORS.gray1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        gap: SIZES.s
                                    }, BUTTONS.recFull]}
                                >
                                    <Text style={{ fontSize: SIZES.m, color: COLORS.black, fontWeight: '500' }}>
                                        {shop ? 'Hủy đơn' : 'Hủy đặt'}
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    )}
                </>
            )}
            {reservationStatus === 'Returned' && (
                <>
                    {shop ? (
                        <View style={styles.cancel}>
                            <View style={{
                                width: SIZES.width - SIZES.s * 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: SIZES.s,
                            }}>
                                <Text style={{ color: COLORS.primary, fontSize: 24, fontWeight: '500' }}>{ALERTS.orderRefund}</Text>
                                <Coin coin={reservationData.amountRefund} size='mid' />
                            </View>
                        </View>

                    ) : (
                        <>
                            {reservationNew ? (
                                <View style={{
                                    height: SIZES.height / 10,
                                    alignItems: 'center',
                                    padding: SIZES.s,
                                    backgroundColor: COLORS.white,
                                    borderWidth: 1,
                                    borderColor: COLORS.gray1,
                                }}>
                                    <Pressable
                                        style={[{
                                            paddingVertical: SIZES.s,
                                            backgroundColor: COLORS.primary,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            gap: SIZES.s,

                                        }, BUTTONS.recFull]}
                                        onPress={handleGoHome}>
                                        <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Trở về</Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <View style={styles.cancel}>
                                    {reservationData.amountRefund === 0 ? (
                                        <Pressable style={{
                                            width: SIZES.width - SIZES.s * 2,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: SIZES.s,
                                        }} onPress={handleCheck}
                                            disabled={!check}
                                        >
                                            <View
                                                style={[{
                                                    paddingVertical: SIZES.s,
                                                    backgroundColor: check ? COLORS.primary : COLORS.primary,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'row',
                                                    gap: SIZES.s,

                                                }, BUTTONS.recFull]}
                                            >
                                                <Text style={{ fontSize: SIZES.m, color: check ? COLORS.white : COLORS.white, fontWeight: '500' }}>Trở về</Text>
                                            </View>
                                        </Pressable>
                                    ) : (
                                        <View style={{
                                            width: SIZES.width - SIZES.s * 2,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: SIZES.s,
                                        }}>
                                            <Text style={{ color: COLORS.primary, fontSize: 24, fontWeight: '500' }}>{ALERTS.orderRefund}</Text>
                                            <Coin coin={reservationData.amountRefund} size='mid' />
                                        </View>
                                    )}
                                </View>
                            )}
                        </>
                    )}
                </>
            )}
            {reservationStatus === 'Overtime' && !showRating && (
                <View style={{
                    height: disableRate ? SIZES.height / 9 : SIZES.height / 4,
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: SIZES.m,
                    paddingTop: disableRate ? SIZES.s : SIZES.l,
                    backgroundColor: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.gray1,
                    position: 'relative'
                }}>
                    {disableRate ? (
                        <View style={{
                            alignItems: 'center',
                            gap: SIZES.s / 2
                        }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Cảm ơn bạn đã đánh giá!</Text>
                            </View>
                            <CustomRatingBar />
                        </View>
                    ) : (
                        <>
                            <View style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: SIZES.s,
                                gap: SIZES.s,
                            }}>
                                <Text style={[{
                                    fontSize: SIZES.l,
                                    fontWeight: 'bold',
                                    color: COLORS.black
                                }]}>Đánh giá lần đặt chỗ này</Text>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={TEXTS.subContent}>Cảm ơn bạn đã tin tưởng và đặt chỗ trên</Text>
                                    <Text style={{ color: COLORS.primary, fontWeight: '500' }}>Nền Tảng Cà Phê Thú Cưng </Text>
                                </View>
                                <Text style={TEXTS.subContent}>Bạn cảm nhận về <Text style={{ color: COLORS.black, fontWeight: '500' }}>{shopData.name} </Text>như thế nào?</Text>
                            </View>
                            <CustomRatingBar />
                            <Pressable
                                onPress={() => setShowRating(!showRating)}
                                style={{
                                    position: 'absolute',
                                    top: "5%",
                                    right: "5%",
                                }}>
                                <Ionicons name="close-circle" size={ICONS.xm} color={COLORS.blackBold} />
                            </Pressable>
                        </>
                    )
                    }

                </View >
            )}
            {reservationStatus === 'Overtime' && showRating && (
                <View style={styles.cancel}>
                    <Pressable style={{
                        width: SIZES.width - SIZES.s * 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: SIZES.s,
                    }} onPress={() => setShowRating(!showRating)}
                    >
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
                            <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Đánh giá</Text>
                        </View>
                    </Pressable>
                </View>
            )}
        </View >

    );
};

export default ReservationDetail;

const styles = StyleSheet.create({

    scrollContent: {
        flexGrow: 1,
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
    container: {
        flex: 1,
        // padding: SIZES.s,
        // backgroundColor: COLORS.white,

    },
    card: {
        padding: SIZES.m,
        backgroundColor: COLORS.white,
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: COLORS.gray1,
        borderRadius: SIZES.s,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shopName: {
        fontSize: SIZES.xl,
        fontWeight: 'bold',
    },
    addNoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.s,
        borderWidth: 1,
        borderColor: COLORS.error,
        borderRadius: SIZES.s,
        margin: SIZES.s,
        gap: SIZES.s / 2,


    },
    addNoteButtonText: {
        fontSize: SIZES.m,
        fontWeight: '500',
    },
    details: {
        paddingVertical: SIZES.xl,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: SIZES.s,
    },
    detailText: {
        fontSize: SIZES.l,
        fontWeight: '500',
        color: COLORS.black,
    },
    footer: {
        borderWidth: 1,
        borderColor: COLORS.gray1,
        borderRadius: SIZES.s,
        padding: SIZES.m,
        marginVertical: SIZES.m
    },
    totalPrice: {
        fontSize: SIZES.m,
        fontWeight: '500',
        color: COLORS.black,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
    },
    textUnder: {

        fontWeight: '500',
        color: COLORS.blackBold,
        textDecorationLine: 'underline'
    }
});
