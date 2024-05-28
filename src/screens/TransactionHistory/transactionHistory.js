// TransactionHistory.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native';
import IconTransaction from '../../components/Wallet/iconTransaction';
import TransactionCard from '../../components/Wallet/transactionCard';
import { useDispatch, useSelector } from 'react-redux';
import { allTransactionSelector } from '../../store/sellectors';
import { getAllTransactionThunk } from '../../store/apiThunk/transactionThunk';
import Loading from '../../components/Alert/modalSimple/loading';
import { COLORS, SIZES, TEXTS, USERS } from '../../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import formatDayReservation from './../../components/Reservation/formatDayReservation';
import SkeletonPet from '../../components/Alert/skeletonPet';

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const transactionUser = useSelector(allTransactionSelector);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();

  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await dispatch(getAllTransactionThunk({ type: selectedFilter })).unwrap();
        let filtered = data.items.filter(transaction =>
          transaction.content.toLowerCase()
        );
        if (selectedFilter) {
          filtered = filtered.filter(transaction => transaction.transactionType === selectedFilter);
        }
        filtered.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        setFilteredTransactions(filtered);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
        setFilteredTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilter, dispatch]);

  useEffect(() => {
    if (route.params) {
      setSelectedFilter(null);
    }
  }, [route.params]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await dispatch(getAllTransactionThunk({ type: null })).unwrap();
      let filtered = data.items.filter(transaction =>
        transaction.content.toLowerCase()
      );
      setFilteredTransactions(filtered);
    } catch (error) {
      console.error('Failed to refresh data', error);
    } finally {
      setRefreshing(false);
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  const handleFilter = (type) => {
    setSelectedFilter(prev => prev === type ? null : type);
  };

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(transaction => {
      const dateKey = formatDayReservation(transaction.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });
    return groups;
  }, [filteredTransactions]);

  const handleTransactionPress = (transaction) => {
    navigation.navigate('TransactionDetail', { transaction });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FlatList
          data={['TopUp', 'Reserve', 'Refund', 'AddProducts', 'RemoveProducts', 'BuyItem', 'Donate', 'Checkout']}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleFilter(item)} style={[styles.filterOption]}>
              <IconTransaction name={renderIcon(item)} size={24} type={item} selected={selectedFilter} />
            </Pressable>
          )}
        />
      </View>
      {loading ? (
        <>
          <SkeletonPet />
          <SkeletonPet />
          <SkeletonPet />

        </>
      ) : (
        filteredTransactions.length > 0 ? (
          <FlatList
            data={Object.entries(groupedTransactions)}
            renderItem={({ item }) => {
              const [date, transactions] = item;
              return (
                <View key={date}>
                  <Text style={styles.dateHeader}>{date}</Text>
                  {transactions.map(transaction => (
                    <Pressable
                      style={{ paddingBottom: SIZES.s / 2 }}
                      key={transaction.id}
                      onPress={() => handleTransactionPress(transaction)}
                    >
                      <TransactionCard transaction={transaction} />
                    </Pressable>
                  ))}
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            ref={flatListRef}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        ) : (
          <View style={{
            alignItems: 'center', justifyContent: 'center',
            padding: SIZES.m
          }}>
            <Text style={TEXTS.content}>{USERS.noTransaction}</Text>
            <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
              height: SIZES.height / 6,
              width: SIZES.height / 6,
              alignSelf: 'center',
            }} />
          </View>
        )
      )}
    </View>
  );

};

const renderIcon = (type) => {
  switch (type) {
    case 'TopUp':
      return 'cash-outline';
    case 'BuyItem':
      return 'diamond-outline';
    case 'Donate':
      return 'gift-outline';
    case 'Reserve':
      return 'calendar-outline';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.m,
    backgroundColor: COLORS.bgr,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.gray1,
    borderRadius: SIZES.s,
    paddingHorizontal: SIZES.s,
    marginBottom: SIZES.s,
  },

  filterContainer: {
    flexDirection: 'row',
    // paddingHorizontal: SIZES.s,
    paddingBottom: SIZES.s
  },
  filterText: {
    marginRight: SIZES.s,
    fontWeight: 'bold',
  },
  filterOption: {
    marginRight: SIZES.s,
  },
  dateHeader: {
    paddingHorizontal: SIZES.s,
    paddingTop: SIZES.s,
    paddingBottom: SIZES.s / 2,
    fontWeight: '500',
    color: COLORS.blackBold,
  },
});

export default TransactionHistory;
