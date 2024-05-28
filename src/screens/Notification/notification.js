import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  allNotificationsSelector,
  unreadNotificationsSelector,
  userDataSelector,
} from '../../store/sellectors';
import {
  getAllNotificationsThunk,
  getUnreadNotificationsThunk,
  readAllNotificationsThunk,
} from '../../store/apiThunk/notificationThunk';
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from '@microsoft/signalr';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, ICONS, SHADOWS, SIZES, TEXTS, USERS } from '../../constants';
import formatTime from '../../components/Social/formatTime';

export default function Notification() {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);
  const unreadNotifications = useSelector(unreadNotificationsSelector);
  const allNotifications = useSelector(allNotificationsSelector);
  const [count, setCount] = useState(unreadNotifications?.count || 0);
  const [notiData, setNotiData] = useState(allNotifications || []);

  useLayoutEffect(() => {
    if (count > 0) {
      navigation.setOptions({
        tabBarBadge: count,
        tabBarBadgeStyle: {
          backgroundColor: 'red'
        }
      })
    } else {
      navigation.setOptions({
        tabBarBadgeStyle: {
          backgroundColor: 'transparent'
        }
      })
    }
  }, [count])

  const joinNoti = () => {
    try {
      if (userData) {
        const connection = new HubConnectionBuilder()
          .withUrl(
            `https://petcoffeshops.azurewebsites.net/notification-hub?accountId=${userData.id}`,
            {
              skipNegotiation: true,
              transport: HttpTransportType.WebSockets,
            },
          )
          .configureLogging(LogLevel.Information)
          .build();
        connection.start().then(() => connection.invoke('OnConnectedAsync'));
        connection.on('ReceiveNotification', () => {
          dispatch(getAllNotificationsThunk())
            .unwrap()
            .then(response => {
              setNotiData(response);
              dispatch(getUnreadNotificationsThunk())
                .unwrap()
                .then(res => setCount(res.count));
            });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    joinNoti();
  }, []);

  const handleNavigate = type => {
    switch (type) {
      case 'Shop':
        navigate('shop');
        break;
      case 'Report':
        navigate('report');
        break;
      case 'Wallet':
      case 'Transaction':
        navigate('wallet');
        break;
      default:
        break;
    }
  };

  const handleReadAll = () => {
    setCount(0);
    const updatedNotiData = notiData.map(noti => ({
      ...noti,
      isRead: true,
    }));
    setNotiData(updatedNotiData);
    dispatch(readAllNotificationsThunk()).then(() => {
      dispatch(getUnreadNotificationsThunk());
      dispatch(getAllNotificationsThunk());
    });
  };

  //refresh
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);
  const handleRefresh = () => {
    console.log('có refresh');
    setRefreshing(true);
    dispatch(getAllNotificationsThunk())
      .unwrap()
      .then(response => {
        setNotiData(response)
        console.log(response)
        dispatch(getUnreadNotificationsThunk())
          .unwrap()
          .then(res => {
            setCount(res.count)
            setRefreshing(false)
          })
          .catch((err) => {
            console.log(err)
            setRefreshing(false)
          });
      })
      .catch((err) => {
        console.log(err)
        setRefreshing(false)
      })
  };

  const renderItem = ({ item }) => (
    <View style={{
      marginBottom: SIZES.s / 2,
    }}>
      <View style={[{
        backgroundColor: item.isRead ? COLORS.white : COLORS.primary100,
        width: '100%',
        height: 78,
        alignItems: 'flex-start',
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }]}>
        <Text style={[TEXTS.subContent, { color: COLORS.black, }]}>{item?.title}</Text>
        <Text numberOfLines={1} style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{item?.content}</Text>
        <Text style={[TEXTS.subContent, { color: COLORS.black, alignSelf: "flex-end" }]}>{formatTime(item?.createdAt)}</Text>
      </View>
    </View>

  );



  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.bgr,
      padding: SIZES.m,
      paddingTop: SIZES.m * 2,

    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: SIZES.s,
        }}>
          <Text style={TEXTS.title}>Thông báo</Text>
          <Ionicons name='notifications' size={ICONS.m} color={COLORS.primary} />
          <Text style={TEXTS.title}>{count !== 0 && `(${count})`}</Text>
        </View>

        <Pressable style={{
          alignSelf: 'flex-end',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }} onPress={handleReadAll}>
          <Text style={{ color: count !== 0 ? COLORS.primary : COLORS.gray2, fontWeight: '500' }}>Đọc tất cả</Text>
          <View style={[ICONS.coverD]}>
            <Ionicons name="checkmark-done-sharp" size={ICONS.m} color={count !== 0 ? COLORS.primary : COLORS.gray2} />
          </View>
        </Pressable>
      </View>

      <View style={{
      }}>
        {notiData?.length !== 0 ? (
          <>
            <FlatList
              data={notiData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              style={{
                height: '87%'
              }}

              //refresh
              ref={flatListRef}
              refreshing={refreshing}
              onRefresh={handleRefresh}

            />
          </>
        ) : (
          <View style={{
            alignItems: 'center', justifyContent: 'center',
            paddingTop: SIZES.m * 2,
          }}>
            <Text style={TEXTS.content} >{USERS.noNoti}</Text>
            <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
              height: SIZES.height / 6,
              width: SIZES.height / 6,
              alignSelf: 'center',
            }} />
          </View>
        )}
      </View>
    </View>
  );
}
