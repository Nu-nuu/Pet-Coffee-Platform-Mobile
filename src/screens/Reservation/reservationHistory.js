import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SIZES, COLORS, USERS, TEXTS, ICONS } from '../../constants';
import ReservationCard from '../../components/Reservation/reservationCard';
import { allFollowShopsSelector, reservationSelector } from '../../store/sellectors';
import { getAllReservationThunk } from '../../store/apiThunk/reservationThunk';
import Loading from '../../components/Alert/modalSimple/loading';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReservationHistory = ({ route, navigation }) => {

    const { reloadGoHome, code } = route.params || {};
    const dispatch = useDispatch();
    const reservation = useSelector(reservationSelector);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloading, setReloading] = useState(false);
    const followShops = useSelector(allFollowShopsSelector);
    const checkFollow = (followShops.length > 0);
    const followedShopIds = checkFollow ? followShops.map(shop => shop.id) : [];


    const [selectedIndex, setSelectedIndex] = useState(0);
    const [status, setStatus] = useState('');
    const [searchText, setSearchText] = useState('');


    //refresh
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);
    const handleRefresh = () => {
        console.log('có refresh');
        setRefreshing(true);
        dispatch(getAllReservationThunk({
            searchQuery: null,
            status: null,
        }))
            .unwrap()
            .then((res) => {
                console.log(res);
                setFilteredReservations(res)
                setRefreshing(false);
                flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
            })
            .catch(() => setRefreshing(false));
    };
    useEffect(() => {
        if (code) {
            setSearchText(code);
        }
    }, [route.params])

    // useEffect(() => {
    //     setReloading(reloadGoHome)
    // }, [reloadGoHome])

    useEffect(() => {
        dispatch(getAllReservationThunk({
            searchQuery: null,
            status: null,
        }))
            .unwrap()
            .then((res) => {
                setFilteredReservations(res)
                setLoading(false)
            })
            .catch(() => setLoading(false));
    }, []);



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
        dispatch(getAllReservationThunk({
            searchQuery: searchText,
            status: status,
        }))
            .unwrap()
            .then(setFilteredReservations)
            .catch(() => console.error('Failed to fetch reservations'))
            .finally(() => setLoading(false));
    }, [searchText, status]);

    const debouncedFetchReservations = useDebouncedFunction(fetchReservations, 300);

    useEffect(() => {
        debouncedFetchReservations();
    }, [searchText, status]);

    const handleStatusFilterChange = (newStatus) => {
        if (newStatus === 'Đã thanh toán') {
            setStatus('Success');
        } else if (newStatus === 'Đã hoàn tiền') {
            setStatus('Returned');
        } else if (newStatus === 'Đã hoàn thành') {
            setStatus('Overtime');
        } else {
            setStatus(null);
        }
    };

    const handleTextChange = (newSearchText) => {
        setSearchText(newSearchText);
    };


    const renderItem = ({ item }) => (
        <View style={{ marginBottom: SIZES.s }}>
            <ReservationCard
                reservation={item}
                userData={item.accountForReservation}
                shopData={item.petCoffeeShopResponse}
                areaData={item.areaResponse}
                followedShopIds={followedShopIds}
            />
        </View>

    );

    return (
        <View style={styles.container}
        >
            <View style={{
                flexDirection: 'row',
                gap: SIZES.s,
                alignItems: 'center',
                paddingVertical: SIZES.s,
            }}>
                <Text style={TEXTS.title}>Lịch sử đặt chỗ</Text>
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
            <View style={{ alignItems: 'center', paddingBottom: SIZES.s, }}>
                <FlatList
                    data={['Tất cả', 'Đã thanh toán', 'Đã hoàn tiền', 'Đã hoàn thành',]}
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
                                color: index === 1 ? COLORS.success : index === 2 ? COLORS.error : COLORS.primary,
                                fontWeight: '500'
                            }}>{item}</Text>
                        </Pressable>
                    )}
                />
            </View>
            <>
                {loading ? (
                    <Loading isModal={false} />
                ) : (
                    <>
                        {filteredReservations.length > 0 ? (
                            <>
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
                                <View style={{ height: SIZES.height / 12 }} />
                            </>
                        ) :
                            (
                                <View style={{
                                    alignItems: 'center', justifyContent: 'center',
                                    padding: SIZES.m
                                }}>
                                    <Text style={TEXTS.content} >{USERS.noReservation}</Text>
                                    <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                                        height: SIZES.height / 6,
                                        width: SIZES.height / 6,
                                        alignSelf: 'center',
                                    }} />
                                </View>)}
                    </>

                )}
            </>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.m,
        backgroundColor: COLORS.bgr
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
});

export default ReservationHistory;
