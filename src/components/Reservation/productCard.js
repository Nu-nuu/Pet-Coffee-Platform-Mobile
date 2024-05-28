import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { BUTTONS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import Coin from '../Wallet/coin';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductCard = ({ item, updateAmount, onQuantityChange, shop, resetQuantity }) => {
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setQuantity(0);
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
        <>
            {shop ? (
                <View style={{
                    padding: SIZES.m,
                }}>
                    <View style={[{
                        backgroundColor: COLORS.white,
                        height: SIZES.height / 4.7,
                        width: SIZES.width / 2 - SIZES.m * 4,
                        alignItems: 'center',
                        padding: SIZES.s,
                        borderRadius: 18,
                        justifyContent: 'center',
                    }, SHADOWS.s,]}>
                        <View style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 5,
                            width: SIZES.width / 2 - SIZES.m * 8,
                        }}>
                            {item.image ? (<Image source={{ uri: item.image }} style={[{ width: SIZES.height / 10, height: SIZES.height / 10, borderRadius: 10 }]} />)
                                : (<View style={[{ width: SIZES.height / 10, height: SIZES.height / 10, backgroundColor: COLORS.gray1, borderRadius: 10 }]}></View>)}
                            <View style={{
                            }}>
                                <Text numberOfLines={1} style={[TEXTS.content, { color: COLORS.black }]}>{item.name}</Text>
                                <Coin coin={item.price} size='min' />
                                <View style={styles.quantityContainer}>
                                    <Pressable
                                        style={[ICONS.coverDM]}
                                        onPress={decreaseQuantity}>
                                        <Ionicons name="remove-circle" color={quantity === 0 ? COLORS.gray2 : COLORS.primary} size={ICONS.xm} />
                                    </Pressable>
                                    <View style={{ width: 24, alignItems: 'center' }}>
                                        <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>{quantity}</Text>
                                    </View>
                                    <Pressable style={[ICONS.coverDM]} onPress={increaseQuantity}>
                                        <Ionicons name="add-circle" color={quantity === 99 ? COLORS.gray2 : COLORS.primary} size={ICONS.xm} />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            ) : (
                <View style={{
                    width: SIZES.width - SIZES.m * 4,
                    alignItems: 'flex-end',
                    paddingVertical: SIZES.s,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderColor: COLORS.gray1,
                }}>
                    <View style={{
                        width: SIZES.width / 2 - SIZES.m,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                    }}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 5,
                        }}>
                            <Text numberOfLines={1} style={[TEXTS.subContent, { color: COLORS.black }]}>{item.name}</Text>
                            <Coin coin={item.price} size='min' />
                        </View>
                    </View>

                    <View style={{
                        width: (SIZES.width / 2 - SIZES.m) / 6,
                        alignItems: 'flex-start',
                    }}>
                        <Text style={{ fontWeight: 'bold', color: COLORS.blackBold }}>x{item.quantity}</Text>
                    </View>
                    <View style={{
                        width: ((SIZES.width / 2 - SIZES.m) - (SIZES.width / 2 - SIZES.m) / 6) - SIZES.m,
                        alignItems: 'center'

                    }}>
                        <Coin coin={item.price * item.quantity} size='min' />
                    </View>
                </View>
            )}


        </>

    );
};


export default ProductCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: SIZES.s,
    },
    description: {
        flex: 1,
        marginRight: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SIZES.s,
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
