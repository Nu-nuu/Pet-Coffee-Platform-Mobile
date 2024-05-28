//bottom tap

import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Notification from '../screens/Notification/notification';
import Profile from '../screens/Authorize/Profile/Profile';
import Homepage from '../screens/Homepage/homepage';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Social from '../screens/Social/social';
import Reservation from '../screens/Reservation/reservation';
import { useSelector } from 'react-redux';
import { unreadNotificationsSelector, userDataSelector } from '../store/sellectors';
import MyShopDetail from '../screens/PetCoffeeShop/MyShopDetail/MyShopDetail';
import { COLORS, ICONS, SIZES } from '../constants';
import Reservations from '../screens/Staff/Reservation/reservations';
import ReservationHistory from '../screens/Reservation/reservationHistory';
import ScanReservation from '../screens/Staff/Reservation/scanReservation';
import StaffHomepage from '../screens/Staff/staffHomepage';
import Downloading from '../components/Alert/downloading';
import { useDispatch } from 'react-redux';
import { getUserDataThunk } from '../store/apiThunk/userThunk';
import { getAllFollowShopsThunk } from '../store/apiThunk/followShopThunk';
import { getAllNotificationsThunk, getUnreadNotificationsThunk } from '../store/apiThunk/notificationThunk';
import { getAllItemsThunk } from '../store/apiThunk/itemThunk';
import { getWalletThunk } from '../store/apiThunk/walletThunk';
import { getPetCoffeeShopDetailThunk } from '../store/apiThunk/petCoffeeShopThunk';
import { NativeBaseProvider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function TabGroup() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const unreadNotifications = useSelector(unreadNotificationsSelector);
  const [count, setCount] = useState(unreadNotifications?.count || 0);
  const userData = useSelector(userDataSelector);
  const [role, setRole] = useState(userData.role)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    dispatch(getUserDataThunk())
      .unwrap()
      .then((res) => {
        setRole(res?.role)
        if (role === 'Customer') {
          dispatch(getAllFollowShopsThunk())
          dispatch(getUnreadNotificationsThunk())
          dispatch(getAllNotificationsThunk())
          dispatch(getAllItemsThunk())
          dispatch(getWalletThunk())
            .then(() => {
              setLoading(false)
              navigation.navigate('Welcome', {
                screen: 'Customer'
              });
            })
        } else {
          dispatch(getUnreadNotificationsThunk());
          dispatch(getAllNotificationsThunk());
          dispatch(getAllItemsThunk())
            .then(() => {
              setLoading(false)
              navigation.navigate('Welcome', {
                screen: 'Staff'
              });
            })
        }
      })
  }, [])

  useEffect(() => {
    setCount(unreadNotifications?.count);
  }, [unreadNotifications])



  return (
    <NativeBaseProvider>
      {loading ? (
        <View style={{
          flex: 1
        }}>
          <Downloading />
        </View>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, focused }) => {
              let iconName;
              let iconSize = route.name === 'ReservationHistory' || route.name === 'ScanReservation' ? 60 : 24;
              if (route.name === 'Customer') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Social') {
                iconName = focused ? 'compass' : 'compass-outline';
              } else if (route.name === 'Notification') {
                iconName = focused ? 'notifications' : 'notifications-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Reservation') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'ReservationHistory') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'ScanReservation') {
                iconName = focused ? 'scan' : 'scan-outline';
              } else if (route.name === 'Staff') {
                iconName = focused ? 'home' : 'home-outline';
              }
              return (
                <View>
                  <View style={{
                    width: iconSize,
                    height: iconSize,
                    backgroundColor: COLORS.white,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: route.name === 'ReservationHistory' || route.name === 'ScanReservation' ? COLORS.primary : null,
                    borderStartWidth: route.name === 'ReservationHistory' || route.name === 'ScanReservation' ? 1 : 0,
                    transform: route.name === 'ReservationHistory' || route.name === 'ScanReservation' ? [{ rotate: '90deg' }] : [],
                    marginBottom: route.name === 'ReservationHistory' || route.name === 'ScanReservation' ? SIZES.l : 0,

                  }}>
                    <View style={{
                      transform: route.name === 'ReservationHistory' || route.name === 'ScanReservation' ? [{ rotate: '-90deg' }] : [],
                    }}>
                      <Ionicons name={iconName} size={ICONS.m} color={color} />
                    </View>
                  </View>
                </View>
              )
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray3,
            tabBarStyle: styles.container,
            tabBarItemStyle: styles.tabItem,
          })}>

          {role != 'Customer' ? (
            <Tab.Screen
              name="Staff"
              component={StaffHomepage}
              options={{
                tabBarLabel: 'Trang chủ',
                headerShown: false,
              }}
            />
          ) : (
            <Tab.Screen
              name="Customer"
              component={Homepage}
              options={{
                tabBarLabel: 'Trang chủ',
                headerShown: false,
              }}
            />
          )}

          <Tab.Screen
            name="Social"
            component={Social}
            options={{ tabBarLabel: 'Khám phá', headerShown: false }}
          />

          {role != 'Customer' ? (
            <Tab.Screen
              name='ScanReservation'
              component={ScanReservation}
              options={{ tabBarLabel: 'Quét QR đặt chỗ', headerShown: false }}
            />

          ) : (
            <Tab.Screen
              name='ReservationHistory'
              component={ReservationHistory}
              options={{ tabBarLabel: 'Lịch sử đặt chỗ', headerShown: false }}
            />
          )}

          <Tab.Screen
            name="Notification"
            component={Notification}
            options={{
              tabBarLabel: 'Thông báo', headerShown: false,
              tabBarBadgeStyle: {
                backgroundColor: count ? 'red' : 'transparent'
              },
              tabBarBadge: count,
            }}
          />

          {role != 'Customer' ? (
            <Tab.Screen
              name='Reservation'
              component={Reservations}
              options={{ tabBarLabel: 'Đơn đặt chỗ', headerShown: false }}
            />
          ) : (
            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{ tabBarLabel: 'Tôi', headerShown: false }}
            />
          )}

        </Tab.Navigator>
      )}

    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    marginBottom: 7,
  },
  container: {
    position: 'absolute',
    width: '95%',
    left: '2.5%',
    bottom: 20,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});
