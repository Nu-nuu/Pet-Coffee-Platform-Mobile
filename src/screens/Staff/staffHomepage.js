import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopTabStaff from './topTabStaff'
import { useSelector, useDispatch } from 'react-redux';
import { petCoffeeShopDetailSelector, userDataSelector } from '../../store/sellectors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AVATARS, BRS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { getPetCoffeeShopDetailThunk } from '../../store/apiThunk/petCoffeeShopThunk';
import Geolocation from '@react-native-community/geolocation';
import SkeletonEvent from '../../components/Alert/skeletonEvent';
import { NativeBaseProvider } from 'native-base';

const StaffHomepage = () => {
  const navigation = useNavigation()
  const userData = useSelector(userDataSelector);
  const shopData = useSelector(petCoffeeShopDetailSelector);
  const [showSignOut, setShopSignOut] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const dispatch = useDispatch();

  async function handleSignOut() {
    try {
      await GoogleSignin.signOut()
      await AsyncStorage.clear().then(() => {
        navigation.navigate('Login')
        console.log('đã clear');
      })
    } catch (error) {
      console.error(error);
      console.log('chưa clear');

    }
  }

  useEffect(() => {
    setShowLoadingModal(true);
    if (userData?.shopResponses?.length > 0) {
      dispatch(
        getPetCoffeeShopDetailThunk({
          id: userData?.shopResponses[0]?.id,
          longitude: 100,
          latitude: 10,
        }),
      ).then(() => {
        setShowLoadingModal(false);
      });
    }
  }, [userData]);

  return (
    <NativeBaseProvider>

      <View
        style={{
          flex: 1,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: SIZES.m, alignItems: 'center', backgroundColor: COLORS.quaternary }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.s, }}
          >
            <Pressable
              onPress={() => setShopSignOut(!showSignOut)}
            >
            </Pressable>
            <Text style={TEXTS.subTitle}>Nhân viên: <Text style={{ fontWeight: '500' }}>{userData.fullName}</Text></Text>
          </View>
          <Pressable
            onPress={() => { handleSignOut() }}
            style={[{
            }]}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Ionicons name="exit-outline" size={ICONS.m} color={COLORS.primary} />
            </View>
          </Pressable>

        </View>
        {showLoadingModal ? (
          <SkeletonEvent />
        ) : (
          <TopTabStaff shopId={shopData.id} />
        )}

      </View>
    </NativeBaseProvider>
  )
}

export default StaffHomepage

const styles = StyleSheet.create({})