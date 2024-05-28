import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Center, Divider, Image, Modal, NativeBaseProvider } from 'native-base';
import { BUTTONS, COLORS, PETS, SIZES, TEXTS } from '../../constants';

import { userDataSelector, vaccinationsFromPetSelector } from '../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteVaccinationThunk,
  getVaccinationsFromPetThunk,
} from '../../store/apiThunk/vaccinationThunk';
import { useNavigation } from '@react-navigation/native';

import VaccineCard from './vaccineCard';
import SkeletonPost from '../Alert/skeletonPost';
import Success from '../Alert/modalSimple/success';
import Loading from '../Alert/modalSimple/loading';

export default function PetVaccines(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [render, setRender] = useState(false)
  const vaccines = useSelector(vaccinationsFromPetSelector);
  const petData = props.petData;
  const vaccine = props.vaccine
  const userData = useSelector(userDataSelector)
  const shop = userData.role === 'Staff' ? true : false
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  useEffect(() => {
    if (vaccines == [] || vaccines[0]?.petId != petData.id || vaccine) {
      setRender(true);
      dispatch(getVaccinationsFromPetThunk(petData.id))
        .unwrap()
        .then(() => {
          setRender(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props]);

  const navigateToCreateVaccine = () => {
    navigation.navigate('CreateVaccination', {
      id: petData.id,
      petData: petData,
    });
  };


  const handleDeleteVaccine = (id) => {
    setShowLoadingModal(true);
    dispatch(deleteVaccinationThunk(id))
      .unwrap()
      .then(() => {
        setShowLoadingModal(false);
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
        }, 2000);
        setRender(true);
        dispatch(getVaccinationsFromPetThunk(petData.id))
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
            <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin tiêm phòng của {petData.name}</Text>
            <Pressable
              onPress={navigateToCreateVaccine}
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
          <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin tiêm phòng của {petData.name}</Text>
        )}
        {render ? (
          <SkeletonPost />
        ) :
          (
            <View style={{ paddingTop: SIZES.m }}>
              {vaccines?.length > 0 ? (
                <>
                  {vaccines.map((vaccines, index) => (
                    <Pressable style={{ marginBottom: SIZES.s, }} key={index}>
                      <VaccineCard vaccineData={vaccines} petData={petData} deleteVaccine={handleDeleteVaccine} />
                    </Pressable>
                  ))}
                </>
              ) : (
                <View style={{
                  alignItems: 'center', justifyContent: 'center',
                  padding: SIZES.m
                }}>
                  <Text style={TEXTS.content} >{PETS.noVaccine}</Text>
                  <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                    height: SIZES.height / 6,
                    width: SIZES.height / 6,
                    alignSelf: 'center',
                  }} />
                </View>
              )}
            </View>
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
