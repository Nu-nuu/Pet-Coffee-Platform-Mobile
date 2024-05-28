import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Coin from '../Wallet/coin'
import { COLORS, SHADOWS, SIZES, TEXTS } from '../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import formatCoin from '../Wallet/formatCoin';

const TopupCard = ({ item, onSelect, selectedPrice }) => {
    const isSelected = item.price === selectedPrice;

    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SIZES.m,
        }}>
            <Pressable
                onPress={() => onSelect(item.price)}
                style={[{
                    backgroundColor: COLORS.white,
                    borderColor: isSelected ? COLORS.primary : COLORS.quaternary,
                    borderRadius: SIZES.s,
                    borderWidth: isSelected ? 2 : 1,
                    padding: SIZES.m,
                    paddingHorizontal: SIZES.s/2,

                    margin: SIZES.s / 4,
                    marginVertical: SIZES.s,
                    width: SIZES.width / 3.2   ,
                    height: (SIZES.width / 3 - SIZES.s * 4),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'column'
                }, SHADOWS.s]}>
                <View>
                    <Coin coin={item.coin} size='min' />
                </View>
                    <Text
                        style={[TEXTS.subContent, {
                            color: COLORS.black,
                            fontWeight: '500',
                        }]}
                    >{formatCoin(item.price)} VNĐ</Text>
            </Pressable>
            {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={{ position: 'absolute', top: '10%', right: "0%" }} />
            )}
        </View>
    )
}

export default TopupCard

const styles = StyleSheet.create({})