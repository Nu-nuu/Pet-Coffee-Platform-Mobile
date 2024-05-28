import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, ICONS, SIZES, TEXTS } from '../../constants';
import { useSelector } from 'react-redux';
import { petCoffeeShopDetailSelector } from '../../store/sellectors';

const Person = ({ seat, maxAvailableSeat, onCountChange }) => {
    const shopData = useSelector(petCoffeeShopDetailSelector)
    const [count, setCount] = useState(seat);
    const iconName = count > 1 ? 'people' : 'person';
    const decreaseCount = useCallback(() => {
        if (count > 0) {
            setCount(prevCount => prevCount - 1);
            onCountChange(count - 1);
        }
    }, [count, onCountChange]);

    const increaseCount = useCallback(() => {
        if (count < shopData.maxSeat) {
            setCount(prevCount => prevCount + 1);
            onCountChange(count + 1);
        }
    }, [count, onCountChange]);
    return (
        <View style={{paddingRight: SIZES.s/2}}>
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <Ionicons name={iconName} size={ICONS.m} color={count === (maxAvailableSeat ?? shopData.maxSeat) ? COLORS.gray2 : COLORS.primary} />
                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Số lượng người</Text>
                </View>
                <View style={styles.quantityContainer}>
                    <Pressable style={[ICONS.coverD]} onPress={decreaseCount} disabled={count === 0}>
                        <Ionicons name="remove-circle" size={ICONS.m} color={count === 0 ? COLORS.gray2 : COLORS.primary} />
                    </Pressable>
                    <View style={{ width: 36, alignItems: 'center' }}>
                        <Text style={TEXTS.heading}>{count}</Text>
                    </View>
                    <Pressable
                        style={[ICONS.coverD]}
                        onPress={increaseCount}
                        disabled={count >= (maxAvailableSeat ?? shopData.maxSeat)}
                    >
                        <Ionicons
                            name="add-circle"
                            size={ICONS.m}
                            color={count >= (maxAvailableSeat ?? shopData.maxSeat) ? COLORS.gray2 : COLORS.primary}
                        />
                    </Pressable>
                </View>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
                {count === (maxAvailableSeat ?? shopData.maxSeat) &&
                    (
                        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                            <Ionicons name="alert-circle" size={ICONS.xs} color={COLORS.error} />
                            <Text style={[TEXTS.subContent, { color: COLORS.error }]}>
                                {maxAvailableSeat
                                    ? `Giới hạn hiện tại của quán là ${maxAvailableSeat} người`
                                    : `Giới hạn một tầng của quán là ${shopData.maxSeat} người`
                                }
                            </Text>
                        </View>
                    )
                }
            </View>
        </View>

    );
};

const styles = StyleSheet.create({

    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SIZES.s / 2,
        width: SIZES.width / 3.4,
        height: 48,
        borderStartWidth: 1,
        borderColor: COLORS.gray1,
        padding: SIZES.s
    },
    countText: {
        fontSize: 60,
        fontWeight: 'bold',
        marginHorizontal: SIZES.s,
    },
    countContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SIZES.xl
    },
    personText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: SIZES.s,
    },
});

export default Person;
