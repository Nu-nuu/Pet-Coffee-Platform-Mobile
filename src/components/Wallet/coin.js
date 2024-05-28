import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants';
import formatCoin from './formatCoin';

const Coin = ({ coin, size }) => {
  const sizes = {
    max: 50,
    min: 16,
    l: 20,
    mid: 24,
    xl: 36,
  };

  const coinSize = sizes[size];
  return (
    <View style={[styles.row]}>
      <Text style={[styles.title, { fontSize: coinSize, color: COLORS.primary }]}>{formatCoin(coin)}</Text>
      <Image style={[styles.coin, { width: coinSize, height: coinSize }]} source={require('../../../assets/coin.png')} />
    </View>
  );
};
export default Coin;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  coin: {
    resizeMode: 'contain',
  },
});
