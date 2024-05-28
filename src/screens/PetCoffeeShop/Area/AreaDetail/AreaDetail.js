import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Center,
  Divider,
  HamburgerIcon,
  Menu,
  NativeBaseProvider,
  ScrollView,
} from 'native-base';
import { BUTTONS, COLORS, ICONS, SHOPS, SIZES, TEXTS } from '../../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { areaDetailSelector, petCoffeeShopDetailSelector, petsFromShopSelector, userDataSelector } from '../../../../store/sellectors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { deleteAreaThunk, getAreaDetailThunk, getAreasFromShopThunk } from '../../../../store/apiThunk/areaThunk';
import LottieView from 'lottie-react-native';
import CarouselPost from '../../../../components/Social/carouselPost';
import SkeletonPet from '../../../../components/Alert/skeletonPet';
import PetCard from '../../../../components/Profile/PetCard';
import { getPetsFromAreaThunk } from '../../../../store/apiThunk/petThunk';
import Coin from '../../../../components/Wallet/coin';
import ErrorModal from '../../../../components/Alert/errorModal';
import Success from '../../../../components/Alert/modalSimple/success';
import Loading from '../../../../components/Alert/modalSimple/loading';

export default function AreaDetail({ route, navigation }) {
  const areaId = route?.params?.areaId;
  const direction = route?.params?.direction;
  const shopId = route?.params?.shopId;
  const res = route?.params?.res;


  const userData = useSelector(userDataSelector);
  const shop = userData.role === 'Staff' ? true : false

  const dispatch = useDispatch();
  const areaDetail = useSelector(areaDetailSelector);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const areaDatas = route?.params?.areaData

  const [areaData, setAreaData] = useState(areaDatas)
  useEffect(() => {
    setAreaData(areaDatas)
  }, [areaDatas]);

  useEffect(() => {
    setShowRender(true)
    dispatch(getAreaDetailThunk(areaId))
      .unwrap()
      .then((res) => {
        setAreaData(res)
        setShowRender(false)
      })
      .catch((err) => console.log(err))
  }, [res])


  const shopData = useSelector(petCoffeeShopDetailSelector);
  const thisPets = useSelector(petsFromShopSelector);
  const [showRender, setShowRender] = useState(false);
  useEffect(() => {
    if (areaData?.pets[0]?.petCoffeeShopId != shopData.id || areaData?.pets?.length < 0 || res) {
      setShowRender(true);
      dispatch(getPetsFromAreaThunk(areaData.id)).then(() => {
        setShowRender(false);
      });
    }
  }, [route?.params]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Tầng ' + `${areaData.order}` + ' | ' + `${shopData.name}`,

      headerRight: () => (
        <Pressable style={{ paddingRight: SIZES.m }} onPress={() => {
          {
            shop ? (
              navigation.navigate('TabGroup', { screen: 'Staff' })
            ) : (
              navigation.navigate('TabGroup', { screen: 'Customer' })
            )
          }
        }}>
          <Ionicons name="home" size={24} color={COLORS.black} />
        </Pressable>
      ),

    })
  }, [])

  const navigateToPetDetail = (petId, petData) => {
    navigation.navigate('PetDetail', {
      id: petId,
      petDatas: petData,
    });
  };


  const handleAreaSelect = (areaId, pricePerHour, order, areaData) => {
    navigation.navigate('Reservation', {
      areaId: areaId,
      price: pricePerHour,
      order: order,
      shop: true,
      areaDatas: areaData
    });
  };

  const handleAddPetArea = (areaId) => {
    navigation.navigate('ChangePetArea', {
      areaId: areaId
    })
  }

  const handleEditArea = (areaId) => {
    navigation.navigate('EditArea', {
      shopId: shopData.id,
      areaId: areaId
    });
  }


  const handleDeleteArea = (areaId) => {
    setShowLoadingModal(true);
    dispatch(deleteAreaThunk(areaId))
      .unwrap()
      .then(() => {
        dispatch(getAreasFromShopThunk(shopData.id))
          .then(() => {
            setShowLoadingModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false)
              navigation.goBack()
            }, 3000);
          });
      })
      .catch(error => {
        setShowLoadingModal(false);
        setErrorMsg(error.message);
        setShowErrorModal(true);
      });
  };


  return (
    <NativeBaseProvider>
      <ScrollView style={{
        backgroundColor: COLORS.bgr,
        flex: 1,
      }}>
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
        {showLoadingModal && (
          <Loading isModal={true} />
        )}
        {showSuccessModal && (
          <Success isModal={true} />
        )}
        <View>
          {areaData?.image && areaData?.image !== '' && (
            <View style={styles.imageContainer}>
              {areaData?.image?.split(';').length > 1 ? (
                <CarouselPost images={areaData?.image.split(';')} />
              ) : (
                <Image
                  source={{ uri: areaData?.image }}
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                    height: SIZES.height / 3,
                    position: 'relative',
                  }}
                />
              )}
            </View>
          )}
        </View>
        {/* ==============Thông tin của tầng=================== */}
        <View style={{
          padding: SIZES.m
        }}>
          <Text style={TEXTS.title}>Tầng {areaData?.order} của {shopData.name}</Text>
          <Text style={TEXTS.content}>{areaData?.description}</Text>

          {/*============= Thông tin chi tiết============= */}
          {shop ? (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: SIZES.m,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin chi tiết</Text>
              <View style={{ flexDirection: 'row', gap: SIZES.s }}>
                <Pressable
                  disabled={showRender}
                  onPress={() => handleDeleteArea(areaData.id)}
                  style={[
                    BUTTONS.recMid,
                    {
                      backgroundColor: showRender ? COLORS.gray2 : COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }]}>
                  <Text style={[{
                    fontWeight: '500',
                    color: COLORS.white,
                    fontSize: SIZES.m
                  }]}>Xóa</Text>
                </Pressable>
                <Pressable
                  disabled={showRender}
                  onPress={() => handleEditArea(areaData.id)}
                  style={[
                    BUTTONS.recMid,
                    {
                      backgroundColor: showRender ? COLORS.gray2 : COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }]}>
                  <Text style={[{
                    fontWeight: '500',
                    color: COLORS.white,
                    fontSize: SIZES.m
                  }]}>Sửa</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: SIZES.m
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin chi tiết</Text>
              <Pressable
                onPress={() => handleAreaSelect(areaData.id, areaData.pricePerHour, areaData.order, areaData)}
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
                }]}>Đặt ngay</Text>
              </Pressable>
            </View>
          )}


          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingRight: SIZES.m,
            paddingBottom: SIZES.s
          }}>
            <View style={ICONS.coverD}>
              <Ionicons name="cash" size={ICONS.xm} color={COLORS.primary} />
            </View>
            <View
              style={{ alignItems: 'center', flexDirection: 'row', gap: 2 }}
            >
              <Text style={TEXTS.content}>Mức giá </Text>
              <Coin coin={areaData?.pricePerHour} size='min' />
              <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>/1h </Text>
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingRight: SIZES.m,
          }}>
            <View style={ICONS.coverD}>
              <Ionicons name="people-circle" size={ICONS.xm} color={COLORS.primary} />
            </View>

            <View
              style={{ alignItems: 'center', flexDirection: 'row', gap: 2 }}
            >
              <Text style={TEXTS.content}>Số chỗ </Text>
              <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>{areaData?.totalSeat} người</Text>
            </View>
          </View>
        </View>
        {/* ==============Thú cưng của tầng=================== */}
        <View style={{
          paddingHorizontal: SIZES.m,
        }}>
          {shop ? (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: SIZES.m,
              alignItems: 'center',
              paddingBottom: SIZES.m,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>
                {areaData?.pets?.length > 0 ? (
                  `Thú cưng của tầng (${areaData?.pets?.length})`
                ) : (
                  `Thú cưng của tầng`
                )}
              </Text>
              <Pressable
                disabled={showRender}
                onPress={() => handleAddPetArea(areaData.id)}
                style={[
                  BUTTONS.recMid,
                  {
                    backgroundColor: showRender ? COLORS.gray2 : COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: SIZES.width / 3,
                  }]}>
                <Text style={[{
                  fontWeight: '500',
                  color: COLORS.white,
                  fontSize: SIZES.m
                }]}>Thêm thú cưng</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={{
              paddingBottom: SIZES.m,
              fontWeight: 'bold',
              fontSize: SIZES.m,
              color: COLORS.black,
            }}>
              {areaData?.pets?.length > 0 ? (
                `Thú cưng của tầng (${areaData?.pets?.length})`
              ) : (
                `Thú cưng của tầng`
              )}
            </Text>
          )}

          {showRender ? (
            <SkeletonPet />
          ) :
            (
              <>
                {areaData?.pets?.length > 0 ? (
                  <View>
                    {areaData?.pets.map((pet) => (
                      <Pressable
                        key={pet.id}
                        onPress={() => navigateToPetDetail(pet.id, pet)}
                      >
                        <PetCard petData={pet} />
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <View style={{
                    alignItems: 'center', justifyContent: 'center',
                    padding: SIZES.m
                  }}>
                    <Text style={TEXTS.content} >{SHOPS.noPet}</Text>
                    <Image alt='noInformation' source={require('../../../../../assets/noinfor.png')} style={{
                      height: SIZES.height / 6,
                      width: SIZES.height / 6,
                      alignSelf: 'center',
                    }} />
                  </View>
                )}
              </>
            )}
        </View>
      </ScrollView>
    </NativeBaseProvider >
  )
}

const styles = StyleSheet.create({
  flexBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  flexColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 5,
  },
  text: {
    fontSize: 20,
    marginTop: 10,
  },
  smallBox: {
    padding: 10,
  },
  img: {
    height: 170,
    borderRadius: 10,
    width: '100%',
  },
  rating: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.primary,
    width: 40,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});
