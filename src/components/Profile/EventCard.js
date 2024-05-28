import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import { BRS, BUTTONS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Coin from '../Wallet/coin';
import { userDataSelector } from '../../store/sellectors';
import { useSelector } from 'react-redux';

const EventCard = ({ eventData, shop, join, onPress, onPressJoin }) => {
    const userData = useSelector(userDataSelector)
    const staff = userData.role === 'Staff' ? true : false

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}`;
    };

    const isEventEnded = (eventData) => {
        const endDate = new Date(eventData.endDate);
        const endTime = eventData.endTime.split(':');
        endDate.setHours(parseInt(endTime[0], 10), parseInt(endTime[1], 10));

        const now = new Date();
        return now > endDate;
    };
    const isEventNotStarted = (eventData) => {
        const startDate = new Date(eventData.startDate);
        const startTime = eventData.startTime.split(':');
        startDate.setHours(parseInt(startTime[0], 10), parseInt(startTime[1], 10));

        const now = new Date();
        return now < startDate;
    };
    const eventEnded = isEventEnded(eventData);
    const eventNotStarted = isEventNotStarted(eventData);

    let statusText = '';
    let statusColor = '';

    if (eventEnded) {
        statusText = 'Đã kết thúc';
        statusColor = COLORS.primary;
    } else if (eventNotStarted) {
        statusText = 'Sắp diễn ra';
        statusColor = COLORS.yellow;
    } else {
        statusText = 'Đang diễn ra';
        statusColor = COLORS.success;
    }

    return (
        <View style={{
            marginBottom: SIZES.s
        }}>
            <View style={[{
                backgroundColor: COLORS.white,
                width: '100%',
                height: 168,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 18,
                justifyContent: 'space-between',
                position: 'relative'
            }, SHADOWS.s]}>
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                }}>
                    {eventData.image ? (<Image source={{ uri: eventData.image }} style={[{
                        width: SIZES.height / 5.5 - SIZES.xm * 3,
                        height: SIZES.height / 5.5 - SIZES.xm * 2,
                        borderRadius: 10
                    }]} />)
                        : (<View style={[{
                            width: SIZES.height / 5.5 - SIZES.xm * 3,
                            height: SIZES.height / 5.5 - SIZES.xm * 2,
                            backgroundColor: COLORS.gray1, borderRadius: 10
                        }]}></View>)}
                    <View style={{
                    }}>
                        {shop ? (
                            <View style={{
                                height: '100%',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 5,
                                paddingTop: staff ? SIZES.xl : SIZES.s / 2,
                                width: staff ? SIZES.width / 2 : SIZES.width / 3.5,
                            }}>
                                <Text numberOfLines={staff ? 2 : 1} style={[TEXTS.content, { color: COLORS.black, fontWeight: 'bold' }]}>{eventData.title}</Text>
                                <Text numberOfLines={1} style={[TEXTS.subContent, { color: COLORS.black, fontWeight: '500' }]}>{formatDate(eventData.startDate)} - {formatDate(eventData.endDate)}</Text>
                                <Text numberOfLines={1} style={[TEXTS.subContent, { color: COLORS.black, fontWeight: '500' }]}>{(eventData.startTime)} - {(eventData.endTime)}</Text>
                                {!staff && (
                                    <Text numberOfLines={2} style={[TEXTS.subContent]}>Địa điểm: <Text style={{ fontWeight: 'bold', color: COLORS.black }}>{eventData.location}</Text></Text>
                                )}
                                {shop && eventData.totalJoinEvent === eventData.maxParticipants ? (
                                    <Text style={[TEXTS.subContent, { fontWeight: '500', color: eventEnded ? COLORS.gray2 : COLORS.primary }]}>Đủ người tham gia</Text>
                                ) : eventData.totalJoinEvent > 0 ? (
                                    <Text style={[TEXTS.subContent, { fontWeight: '500', color: eventEnded ? COLORS.gray2 : COLORS.success }]}>{eventData.totalJoinEvent} người tham gia</Text>
                                )
                                    : (
                                        <Text numberOfLines={1} style={[TEXTS.subContent, { fontWeight: '500', color: eventEnded ? COLORS.gray2 : COLORS.primary }]}>Chưa có người tham gia</Text>
                                    )
                                }
                            </View>
                        ) : (
                            <View style={{
                                height: '100%',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 5,
                                paddingTop: SIZES.s / 2,
                                width: SIZES.width / 3.5,
                            }}>
                                <Text numberOfLines={1} style={[TEXTS.content, { color: COLORS.black, fontWeight: 'bold' }]}>{eventData.title}</Text>
                                <Text numberOfLines={1} style={[TEXTS.subContent, { color: COLORS.black, fontWeight: '500' }]}>{formatDate(eventData.startDate)} - {formatDate(eventData.endDate)}</Text>
                                <Text numberOfLines={1} style={[TEXTS.subContent, { color: COLORS.black, fontWeight: '500' }]}>{(eventData.startTime)} - {(eventData.endTime)}</Text>
                                <Text numberOfLines={3} style={[TEXTS.subContent]}>Địa điểm: <Text style={{ fontWeight: 'bold', color: COLORS.black }}>{eventData.location}</Text></Text>
                            </View>
                        )}
                    </View>
                </View>
                {staff ? (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            padding: SIZES.m,
                        }}>
                        <Text style={[TEXTS.content, { fontWeight: '500', color: statusColor }]}>
                            {statusText}
                        </Text>
                    </View>
                ) : (
                    <View style={{
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        paddingHorizontal: 2,
                        paddingVertical: 4,
                    }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center', gap: 5,
                            }}>
                            <Text style={[TEXTS.content, { fontWeight: '500', color: statusColor }]}>
                                {statusText}
                            </Text>
                        </View>
                        <View>
                            {join && (
                                <Text style={[TEXTS.subContent, { alignSelf: 'center', paddingBottom: 5 }]}>Đã tham gia</Text>
                            )}
                            {join || eventEnded ? (
                                <Pressable
                                    onPress={onPress}
                                    style={[
                                        BUTTONS.recMid,
                                        {
                                            backgroundColor: eventData.totalJoinEvent === eventData.maxParticipants ? COLORS.gray2 : COLORS.primary,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }]}>
                                    <Text style={[{
                                        fontWeight: '500',
                                        color: COLORS.white,
                                        fontSize: SIZES.m
                                    }]}>
                                        Chi tiết
                                    </Text>
                                </Pressable>
                            ) : (
                                <Pressable
                                    onPress={onPressJoin}
                                    style={[
                                        BUTTONS.recMid,
                                        {
                                            backgroundColor: eventData.totalJoinEvent === eventData.maxParticipants ? COLORS.gray2 : COLORS.primary,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }]}>
                                    <Text style={[{
                                        fontWeight: '500',
                                        color: COLORS.white,
                                        fontSize: SIZES.m
                                    }]}>
                                        Đăng ký
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                )}

            </View>
        </View>
    )
}

export default EventCard

const styles = StyleSheet.create({})