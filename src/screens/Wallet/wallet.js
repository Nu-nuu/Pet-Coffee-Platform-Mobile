import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ItemCard from '../../components/Wallet/itemCard';
import TransactionCard from '../../components/Wallet/transactionCard';
import Coin from '../../components/Wallet/coin';
import { BUTTONS, COLORS, SIZES, TEXTS, USERS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { walletSelector } from '../../store/sellectors';
import { getWalletThunk } from '../../store/apiThunk/walletThunk';
import Loading from '../../components/Alert/modalSimple/loading';

const Wallet = () => {
    const dispatch = useDispatch();
    const walletData = useSelector(walletSelector);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        {
            dispatch(getWalletThunk())
                .unwrap()
                .then(() => setLoading(false))
                .catch(() => setLoading(false));
        }
    }, []);

    const navigation = useNavigation();

    const seeMorePress = () => {
        navigation.navigate('Lịch sử giao dịch', {
        });
    };

    const buyMorePress = () => {
        navigation.navigate('Cửa hàng quà tặng')
    };
    const handleTransactionPress = (transaction) => {
        navigation.navigate('TransactionDetail', { transaction });
    };

    return (

        <View style={styles.container}>
            {loading ? (
                <Loading isModal={false} />
            ) : (
                <>
                    <View style={{ padding: SIZES.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                            <Coin size='max' coin={walletData.balance} />
                        </View>
                    </View>
                    <View>
                        <View style={styles.row}>
                            <Text style={TEXTS.title}>Quà tặng của bạn</Text>
                            <Pressable
                                onPress={buyMorePress}
                                style={[
                                    BUTTONS.recMid,
                                    {
                                        backgroundColor: COLORS.primary,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }]}>
                                <Text style={[{
                                    fontWeight: '500',
                                    color: COLORS.white,
                                    fontSize: SIZES.m
                                }]}>Cửa hàng</Text>
                            </Pressable>
                        </View>
                        {(!walletData.items || walletData.items.length === 0) && (
                            <View style={{
                                alignItems: 'center', justifyContent: 'center',
                                padding: SIZES.m,
                                // marginLeft: SIZES.width / 6,
                            }}>
                                <Text style={TEXTS.content} >{USERS.noItems}</Text>
                                <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                                    height: SIZES.height / 6,
                                    width: SIZES.height / 6,
                                    alignSelf: 'center',
                                }} />
                            </View>
                        )}
                        {walletData.items && walletData.items.length > 0 && (
                            <FlatList
                                data={walletData.items}
                                horizontal
                                renderItem={({ item }) => <ItemCard item={item} shop={false} />}
                                keyExtractor={(item) => item.itemId.toString()}
                                style={{paddingBottom: SIZES.m}}
                            />
                        )}
                    </View>
                    <View style={styles.row}>
                        <Text style={TEXTS.title}>Lịch sử giao dịch</Text>
                        <Pressable onPress={seeMorePress}>
                            <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Xem thêm</Text>
                        </Pressable>
                    </View>
                    {walletData.transactions && walletData.transactions.length > 0 && (
                        <FlatList
                            data={walletData.transactions.slice(0, 4)}
                            renderItem={({ item }) =>
                                <Pressable style={{
                                    paddingBottom: SIZES.s / 2,
                                }}
                                    onPress={() => handleTransactionPress(item)}>
                                    <TransactionCard transaction={item} />
                                </Pressable>
                            }

                            keyExtractor={(item) => item.id.toString()}
                        />
                    )}
                    {(!walletData.transactions || walletData.transactions.length === 0) && (
                        <View style={{
                            alignItems: 'center', justifyContent: 'center',
                            padding: SIZES.m,
                            // marginLeft: SIZES.width / 6,
                        }}>
                            <Text style={TEXTS.content} >{USERS.noTransaction}</Text>
                            <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                                height: SIZES.height / 6,
                                width: SIZES.height / 6,
                                alignSelf: 'center',
                            }} />
                        </View>
                    )}
                </>
            )}
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.m,
        backgroundColor: COLORS.bgr
    },
    link: {
        color: COLORS.blackBold,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        marginTop: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: SIZES.xl,
        color: COLORS.blackBold
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    noItemsContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    noItemsText: {
        fontSize: SIZES.l,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noTransactionsContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    noTransactionsText: {
        fontSize: SIZES.l,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default Wallet;
