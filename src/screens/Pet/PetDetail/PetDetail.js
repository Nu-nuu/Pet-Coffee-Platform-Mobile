import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Center,
  Divider,
  HamburgerIcon,
  Image,
  Menu,
  NativeBaseProvider,
} from 'native-base';
import { AVATARS, BUTTONS, COLORS, ICONS, PETS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  petDetailSelector,
  randomRatingSelector,
  ratingsFromPetSelector,
  userDataSelector,
} from '../../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import { getPetDetailThunk } from '../../../store/apiThunk/petThunk';
import PetCarousel from '../../../components/PetDetail/petCarousel';
import { getVaccinationsFromPetThunk } from '../../../store/apiThunk/vaccinationThunk';
import ErrorModal from '../../../components/Alert/errorModal';
import PetVaccines from '../../../components/PetDetail/petVaccine';
import PetMoment from '../../../components/PetDetail/petMoment';
import { getMomentsFromPetThunk } from '../../../store/apiThunk/momentThunk';
import PetRating from '../../../components/PetDetail/petRating';
import PetDonation from '../../../components/PetDetail/petDonation';

import PetProfile from './PetProfile';

export default function PetDetail({ route, navigation }) {
  const { id, vaccine, petDatas, edit, moment } = route?.params;
  const userData = useSelector(userDataSelector);

  const [petData, setPetData] = useState(petDatas)
  const shop = userData.role === 'Staff' ? true : false

  useEffect(() => {
    setPetData(petDatas)
    if (edit) {
      setSelectedComponent(<PetProfile petDatas={petDatas} petId={id} />)
    } else if (moment) {
      setSelectedComponent(<PetMoment petDatas={petDatas} moment={moment} />)
    } else if (vaccine) {
      setSelectedComponent(<PetVaccines petDatas={petDatas} vaccine={vaccine} />)
    }
  }, [petDatas])

  const dispatch = useDispatch();
  const thisPet = useSelector(petDetailSelector);
  const petRatings = useSelector(ratingsFromPetSelector);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: petData.name,
      //về home
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
    }
    )
  }, [thisPet])

  const [selectedComponent, setSelectedComponent] = useState(<PetProfile petDatas={petData} petId={id} />);
  const [selectedId, setSelectedId] = useState(0);
  const ratePetIds = petRatings?.map(item => item.account.id);
  const [render, setRender] = useState(false)


  const backgroundsArray = petData?.backgrounds != null && petData.backgrounds.split(';');
  const arrBackground = petData?.backgrounds ? backgroundsArray : [];

  useEffect(() => {
    setRender(true);
    dispatch(getPetDetailThunk(id))
      .unwrap()
      .then(() => {
        setRender(false);
      });
  }, [id]);

  const checkRate = ratePetIds?.includes(userData.id);

  const ScreenNames = [
    { id: 0, name: 'Giới thiệu', component: <PetProfile petDatas={petData} petId={id} /> },
    { id: 1, name: 'Ủng hộ', component: <PetDonation petData={petData} /> },
    { id: 2, name: 'Khoảnh khắc', component: <PetMoment petData={petData} /> },
    { id: 3, name: 'Đánh giá', component: <PetRating petData={petData} /> },
    { id: 4, name: 'Tiêm phòng', component: <PetVaccines petData={petData} /> },
  ];

  const flatListRef = useRef(null);

  const handleRating = () => {
    const selectedItem = ScreenNames.find(item => item.name === 'Đánh giá');
    setSelectedComponent(selectedItem.component);
    setSelectedId(selectedItem.id);
    flatListRef.current.scrollToIndex({ animated: true, index: selectedItem.id });
  };

  const handleDonate = () => {
    const selectedItem = ScreenNames.find(item => item.name === 'Ủng hộ');
    setSelectedComponent(selectedItem.component);
    setSelectedId(selectedItem.id);
    flatListRef.current.scrollToIndex({ animated: true, index: selectedItem.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => [setSelectedComponent(item.component), setSelectedId(item.id)]}
      style={{
        width: SIZES.width / 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderBottomStartRadius: 3,
        borderBottomEndRadius: 3,
        borderColor: selectedId === item.id ? COLORS.primary : 'transparent',
      }}>
      <Text style={{
        textTransform: 'none',
        fontSize: SIZES.m,
        fontWeight: selectedId === item.id ? '500' : 'normal',
        color: selectedId === item.id ? COLORS.primary : COLORS.blackBold,
      }} >{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <NativeBaseProvider>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: COLORS.bgr
        }}
      >
        <View>
          <View style={{
            backgroundColor: COLORS.bgr,
          }}>
            {arrBackground.length > 0 ? (
              <Image
                source={{ uri: arrBackground[0] }}
                alt=""
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  height: SIZES.height / 5,
                  position: 'relative',
                }}
              />
            ) : (
              <View style={{
                width: '100%',
                objectFit: 'cover',
                height: SIZES.height / 5,
                position: 'relative',
                backgroundColor: COLORS.gray1
              }}>
              </View>
            )}

            <View
              style={{
                position: 'absolute',
                top: SIZES.height / 10,
                left: SIZES.width / 2 - SIZES.m * 5,
              }}>
              <Image
                source={{ uri: petData.avatar }}
                alt=""
                style={AVATARS.max}
              />
            </View>
            <View
              style={{
                // padding: SIZES.s,
                marginTop: SIZES.width / 6,
                flexDirection: 'column',
                alignItems: 'center',
                gap: SIZES.xs / 2,
              }}
            >
              <View style={{
                flexDirection: 'row',
                gap: SIZES.s,
              }}>
                <Text style={TEXTS.titleMax}>{petData.name}</Text>
                <View style={{}}>
                  <View style={{
                    borderRadius: 20,
                    width: 40,
                    height: 40,
                    backgroundColor: petData.gender === 'MALE' ? COLORS.male200 : COLORS.female200,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Ionicons
                      name={petData.gender === 'MALE' ? 'male' : 'female'}
                      size={ICONS.s}
                      color={petData.gender === 'MALE' ? COLORS.male : COLORS.female}
                    />
                  </View>
                </View>
              </View>

              <Text style={[TEXTS.content]}>{petData.petType === 'Cat'
                ? 'Mèo'
                : petData.petType === 'Dog'
                  ? 'Chó'
                  : 'Khác'} | {petData.typeSpecies}</Text>
              {shop ? (
                <View>
                </View>
              ) : (
                <View style={{
                  flexDirection: 'row',
                  width: SIZES.width - SIZES.m * 2,
                  alignSelf: 'center',
                  gap: SIZES.m * 2,
                }}>
                  {checkRate ? (
                    <Pressable
                      onPress={handleRating}
                      style={[{
                        paddingVertical: SIZES.s,
                        backgroundColor: COLORS.gray1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: SIZES.s,
                        height: SIZES.width / 9,
                        width: SIZES.width / 2 - SIZES.m * 2,
                        borderRadius: 10,
                      }]}
                    >
                      <Ionicons name="star" size={ICONS.xm} color={COLORS.black} />
                      <Text style={{ fontSize: SIZES.m, color: COLORS.black, fontWeight: '500' }}>Đã đánh giá</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={handleRating}
                      style={[{
                        paddingVertical: SIZES.s,
                        backgroundColor: COLORS.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: SIZES.s,
                        height: SIZES.width / 9,
                        width: SIZES.width / 2 - SIZES.m * 2,
                        borderRadius: 10,
                      }]}
                    >
                      <Ionicons name="star" size={ICONS.xm} color={COLORS.white} />
                      <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Đánh giá</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={handleDonate}
                    style={[{
                      paddingVertical: SIZES.s,
                      backgroundColor: COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: SIZES.s,
                      height: SIZES.width / 9,
                      width: SIZES.width / 2 - SIZES.m * 2,
                      borderRadius: 10,
                    }]}
                  >
                    <Ionicons name="gift" size={ICONS.xm} color={COLORS.white} />
                    <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Ủng hộ</Text>
                  </Pressable>
                </View>
              )}

            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={ScreenNames}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[{
            height: 48,
            backgroundColor: COLORS.bgr,
          }, SHADOWS.s]}
        />
        {selectedComponent}

      </ScrollView>
    </NativeBaseProvider>

  )
}

const styles = StyleSheet.create({
  randomRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  randomRatingText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'white',
  },
  box: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: 180,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 30,
  },
  name: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  flexDirectionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 15,
    marginTop: 10,
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flexBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexDirectionColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 5,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 8,
    backgroundColor: 'black',
    borderRadius: 15,
  },
  age: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ageText: {
    fontSize: 13,
    color: '#AEAEAE',
  },
  btn: {
    backgroundColor: 'white',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    marginBottom: 20,
  },
  rate: {
    backgroundColor: 'white',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 20,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },

  // ============================================


});
