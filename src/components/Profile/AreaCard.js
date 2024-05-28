import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { AVATARS, BRS, BUTTONS, COLORS, ICONS, SHADOWS, SHOPS, SIZES, TEXTS } from '../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Coin from '../Wallet/coin';

const AreaCard = ({ areaData, reservation, onPress, count, isSelected, shop }) => {

    return (
        <View
            style={{
                marginBottom: SIZES.s
            }}>
            <View style={[{
                backgroundColor: COLORS.white,
                width: SIZES.width - SIZES.m * 2,
                height: SIZES.height / 5.5,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SIZES.s,
                paddingLeft: SIZES.s,
                borderRadius: 18,
            }, SHADOWS.s, isSelected && styles.selectedCard]}>
                <View style={{
                    flexDirection: 'row',
                    gap: SIZES.s,
                    alignItems: 'center',
                }}>
                    {areaData?.image ? (<Image source={{ uri: areaData.image }} style={[{
                        width: SIZES.height / 5.5 - SIZES.xm * 3,
                        height: SIZES.height / 5.5 - SIZES.xm * 2,
                        borderRadius: 10
                    }]} />)
                        : (<View style={[{
                            width: SIZES.height / 5.5 - SIZES.xm * 3,
                            height: SIZES.height / 5.5 - SIZES.xm * 2,
                            backgroundColor: COLORS.gray1,
                            borderRadius: 10
                        }]}><Text style={{ alignSelf: 'center' }}>Chưa có ảnh</Text></View>)}
                    <View style={{
                    }}>
                        <View style={{
                            height: '100%',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 3,
                            width: SIZES.height / 5.5 - SIZES.m *2,
                        }}>
                            <Text numberOfLines={1} style={[TEXTS.content, { color: COLORS.black, fontWeight: 'bold' }]}>Tầng {areaData.order}</Text>
                            {reservation ? (
                                <Text style={[TEXTS.content]}>Còn trống <Text style={{ color: COLORS.success, fontWeight: '500' }}>{areaData?.availableSeat}</Text></Text>
                            ) : (
                                <Text style={[TEXTS.content]}>Tối đa <Text style={{ color: COLORS.black, fontWeight: '500' }}>{areaData.totalSeat}</Text> người</Text>
                            )}
                            {areaData.pets.length > 0 ? (
                                <View>
                                    <Text style={[TEXTS.subContent]}>Thú cưng</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 3
                                    }}>
                                        {areaData?.pets.length > 4 ? areaData?.pets.slice(0, 4).map((pet, index) => (
                                            (pet.avatar != null ? (
                                                <Image key={index} source={{ uri: pet.avatar }} style={AVATARS.mini} />
                                            ) : (
                                                <View key={index} style={AVATARS.mini}></View>
                                            ))
                                        )) : (
                                            <>
                                                {areaData?.pets.map((pet, index) => (
                                                    pet.avatar != null ? (
                                                        <Image key={index} source={{ uri: pet.avatar }} style={AVATARS.mini} />
                                                    ) : (
                                                        <View key={index} style={AVATARS.mini}></View>
                                                    )
                                                ))
                                                }
                                            </>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Text numberOfLines={1} style={[TEXTS.subContent]}>{SHOPS.noPet}</Text>
                                </View>
                            )}
                            <Text numberOfLines={2} style={[TEXTS.subContent]}>{areaData.description}</Text>
                        </View>
                    </View>

                </View>
                <View style={{
                    height: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    // paddingHorizontal: 2,
                    paddingVertical: 4,
                }}>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Coin coin={areaData.pricePerHour} size='min' />
                        <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>/1h</Text>
                    </View>
                    {reservation ? (
                        <Pressable
                            onPress={onPress}
                            disabled={(areaData?.availableSeat < count)}
                            style={[
                                BUTTONS.recMid,
                                {
                                    backgroundColor: isSelected ? 'transparent' :
                                        (areaData?.availableSeat < count || areaData?.availableSeat === 0) ? COLORS.gray2 : COLORS.primary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: isSelected ? 4 : 0,
                                }]}>
                            <Text style={[{ fontWeight: '500', color: isSelected ? COLORS.primary : COLORS.white, fontSize: SIZES.m }]}>
                                {isSelected
                                    ? 'Đang chọn'
                                    : areaData?.availableSeat < count
                                        ? 'Không đủ'
                                        : areaData?.availableSeat === 0
                                            ? 'Hết chỗ'
                                            : 'Đặt ngay'}
                            </Text>
                            {isSelected && (
                                <Ionicons name="checkmark-circle" size={ICONS.xm} color={COLORS.primary} />
                            )}
                        </Pressable>
                    ) : (
                        <>
                            {!shop && (
                                <Pressable
                                    onPress={onPress}
                                    style={[
                                        BUTTONS.recMid,
                                        {
                                            backgroundColor: COLORS.primary,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }]}>
                                    <Text style={[{
                                        fontWeight: '500',
                                        color: COLORS.white,
                                        fontSize: SIZES.m
                                    }]}> Đặt ngay
                                    </Text>
                                </Pressable>
                            )}
                        </>
                    )}

                </View>
            </View>
        </View>
    )
}

export default AreaCard

const styles = StyleSheet.create({
    selectedCard: {
        borderWidth: 1,
        borderColor: COLORS.primary
    }
})