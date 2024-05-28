import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Menu, Modal, NativeBaseProvider } from 'native-base';
import { AVATARS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { petCoffeeShopDetailSelector, userDataSelector } from '../../../store/sellectors';
import { getPetCoffeeShopDetailThunk } from '../../../store/apiThunk/petCoffeeShopThunk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SkeletonEvent from '../../../components/Alert/skeletonEvent';
import Geolocation from '@react-native-community/geolocation';

const Shops = () => {
    const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();

    const userData = useSelector(userDataSelector);
    const shopData = useSelector(petCoffeeShopDetailSelector);

    useEffect(() => {
        setShowLoadingModal(true);
        Geolocation.getCurrentPosition(
            position => {
                let longitude = JSON.stringify(position.coords.longitude);
                let latitude = JSON.stringify(position.coords.latitude);
                if (userData?.shopResponses?.length > 0) {
                    dispatch(
                        getPetCoffeeShopDetailThunk({
                            id: userData?.shopResponses[0]?.id,
                            longitude: longitude,
                            latitude: latitude,
                        }),
                    ).then(() => {
                        setShowLoadingModal(false);
                    });
                }
            },
            error => console.log(error.message),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
            },
        );
    }, [userData]);

    return (
        <NativeBaseProvider>
            {showLoadingModal ? (
                <SkeletonEvent />
            ) : (
                <View style={{ backgroundColor: COLORS.bgr }}>
                    <View>
                        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                            <Pressable onPress={() => setIsOpen(false)}>
                                <Image
                                    source={{ uri: shopData.avatarUrl }}
                                    alt=""
                                    style={{ width: 350, height: 500, objectFit: 'contain' }}
                                />
                            </Pressable>
                        </Modal>
                        <Modal
                            isOpen={isBackgroundOpen}
                            onClose={() => setIsBackgroundOpen(false)}>
                            <Pressable onPress={() => setIsBackgroundOpen(false)}>
                                <Image
                                    source={{ uri: shopData.backgroundUrl }}
                                    alt=""
                                    style={{ width: 350, height: 500, objectFit: 'contain' }}
                                />
                            </Pressable>
                        </Modal>
                        <View style={{
                            backgroundColor: COLORS.bgr,
                        }}>
                            <Pressable
                                onPress={() => {
                                    setIsBackgroundOpen(true);
                                }}>
                                <Image
                                    source={{ uri: shopData.backgroundUrl }}
                                    alt=""
                                    style={styles.backgroundImage}
                                />
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    setIsOpen(true);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '20%',
                                    left: SIZES.m,
                                }}>
                                <Image
                                    source={{ uri: shopData.avatarUrl }}
                                    alt=""
                                    style={AVATARS.max}
                                />
                            </Pressable>
                            <View
                                style={{
                                    padding: SIZES.m,
                                    marginTop: SIZES.xl,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: SIZES.xs / 2,
                                }}
                            >
                                <Text style={TEXTS.titleMax}>{shopData.name}</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>{shopData.totalFollow} </Text>
                                    <Text style={TEXTS.content}>người theo dõi</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Text style={TEXTS.content}>
                                        Cà phê
                                        {shopData.type === 'Cat'
                                            ? ' Mèo'
                                            : shopData.type === 'Dog'
                                                ? ' Chó'
                                                : ' Chó và Mèo'}{' '}
                                    </Text>
                                    <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Ionicons name="navigate-circle" size={ICONS.s} color={COLORS.primary} />
                                    <Text style={TEXTS.subContent}>{shopData?.distance?.toFixed(2)} Km</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}>
                                    <Pressable
                                        style={{
                                            paddingVertical: SIZES.s,
                                            backgroundColor: COLORS.gray1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                            gap: SIZES.s,
                                            height: 48,
                                            width: 169 * 2 + SIZES.m,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Ionicons name="pencil" size={ICONS.xm} color={COLORS.black} />
                                        <Text style={{ fontSize: SIZES.m, color: COLORS.black, fontWeight: '500' }}>Chỉnh sửa thông tin quán</Text>
                                    </Pressable>
                                    <Menu
                                        w="190"
                                        marginTop={3}
                                        marginRight={5}
                                        trigger={triggerProps => {
                                            return (
                                                <Pressable
                                                    accessibilityLabel="More options menu"
                                                    {...triggerProps}
                                                    style={[{
                                                        paddingVertical: SIZES.s,
                                                        backgroundColor: COLORS.gray1,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }, BUTTONS.cub]}
                                                >
                                                    <Ionicons name="ellipsis-horizontal" size={ICONS.s} />
                                                </Pressable>

                                            );
                                        }}>
                                        <Menu.Item
                                        >
                                            <Ionicons name="navigate-circle-outline" size={ICONS.xm} color={COLORS.black} />
                                            <Text style={{ fontSize: 16, color: 'black' }}>Đi tới</Text>
                                        </Menu.Item>
                                    </Menu>

                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )
            }
        </NativeBaseProvider >
    )
}

export default Shops

const styles = StyleSheet.create({})