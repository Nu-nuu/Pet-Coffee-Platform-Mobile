import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, SIZES, TEXTS} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPetCoffeeShopsThunk,
  getPopularPetCoffeeShopsThunk,
  getRandomPetCoffeeShopsThunk,
} from '../../store/apiThunk/petCoffeeShopThunk';
import Geolocation from '@react-native-community/geolocation';
import {Center, NativeBaseProvider, VStack, Skeleton} from 'native-base';
import {getFollowShopsThunk} from '../../store/apiThunk/followShopThunk';
import CardShop from './cardShop';
import SkeletonLoading from '../Alert/skeletonLoading';
import Carousel from './carousel';
import {allFollowShopsSelector} from '../../store/sellectors';

const ShopList = props => {
  const dispatch = useDispatch();

  const img =
    'https://www.fodors.com/wp-content/uploads/2017/08/Pet-Cafes-Eat-Purr-Love.jpg';
  const img2 =
    'https://phuongphap.vn/wp-content/uploads/2021/03/b75b231f68c3f27554b5d4cfb1dd818d.jpg';
  const img3 =
    'https://thesmartlocal.com/thailand/wp-content/uploads/2020/11/7-Adorable-Pet-Cafes-Around-Bangkok-Where-You-Can-Play-With-Corgis-Rabbits-Rare-Pets-5.jpg';

  const images = [img, img2, img, img3, img];
  const followShops = useSelector(allFollowShopsSelector);

  const [type, setType] = useState('');
  const [data, setData] = useState([]);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const followedShopIds = followShops.map(item => item.id);
  const [userLongitude, setUserLongitude] = useState(null);
  const [userLatitude, setUserLatitude] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    setShowLoadingModal(true);
    Geolocation.getCurrentPosition(
      position => {
        let longitude = JSON.stringify(position.coords.longitude);
        let latitude = JSON.stringify(position.coords.latitude);

        setUserLongitude(longitude);
        setUserLatitude(latitude);

        switch (props.type) {
          case 'random':
            dispatch(
              getRandomPetCoffeeShopsThunk({
                longitude: longitude,
                latitude: latitude,
                size: 5,
                type: '',
              }),
            )
              .unwrap()
              .then(res => {
                setData(res);
                setType('random');
                setShowLoadingModal(false);
                setShowGrid(true);
              })
              .catch(err => console.log(err));
            break;
          case 'mostPopular':
            dispatch(
              getPopularPetCoffeeShopsThunk({
                longitude: longitude,
                latitude: latitude,
                pageSize: 5,
                pageNumber: 1,
                type: '',
              }),
            )
              .unwrap()
              .then(res => {
                setData(res);
                setType('mostPopular');
                setShowLoadingModal(false);
                setShowGrid(true);
              })
              .catch(err => console.log(err));
            break;
          case 'nearby':
            dispatch(
              getPetCoffeeShopsThunk({
                searchQuery: '',
                type: '',
                longitude: longitude,
                latitude: latitude,
                pageSize: 5,
                pageNumber: 1,
              }),
            )
              .unwrap()
              .then(res => {
                setData(res);
                setType('nearby');
                setShowLoadingModal(false);
                setShowGrid(true);
              })
              .catch(err => console.log(err));
            break;
          case 'following':
            dispatch(
              getFollowShopsThunk({
                longitude: longitude,
                latitude: latitude,
                pageSize: 5,
                pageNumber: 1,
                type: '',
                searchQuery: '',
              }),
            )
              .unwrap()
              .then(res => {
                setData(res);
                setType('following');
                setShowLoadingModal(false);
                setShowGrid(true);
              })
              .catch(err => console.log(err));
            break;
          default:
            break;
        }
      },
      error => {
        switch (props.type) {
          case 'random':
            dispatch(
              getRandomPetCoffeeShopsThunk({
                longitude: 10.87,
                latitude: 106.8,
                size: 5,
                type: '',
              }),
            )
              .unwrap()
              .then(res => {
                setData(res);
                setType('random');
                setShowLoadingModal(false);
                setShowGrid(true);
              })
              .catch(err => console.log(err));
            break;
          case 'mostPopular':
            dispatch(
              getPopularPetCoffeeShopsThunk({
                longitude: 10.87,
                latitude: 106.8,
                pageSize: 5,
                pageNumber: 1,
                type: '',
              }),
            )
              .unwrap()
              .then(res => {
                setData(res);
                setType('mostPopular');
                setShowLoadingModal(false);
                setShowGrid(true);
              })
              .catch(err => console.log(err));
            break;
          case 'nearby':
            dispatch(
              getPetCoffeeShopsThunk({
                searchQuery: '',
                type: '',
                longitude: 10.87,
                latitude: 106.8,
                pageSize: 5,
                pageNumber: 1,
              }),
            )
              .unwrap()
              .then(res => {
                setData(res);
                setType('nearby');
                setShowLoadingModal(false);
                setShowGrid(true);
              })
              .catch(err => console.log(err));
            break;
          case 'following':
            dispatch(
              getFollowShopsThunk({
                longitude: 10.87,
                latitude: 106.8,
                pageSize: 5,
                pageNumber: 1,
                type: '',
                searchQuery: '',
              }),
            )
              .unwrap()
              .then(res => {
                setData(res);
                setType('following');
                setShowLoadingModal(false);
                setShowGrid(true);
              })
              .catch(err => console.log(err));
            break;
          default:
            break;
        }
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, [props]);

  const onPressHeader = () => {
    navigation.navigate('CafeList', {
      type: type,
      data: data,
      followedShopIds: followedShopIds,
    });
  };

  const renderHeader = () => {
    if (props.type === '' || props.type === 'carousel') {
      return null;
    }

    return (
      <View style={styles.header}>
        <Text style={TEXTS.title}>
          {props.type === 'random' && 'Quán nào hôm nay'}
          {props.type === 'mostPopular' && 'Phổ biến nhất'}
          {props.type === 'nearby' && 'Gần bạn'}
          {props.type === 'following' && 'Bạn đang theo dõi'}
        </Text>
        <Pressable disabled={!showGrid} onPress={onPressHeader}>
          <Ionicons name="grid" size={24} color={COLORS.secondary} />
        </Pressable>
      </View>
    );
  };

  return (
    <NativeBaseProvider>
      <>
        <View style={styles.container}>{renderHeader()}</View>
        {props.type === '' && <View style={{paddingBottom: SIZES.xxl * 2}} />}
        {props.type === 'carousel' && <Carousel images={images} />}
        {props.type !== '' && props.type !== 'carousel' && (
          <View style={{marginTop: SIZES.m}}>
            <FlatList
              data={data}
              renderItem={({item}) => (
                <CardShop
                  userLongitude={userLongitude}
                  userLatitude={userLatitude}
                  item={item}
                  navigation={navigation}
                  followedShopIds={followedShopIds}
                />
              )}
              ListEmptyComponent={<SkeletonLoading />}
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{columnGap: SIZES.m}}
            />
          </View>
        )}
      </>
    </NativeBaseProvider>
  );
};

export default ShopList;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: SIZES.xl - 2,
    color: 'black',
  },
});
