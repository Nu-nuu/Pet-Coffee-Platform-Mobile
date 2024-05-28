import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { COLORS, ICONS, SHADOWS, SIZES, TEXTS, USERS } from '../../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import SkeletonArea from '../../../components/Alert/skeletonArea';
import { getAllReservationThunk, getReservationShopThunk } from '../../../store/apiThunk/reservationThunk';
import { useDispatch, useSelector } from 'react-redux';
import { reservationShopSelector, userDataSelector } from '../../../store/sellectors';
import { NativeBaseProvider } from 'native-base';
import ReservationShopCard from './reservationShopCard';

const Reservations = ({ route }) => {
    const dispatch = useDispatch();
    const reservation = useSelector(reservationShopSelector);
    const userData = useSelector(userDataSelector);
    const { code } = route.params || {};

    const [searchText, setSearchText] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [filteredReservations, setFilteredReservations] = useState(reservation);


    useEffect(() => {
        if (code) {
            setSearchText(code);
        }
    }, [route.params])

    const useDebouncedFunction = (func, delay) => {
        return useMemo(() => {
            let timeoutId;
            return (...args) => {
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func(...args);
                }, delay);
            };
        }, [func, delay]);
    };

    const fetchReservations = useCallback(() => {
        setLoading(true);
        dispatch(getReservationShopThunk({
            id: userData?.shopResponses[0].id,
            searchQuery: searchText,
            status: status,
        }))
            .unwrap()
            .then(setFilteredReservations)
            .catch(() => console.error('Failed to fetch reservations'))
            .finally(() => setLoading(false));
    }, [searchText, status, userData?.shopResponses]);

    const debouncedFetchReservations = useDebouncedFunction(fetchReservations, 300);

    useEffect(() => {
        debouncedFetchReservations();
    }, [searchText, status]);

    const handleStatusFilterChange = (newStatus) => {
        if (newStatus === 'Đã thanh toán') {
            setStatus('Success');
        } else if (newStatus === 'Đã hoàn tiền') {
            setStatus('Returned');
        } else {
            setStatus('Overtime');
        }
    };

    const handleTextChange = (newSearchText) => {
        setSearchText(newSearchText);
    };

    const renderItem = ({ item }) => (
        <View style={{ marginBottom: SIZES.s, }}>
            <ReservationShopCard
                reservationData={item}
                userData={item.accountForReservation}
                shopData={item.petCoffeeShopResponse}
                areaData={item.areaResponse}
            />
        </View>

    );

    //refresh
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);
    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(getAllReservationThunk({
            searchQuery: null,
            status: null,
        }))
            .unwrap()
            .then(() => {
                setRefreshing(false);
                flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
            })
            .catch(() => setRefreshing(false));
    };

    return (
        <NativeBaseProvider>
            <View style={{
                flex: 1,
                backgroundColor: COLORS.quaternary,
            }}>
                <View style={{
                    padding: SIZES.m,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: SIZES.s,
                        alignItems: 'center',
                        paddingVertical: SIZES.s,
                    }}>
                        <Text style={TEXTS.title}>Danh sách đơn đặt chỗ</Text>
                        <Ionicons name='calendar' size={ICONS.m} color={COLORS.primary} />
                    </View>
                    <View style={{ position: 'relative' }}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Mã đặt chỗ..."
                            value={searchText}
                            onChangeText={handleTextChange}
                        />
                        {searchText && (
                            <Pressable
                                onPress={() => setSearchText('')}
                                style={{
                                    position: 'absolute',
                                    right: '2%',
                                    top: '20%'
                                }}>
                                <Ionicons name='close-circle' size={ICONS.m} color={COLORS.blackBold} />
                            </Pressable>
                        )}
                    </View>
                    <View style={{ alignItems: 'center', }}>
                        <FlatList
                            data={['Đã thanh toán', 'Đã hoàn tiền', 'Đã hoàn thành',]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item}
                            renderItem={({ item, index }) => (
                                <Pressable
                                    onPress={() => [handleStatusFilterChange(item), setSelectedIndex(index)]}
                                    style={{
                                        borderWidth: 0.5,
                                        borderRadius: SIZES.s,
                                        width: SIZES.width / 3 - SIZES.m,
                                        alignItems: 'center',
                                        margin: 5,
                                        borderColor: selectedIndex === index ? COLORS.primary : COLORS.gray1,
                                    }}
                                >
                                    <Text style={{
                                        color: index === 0 ? COLORS.success : index === 1 ? COLORS.error : COLORS.primary,
                                        fontWeight: '500'
                                    }}>{item}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                    <>
                        {loading ? (
                            <SkeletonArea />
                        ) : (
                            <>
                                {filteredReservations.length > 0 ? (
                                    <FlatList
                                        data={filteredReservations}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        contentContainerStyle={styles.flatListContent}

                                        //refresh
                                        ref={flatListRef}
                                        refreshing={refreshing}
                                        onRefresh={handleRefresh}
                                    />
                                ) :
                                    (
                                        <View style={{
                                            alignItems: 'center', justifyContent: 'center',
                                            padding: SIZES.m
                                        }}>
                                            <Text style={TEXTS.content} >{USERS.noReservation}</Text>
                                            <Image alt='noInformation' source={require('../../../../assets/noinfor.png')} style={{
                                                height: SIZES.height / 6,
                                                width: SIZES.height / 6,
                                                alignSelf: 'center',
                                            }} />
                                        </View>)}
                            </>

                        )}
                    </>
                </View>
            </View>
        </NativeBaseProvider>
    )
}

export default Reservations

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.m,
        backgroundColor: COLORS.white
    },
    searchInput: {
        borderWidth: 1,
        borderColor: COLORS.gray1,
        borderRadius: SIZES.s,
        paddingHorizontal: SIZES.s,
        marginBottom: SIZES.s,

    },
    flatListContent: {
        paddingVertical: SIZES.m,
    },
})