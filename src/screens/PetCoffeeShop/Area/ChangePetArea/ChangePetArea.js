import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Center,
  NativeBaseProvider,
  Heading,
  Checkbox,
  Image,
  FlatList,
} from 'native-base';
import { BUTTONS, COLORS, SIZES } from '../../../../constants';
import ErrorModal from '../../../../components/Alert/errorModal';
import SuccessModal from '../../../../components/Alert/successModal';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { updatePetsFromAreaThunk } from '../../../../store/apiThunk/petThunk';
import {
  areaDetailSelector,
  petCoffeeShopDetailSelector,
  petsFromShopSelector,
} from '../../../../store/sellectors';
import { getAreaDetailThunk, getAreasFromShopThunk } from '../../../../store/apiThunk/areaThunk';
import QuestionModal from '../../../../components/Alert/questionModal';
import PetCard from '../../../../components/Profile/PetCard';
import Loading from '../../../../components/Alert/modalSimple/loading';
import Success from '../../../../components/Alert/modalSimple/success';
import SkeletonPet from '../../../../components/Alert/skeletonPet';

export default function ChangePetArea({ route, navigation }) {
  const areaId = route?.params?.areaId;
  const dispatch = useDispatch();
  const petsFromShop = useSelector(petsFromShopSelector);
  const areaDetail = useSelector(areaDetailSelector);
  const shopData = useSelector(petCoffeeShopDetailSelector);

  const petsFromAreaIds = areaDetail.pets?.map(pet => pet.id);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [render, setRender] = useState(false);

  const [listPetIds, setListPetIds] = useState(petsFromAreaIds);

  const handleCheckboxChange = id => {
    const index = listPetIds.indexOf(id);

    if (index === -1) {
      setListPetIds(prevIds => [...prevIds, id]);
    } else {
      setListPetIds(prevIds => prevIds.filter(petId => petId !== id));
    }
  };

  useEffect(() => {
    setRender(true)
    dispatch(getAreasFromShopThunk(shopData.id))
    dispatch(getAreaDetailThunk(areaId))
      .unwrap()
      .then(() => setRender(false)
      )
      .catch((err) => console.log(err))

  }, [])

  const handleSubmit = () => {
    setShowLoadingModal(true);

    const data = {
      areaId: areaId,
      petIds: listPetIds,
    };

    dispatch(updatePetsFromAreaThunk(data))
      .unwrap()
      .then(() => {
        dispatch(getAreasFromShopThunk(shopData.id))
        dispatch(getAreaDetailThunk(areaId))
          .unwrap()
          .then(() => {
            setShowLoadingModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false)
              navigation.navigate('AreaDetail', {
                areaId: areaId,
                areaData: areaData,
                res: true
              });

            }, 3000);
          });
      })
      .catch(error => {
        setShowLoadingModal(false);
        setErrorMsg(error.message);
        setShowErrorModal(true);
      });
  };

  const areaData = useSelector(areaDetailSelector)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Thêm thú cưng cho Tầng ' + `${areaData.order}`,
    })
  }, [])
  const renderCheckboxItem = ({ item }) => (
    <Checkbox
      value={item.id}
      key={item.id}
      colorScheme="orange"
      defaultIsChecked={petsFromAreaIds.includes(item.id)}
      onChange={() => handleCheckboxChange(item.id)}>
      <View style={{
        width: SIZES.width / 1.2
      }}>
        <PetCard area={true} petData={item} />
      </View>
    </Checkbox>
  );

  return (
    <NativeBaseProvider>
      <View style={{
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
        <View style={{
          backgroundColor: COLORS.bgr,
          alignItems: "center"
        }}>
          <Text style={{ padding: SIZES.m, alignSelf: 'flex-start', fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Danh sách thú cưng của quán</Text>
          {render ? (
            <View style={{padding: SIZES.m}}>
              <SkeletonPet />
              <SkeletonPet />
              <SkeletonPet />
            </View>
          ) : (
            <FlatList
              data={petsFromShop}
              renderItem={renderCheckboxItem}
              keyExtractor={item => item.id?.toString()}
              style={{
                height: SIZES.height - SIZES.height / 4.5,
              }}
            />
          )}

          <Center>
            <Center>
              <View style={styles.cancel}>
                <Pressable style={{
                  width: SIZES.width - SIZES.s * 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: SIZES.s,
                }} onPress={handleSubmit}>
                  <View
                    style={[{
                      paddingVertical: SIZES.s,
                      backgroundColor: COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: SIZES.s
                    }, BUTTONS.recFull]}
                  >
                    <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Cập nhật</Text>
                  </View>
                </Pressable>
              </View>
            </Center>
          </Center>
        </View>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  cancel: {
    height: SIZES.height / 10,
    padding: SIZES.s,
  },
  loginBtn: {
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    marginTop: 30,
  },
  smallBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    paddingBottom: 0,
  },
  heading: { color: COLORS.primary, fontSize: 20 },
  desc: {
    color: 'gray',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 30,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 90,
    padding: 10,
    marginTop: 20,
    borderColor: COLORS.primary,
    borderWidth: 1,
    marginBottom: 20,
  },
});
