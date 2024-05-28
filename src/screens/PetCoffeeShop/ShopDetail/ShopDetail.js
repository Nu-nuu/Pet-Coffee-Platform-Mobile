import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Menu, Modal, NativeBaseProvider, Skeleton} from 'native-base';
import {
  AVATARS,
  BUTTONS,
  COLORS,
  ICONS,
  SHADOWS,
  SIZES,
  TEXTS,
} from '../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {petCoffeeShopDetailSelector} from '../../../store/sellectors';
import {useDispatch, useSelector} from 'react-redux';
import {getPetCoffeeShopDetailThunk} from '../../../store/apiThunk/petCoffeeShopThunk';
import {
  followShopsThunk,
  getAllFollowShopsThunk,
  unfollowShopsThunk,
} from '../../../store/apiThunk/followShopThunk';
import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import AboutComponent from '../../../components/Profile/About';
import Pets from '../../../components/Profile/Pets';
import Area from '../../../components/Profile/Area';
import Event from '../../../components/Profile/Event';
import Post from '../../../components/Profile/Post';
import Review from '../../../components/Profile/Review';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ShopDetail({route}) {
  const navigation = useNavigation();
  const {id, shopData, checkFollow, userLongitude, userLatitude, event} =
    route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: shopData.name,
    });
  }, []);
  const thisCoffeeShop = useSelector(petCoffeeShopDetailSelector);
  const [isOpen, setIsOpen] = useState(false);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [followShop, setFollowShop] = useState(checkFollow);
  const [countFollowShop, setCountFollowShop] = useState(
    shopData?.totalFollow || thisCoffeeShop?.totalFollow || 1,
  );

  const dispatch = useDispatch();
  const shop = useSelector(petCoffeeShopDetailSelector);

  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  useEffect(() => {
    setShowLoadingModal(true);
    setSelectedComponent(<AboutComponent showRender={true} shopId={id} />);
    Geolocation.getCurrentPosition(
      position => {
        let longitudee = JSON.stringify(position.coords.longitude);
        let latitudee = JSON.stringify(position.coords.latitude);
        setLatitude(latitudee);
        setLongitude(longitudee);
        dispatch(
          getPetCoffeeShopDetailThunk({
            id,
            latitude: latitudee,
            longitude: longitudee,
          }),
        )
          .unwrap()
          .then(() => {
            setShowLoadingModal(false);
            setSelectedComponent(
              <AboutComponent showRender={false} shopId={id} />,
            );
          });
      },
      error => {
        console.log(error);
        dispatch(
          getPetCoffeeShopDetailThunk({
            id,
            latitude: 10.87,
            longitude: 106.8,
          }),
        )
          .unwrap()
          .then(() => {
            setSelectedComponent(
              <AboutComponent showRender={false} shopId={id} />,
            );
          });
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, [id]);

  const handleFollowShop = () => {
    setCountFollowShop(countFollowShop + 1);
    setFollowShop(true);
    dispatch(followShopsThunk(id)).then(() => {
      dispatch(getPetCoffeeShopDetailThunk({id, latitude, longitude})).then(
        () => {
          dispatch(getAllFollowShopsThunk());
        },
      );
    });
  };

  const handleUnfollowShop = () => {
    setCountFollowShop(countFollowShop - 1);
    setFollowShop(false);
    dispatch(unfollowShopsThunk(id)).then(() => {
      dispatch(getPetCoffeeShopDetailThunk({id, latitude, longitude})).then(
        () => {
          dispatch(getAllFollowShopsThunk());
        },
      );
    });
  };
  const handleReservation = () => {
    navigation.navigate('Reservation', {
      id: id,
    });
  };

  const flatListRef = useRef(null);
  const [selectedComponent, setSelectedComponent] = useState(
    <AboutComponent showRender={showLoadingModal} shopId={id} />,
  );
  const [selectedId, setSelectedId] = useState(0);
  useEffect(() => {
    if (event) {
      setSelectedComponent(<Event shopId={id} checkFollow={checkFollow} />);
    }
  }, [event]);

  const ScreenNames = [
    {id: 0, name: 'Giới thiệu', component: <AboutComponent shopId={id} />},
    {id: 1, name: 'Thú cưng', component: <Pets shopId={id} />},
    {id: 2, name: 'Khu vực', component: <Area shopId={id} />},
    {
      id: 3,
      name: 'Sự kiện',
      component: <Event shopId={id} checkFollow={checkFollow} />,
    },
    {id: 4, name: 'Bài viết', component: <Post shopId={id} />},
    {id: 5, name: 'Lượt nhắc', component: <Review shopId={id} />},
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => [
        setSelectedComponent(item.component),
        setSelectedId(item.id),
      ]}
      style={{
        width: SIZES.width / 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderBottomStartRadius: 3,
        borderBottomEndRadius: 3,
        borderColor: selectedId === item.id ? COLORS.primary : 'transparent',
      }}>
      <Text
        style={{
          textTransform: 'none',
          fontSize: SIZES.m,
          fontWeight: selectedId === item.id ? '500' : 'normal',
          color: selectedId === item.id ? COLORS.primary : COLORS.blackBold,
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <NativeBaseProvider>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: COLORS.bgr,
        }}>
        <View>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Pressable onPress={() => setIsOpen(false)}>
              <Image
                source={{uri: shopData.avatarUrl}}
                alt=""
                style={{width: 350, height: 500, objectFit: 'contain'}}
              />
            </Pressable>
          </Modal>
          <Modal
            isOpen={isBackgroundOpen}
            onClose={() => setIsBackgroundOpen(false)}>
            <Pressable onPress={() => setIsBackgroundOpen(false)}>
              <Image
                source={{uri: shopData.backgroundUrl}}
                alt=""
                style={{width: 350, height: 500, objectFit: 'contain'}}
              />
            </Pressable>
          </Modal>

          <View
            style={{
              backgroundColor: COLORS.bgr,
            }}>
            <Pressable
              onPress={() => {
                setIsBackgroundOpen(true);
              }}>
              <Image
                source={{uri: shopData.backgroundUrl}}
                alt=""
                style={styles.backgroundImage}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setIsOpen(true);
              }}
              style={{
                position: 'absolute',
                top: '20%',
                left: SIZES.m,
              }}>
              <Image
                source={{uri: shopData.avatarUrl}}
                alt=""
                style={AVATARS.max}
              />
            </Pressable>
            <View
              style={{
                padding: SIZES.m,
                marginTop: SIZES.xl,
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: SIZES.xs / 2,
              }}>
              <Text style={TEXTS.titleMax}>{shopData.name}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    TEXTS.content,
                    {fontWeight: '500', color: COLORS.black},
                  ]}>
                  {countFollowShop}{' '}
                </Text>
                <Text style={TEXTS.content}>người theo dõi</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                }}>
                <Text style={TEXTS.content}>
                  Cà phê
                  {shopData.type === 'Cat'
                    ? ' Mèo'
                    : shopData.type === 'Dog'
                    ? ' Chó'
                    : ' Chó và Mèo'}{' '}
                </Text>
                <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                }}>
                <Ionicons
                  name="navigate-circle"
                  size={ICONS.s}
                  color={COLORS.primary}
                />
                {showLoadingModal ? (
                  <Skeleton.Text lines={1} width="16" />
                ) : (
                  <Text style={TEXTS.subContent}>
                    {shop?.distance?.toFixed(2)} Km
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: SIZES.width - SIZES.m * 2,
                  alignSelf: 'center',
                }}>
                {followShop ? (
                  <Pressable
                    onPress={handleUnfollowShop}
                    style={[
                      {
                        paddingVertical: SIZES.s,
                        backgroundColor: COLORS.gray1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: SIZES.s,
                      },
                      BUTTONS.recMax,
                    ]}>
                    <Ionicons
                      name="heart-dislike"
                      size={ICONS.xm}
                      color={COLORS.black}
                    />
                    <Text
                      style={{
                        fontSize: SIZES.m,
                        color: COLORS.black,
                        fontWeight: '500',
                      }}>
                      Bỏ theo dõi
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={handleFollowShop}
                    style={[
                      {
                        paddingVertical: SIZES.s,
                        backgroundColor: COLORS.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: SIZES.s,
                      },
                      BUTTONS.recMax,
                    ]}>
                    <Ionicons
                      name="heart"
                      size={ICONS.xm}
                      color={COLORS.white}
                    />
                    <Text
                      style={{
                        fontSize: SIZES.m,
                        color: COLORS.white,
                        fontWeight: '500',
                      }}>
                      Theo dõi
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={handleReservation}
                  style={[
                    {
                      paddingVertical: SIZES.s,
                      backgroundColor: COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: SIZES.s,
                    },
                    BUTTONS.recMax,
                  ]}>
                  <Ionicons
                    name="calendar"
                    size={ICONS.xm}
                    color={COLORS.white}
                  />
                  <Text
                    style={{
                      fontSize: SIZES.m,
                      color: COLORS.white,
                      fontWeight: '500',
                    }}>
                    Đặt chỗ
                  </Text>
                </Pressable>
                <Menu
                  w="190"
                  marginTop={3}
                  marginRight={5}
                  trigger={triggerProps => {
                    return (
                      <Pressable
                        accessibilityLabel="More options menu"
                        {...triggerProps}
                        style={[
                          {
                            paddingVertical: SIZES.s,
                            backgroundColor: COLORS.gray1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                          BUTTONS.cub,
                        ]}>
                        <Ionicons name="ellipsis-horizontal" size={ICONS.s} />
                      </Pressable>
                    );
                  }}>
                  <Menu.Item
                    onPress={() =>
                      navigation.navigate('Map', {
                        shopData: shopData,
                        userLongitude: userLongitude,
                        userLatitude: userLatitude,
                        selectedShopId: shopData.id,
                      })
                    }>
                    <Ionicons
                      name="navigate-circle-outline"
                      size={ICONS.xm}
                      color={COLORS.black}
                    />
                    <Text style={{fontSize: 16, color: 'black'}}>Đi tới</Text>
                  </Menu.Item>
                </Menu>
              </View>
              {shopData.hasPromotion && (
                <View
                  style={[
                    ICONS.coverPro,
                    {
                      position: 'absolute',
                      top: '-18%',
                      right: '5%',
                    },
                  ]}>
                  <MaterialIcons
                    name="redeem"
                    size={ICONS.xm}
                    color={COLORS.primary}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <FlatList
          ref={flatListRef}
          data={ScreenNames}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[
            {
              height: 48,
              backgroundColor: COLORS.bgr,
            },
            SHADOWS.s,
          ]}
        />
        {selectedComponent}
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    objectFit: 'cover',
    height: SIZES.height / 5,
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 21,
    color: COLORS.primary,
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {fontSize: 17, fontWeight: 'bold', color: COLORS.primary},
  text: {color: 'gray', fontSize: 17},
  btn: {
    backgroundColor: 'white',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  shopRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  shopText: {
    fontSize: 14,
  },
  shopCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
});
