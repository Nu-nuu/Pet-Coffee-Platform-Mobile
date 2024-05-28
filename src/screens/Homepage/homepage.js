import { StyleSheet, View, Pressable, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BRS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ShopList from '../../components/Homepage/shopList';
import { useSelector } from 'react-redux';
import { allFollowShopsSelector, userDataSelector } from '../../store/sellectors';
import { NativeBaseProvider } from 'native-base';

export default function Homepage({ navigation }) {

  const followShops = useSelector(allFollowShopsSelector);
  const checkFollow = (followShops.length > 0);
  const followedShopIds = checkFollow ? followShops.map(shop => shop.id) : [];

  // const netInfo = useNetInfo();

  const userData = useSelector(userDataSelector);
  const data = [
    { id: '1', type: 'random' },
    { id: '2', type: 'mostPopular' },
    { id: '3', type: 'carousel' },
    { id: '4', type: 'nearby' },
    { id: '5', type: '' },
  ];

  if (checkFollow) {
    data.splice(data.findIndex(item => item.id === '5'), 1);
    data.push({ id: '6', type: 'following', shopId: { followedShopIds } });
    data.push({ id: '7', type: '' });
  }

  const renderItem = ({ item }) => (
    <ShopList type={item.type} shopId={item.type === 'following' ? item.shopId : null} />
  );
  const messages = [
    `Xin chào, ${userData.fullName}`,
    `${userData.fullName}, bạn đang tìm gì?`,
    'Thú cưng yêu thích của bạn?',
    'Quán cà phê thú cưng hợp gu?'
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [searchContent, setSearchContent] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    setSearchContent(messages[currentMessageIndex]);
  }, [currentMessageIndex, messages]);

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <View style={[styles.header, SHADOWS.s, { height: SIZES.height / 10 }]}>
          <View style={styles.appBar}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons
                name="menu"
                size={ICONS.l}
                color={COLORS.white}
                style={styles.iconPadding}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: 260,
                backgroundColor: COLORS.primary400,
                padding: SIZES.s,
                borderRadius: BRS.out
              }}>
              <TouchableOpacity style={{
                marginRight: SIZES.s,
                alignItems: 'flex-end',
                flexDirection: 'row',
                gap: 5,
              }} onPress={() => navigation.navigate('SearchPage', {
                followedShopIds: followedShopIds,
              })}>
                <Ionicons name="search" size={ICONS.m} color={COLORS.white} />
                <Text numberOfLines={1} style={[TEXTS.content, { color: COLORS.white, width: '90%' }]}>{searchContent}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={ICONS.coverL} onPress={() => navigation.navigate('Map', {
              followedShopIds: followedShopIds,
            })}>
              <Ionicons
                name="location-sharp"
                size={ICONS.m}
                color={COLORS.white}
                style={styles.iconPadding}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.appBarWrapper}
        />
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgr,
    height: '100%',
  },
  appBarWrapper: {
    width: '100%',
    padding: SIZES.s,
    paddingHorizontal: SIZES.l,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.s,
  },
  iconPadding: {
    padding: 3,
  },
  header: {
    width: '100%',
    backgroundColor: COLORS.secondary,
    borderBottomEndRadius: SIZES.xxl,
    borderBottomStartRadius: SIZES.xxl,
    padding: SIZES.s,
    paddingHorizontal: SIZES.l,
  }
});
