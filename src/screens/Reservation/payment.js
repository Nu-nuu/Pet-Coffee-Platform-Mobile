import { Image, Pressable, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AREAS, AVATARS, BRS, COLORS, ICONS, RESERVATIONS, SHADOWS, SIZES, TEXTS } from '../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Coin from '../../components/Wallet/coin';
import formatTime7Reservation from '../../components/Reservation/formatTime7Reservation';
import formatDayReservation from '../../components/Reservation/formatDayReservation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

const Payment = ({ note, promotionPercent, promotionSelect, promotionData, onPromotionChange, onNoteChange, shopData, areaData, userData, count, selectedOrder, timeStart, timeEnd, pricePerHour, selectedDate, hour }) => {

    const [showArea, setShowArea] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const [noteText, setNoteText] = useState(note);

    const [totalPrice, setTotalPrice] = useState((pricePerHour * count * hour) - (pricePerHour * count * hour * (promotionPercent / 100)))

    useEffect(() => {
        setTotalPrice((pricePerHour * count * hour) - (pricePerHour * count * hour * (promotionPercent / 100)))
    }, [promotionPercent])

    const handleNoteTextChange = (text) => {
        setNoteText(text);
        onNoteChange(text);
    };

    const isPromotionSelected = (promotionId) => {
        return promotionId === promotionSelect;
    };

    const isPromotionAvailable = (promotion) => {
        const currentDate = new Date();
        const from = new Date(promotion.from);
        const to = new Date(promotion.to);

        if (currentDate >= from && currentDate <= to) {
            return true;
        }
        else if (currentDate < from) {
            return false;
        }
        else {
            return 'out';
        }
    };
    return (
        <ScrollView style={{
            backgroundColor: COLORS.bgr,
            height: '100%'
        }}>
            <View style={{
                padding: SIZES.m,
                flexDirection: 'column',
                gap: SIZES.s,
            }}>
                <Text style={{ fontWeight: 'bold', fontSize: SIZES.l, color: COLORS.black }}>Thông tin đặt chỗ của bạn</Text>
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
                        <Image source={{ uri: shopData.backgroundUrl }}
                            style={[{
                                width: '100%',
                                height: SIZES.height / 6,
                                borderRadius: 10
                            }]} />
                        <Text style={[{ color: COLORS.black, fontSize: SIZES.xl, alignItems: 'center', fontWeight: 'bold' }]}>{shopData.name}</Text>
                        <Text style={[TEXTS.subContent, { color: COLORS.gray3 }]}>{shopData.location}</Text>
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
                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{formatDayReservation(selectedDate)}</Text>
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
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{formatTime7Reservation(timeStart)}</Text>
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                width: SIZES.width / 5,
                                flexDirection: 'row',
                                alignItems: 'flex-end'
                            }}>
                                <Text style={[TEXTS.subContent, { color: COLORS.gray3 }]}>Đến</Text>
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{formatTime7Reservation(timeEnd)}</Text>
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
                            <Text style={[TEXTS.subContent, { color: COLORS.blackBold, fontWeight: '500' }]}>Bạn đã chọn:</Text>
                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{count} người, Tầng {selectedOrder}</Text>
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
                                    {areaData?.image ? (<Image source={{ uri: areaData.image }} style={[{ width: 132, height: 132, borderRadius: 10 }]} />)
                                        : (<View style={[{ width: 132, height: 132, backgroundColor: COLORS.gray1, borderRadius: 10 }]}></View>)}
                                    <View style={{
                                    }}>
                                        <View style={{
                                            height: '100%',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            // gap: 5,
                                            paddingTop: SIZES.s / 2,
                                            width: SIZES.width / 2
                                        }}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                                <Text numberOfLines={1} style={[TEXTS.content, { color: COLORS.black, fontWeight: 'bold' }]}>Tầng {areaData.order}</Text>
                                                <View
                                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                    <Coin coin={areaData.pricePerHour} size='min' />
                                                    <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>/1h</Text>
                                                </View>
                                            </View>

                                            {areaData?.pets.length > 0 ? (
                                                <View>
                                                    <Text style={[TEXTS.subContent]}>Thú cưng</Text>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: 3
                                                    }}>
                                                        {areaData.pets.map((pet, index) => (
                                                            <Image key={index} source={{ uri: pet.avatar }} style={{
                                                                height: 20,
                                                                width: 20,
                                                                borderRadius: 10,
                                                            }} />
                                                        ))}
                                                    </View>
                                                </View>
                                            ) : (
                                                <View>
                                                    <Text style={[TEXTS.subContent]}>{AREAS.noPet}</Text>
                                                </View>
                                            )}
                                            <Text numberOfLines={4} style={[TEXTS.subContent]}>{areaData.description}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    {/* ===============Thông tin cá nhân================ */}
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
                </View>
                {/* ===============Ưu đãi================ */}
                <View style={{
                    borderWidth: 1,
                    borderColor: COLORS.gray1,
                    borderRadius: SIZES.s,
                    padding: SIZES.m,
                    backgroundColor: COLORS.white,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s }}>
                        <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>Mã ưu đãi của {shopData.name}</Text>
                        <MaterialIcons
                            name="redeem"
                            size={ICONS.s}
                            color={COLORS.primary}
                        />
                    </View>
                    {promotionData?.length > 0 ? (
                        promotionData.map((promotion, index) => (
                            !promotion.isUsed && isPromotionAvailable(promotion) != 'out' && promotion.available > 0 ? (
                                <View
                                    key={index}
                                    style={{
                                        position: 'relative'
                                    }}>
                                    <Pressable
                                        onPress={() => {
                                            if (isPromotionSelected(promotion.id)) {
                                                onPromotionChange(null, 0);
                                            } else {
                                                onPromotionChange(promotion.id, promotion.percent);
                                            }
                                        }}
                                        style={[{
                                            marginTop: SIZES.s / 2,
                                            padding: SIZES.s / 2,
                                            borderRadius: BRS.out,
                                            height: SIZES.height / 9,
                                            borderWidth: 1,
                                            borderColor: isPromotionSelected(promotion.id) ? COLORS.primary : COLORS.gray1,
                                            position: 'relative',

                                        },]}>
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <View style={{
                                                flexDirection: 'column',
                                                gap: 5,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignSelf: 'flex-start',
                                                borderRadius: BRS.in,
                                                width: '25%',
                                                height: '100%'
                                            }}>
                                                <Image source={{ uri: shopData.avatarUrl }} alt='' style={AVATARS.min} />
                                                <Text style={[TEXTS.subContent, { fontWeight: '500', color: COLORS.black }]}>Đặt chỗ</Text>
                                            </View>
                                            <View style={{
                                                width: '73%',
                                                height: '100%'
                                            }}>
                                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>Giảm giá {promotion.percent}%</Text>
                                                {isPromotionAvailable(promotion) ? (
                                                    <>
                                                        <Text style={[TEXTS.subContent]}>Hết hạn: <Text style={{ color: COLORS.black }}>{format(promotion.to, 'dd/MM/yyyy')}</Text></Text>
                                                        <Text style={[TEXTS.subContent]}>Còn lại <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{promotion.available}</Text></Text>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Text style={[TEXTS.subContent]}>Có hiệu lực từ: <Text style={{ color: COLORS.black }}>{format(promotion.from, 'dd/MM/yyyy')}</Text></Text>
                                                        <Text style={[TEXTS.subContent]}>Số lượng <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{promotion.quantity}</Text></Text>
                                                    </>
                                                )}
                                                <Text style={{ fontSize: SIZES.xs, color: COLORS.blackBold, paddingTop: 5 }}>*Số lượng ưu đãi giới hạn một lần sử dụng</Text>
                                            </View>
                                            <Pressable
                                                onPress={() => {
                                                    if (isPromotionSelected(promotion.id)) {
                                                        onPromotionChange(null, 0);
                                                    } else {
                                                        onPromotionChange(promotion.id, promotion.percent);
                                                    }
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 10,
                                                }}>
                                                <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', },]}>
                                                    {isPromotionSelected(promotion.id) ?
                                                        <Ionicons name='checkmark-circle' size={ICONS.m} color={COLORS.primary} />
                                                        :
                                                        <Ionicons name='add-circle-outline' size={ICONS.m} color={COLORS.primary} />
                                                    }
                                                </Text>
                                            </Pressable>


                                        </View>
                                    </Pressable>
                                    {!isPromotionAvailable(promotion) && (
                                        <View style={{
                                            marginTop: SIZES.s / 2,
                                            position: 'absolute',
                                            backgroundColor: COLORS.none,
                                            borderRadius: BRS.out,
                                            height: SIZES.height / 9,
                                            borderWidth: 1,
                                            borderColor: COLORS.gray1,
                                            width: '100%',
                                            top: 0,
                                        }} />
                                    )}

                                </View>
                            ) : (promotionData.every(promotion => promotion.isUsed)) ? (
                                <Text style={[TEXTS.subContent]}>Bạn đã sử dụng hết ưu đãi của quán</Text>
                            ) : null
                        ))
                    ) : (
                        <View style={{
                            paddingVertical: SIZES.s / 2
                        }}>
                            <Text style={[TEXTS.subContent]}>Quán hiện tại chưa có mã ưu đãi</Text>
                        </View>
                    )}
                </View>

                {/* ===============Ghi chú================ */}
                <View style={{
                    borderWidth: 1,
                    borderColor: COLORS.gray1,
                    borderRadius: SIZES.s,
                    padding: SIZES.m,
                    backgroundColor: COLORS.white,
                }}>
                    <Pressable onPress={() => setShowNote(!showNote)} style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s }}>
                        <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>
                            {RESERVATIONS.noteAdd}
                        </Text>
                        <Ionicons name="pencil" color={COLORS.primary} size={ICONS.s} />
                    </Pressable>
                    {showNote && (
                        <TextInput
                            multiline
                            value={noteText}
                            onChangeText={handleNoteTextChange}
                            placeholder="Nhập ghi chú của bạn..."
                            style={{
                                borderBottomWidth: 1,
                                borderColor: COLORS.gray1,
                                paddingBottom: SIZES.s / 2,
                            }}
                        />
                    )}
                </View>
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
                            color: COLORS.black
                        }]}>Tổng cộng</Text>
                        <View style={{
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                        }}>
                            <Text style={styles.totalPrice}><Coin coin={totalPrice} size='xl' /></Text>
                            <Text></Text>
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
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Giá khu vực:</Text>
                                        <Coin coin={areaData.pricePerHour} size='min' />
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Số người:</Text>
                                        <Text style={[TEXTS.subContent, { color: COLORS.black, fontWeight: '500' }]}>x{count}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Tổng thời gian:</Text>
                                        <Text style={[TEXTS.subContent, { color: COLORS.black, fontWeight: '500' }]}>{hour}h</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Giảm giá:</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={[{ fontWeight: 'bold', fontSize: 16, color: COLORS.primary }]}>- </Text>
                                            <Coin coin={(pricePerHour * count * hour) - totalPrice} size='min' />
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center', paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderColor: COLORS.gray2 }}>
                                        <Text style={[TEXTS.subContent, { color: COLORS.black }]}>Tạm tính:</Text>
                                        <Coin coin={totalPrice} size='min' />
                                    </View>
                                </View>
                            )}
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Payment

const styles = StyleSheet.create({})