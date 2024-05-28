import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AVATARS, BRS, BUTTONS, COLORS, ICONS, PETS, SHADOWS, SIZES, TEXTS, USERS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { petDetailSelector, userDataSelector, walletSelector } from '../../store/sellectors';
import Coin from '../Wallet/coin';
import { donatePetThunk } from '../../store/apiThunk/itemThunk';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Center, Modal, Image, NativeBaseProvider } from 'native-base';
import LottieView from 'lottie-react-native';
import { getWalletThunk } from '../../store/apiThunk/walletThunk';
import { getPetDetailThunk } from '../../store/apiThunk/petThunk';
import GoldMedal from '../../../assets/images/gold-medal.png';
import SilverMedal from '../../../assets/images/silver-medal.png';
import BronzeMedal from '../../../assets/images/bronze-medal.png';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';
import ItemDonation from './itemDonation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Success from '../Alert/modalSimple/success';
import LoadingMin from '../Alert/modalSimple/loadingMin';

export default function PetDonation() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const wallet = useSelector(walletSelector);
  const petDetail = useSelector(petDetailSelector);

  const userData = useSelector(userDataSelector)
  const shop = userData.role === 'Staff' ? true : false

  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [showDonate, setShowDonate] = useState(shop);
  const [showSend, setShowSend] = useState(false);

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const defaultQuantities = {};
    wallet?.items?.forEach(item => {
      defaultQuantities[item.itemId] = 0;
    });
    setQuantities(defaultQuantities);
  }, [wallet]);

  const press = showDonate ? 'Ủng hộ' : 'Top Ủng hộ';
  const text = showDonate ? 'Danh sách những người ủng hộ' : 'Quà tặng của bạn';


  const handlePress = () => {
    setShowDonate(!showDonate)
  }

  const handleItemPress = (index, itemId) => {
    setSelectedItemIndex(index);
    setItemId(itemId);
    setShowSend(!showSend);
    if (!quantities[itemId]) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [itemId]: 1,
      }));
    }
  };

  const handleDonate = (index, itemId) => {
    const donateData = {
      petId: petDetail.id,
      donateItems: [
        {
          itemId: itemId,
          quantity: quantities[itemId],
        },
      ],
    };
    setLoading(true);
    dispatch(donatePetThunk(donateData)).then((res) => {
      setSuccess(true)
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
      }, 4000)
      dispatch(getWalletThunk());
      dispatch(getPetDetailThunk(petDetail.id)).then(() => {
        setQuantities(prevQuantities => ({
          ...prevQuantities,
          [itemId]: 1,
        }));
      });
    });
  }


  const decreaseQuantity = (itemId) => {
    if (quantities[itemId] > 1) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [itemId]: prevQuantities[itemId] - 1,
      }));
    }
  };

  const increaseQuantity = (itemId, totalItem) => {
    if (quantities[itemId] < totalItem) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [itemId]: prevQuantities[itemId] + 1,
      }));
    }
  };

  return (
    <View style={{
      backgroundColor: COLORS.bgr,
      padding: SIZES.m,
      minHeight: SIZES.height / 2,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>{text}</Text>
        <View style={{
          flexDirection: 'row',
          gap: SIZES.m,
        }}>
          {!showDonate && (
            <Pressable
              onPress={() => navigation.navigate('Items')}
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
          )}
          {!shop && (
            <Pressable
              onPress={handlePress}
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
              }]}>{press}</Text>
            </Pressable>

          )}

        </View>
      </View>
      {success && (
        <View style={{
          position: 'absolute',
          top: -SIZES.height / 6.5,
          right: SIZES.width / 3,
        }}>
          <Success isModal={false} />
        </View>
      )}
      {showDonate ? (
        <>
          {petDetail?.accounts?.length > 0 ? (
            <>
              {petDetail?.accounts?.map((donation, index) => {
                const isCurrentUser = donation.id === userData.id;
                return (
                  <View style={[{
                    backgroundColor: COLORS.white,
                    width: '100%',
                    height: 78,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 18,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    justifyContent: 'space-between',
                    marginVertical: SIZES.s,
                    position: 'relative'

                  }, SHADOWS.s]} key={index}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: SIZES.s,
                    }}>
                      <View style={{
                      }}>
                        {index === 0 && (
                          <Image source={GoldMedal} alt="" style={styles.medal} />
                        )}
                        {index === 1 && (
                          <Image source={SilverMedal} alt="" style={styles.medal} />
                        )}
                        {index === 2 && (
                          <Image source={BronzeMedal} alt="" style={styles.medal} />
                        )}
                        {index > 2 && <View style={styles.medal}>
                          <Text style={[{ paddingTop: 8, alignSelf: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }]}>{index + 1}</Text>
                        </View>}
                      </View>
                      <Image
                        source={{ uri: donation.avatarUrl }}
                        alt=""
                        style={AVATARS.mid}
                      />
                      <Text numberOfLines={1} style={[TEXTS.content, { width: 140, color: isCurrentUser ? COLORS.primary : COLORS.black, fontWeight: 'bold' }]}>
                        {donation.name}
                      </Text>
                    </View>
                    <Coin
                      coin={donation.totalDonate}
                      size='l'
                    />
                    {isCurrentUser &&
                      <View style={{ position: 'absolute', top: 5, left: '29%', transform: [{ rotate: '45deg' }] }}>
                        <Ionicons name='paw' size={ICONS.s} color={COLORS.primary} />
                      </View>
                    }
                  </View>
                );
              })}
            </>
          ) : (
            <View style={{
              alignItems: 'center', justifyContent: 'center',
              padding: SIZES.m
            }}>
              <Text style={TEXTS.content} >{PETS.noDonate}</Text>
              <Image alt='noInformation' source={require('../../../')} style={{
                height: SIZES.height / 6,
                width: SIZES.height / 6,
                alignSelf: 'center',
              }} />
            </View>
          )}
        </>
      ) : (
        <ScrollView contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative',
          paddingVertical: SIZES.s,
        }}>
          {wallet?.items?.length > 0 ? (
            <>
              {wallet?.items
                .filter(item => item.totalItem > 0)
                .map((item, index) => (
                  <View
                    key={index}
                    style={{
                      position: 'relative'
                    }}>
                    <View style={[styles.container, {
                      position: 'absolute',
                      backgroundColor: COLORS.female200,
                      top: 5,
                      left: SIZES.s / 2,
                      width: SIZES.width / 3 - SIZES.s * 2 - SIZES.s,
                    }, SHADOWS.sfe]} />
                    <Pressable
                      onPress={() => handleItemPress(index, item.itemId)}
                      disabled={loading}
                      style={[styles.container, SHADOWS.s,
                      selectedItemIndex === index && {
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                      }]}>
                      <View style={{ position: 'relative', paddingHorizontal: SIZES.s }}>
                        <Image source={{ uri: item.icon }} alt='' style={styles.image} />
                        <View style={{
                          width: 0,
                          height: 0,
                          borderTopWidth: 7.5,
                          borderRightWidth: 7.5,
                          borderBottomWidth: 0,
                          borderLeftWidth: 0,
                          borderTopColor: COLORS.gray2,
                          borderRightColor: 'transparent',
                          borderBottomColor: 'transparent',
                          borderLeftColor: 'transparent',
                          position: 'absolute',
                          top: 12,
                          right: -8.3,
                        }} />
                        <View style={[{
                          position: 'absolute',
                          borderTopStartRadius: 14,
                          borderBottomStartRadius: 14,
                          width: 38,
                          height: 24,
                          top: -10, right: -8,
                          paddingLeft: 10,
                          justifyContent: 'center',
                          backgroundColor: COLORS.quaternary,
                        }]}>
                          <Text style={[styles.title, { color: COLORS.black }]}>x{item.totalItem}</Text>
                        </View>
                      </View>
                      {!(selectedItemIndex === index) && (
                        <View style={{
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingBottom: SIZES.s / 2,
                          width: SIZES.width / 3 - SIZES.s * 2 - SIZES.s * 2,
                        }}>
                          <Text numberOfLines={1} style={[styles.title, {
                            color: COLORS.black,
                            paddingVertical: SIZES.s / 2,
                          }]}>{item.name}</Text>
                          <Coin coin={item.price} size='min' />
                        </View>
                      )}
                      {selectedItemIndex === index && (
                        <View style={{
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: SIZES.s,
                            paddingVertical: SIZES.s / 2,
                          }}>
                            <View style={[styles.quantityContainer,
                            ]}>
                              <Pressable
                                style={[ICONS.coverDS]}
                                onPress={() => decreaseQuantity(item.itemId)}>
                                <Ionicons n
                                  name="remove-circle"
                                  color={quantities[item.itemId] > 1 ? COLORS.primary : COLORS.gray2}
                                  size={ICONS.s} />
                              </Pressable>
                              <View style={{ width: 16, alignItems: 'center' }}>
                                <Text style={[TEXTS.subContent, { fontWeight: '500', color: COLORS.black }]}>{quantities[item.itemId]}</Text>
                              </View>
                              <Pressable style={[ICONS.coverDS]}
                                onPress={() => increaseQuantity(item.itemId, item.totalItem)}>
                                <Ionicons
                                  name="add-circle"
                                  color={quantities[item.itemId] < item.totalItem ? COLORS.primary : COLORS.gray2}
                                  size={ICONS.s} />
                              </Pressable>
                            </View>
                          </View>
                          <Pressable
                            onPress={() => handleDonate(index, item.itemId)}
                            disabled={quantities[item.itemId] === 0 || loading}
                            style={{
                              backgroundColor: COLORS.primary,
                              width: SIZES.width / 3 - SIZES.s * 2,
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              borderBottomEndRadius: BRS.in,
                              borderBottomStartRadius: BRS.in,
                              paddingVertical: SIZES.s / 4,
                            }}>
                            {loading ? (
                              <>
                                <Text style={[TEXTS.subContent, { color: COLORS.white, fontWeight: '500' }]}></Text>
                                <LoadingMin />
                              </>
                            ) : (
                              <Text style={[TEXTS.subContent, { color: COLORS.white, fontWeight: '500' }]}>Tặng</Text>
                            )}
                          </Pressable>
                        </View>
                      )}
                    </Pressable>

                  </View>
                ))}
            </>
          ) : (
            <View style={{
              alignItems: 'center', justifyContent: 'center',
              padding: SIZES.m,
              marginLeft: SIZES.width / 8,
            }}>
              <Text style={TEXTS.content} >{USERS.noItems}</Text>
              <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                height: SIZES.height / 6,
                width: SIZES.height / 6,
                alignSelf: 'center',
              }} />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SIZES.s,
  },
  container: {
    backgroundColor: COLORS.white,
    marginVertical: SIZES.s,
    marginHorizontal: SIZES.s / 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BRS.in,
    borderWidth: 1,
    borderColor: 'transparent',
    width: SIZES.width / 3 - SIZES.s * 2,
    height: (SIZES.width / 3 - SIZES.s * 2) * 1.375,
    paddingTop: SIZES.s,
  },
  image: {
    width: SIZES.width / 3 - SIZES.s * 2 - SIZES.s * 2,
    height: SIZES.width / 3 - SIZES.s * 2 - SIZES.s * 2,
    borderRadius: 5
  },
  title: {
    fontWeight: 'bold',
  },
  medal: {
    width: 33,
    height: 33,
  },
  vaccineFlexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  vaccineBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    padding: 10,
    borderRadius: 15,
    width: '33%',
  },
  vaccineImg: {
    height: 170,
    borderRadius: 10,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flexEvenly: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    elevation: 8,
    backgroundColor: 'white',
  },
});
