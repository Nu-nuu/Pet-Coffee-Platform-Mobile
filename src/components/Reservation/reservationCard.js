import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Coin from '../Wallet/coin'
import { ALERTS, BRS, COLORS, SHADOWS, SIZES, TEXTS } from '../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import formatDayReservation from './formatDayReservation';
import formatTimeReservation from './formatTimeReservation';
const ReservationCard = ({ reservation, userData, shopData, areaData, followedShopIds }) => {
    const navigation = useNavigation();
    const checkFollow = followedShopIds?.includes(shopData.id);

    const handleReservationDetail = () => {
        navigation.navigate('ReservationDetail', {
            reservationData: reservation,
            userData: userData,
            shopData: shopData,
            areaData: areaData,
            reservationNew: false,
        })
    }
    const handleShopDetail = () => {
        navigation.navigate('ShopDetail', {
            id: shopData.id,
            shopData: shopData,
            checkFollow
        })
    }

    const statusMap = {
        Success: { text: ALERTS.orderSuccess, color: COLORS.success },
        Returned: { text: ALERTS.orderRefund, color: COLORS.error },
        Overtime: { text: ALERTS.orderOvertime, color: COLORS.primary },
    };

    const status = statusMap[reservation.status] || { text: '', color: COLORS.black }

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
                <Pressable
                    onPress={handleShopDetail}
                >
                    <Text style={{
                        fontWeight: '500',
                        color: COLORS.black,
                        fontSize: SIZES.m
                    }}>{shopData.name}</Text>
                    <Text>{formatDayReservation(reservation.startTime)}</Text>
                    <Text>{formatTimeReservation(reservation.startTime)} - {formatTimeReservation(reservation.endTime)}</Text>
                    <Text>{reservation.bookingSeat} người | Tầng {areaData.order}</Text>
                </Pressable>
                <Pressable
                    onPress={handleReservationDetail}
                    style={{
                        alignItems: 'flex-end',
                        gap: SIZES.s,
                    }}>
                    <Text style={[TEXTS.subContent, {
                        fontWeight: '500',
                        color: COLORS.blackBold,
                    }]}>{reservation.code}</Text>
                    <Coin coin={reservation.totalPrice} size='mid' />
                </Pressable>
            </View>
            <Pressable
                onPress={handleReservationDetail}
                style={{
                    padding: SIZES.s,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderTopWidth: 1,
                    borderColor: COLORS.gray1,
                }}>
                <Text style={[TEXTS.subContent, { color: status.color, fontWeight: '500' }]}>{status.text}</Text>

                <View style={styles.addNoteButton}>
                    <Ionicons name="arrow-forward-circle" size={24} color={COLORS.primary} />
                </View>
            </Pressable>
        </View>
    )
}

export default ReservationCard

const styles = StyleSheet.create({
    addNoteButtonText: {
        fontSize: SIZES.m,
        fontWeight: '500',
    },
    addNoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.s
    }

})