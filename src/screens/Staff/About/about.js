import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ICONS, SIZES, TEXTS } from '../../../constants';
import { Skeleton } from 'native-base';
import checkActivityShop from '../../../components/Profile/checkActivityShop';
import Coin from '../../../components/Wallet/coin';
import formatDayReservation from '../../../components/Reservation/formatDayReservation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { petCoffeeShopDetailSelector, userDataSelector } from '../../../store/sellectors';
import { getPetCoffeeShopDetailThunk } from '../../../store/apiThunk/petCoffeeShopThunk';
import Geolocation from '@react-native-community/geolocation';

const About = ({ shopId }) => {
    const [showRender, setShowRender] = useState(true);
    const shopData = useSelector(petCoffeeShopDetailSelector)
    const userData = useSelector(userDataSelector)

    const dispatch = useDispatch();
    const [createDay, setCreateDay] = useState(shopData?.createdAt || new Date());

    useEffect(() => {
        handleFetchData()
    }, [])

    const handleFetchData = async () => {
        Geolocation.getCurrentPosition(
            position => {
                let longitude = JSON.stringify(position.coords.longitude);
                let latitude = JSON.stringify(position.coords.latitude);
                dispatch(
                    getPetCoffeeShopDetailThunk({
                        id: shopId,
                        latitude: latitude,
                        longitude: longitude,
                    }),
                ).then(() => {
                    setShowRender(false);
                    setCreateDay(shopData.createdAt)
                });
            },
            error => console.log(error.message),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
            },
        );
    }

    return (
        <View style={{
            backgroundColor: COLORS.quaternary,
            padding: SIZES.m,
            minHeight: SIZES.height ,
        }}>
            <View
                style={{}}
            >
                <View style={{
                    borderBottomWidth: 1,
                    paddingBottom: SIZES.m,
                    borderColor: COLORS.gray2,
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Chi tiết</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingRight: SIZES.m,
                        paddingVertical: SIZES.s / 1.5,
                    }}>
                        <Ionicons name="location" size={ICONS.xm} color={COLORS.primary} />
                        {showRender ? (<Skeleton.Text lines={2} />) : (
                            <Text style={TEXTS.content}>
                                {shopData?.location}
                            </Text>
                        )}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingRight: SIZES.m,
                        paddingVertical: SIZES.s / 1.5,
                    }}>
                        <Ionicons name="call" size={ICONS.xm} color={COLORS.primary} />
                        {showRender ? (<Skeleton.Text lines={1} />) : (
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:${shopData?.phone}`)}>
                                <Text style={[TEXTS.content, { color: COLORS.primary }]}>
                                    {shopData?.phone}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingRight: SIZES.m,
                        paddingVertical: SIZES.s / 1.5,
                    }}>
                        <Ionicons name="mail" size={ICONS.xm} color={COLORS.primary} />
                        {showRender ? (<Skeleton.Text lines={1} />) : (
                            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${shopData?.email}`)}>
                                <Text style={[TEXTS.content, { color: COLORS.primary }]}>
                                    {shopData?.email}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingRight: SIZES.m,
                        paddingVertical: SIZES.s / 1.5,
                    }}>
                        <Ionicons name="time" size={ICONS.xm} color={COLORS.primary} />
                        {showRender ? (<Skeleton.Text lines={1} />) : (
                            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <Text style={[TEXTS.content]}>
                                    {checkActivityShop(shopData?.startTime, shopData?.endTime)}
                                </Text>
                                {!shopData?.startTime && !shopData?.endTime ?
                                    (null) : (
                                        <Text style={TEXTS.content}> {shopData?.startTime} - {shopData?.endTime}</Text>
                                    )}
                            </View>

                        )}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingRight: SIZES.m,
                        paddingVertical: SIZES.s / 1.5,
                    }}>
                        <Ionicons name="cash" size={ICONS.xm} color={COLORS.primary} />
                        {showRender ? (<Skeleton.Text lines={2} />) : (
                            <View
                                style={{ alignItems: 'center', flexDirection: 'row', gap: 2 }}
                            >
                                <Text style={TEXTS.content}>Mức giá </Text>
                                <Coin coin={shopData?.minPriceArea} size='min' />
                                <Text style={[TEXTS.content, { color: COLORS.primary }]}> - </Text>
                                <Coin coin={shopData?.maxPriceArea} size='min' />
                            </View>
                        )}
                    </View>
                </View>
                <View style={{ paddingTop: SIZES.m }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin về Quán</Text>
                    {/* Ngày tạo */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingRight: SIZES.m,
                        paddingVertical: SIZES.s / 1.5,
                    }}>
                        <View style={ICONS.coverD}>
                            <Ionicons name="time" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
                        </View>
                        {showRender ? (<Skeleton.Text lines={2} />) : (
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Ngày tạo - {shopData?.name}</Text>
                                <Text style={TEXTS.content}>{formatDayReservation(createDay)}</Text>
                            </View>
                        )}
                    </View>
                    {/* Người đại diện */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingRight: SIZES.m,
                        paddingVertical: SIZES.s / 1.5,
                    }}>
                        <View style={ICONS.coverD}>
                            <Ionicons name="person" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
                        </View>
                        {showRender ? (<Skeleton.Text lines={2} />) : (
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Người đại diện</Text>
                                <Text style={TEXTS.content}>{shopData?.createdBy.fullName}</Text>
                            </View>
                        )}
                    </View>
                    {/* Mã số thuế */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingRight: SIZES.m,
                        paddingVertical: SIZES.s / 1.5,
                    }}>
                        <View style={ICONS.coverD}>
                            <Ionicons name="business" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
                        </View>
                        {showRender ? (<Skeleton.Text lines={2} />) : (
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={[TEXTS.content, { color: COLORS.black }]}>Mã số thuế</Text>
                                <Text style={TEXTS.content}>{shopData?.taxCode}</Text>
                            </View>
                        )}
                    </View>
                    {/* Website */}
                    {shopData?.websiteUrl && (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                            paddingRight: SIZES.m,
                            paddingVertical: SIZES.s / 1.5,
                        }}>
                            <View style={ICONS.coverD}>
                                <Ionicons name="globe" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
                            </View>
                            {showRender ? (<Skeleton.Text lines={2} />) : (
                                <View style={{
                                    flexDirection: 'column',
                                }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Website</Text>
                                    <Text style={TEXTS.content}>{shopData?.websiteUrl}</Text>
                                </View>
                            )}
                        </View>
                    )}
                    {/* Facebook */}
                    {shopData?.fbUrl && (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                            paddingRight: SIZES.m,
                            paddingVertical: SIZES.s / 1.5,
                        }}>
                            <View style={ICONS.coverD}>
                                <Ionicons name="logo-facebook" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
                            </View>
                            {showRender ? (<Skeleton.Text lines={2} />) : (
                                <View style={{
                                    flexDirection: 'column',
                                }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Facebook</Text>
                                    <Text style={TEXTS.content}>{shopData?.fbUrl}</Text>
                                </View>
                            )}
                        </View>
                    )}
                    {/* Instagram */}
                    {shopData?.instagramUrl && (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                            paddingRight: SIZES.m,
                            paddingVertical: SIZES.s / 1.5,
                        }}>
                            <View style={ICONS.coverD}>
                                <Ionicons name="logo-instagram" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
                            </View>
                            {showRender ? (<Skeleton.Text lines={2} />) : (
                                <View style={{
                                    flexDirection: 'column',
                                }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Instagram</Text>
                                    <Text style={TEXTS.content}>{shopData?.instagramUrl}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>

        </View>
    )
}

export default About

const styles = StyleSheet.create({})