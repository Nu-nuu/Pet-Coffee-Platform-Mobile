import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { BRS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CardShop = ({ item, navigation, followedShopIds, userLatitude, userLongitude }) => {
    const checkFollow = followedShopIds?.includes(item.id);
    return (
        <Pressable onPress={() => navigation.navigate('ShopDetail', { userLatitude: userLatitude, userLongitude: userLongitude, id: item.id, shopData: item, checkFollow })}>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.shopImageContainer}>
                        <Image
                            source={{
                                uri: item.avatarUrl,
                            }}
                            style={styles.shopImage}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'flex-start', marginLeft: SIZES.m, marginTop: 14 }}>
                    <View style={styles.shopDetail}>
                        <Text numberOfLines={1} style={TEXTS.heading}>{item.name}</Text>
                        <View style={styles.shopCategory}>
                            <Text style={TEXTS.subContent}>
                                Cà phê
                                {item.type === 'Cat'
                                    ? ' Mèo'
                                    : item.type === 'Dog'
                                        ? ' Chó'
                                        : ' Chó và Mèo'}
                            </Text>
                            <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
                        </View>
                        <View style={styles.shopHeader}>
                            <Ionicons name="navigate-circle" size={15} color={COLORS.primary} />
                            <Text style={TEXTS.subContent}>{item?.distance?.toFixed(2)} Km</Text>
                        </View>
                    </View>
                </View>
                {item.hasPromotion && (
                    <View style={[ICONS.coverPro, {
                        position: 'absolute',
                        top: "7%",
                        right: "7%",
                    }]}>
                        <MaterialIcons
                            name="redeem"
                            size={ICONS.xm}
                            color={COLORS.primary}
                        />
                    </View>
                )}
            </View>
        </Pressable>
    );
};

export default CardShop;

const styles = StyleSheet.create({
    shopContainer: {
        width: 227,
        height: 235,
        borderRadius: BRS.out,
        paddingTop: SIZES.xs,
        backgroundColor: COLORS.white,
        flexDirection: 'column',
        position: 'relative'
    },
    shopImageContainer: {
        width: 207,
        height: 131,
        borderRadius: BRS.in,
        overflow: 'hidden',

    },
    shopImage: {
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    shopDetail: {
        maxWidth: 198,
        height: 68,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    shopTitle: {
        fontWeight: 'bold',
        fontSize: SIZES.l,
        marginBottom: 2,
        color: COLORS.black,

    },
    shopDistance: {
        gap: 2,
    },
    shopHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,

    },
    shopText: {
        fontSize: SIZES.s,
    },
    shopCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.xs / 2,
    },
});
