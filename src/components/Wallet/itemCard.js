import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { BRS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import Coin from './coin';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ItemCard = ({ item, shop, updateAmount, onQuantityChange, resetQuantity }) => {
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setQuantity(0)
    }, [resetQuantity]);

    const decreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(prevQuantity => prevQuantity - 1);
            updateAmount(-item.price);
            onQuantityChange(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < 99) {
            setQuantity(prevQuantity => prevQuantity + 1);
            updateAmount(item.price);
            onQuantityChange(quantity + 1);
        }
    };

    return (
        <View>
            {shop ? (
                <View style={[styles.containerShop, SHADOWS.s]}>
                    <Image source={{ uri: item.icon }} style={styles.imageShop} />
                    <Text numberOfLines={1} style={[styles.title, { color: COLORS.black, paddingHorizontal: 5 }]}>{item.name}</Text>
                    <View>
                        <Coin size='min' coin={item.price} />
                        <View style={{
                            
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: SIZES.s,
                                paddingVertical: SIZES.s / 2,
                            }}>
                                <View style={styles.quantityContainer}>
                                    <Pressable
                                        style={[ICONS.coverDS]}
                                        disabled={quantity === 0}
                                        onPress={decreaseQuantity}>
                                        <Ionicons name="remove-circle"
                                            color={quantity > 0 ? COLORS.primary : COLORS.gray2}
                                            size={ICONS.s}
                                        />
                                    </Pressable>
                                    <View style={{ width: 16, alignItems: 'center' }}>
                                        <Text style={[TEXTS.subContent, { fontWeight: '500', color: COLORS.black }]}>{quantity}</Text>
                                    </View>
                                    <Pressable
                                        style={[ICONS.coverDS]}
                                        disabled={quantity === 99}
                                        onPress={increaseQuantity}>
                                        <Ionicons
                                            name="add-circle"
                                            color={quantity < 99 ? COLORS.primary : COLORS.gray2}
                                            size={ICONS.s}
                                        />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            ) : (
                <View
                    style={{
                        position: 'relative'
                    }}>
                    <View style={[styles.container, {
                        position: 'absolute',
                        backgroundColor: COLORS.female200,
                        top: 5,
                        left: SIZES.s / 2,
                        width: SIZES.width / 3 - SIZES.s * 2 - SIZES.s,
                        borderRadius: BRS.in
                    }, SHADOWS.sfe]} />
                    <Pressable
                        style={[styles.container, SHADOWS.s,
                        ]}>
                        <View style={{ position: 'relative', paddingHorizontal: SIZES.s }}>
                            <Image source={{ uri: item.icon }} alt='' style={styles.image} />
                            <View style={{
                                width: 0,
                                height: 0,
                                borderTopWidth: 7.5,
                                borderRightWidth: 7.5,
                                borderBottomWidth: 0,
                                borderLeftWidth: 0,
                                borderTopColor: COLORS.gray2,
                                borderRightColor: 'transparent',
                                borderBottomColor: 'transparent',
                                borderLeftColor: 'transparent',
                                position: 'absolute',
                                top: 12,
                                right: -8.3,
                            }} />
                            <View style={[{
                                position: 'absolute',
                                borderTopStartRadius: 14,
                                borderBottomStartRadius: 14,
                                width: 38,
                                height: 24,
                                top: -10, right: -8,
                                paddingLeft: 10,
                                justifyContent: 'center',
                                backgroundColor: COLORS.quaternary,
                            }]}>
                                <Text style={[styles.title, { color: COLORS.black }]}>x{item.totalItem}</Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingBottom: SIZES.s / 2,
                            width: SIZES.width / 3 - SIZES.s * 2 - SIZES.s * 2,
                        }}>
                            <Text numberOfLines={1} style={[styles.title, {
                                color: COLORS.black,
                                paddingVertical: SIZES.s / 2,
                            }]}>{item.name}</Text>
                            <Coin coin={item.price} size='min' />
                        </View>
                    </Pressable>

                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: SIZES.s,
    },
    container: {
        backgroundColor: COLORS.white,
        marginVertical: SIZES.s,
        marginHorizontal: SIZES.s / 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: BRS.in,
        borderWidth: 1,
        borderColor: 'transparent',
        width: SIZES.width / 3 - SIZES.s * 2,
        height: (SIZES.width / 3 - SIZES.s * 2) * 1.375,
        paddingTop: SIZES.s,
    },
    containerShop: {
        backgroundColor: COLORS.white,
        marginVertical: SIZES.s,
        marginHorizontal: SIZES.s / 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: BRS.in,
        borderWidth: 1,
        borderColor: 'transparent',
        width: SIZES.width / 3 - SIZES.s * 2,
        height: (SIZES.width / 3 - SIZES.s * 2) * 1.375,
        paddingTop: SIZES.s,
    },
    image: {
        width: SIZES.width / 3 - SIZES.s * 2 - SIZES.s * 2,
        height: SIZES.width / 3 - SIZES.s * 2 - SIZES.s * 2,
        borderRadius: 5
    },
    imageShop: {
        width: SIZES.width / 3 - SIZES.s * 2 - SIZES.s * 2 - SIZES.s * 2,
        height: SIZES.width / 3 - SIZES.s * 2 - SIZES.s * 2 - SIZES.s * 2,
        borderRadius: 5
    },
    title: {
        fontWeight: 'bold',
    },
    quantityButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    quantity10: {
        width: 19,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    quantity: {
        width: 19,
        paddingLeft: 4,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
    },
});

export default ItemCard;
