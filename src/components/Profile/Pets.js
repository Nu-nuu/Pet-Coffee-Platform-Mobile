import { Center, Image, ScrollView, Text, View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { petsFromShopSelector, userDataSelector } from '../../store/sellectors';
import {
  deletePetThunk,
  getPetsFromShopThunk,
} from '../../store/apiThunk/petThunk';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHOPS, SIZES, TEXTS } from '../../constants';

import PetCard from './PetCard';
import SkeletonPet from '../Alert/skeletonPet';

export default function Pets(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const thisPets = useSelector(petsFromShopSelector);
  const [showRender, setShowRender] = useState(false);


  useEffect(() => {
    if (thisPets[0]?.petCoffeeShopId != props.shopId || thisPets.length < 0) {
      setShowRender(true);
      dispatch(getPetsFromShopThunk(props.shopId)).then(() => {
        setShowRender(false);
      });
    }
  }, []);


  const navigateToPetDetail = (petId, petData) => {
    navigation.navigate('PetDetail', {
      id: petId,
      petDatas: petData,
      direction: props.direction,
    });
  };


  return (
    <View style={{
      backgroundColor: COLORS.bgr,
      padding: SIZES.m,
      minHeight: SIZES.height / 2,
    }}>
      <View style={{
        paddingBottom: SIZES.m,
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thú cưng của quán</Text>
        {showRender ? (
          <SkeletonPet />
        ) :
          (
            <>
              {thisPets.length > 0 ? (
                <View
                  style={{ marginTop: SIZES.m }}
                >
                  {thisPets.map((pet) => (
                    <Pressable key={pet.id} onPress={() => navigateToPetDetail(pet.id, pet)}>
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
});
