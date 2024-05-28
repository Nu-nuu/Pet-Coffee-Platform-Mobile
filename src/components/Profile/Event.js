import { Center, Image, ScrollView, Text, View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  getEventsFromShopThunk,
  getJoinEventsThunk,
} from '../../store/apiThunk/eventThunk';
import { eventsFromShopSelector, joinEventsSelector, userDataSelector } from '../../store/sellectors';
import LottieView from 'lottie-react-native';
import { COLORS, SHOPS, SIZES, TEXTS, USERS } from '../../constants';
import SkeletonArea from '../Alert/skeletonArea';
import EventCard from './EventCard';

export default function Event(props) {
  const dispatch = useDispatch();
  const shopId = props.shopId;
  const checkFollow = props.checkFollow
  const navigation = useNavigation();
  const [showRender, setShowRender] = useState(false);


  const joinEvent = useSelector(joinEventsSelector);
  const eventData = useSelector(eventsFromShopSelector)
  const userData = useSelector(userDataSelector)

  const shop = userData.role === 'Staff' ? true : false


  useEffect(() => {

    if (shopId) {
      handleFetchData()
    } else {
      handleFetchDataUser()
    }
  }, []);


  const handleFetchData = async () => {
    setShowRender(true);
    dispatch(getEventsFromShopThunk(shopId))
      .unwrap()
      .then(() => {
        setShowRender(false);
      });
  }

  const handleFetchDataUser = async () => {
    setShowRender(true);
    dispatch(getJoinEventsThunk())
      .unwrap()
      .then((res) => {
        setShowRender(false);
      });
  }

  const handlePressEvent = (event) => {
    navigation.navigate('EventDetail', {
      eventData: event,
      checkFollow: checkFollow
    });
  }

  const handlePressJoinEvent = (event) => {
    navigation.navigate('JoinEvent', {
      eventData: event,
      eventId: event.eventId,
      shopId: shopId,
      checkFollow: checkFollow
    });
  }


  return (
    <View style={{
      backgroundColor: shop ? COLORS.quaternary : COLORS.bgr,
      padding: SIZES.m,
    }}>
      {shopId ? (
        <>
          <ScrollView style={{
            paddingBottom: SIZES.m,
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Sự kiện của quán</Text>
            {showRender ? (
              <SkeletonArea />
            ) :
              (
                <>
                  {eventData?.filter(event => event.status === 'Opened')?.length > 0 ? (
                    <View
                      style={{ marginTop: SIZES.m }}
                    >
                      {eventData
                        .filter(event => event.status === 'Opened')
                        .map((event, index) => (
                          <Pressable key={index} onPress={() => handlePressEvent(event)}>
                            <EventCard
                              eventData={event}
                              shop={true}
                              join={event.isJoin}
                              onPressJoin={() => handlePressJoinEvent(event)}
                              onPress={() => handlePressEvent(event)}
                            />
                          </Pressable>
                        ))
                      }

                    </View>
                  ) : (
                    <View style={{
                      alignItems: 'center', justifyContent: 'center',
                      padding: SIZES.m
                    }}>
                      <Text style={TEXTS.content} >{SHOPS.noEvent}</Text>
                      <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                        height: SIZES.height / 6,
                        width: SIZES.height / 6,
                        alignSelf: 'center',
                      }} />
                    </View>
                  )}
                </>
              )}
          </ScrollView>
        </>) :
        (
          <>
            <View style={{
              paddingBottom: SIZES.m,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Sự kiện tôi tham gia</Text>
              {joinEvent.length > 0 ? (
                <ScrollView contentContainerStyle={{ paddingTop: SIZES.m, paddingBottom: SIZES.m * 2, }}>
                  {joinEvent
                    .map((event, index) => (
                      <Pressable key={index} onPress={() => handlePressEvent(event)}>
                        <EventCard
                          eventData={event}
                          join={true}
                          onPress={() => handlePressEvent(event)} />
                      </Pressable>
                    ))}
                </ScrollView>
              ) : (
                <View style={{
                  alignItems: 'center', justifyContent: 'center',
                  padding: SIZES.m
                }}>
                  <Text style={TEXTS.content} >{USERS.noJoinEvent}</Text>
                  <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                    height: SIZES.height / 6,
                    width: SIZES.height / 6,
                    alignSelf: 'center',
                  }} />
                </View>
              )}
            </View>
          </>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
});
