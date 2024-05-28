import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DayTime from './dayTime';
import Area from './area';
import Footer from '../../components/Reservation/footer';
import { useDispatch, useSelector } from 'react-redux';
import { petCoffeeShopDetailSelector, promotionFromShopSelector, userDataSelector, walletSelector } from '../../store/sellectors';
import { COLORS, RESERVATIONS, SIZES } from '../../constants';
import { createReservationThunk, getAllReservationThunk, getAvailableSeatThunk } from '../../store/apiThunk/reservationThunk';
import Coin from '../../components/Wallet/coin';
import formatDayReservation from './../../components/Reservation/formatDayReservation';
import Loading from '../../components/Alert/modalSimple/loading';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ConfirmModal from '../../components/Alert/confirmModal';
import Success from '../../components/Alert/modalSimple/success';
import ErrorItems from '../../components/Alert/modalSimple/errorItems';
import { format, set } from 'date-fns';
import ErrorReservation from '../../components/Alert/modalSimple/errorReservation';
import { getWalletThunk } from '../../store/apiThunk/walletThunk';
import { getAllTransactionThunk } from '../../store/apiThunk/transactionThunk';
import formatTime7Reservation from '../../components/Reservation/formatTime7Reservation';
import Payment from './payment';
import { getPromotionFromShopThunk } from '../../store/apiThunk/promotionThunk';
import { getPetCoffeeShopDetailThunk } from '../../store/apiThunk/petCoffeeShopThunk';


