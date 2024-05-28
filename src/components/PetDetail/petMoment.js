import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Center, Divider, Image, Modal, NativeBaseProvider } from 'native-base';
import { BUTTONS, COLORS, PETS, SIZES, TEXTS } from '../../constants';
import { momentsFromPetSelector, userDataSelector } from '../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  deleteMomentThunk,
  getMomentsFromPetThunk,
} from '../../store/apiThunk/momentThunk';
import SkeletonPost from '../Alert/skeletonPost';
import MomentCard from './momentCard';
import Success from '../Alert/modalSimple/success';
import Loading from '../Alert/modalSimple/loading';

export default function PetMoment(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [render, setRender] = useState(false)
  const moments = useSelector(momentsFromPetSelector);
  const petData = props.petData
  const moment = props.moment

  const userData = useSelector(userDataSelector)
  const shop = userData.role === 'Staff' ? true : false
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  useEffect(() => {
    if (moments == [] || moments[0]?.petId != petData.id || moment) {
      setRender(true);
      dispatch(getMomentsFromPetThunk(petData.id))
        .unwrap()
        .then(() => {
          setRender(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props]);

  const navigateToCreateMoment = () => {
    navigation.navigate('CreateMoment', {
      id: petData.id,
      petData: petData,
    });
  };

  const handleDeleteMoment = (id) => {
    setShowLoadingModal(true);
    dispatch(deleteMomentThunk(id))
      .unwrap()
      .then(() => {
        setShowLoadingModal(false);
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000);
        setRender(true);
        dispatch(getMomentsFromPetThunk(petData.id))
          .unwrap()
          .then(() => {
            setRender(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err))
  }

  return (
    <View style={{
      backgroundColor: COLORS.bgr,
      padding: SIZES.m,
    }}>
      {showSuccessModal && (
        <Success isModal={true} />
      )}
      {showLoadingModal && (
        <Loading isModal={true} />
      )}
      <View style={{
        paddingBottom: SIZES.m,
      }}>
        {shop ? (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Khoảnh khắc của {petData.name}</Text>
            <Pressable
              onPress={navigateToCreateMoment}
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
              }]}>Thêm</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Khoảnh khắc của {petData.name}</Text>
        )}
        {render ? (
          <SkeletonPost />
        ) :
          (
            <>
              {moments?.length > 0 ? (
                <View style={{ paddingTop: SIZES.m }}>
                  {moments.map((moments, index) => (
                    <Pressable style={{ marginBottom: SIZES.s, }} key={index}>
                      <MomentCard momentData={moments} petData={petData} deleteMoment={handleDeleteMoment} />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={{
                  alignItems: 'center', justifyContent: 'center',
                  padding: SIZES.m
                }}>
                  <Text style={TEXTS.content} >{PETS.noMoment}</Text>
                  <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                    height: SIZES.height / 6,
                    width: SIZES.height / 6,
                    alignSelf: 'center',
                  }} />
                </View>
              )}
            </>
          )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  vaccineFlexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  vaccineFlexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 10,
  },
  vaccineBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 15,
    elevation: 5,
  },
  vaccineSmallBox: {
    padding: 10,
  },
  vaccineImg: {
    height: 170,
    borderRadius: 10,
    width: 360,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
