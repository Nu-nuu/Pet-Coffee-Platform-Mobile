import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BUTTONS, COLORS, ICONS, SHOPS, SIZES, TEXTS } from '../../../constants';
import SkeletonPet from '../../../components/Alert/skeletonPet';
import PetCard from '../../../components/Profile/PetCard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getPetsFromShopThunk } from '../../../store/apiThunk/petThunk';
import { petCoffeeShopDetailSelector, petsFromShopSelector, userDataSelector } from '../../../store/sellectors';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Pets = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const shopData = useSelector(petCoffeeShopDetailSelector);
  const petData = useSelector(petsFromShopSelector)
  const [showRender, setShowRender] = useState(false);

  useEffect(() => {
    setShowRender(true);
    dispatch(getPetsFromShopThunk(shopData.id)).then(() => {
      setShowRender(false);
    });
  }, []);
  const navigateToPetDetail = (petId, petData) => {
    navigation.navigate('PetDetail', {
      id: petId,
      petDatas: petData,
    });
  };

  const navigateToCreatePet = () => {
    navigation.navigate('CreatePet', {
      id: shopData.id
    });
  };

  return (
    <ScrollView style={{
      backgroundColor: COLORS.quaternary,
      padding: SIZES.m,
      height: '100%',
    }}>
      <View style={{
        paddingBottom: SIZES.m,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thú cưng của quán</Text>
          <Pressable
            onPress={navigateToCreatePet}
            style={[
              BUTTONS.recMid,
              {
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                width: SIZES.width / 3.5,
                flexDirection: 'row',
                paddingHorizontal: 5,
                gap: 5,
              }]}>
            <Ionicons name='add-circle' size={ICONS.m} color={COLORS.white} />
            <Text style={[{
              fontWeight: '500',
              color: COLORS.white,
              fontSize: SIZES.m
            }]}>Thú cưng</Text>
          </Pressable>
        </View>
        {showRender ? (
          <SkeletonPet />
        ) :
          (
            <>
              {petData.length > 0 ? (
                <View
                  style={{ marginTop: SIZES.m, marginBottom: SIZES.xxl * 2, }}
                >
                  {petData.map((pet) => (
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
                  <Image alt='noInformation' source={require('../../../../assets/noinfor.png')} style={{
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
  )
}

export default Pets

const styles = StyleSheet.create({})