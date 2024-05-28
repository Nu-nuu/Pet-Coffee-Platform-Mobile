import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getWalletThunk } from '../../store/apiThunk/walletThunk';
import { useDispatch } from 'react-redux';
import { COLORS, SIZES } from '../../constants';

const ReloadBalance = ({ size, onReload }) => {
    const dispatch = useDispatch()

    const sizes = {
        max: 50,
        min: 16,
        mid: 24,
    };
    const reloadSize = sizes[size];

    const handleReload = async () => {
        try {
            onReload(true);
            await dispatch(getWalletThunk());
        } catch (error) {
        } finally {
            onReload(false);
        }
    };


    return (
        <View style={{ paddingHorizontal: SIZES.s }}>
            <Pressable onPress={handleReload}>
                <Ionicons name="reload-circle" size={reloadSize} color={COLORS.primary} />
            </Pressable>
        </View>
    )
}

export default ReloadBalance;

const styles = StyleSheet.create({});
