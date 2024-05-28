import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, Keyboard, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BRS, COLORS, ICONS, SHADOWS, SHOPS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { searchPetCoffeeShopsThunk } from '../../store/apiThunk/petCoffeeShopThunk';
import SkeletonLoading from '../../components/Alert/skeletonLoading';
import { NativeBaseProvider } from 'native-base';
import SkeletonArea from '../../components/Alert/skeletonArea';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SearchPage = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { followedShopIds } = route.params

    const debounce = useCallback((func, delay) => {
        let timeoutId;
        return (...args) => {
            setLoading(true);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    }, []);

    const performSearch = debounce((searchQuery) => {
        dispatch(searchPetCoffeeShopsThunk({
            searchQuery,
            pageSize: 5,
            pageNumber: 1,
        }))
            .unwrap()
            .then((res) => {
                setData(res);
            })
            .catch((error) => {
                console.error('Error searching:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, 300);

    const handleTextChange = (searchQuery) => {
        setText(searchQuery);
        performSearch(searchQuery);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={[{
                    marginRight: SIZES.s,
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 10,
                    width: SIZES.width / 1.5,
                    paddingHorizontal: SIZES.s,
                    backgroundColor: COLORS.bgr,
                    borderRadius: BRS.out,
                    height: 40
                }]}>
                    <Ionicons name="search" size={ICONS.m} color={COLORS.black} />
                    <TextInput
                        onChangeText={handleTextChange}
                        value={text}
                        autoFocus={true}
                        style={{
                            width: '90%',
                        }}
                    />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: SIZES.s
                }} onPress={() => navigation.goBack()}>
                    <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>Hủy</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, text, handleTextChange]);

    const listEmpty = () => {
        if (!text) {
            return (
                <>
                    <View style={{}}>
                        <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Gợi ý</Text>
                    </View>
                    <View>
                        <FlatList
                            data={['hiraw', 'Alaska', 'Cafe', 'Cherry', 'bau cat']}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => handleTextChange(item)}
                                    style={[{
                                        backgroundColor: COLORS.white,
                                        padding: SIZES.s,
                                        margin: SIZES.s / 2,
                                        borderRadius: BRS.in
                                    }, SHADOWS.s]}
                                >
                                    <Text>{item}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </>
            );
        } else {
            return (
                <View style={{
                    alignItems: 'center', justifyContent: 'center',
                    padding: SIZES.m
                }}>
                    <Text style={TEXTS.content} >{SHOPS.noShop} '{text}'</Text>
                    <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                        height: SIZES.height / 6,
                        width: SIZES.height / 6,
                        alignSelf: 'center',
                    }} />
                </View>
            );
        }
    };

    const renderCafeItem = ({ item }) => {
        const checkFollow = followedShopIds?.includes(item.id);
        return (
            <Pressable
                onPress={() => navigation.navigate('ShopDetail', { id: item.id, shopData: item, checkFollow })}
                style={{
                    marginBottom: 12
                }} >
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
                    <View style={{ alignItems: 'flex-start', marginLeft: SIZES.m, alignSelf: 'flex-start', paddingTop: 10 }}>
                        <View style={styles.shopDetail}>
                            <Text numberOfLines={2} style={TEXTS.heading}>{item.name}</Text>
                            <View style={styles.shopCategory}>
                                <Text style={TEXTS.subContent}>
                                    Cà phê
                                    {item.type === 'Cat'
                                        ? ' Mèo'
                                        : item.type === 'Dog'
                                            ? ' Chó'
                                            : ' Chó và Mèo'}{' '}
                                </Text>
                                <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
                            </View>
                            {/* <View style={styles.shopHeader}>
                                <Ionicons name="navigate-circle" size={15} color={COLORS.primary} />
                                <Text style={TEXTS.subContent}>{item?.distance?.toFixed(2)} Km</Text>
                            </View> */}
                            <View style={styles.shopHeader}>
                                <Ionicons name="call" size={15} color={COLORS.primary} />
                                <Text style={[TEXTS.subContent]}>{item.phone}</Text>
                            </View>
                            <View style={styles.shopHeader}>
                                <Ionicons name="mail" size={15} color={COLORS.primary} />
                                <Text style={TEXTS.subContent}>{item.email}</Text>
                            </View>
                        </View>
                    </View>
                    {item.hasPromotion && (
                        <View style={[ICONS.coverPro, {
                            position: 'absolute',
                            top: "2%",
                            right: "2%",
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
    }

    return (
        <NativeBaseProvider>
            <View style={{ flex: 1, backgroundColor: COLORS.bgr }}>
                {loading ? (
                    <View style={{ padding: SIZES.m }}>
                        <SkeletonArea />
                    </View>
                ) : (
                    <>
                        {data && (
                            <View style={{ paddingHorizontal: SIZES.m, paddingTop: SIZES.m, }}>
                                <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Kết quả tìm kiếm</Text>
                            </View>
                        )}
                        <FlatList
                            data={data}
                            renderItem={renderCafeItem}
                            ListEmptyComponent={listEmpty}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ padding: SIZES.m }}
                        />
                    </>
                )}
            </View>
        </NativeBaseProvider>
    );
};

export default SearchPage;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: COLORS.bgr,
    },
    appBarWrapper: {
        width: '100%',
        padding: SIZES.s,
        paddingHorizontal: SIZES.l,
        marginTop: 12,
    },
    shopContainer: {
        backgroundColor: COLORS.white,
        width: '100%',
        height: 168,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 18,
        gap: 12,
        position: 'relative'
    },
    shopImageContainer: {
        width: 132,
        height: 132,
        borderRadius: BRS.in,
        overflow: 'hidden',

    },
    shopImage: {
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    shopDetail: {
        maxWidth: SIZES.width / 2,
        // height: 68,
        flexDirection: 'column',
        // justifyContent: 'space-between'
        gap: SIZES.s / 2

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
