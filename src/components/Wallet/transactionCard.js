import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Coin from './coin';
import { ALERTS, COLORS, SHADOWS, SIZES, TEXTS } from '../../constants';
import formatTimeTransaction from './formatTimeTransaction';

const TransactionCard = ({ transaction }) => {
    const renderIcon = () => {
        switch (transaction.transactionType) {
            case 'Reserve':
                return 'calendar-outline';
            case 'TopUp':
                return 'cash-outline';
            case 'BuyItem':
                return 'diamond-outline';
            case 'Donate':
                return 'gift-outline';
            case 'Refund':
                return 'refresh-circle-outline';
            case 'AddProducts':
                return 'bag-add-outline';
            case 'RemoveProducts':
                return 'bag-remove-outline';
            default:
                return 'alert-circle-outline';
        }
    };


    const statusMap = {
        Done: { text: ALERTS.success, color: COLORS.success },
        Cancel: { text: ALERTS.cancel, color: COLORS.error },
        Processing: { text: ALERTS.processing, color: COLORS.yellow },
        Return: { text: ALERTS.return, color: COLORS.primary }

    };

    const status = statusMap[transaction.transactionStatus] || { text: '', color: COLORS.black }

    return (
        <View style={[styles.container, SHADOWS.s]}>
            <View style={[styles.row]}>
                <View style={[styles.row, { gap: SIZES.xl, }]}>
                    <View style={{ backgroundColor: COLORS.primary100, borderRadius: 27, width: 54, height: 54, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={renderIcon()} size={32} color={COLORS.primary} />
                    </View>
                    <View style={{
                        flex: 1,
                    }}>
                        <Text numberOfLines={2} style={styles.title} >{transaction.content}</Text>
                        <Text style={styles.description} >{formatTimeTransaction(transaction.createdAt)}</Text>
                        <Text style={[TEXTS.subContent, { color: status.color, fontWeight: '500' }]}>{status.text}</Text>

                        <View style={[styles.column, { position: 'absolute', bottom: 0, right: 0, }]}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                {(transaction.transactionType === 'TopUp' && transaction.transactionStatus === 'Done') || (transaction.transactionType === 'Refund' && transaction.transactionStatus === 'Done') || (transaction.transactionType === 'RemoveProducts' && transaction.transactionStatus === 'Return')
                                    ? <Text style={{ fontSize: 20, color: COLORS.primary, fontWeight: 'bold' }}>+</Text>
                                    : (transaction.transactionStatus === 'Done')
                                        ? <Text style={{ fontSize: 20, color: COLORS.primary, fontWeight: 'bold' }}>-</Text>
                                        : null}
                                <Coin size='l' coin={transaction.amount} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 18,
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        fontWeight: 'bold',
        fontSize: SIZES.m,
        color: COLORS.black
    },
    description: {
        fontSize: SIZES.s,
        color: COLORS.gray2
    },
    column: {
        alignItems: 'flex-end'
    }
});

export default TransactionCard;
