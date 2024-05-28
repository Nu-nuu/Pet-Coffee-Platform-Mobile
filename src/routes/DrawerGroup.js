//sidebar

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Wallet from '../screens/Wallet/wallet';
import HomeStackGroup from './HomeStackGroup';
import TransactionHistory from '../screens/TransactionHistory/transactionHistory';
import CustomDrawer from '../components/Drawer/customDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Items from '../screens/Items/items';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Topup from '../screens/Topup/topup';
import { BUTTONS, COLORS, SIZES } from '../constants';

const Drawer = createDrawerNavigator();

export default function DrawerGroup() {
  const navigation = useNavigation();

  const navigateToTopUpScreen = () => {
    navigation.navigate('Nạp tiền');
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} navigation={props.navigation} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.primary200,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.gray3,
      }
      }>

      <Drawer.Screen
        name="HomeStackGroup"
        component={HomeStackGroup}
        options={{
          drawerLabel: 'Trang chủ',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Ví của bạn"
        component={Wallet}
        options={{
          headerRight: () => (
            <Pressable
              onPress={navigateToTopUpScreen}
              style={[
                BUTTONS.recMid,
                {
                  backgroundColor: COLORS.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: SIZES.m,
                }]}>
              <Text style={[{
                fontWeight: '500',
                color: COLORS.white,
                fontSize: SIZES.m
              }]}>Nạp tiền</Text>
            </Pressable>
          ),
          headerShown: true,
          drawerIcon: ({ color }) => (
            <Ionicons name="wallet-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Nạp tiền"
        component={Topup}
        options={{
          headerShown: true,
          drawerIcon: ({ color }) => (
            <Ionicons name="cash-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cửa hàng quà tặng"
        component={Items}
        options={{
          headerShown: true,
          drawerIcon: ({ color }) => (
            <Ionicons name="diamond-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Lịch sử giao dịch"
        component={TransactionHistory}
        options={{
          headerShown: true,
          drawerIcon: ({ color }) => (
            <Ionicons name="time-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
