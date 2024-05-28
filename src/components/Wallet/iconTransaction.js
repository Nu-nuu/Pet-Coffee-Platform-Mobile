import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SHADOWS, SIZES } from '../../constants';

const IconTransaction = ({ name, size, type, selected }) => {
    return (
        <View style={[styles.iconContainer, SHADOWS.s, selected === type && selected !== styles.icon && styles.selectedIcon]}>
            <Ionicons name={name} size={size} color={COLORS.primary} />
            <Text style={{ fontSize: SIZES.s, color: COLORS.gray3, fontWeight: '500' }}>{renderIcon(type)}</Text>
        </View>
    );
};

const renderIcon = (type) => {
    switch (type) {
        case 'TopUp':
            return 'Nạp tiền';
        case 'BuyItem':
            return 'Quà tặng';
        case 'Donate':
            return 'Ủng hộ';
        case 'Reserve':
            return 'Đặt chỗ';
        case 'Refund':
            return 'Hoàn tiền';
        case 'AddProducts':
            return 'Đặt đồ uống';
        case 'RemoveProducts':
            return 'Hủy đồ uống';
        default:
            return 'Khác';
    }
};


const styles = StyleSheet.create({
    iconContainer: {
        // marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: SIZES.m / 2,
        borderRadius: SIZES.s,
        gap: 4,
    },
    selectedIcon: {
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    icon: {
        borderWidth: 1,
        borderColor: 'transparent',
    },
});

export default IconTransaction;
