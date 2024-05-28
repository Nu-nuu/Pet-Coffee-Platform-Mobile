import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ALERTS, BRS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import Coin from '../../../components/Wallet/coin';
import formatDayReservation from '../../../components/Reservation/formatDayReservation';
import formatTimeReservation from '../../../components/Reservation/formatTimeReservation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ReservationShopCard = ({ reservationData, userData, shopData, areaData }) => {

    const navigation = useNavigation()

    const statusMap = {
        Success: { text: ALERTS.orderSuccess, color: COLORS.success },
        Returned: { text: ALERTS.orderRefund, color: COLORS.error },
        Overtime: { text: ALERTS.orderOvertime, color: COLORS.primary },
    };

    const status = statusMap[reservationData.status] || { text: '', color: COLORS.black }

    const handleReservationDetail = () => {
        navigation.navigate('ReservationDetail', {
            reservationData: reservationData,
            userData: userData,
            shopData: shopData,
            areaData: areaData,
            reservationNew: false,
            shop: true
        })
    }
    return (
        <View style={[{
            padding: SIZES.s,
            borderRadius: BRS.out,
            backgroundColor: COLORS.white,
        }, SHADOWS.s]}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: SIZES.s,
            }}>
                <View>
                    <Text style={{
                        fontWeight: '500',
                        color: COLORS.black,
                        fontSize: SIZES.m
                    }}>{userData.fullName}</Text>
                    <Text>{formatDayReservation(reservationData.startTime)}</Text>
                    <Text>{formatTimeReservation(reservationData.startTime)} - {formatTimeReservation(reservationData.endTime)}</Text>
                    <Text>{reservationData.bookingSeat} người | Tầng {areaData.order}</Text>
                </View>
                <View style={{
                    alignItems: 'flex-end',
                    gap: SIZES.s,
                }}>
                    <Text style={[TEXTS.subContent, {
                        fontWeight: '500',
                        color: COLORS.blackBold,
                    }]}>{reservationData.code}</Text>
                    <Coin coin={reservationData.totalPrice} size='mid' />
                </View>
            </View>
            <View style={{
                paddingHorizontal: SIZES.s,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderColor: COLORS.gray1,
                paddingTop: SIZES.s / 2,
            }}>
                <Text style={[TEXTS.subContent, { color: status.color, fontWeight: '500' }]}>{status.text}</Text>
                <Pressable onPress={handleReservationDetail} style={styles.addNoteButton}>
                    <Ionicons name="arrow-forward-circle" size={ICONS.m} color={COLORS.primary} />
                </Pressable>
            </View>
        </View>
    )
}

export default ReservationShopCard

const styles = StyleSheet.create({})