const Reservation = ({ route }) => {
    const { areaId, price, order, shop, areaDatas } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [count, setCount] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [selectedArea, setSelectedArea] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(0);
    const [areaData, setAreaData] = useState(areaDatas);
    const [note, setNote] = useState('');
    const [promotionId, setPromotionId] = useState(null);
    const [percent, setPercent] = useState(0);


    const [pricePerHour, setPricePerHour] = useState(0);

    const [availableStatus, setAvailableStatus] = useState(false);

    const [titleHeader, setTitleHeader] = useState('Đặt chỗ');
    const [titleFooter, setTitleFooter] = useState('Khu vực?');
    const [titleStatus, setTitleStatus] = useState(false);
    const [nextStep, setNextStep] = useState(1);
    const [hour, setHour] = useState(0);

    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showErrorReservationModal, setShowErrorReservationModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [maxAvailableSeat, setMaxAvailableSeat] = useState(null)

    useEffect(() => {
        handleReload()
    }, [showSuccessModal])

    const handleReload = async () => {
        await dispatch(getWalletThunk());
        await dispatch(getAllTransactionThunk({type: null}))
    }
    const userData = useSelector(userDataSelector)
    const shopData = useSelector(petCoffeeShopDetailSelector)
    const walletData = useSelector(walletSelector)
    const promotionData = useSelector(promotionFromShopSelector)

    const calculateHourDifference = () => {
        if (timeStart && timeEnd) {
            const start = new Date(timeStart).getUTCHours();
            const end = new Date(timeEnd).getUTCHours();
            const difference = end - start;
            setHour(difference);
        }
    };


    useLayoutEffect(() => {
        if (nextStep == 1) {
            navigation.setOptions({
                headerTitle: titleHeader,
                headerLeft: () => (
                    <Pressable style={{ paddingRight: SIZES.xxl }} onPress={() => {
                        navigation.goBack()
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
        }
        if (nextStep == 2) {
            navigation.setOptions({
                headerTitle: titleHeader,
                headerLeft: () => (
                    <Pressable style={{ paddingRight: SIZES.xxl }} onPress={() => {
                        setNextStep(1);
                        setTitleFooter('Khu vực?');
                    }}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                    </Pressable>
                ),
            });
        }
        if (nextStep == 3) {
            navigation.setOptions({
                headerTitle: titleHeader,
                headerLeft: () => (
                    <Pressable style={{ paddingRight: SIZES.xxl }} onPress={() => {
                        setNextStep(2);
                        setTitleFooter('Chi tiết?');
                        setTitleStatus(false);
                    }}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                    </Pressable>
                ),
            });
        }
    }, [nextStep]);

    useEffect(() => {
        if (shop) {
            setSelectedArea(areaId);
            setSelectedOrder(order);
            setPricePerHour(price);
        }
    }, [])

    useEffect(() => {
        setAvailableStatus(false)
        if (!!selectedDate && !!timeStart && !!timeEnd) {

            const formattedDate = format(selectedDate, "yyyy-MM-dd");
            const formattedTimeStart = "T" + format(timeStart, "HH:mm:ss.SSS");
            const formattedTimeEnd = "T" + format(timeEnd, "HH:mm:ss.SSS");

            const startTime = formattedDate + formattedTimeStart
            const endTime = formattedDate + formattedTimeEnd
            dispatch(getAvailableSeatThunk({
                shopId: shopData.id,
                startTime: startTime,
                endTime: endTime,
                totalSeat: count,
            }))
                .unwrap()
                .then((res) => {
                    setAvailableStatus(true)
                    const maxAvailableSeat = res?.reduce((max, area) => {
                        return area.availableSeat > max ? area.availableSeat : max;
                    }, 0);
                    setMaxAvailableSeat(maxAvailableSeat);
                }
                )
                .catch((error) => {
                    setAvailableStatus(false);
                    console.log(error);
                });
            calculateHourDifference();
        }
    }, [selectedDate, timeStart, timeEnd, count])


    useEffect(() => {
        dispatch(getPromotionFromShopThunk(shopData.id))
            .unwrap()
            .then()
            .catch((err) => console.log(err))

    }, [])


    const handleCountChange = (newCount) => {
        setCount(newCount);
    };
    const handleDaySelect = (date) => {
        setSelectedDate(date.toString());
        if (!timeStart && shopData.startTime) {
            const [startHour, startMinute] = shopData.startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(startHour);
            startDate.setMinutes(startMinute);
            const endDate = new Date(startDate.getTime() + (1 * 60 * 60 * 1000)); // Thêm 1 giờ (1 * 60 * 60 * 1000 milliseconds)
            const endHour = endDate.getHours();
            const endMinute = endDate.getMinutes();
            const endHourString = endHour < 10 ? `0${endHour}` : `${endHour}`;
            const endMinuteString = endMinute < 10 ? `0${endMinute}` : `${endMinute}`;

            const start = shopData.startTime
            const end = `${endHourString}:${endMinuteString}`;

            const formattedDate = format(date.toString(), "yyyy-MM-dd");
            const formattedTimeStart = "T" + `${start}` + ":00.000Z";
            const formattedTimeEnd = "T" + `${end}` + ":00.000Z";

            const startTime = formattedDate + formattedTimeStart;
            const endTime = formattedDate + formattedTimeEnd;
            setTimeStart(startTime)
            setTimeEnd(endTime)
        }
    };
    const handleTimeStartSelect = (start) => {
        setTimeStart(start.toString());
    };
    const handleTimeEndSelect = (end) => {
        setTimeEnd(end.toString());
    };

    const handleAreaSelect = (areaId, pricePerHour, order, item) => {
        setSelectedArea(areaId);
        setSelectedOrder(order);
        setPricePerHour(pricePerHour);
        setAreaData(item)
    };

    const handlePressPersonFooter = () => {
        setTitleFooter('Chi tiết');
        setNextStep(2);
    };

    const handlePressDetailFooter = () => {
        setTitleFooter('Thanh toán');
        setNextStep(3);
        setTitleStatus(true);
    };

    const handleCancelPress = () => {
        navigation.goBack();
    };

    const handleCancel = () => {
        setShowCancelModal(true)

    };

    const handleNoteChange = (text) => {
        setNote(text);
    };

    const handlePromotionChange = (promotionId, percent) => {
        setPromotionId(promotionId);
        setPercent(percent)
    };

    const handleConfirm = () => {
        {
            (pricePerHour * count * hour) > walletData.balance ? (
                setShowErrorModal(true)
            ) :
                (
                    setShowConfirmModal(true)
                )
        }

    };

    const handleBack = () => {
        navigation.goBack()
    }

    const handlePayment = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const formattedTimeStart = "T" + format(timeStart, "HH:mm:ss.SSS");
        const formattedTimeEnd = "T" + format(timeEnd, "HH:mm:ss.SSS");

        const startTime = formattedDate + formattedTimeStart
        const endTime = formattedDate + formattedTimeEnd

        const formData = new FormData();
        formData.append('AreaId', selectedArea);
        formData.append('StartTime', startTime);
        formData.append('EndTime', endTime);
        formData.append('TotalSeat', count);
        formData.append('Note', note);
        if (promotionId) {
            formData.append('PromotionId', promotionId)
        }
        dispatch(createReservationThunk(formData))
            .unwrap()
            .then((response) => {
                setLoading(false);
                setShowSuccessModal(true)
                setTimeout(() => {
                    setShowSuccessModal(false);
                    dispatch(getAllReservationThunk({
                        searchQuery: null,
                        status: null,
                    }))
                    navigation.navigate('ReservationDetail', {
                        reservationData: response,
                        userData: response?.accountForReservation,
                        shopData: response?.petCoffeeShopResponse,
                        areaData: response?.areaResponse,
                        reservationNew: true,
                    });
                }, 3000);
            })
            .catch(error => {
                setErrorMsg(error.message)
                setLoading(false);
                setShowErrorReservationModal(true);
            });
    }

    const handleErrorBuy = () => {
        navigation.navigate('Topup')
    }
    return (

        <View style={styles.container}>
            {/* ========================================================================= */}
            <View style={styles.content}>
                {showConfirmModal && (
                    <ConfirmModal
                        showConfirmModal={showConfirmModal}
                        setShowConfirmModal={setShowConfirmModal}
                        confirmMsg={RESERVATIONS.confirmOrder}
                        coin={(pricePerHour * count * hour) - (pricePerHour * count * hour * percent / 100)}
                        onConfirm={handlePayment}
                    />
                )}
                {showCancelModal && (
                    <ConfirmModal
                        showConfirmModal={showCancelModal}
                        setShowConfirmModal={setShowCancelModal}
                        confirmMsg={RESERVATIONS.cancel}
                        onConfirm={handleCancelPress}
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
                        coin={pricePerHour * count * hour}
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
                {nextStep === 1 && (
                    <DayTime seat={count} daySelect={selectedDate} startSelect={timeStart} endSelect={timeEnd} start={shopData.startTime} end={shopData.endTime} onSelectDay={handleDaySelect} onSelectTimeStart={handleTimeStartSelect} onSelectTimeEnd={handleTimeEndSelect} onSelectPerson={handleCountChange} maxAvailableSeat={maxAvailableSeat} />
                )}
                {nextStep === 2 && (
                    <Area onSelectArea={handleAreaSelect} count={count} selectedArea={selectedArea} />
                )}
                {nextStep === 3 && (
                    <Payment promotionPercent={percent} note={note} promotionSelect={promotionId} promotionData={promotionData} onPromotionChange={handlePromotionChange} onNoteChange={handleNoteChange} areaData={areaData} userData={userData} shopData={shopData} count={count} selectedOrder={selectedOrder} timeStart={timeStart} timeEnd={timeEnd} hour={hour} pricePerHour={pricePerHour} selectedDate={selectedDate} />
                )}
            </View>
            <Footer
                count={count}
                title={titleFooter}
                titleStatus={titleStatus}
                day={selectedDate}
                timeStart={timeStart}
                timeEnd={timeEnd}
                area={selectedOrder}
                onPress={
                    nextStep === 1 ? handlePressPersonFooter :
                        nextStep === 2 ? handlePressDetailFooter :
                            handleConfirm
                }
                onPressCancel={handleCancel}
                availableSeat={availableStatus}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgr,
    },
    content: {
        flex: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        gap: SIZES.m
    },
    label: {
        fontWeight: 'bold',
        fontSize: SIZES.l,
        color: COLORS.blackBold
    },
    value: {
        color: COLORS.blackBold,
        fontSize: SIZES.m,

    },

});

export default Reservation;
