import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useSelector } from 'react-redux';
import { userDataSelector } from '../../store/sellectors';
import { AVATARS, SIZES } from '../../constants';

const CustomDrawer = ({ navigation, ...props }) => {
  const userDetail = useSelector(userDataSelector);
  const role = userDetail.role;

  async function handleSignOut() {
    try {
      await GoogleSignin.signOut()
      await AsyncStorage.clear().then(() => {
        navigation.closeDrawer()
        navigation.navigate('Login')
        console.log('đã clear');
      })
    } catch (error) {
      console.error(error);
      console.log('chưa clear');
    }
  }

  const shopName = userDetail?.shopResponses?.[0]?.name ?? 'loading';
  const shopEmail = userDetail?.shopResponses?.[0]?.email ?? 'loading';

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          source={{
            uri: userDetail.background,
          }}
          style={{ padding: SIZES.m }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{
                uri: userDetail.avatar,
              }}
              style={AVATARS.xmid}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Roboto-Medium',
              marginBottom: 5,
            }}>
            {role === 'Customer' ? userDetail.fullName : shopName}
          </Text>

          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Roboto-Regular',
                marginRight: 5,
              }}>
              {role === 'Customer' ? userDetail.email : shopEmail}
            </Text>
          </View>
        </ImageBackground>

        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList
            {...props}
            navigation={navigation}
          />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity
          onPress={() => handleSignOut()}
          style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Đăng xuất
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
