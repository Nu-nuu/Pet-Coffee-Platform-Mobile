import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Center,
  Divider,
  Image,
  Input,
  NativeBaseProvider,
  Radio,
  Skeleton,
} from 'native-base';
import { BRS, BUTTONS, COLORS, ICONS, SHADOWS, SHOPS, SIZES, TEXTS, USERS } from '../../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEventDetailForCustomerThunk,
  getEventDetailThunk,
} from '../../../../store/apiThunk/eventThunk';
import LottieView from 'lottie-react-native';
import CarouselPost from '../../../../components/Social/carouselPost';
import { petCoffeeShopDetailSelector, userDataSelector } from '../../../../store/sellectors';
import formatDayReservation from '../../../../components/Reservation/formatDayReservation';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import { format } from 'date-fns';
import SkeletonArea from '../../../../components/Alert/skeletonArea';
import Loading from '../../../../components/Alert/modalSimple/loading';

export default function EventDetail({ route, navigation }) {
  // const eventId = route?.params?.eventId;
  const submitEventId = route?.params?.submitEventId;
  const checkFollow = route?.params?.checkFollow
  const dispatch = useDispatch();

  const [showLoadingModal, setShowLoadingModal] = useState(false);



  // console.log(data);
  // function formatDate(inputDate) {
  //   const date = new Date(inputDate);

  //   const options = {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   };

  //   const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
  //     date,
  //   );
  //   return formattedDate;
  // }

  // return (
  //   <NativeBaseProvider>
  //     {!showLoadingModal ? (
  //       <ScrollView>
  //         <TouchableOpacity
  //           onPress={() => navigation.goBack()}
  //           style={{
  //             backgroundColor: 'black',
  //             padding: 7,
  //             borderRadius: 7,
  //             marginLeft: 20,
  //             width: 40,
  //             marginTop: 30,
  //           }}>
  //           <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
  //         </TouchableOpacity>
  //         {data !== null && (
  //           <>
  //             <View
  //               style={{
  //                 margin: 20,
  //                 borderRadius: 10,
  //                 borderTopColor: COLORS.primary,
  //                 borderTopWidth: 10,
  //                 backgroundColor: 'white',
  //                 borderColor: COLORS.primary,
  //                 borderWidth: 1,
  //               }}>
  //               {data.image && (
  //                 <Image
  //                   source={{uri: data.image}}
  //                   alt=""
  //                   style={{
  //                     width: '100%',
  //                     height: 170,
  //                   }}
  //                 />
  //               )}
  //               <View
  //                 style={{
  //                   padding: 25,
  //                   paddingTop: 20,
  //                   paddingBottom: 20,
  //                 }}>
  //                 <Center>
  //                   <Text
  //                     style={{
  //                       fontSize: 30,
  //                       fontWeight: 'bold',
  //                       marginBottom: 10,
  //                       color: 'black',
  //                     }}>
  //                     {data.title}
  //                   </Text>
  //                   <Text
  //                     style={{color: 'gray', marginBottom: 10, fontSize: 16}}>
  //                     {data.totalJoinEvent} joined
  //                   </Text>
  //                 </Center>
  //                 <View style={styles.flexRow}>
  //                   <Octicons name="clock" size={18} color={COLORS.primary} />
  //                   <Text style={{fontSize: 15, fontWeight: 'bold'}}>
  //                     {formatDate(data.startDate)} - {formatDate(data.endDate)}{' '}
  //                     ({data.startTime} - {data.endTime})
  //                   </Text>
  //                 </View>
  //                 <View style={styles.flexRow}>
  //                   <Ionicons
  //                     name="location-sharp"
  //                     size={20}
  //                     color={COLORS.primary}
  //                   />
  //                   <Text style={{fontSize: 15, fontWeight: 'bold'}}>
  //                     {data.location}
  //                   </Text>
  //                 </View>
  //                 <View style={styles.flexRow}>
  //                   <Ionicons
  //                     name="file-tray-full"
  //                     size={20}
  //                     color={COLORS.primary}
  //                   />
  //                   <Text style={{fontSize: 15, fontWeight: 'bold'}}>
  //                     {data.description}
  //                   </Text>
  //                 </View>
  //                 <Divider orientation="horizontal" bg={COLORS.primary} />
  //                 <Text style={{color: 'red', marginTop: 15}}>
  //                   * Biểu thị câu hỏi bắt buộc
  //                 </Text>
  //               </View>
  //             </View>
  //             {data.fields?.map((field, index) => {
  //               const type = field.type;
  //               const answerArr = field.answer?.split(';');
  //               return (
  //                 <View
  //                   key={index}
  //                   style={{
  //                     marginHorizontal: 20,
  //                     marginBottom: 20,
  //                     borderRadius: 10,
  //                     backgroundColor: 'white',
  //                     padding: 20,
  //                     borderColor: COLORS.primary,
  //                     borderWidth: 1,
  //                   }}>
  //                   <Text
  //                     style={{
  //                       fontSize: 20,
  //                       fontWeight: 'bold',
  //                       marginBottom: 20,
  //                     }}>
  //                     {field.question}{' '}
  //                     {field.isOptional === true && (
  //                       <Text style={{color: 'red', fontSize: 18}}>*</Text>
  //                     )}
  //                   </Text>
  //                   {(() => {
  //                     switch (type) {
  //                       case 'input':
  //                         return (
  //                           <Input
  //                             size="lg"
  //                             placeholder="Answer"
  //                             isDisabled
  //                             value={field.submittingContent}
  //                           />
  //                         );
  //                       case 'radio':
  //                         return (
  //                           <Radio.Group defaultValue={field.submittingContent}>
  //                             {answerArr.map((answer, index) => (
  //                               <Radio
  //                                 isDisabled
  //                                 key={index}
  //                                 value={answer}
  //                                 my={1}>
  //                                 {answer}
  //                               </Radio>
  //                             ))}
  //                           </Radio.Group>
  //                         );
  //                       default:
  //                         return null; // Or render default component
  //                     }
  //                   })()}
  //                 </View>
  //               );
  //             })}
  //           </>
  //         )}
  //       </ScrollView>
  //     ) : (
  //       <Center style={{marginTop: 30}}>
  //         <LottieView
  //           source={require('../../../../../assets/images/loading.json')}
  //           autoPlay
  //           style={{width: 100, height: 100}}
  //         />
  //       </Center>
  //     )}
  //   </NativeBaseProvider>
  // );
  const shopData = useSelector(petCoffeeShopDetailSelector);
  const eventDatas = route.params.eventData;
  const [eventData, setEventData] = useState(eventDatas)
  const [showRender, setShowRender] = useState(false);
  const userData = useSelector(userDataSelector)
  const staff = userData.role === 'Staff' ? true : false
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null);

  useEffect(() => {
    setShowRender(true)
    dispatch(getEventDetailThunk(eventDatas.eventId))
      .unwrap()
      .then((res) => {
        setEventData(res)
        setShowRender(false)
      })
      .catch((err) => console.log(err))
  }, [eventDatas])

  useEffect(() => {
    if (eventData.isJoin) {
      setLoading(true);
      if (eventDatas.eventId) {
        dispatch(getEventDetailForCustomerThunk(eventDatas.eventId))
          .unwrap()
          .then(res => {
            setData(res);
            setLoading(false);
          });
      }
    }

  }, [eventData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}`;
  };

  const isEventEnded = (eventData) => {
    const endDate = new Date(eventData?.endDate);
    const endTime = eventData?.endTime.split(':');
    endDate.setHours(parseInt(endTime[0], 10), parseInt(endTime[1], 10));

    const now = new Date();
    return now > endDate;
  };
  const isEventNotStarted = (eventData) => {
    const startDate = new Date(eventData?.startDate);
    const startTime = eventData?.startTime.split(':');
    startDate.setHours(parseInt(startTime[0], 10), parseInt(startTime[1], 10));

    const now = new Date();
    return now < startDate;
  };
  const eventEnded = isEventEnded(eventData);
  const eventNotStarted = isEventNotStarted(eventData);

  let statusText = '';
  let statusColor = '';

  if (eventEnded) {
    statusText = 'Đã kết thúc';
    statusColor = COLORS.primary;
  } else if (eventNotStarted) {
    statusText = 'Sắp diễn ra';
    statusColor = COLORS.yellow;
  } else {
    statusText = 'Đang diễn ra';
    statusColor = COLORS.success;
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Sự kiện của quán ' + `${shopData.name}`,
      //về home
      headerRight: () => (
        <Pressable style={{ paddingRight: SIZES.m }} onPress={() => {
          {
            staff ? (
              navigation.navigate('TabGroup', { screen: 'Staff' })
            ) : (
              navigation.navigate('TabGroup', { screen: 'Customer' })
            )
          }
        }}>
          <Ionicons name="home" size={24} color={COLORS.black} />
        </Pressable>
      ),
    })
  }, [])

  const handlePressJoinEvent = (event) => {
    navigation.navigate('JoinEvent', {
      eventData: event,
      checkFollow: checkFollow,
    });
  }

  return (
    <NativeBaseProvider>
      <ScrollView style={{
        backgroundColor: COLORS.bgr,
        flex: 1,
      }}>
        <View>
          {eventDatas.image && eventDatas.image !== '' ? (
            <View style={styles.imageContainer}>
              {eventDatas.image.split(';').length > 1 ? (
                <CarouselPost images={eventDatas.image.split(';')} />
              ) : (
                <Image
                  source={{ uri: eventDatas.image }}
                  alt=''
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                    height: SIZES.height / 3,
                    position: 'relative',
                  }}
                />
              )}
            </View>
          ) : (
            <View style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              height: SIZES.height / 3,
              backgroundColor: COLORS.gray1,
            }}><Text>Chưa có ảnh</Text></View>
          )}
        </View>
        {/* ==============Thông tin của sự kiện=================== */}
        <View style={{
          padding: SIZES.m
        }}>
          <Text style={[TEXTS.titleMax,]}>{eventDatas.title}</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: SIZES.m
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin chi tiết</Text>
            {!staff && (
              <>
                {showRender ? (<Skeleton w="20" h="10" rounded='md' />) : (
                  <>
                    {!eventEnded && !eventData.isJoin && (
                      <Pressable
                        onPress={() => handlePressJoinEvent(eventDatas)}
                        disabled={eventData.totalJoinEvent === eventData.maxParticipants}
                        style={[
                          BUTTONS.recMid,
                          {
                            backgroundColor: eventData.totalJoinEvent === eventData.maxParticipants ? COLORS.gray2 : COLORS.primary,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }]}>
                        <Text style={[{
                          fontWeight: '500',
                          color: COLORS.white,
                          fontSize: SIZES.m
                        }]}>
                          Đăng ký
                        </Text>
                      </Pressable>
                    )}
                    {eventData.isJoin && (
                      <View
                        style={[
                          {
                            backgroundColor: COLORS.bgr,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: SIZES.s / 2,
                            borderWidth: 1,
                            borderColor: COLORS.primary,
                            borderRadius: BRS.in,
                            padding: SIZES.s / 2,
                          }]}>
                        <Text style={[{
                          fontWeight: '500',
                          color: COLORS.primary,
                          fontSize: SIZES.m
                        }]}>
                          Đã đăng ký
                        </Text>
                        <Ionicons name="checkmark-circle" size={ICONS.xm} color={COLORS.primary} />
                      </View>
                    )}
                  </>
                )}
              </>
            )}


          </View>
          {/* ===============Thời gian trạng thái================ */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingRight: SIZES.m,
              paddingVertical: SIZES.s / 1.5,
            }}>
              <View style={ICONS.coverCub}>
                <Ionicons name="calendar" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
              </View>
              {showRender ? (<Skeleton.Text lines={2} />) : (
                <View style={{
                  flexDirection: 'column',
                }}>
                  <Text style={[TEXTS.content, { color: COLORS.black }]}>Ngày diễn ra</Text>
                  <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>{format(eventDatas.startDate, 'dd/MM')} - {format(eventDatas.endDate, 'dd/MM/yyyy')}</Text>
                </View>
              )}
            </View>
            <Text style={[TEXTS.content, { fontWeight: '500', color: statusColor }]}>{statusText}</Text>
          </View>
          {/* ===============Thời gian================ */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingRight: SIZES.m,
            paddingVertical: SIZES.s / 1.5,
          }}>
            <View style={ICONS.coverCub}>
              <Ionicons name="time" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
            </View>
            {showRender ? (<Skeleton.Text lines={2} />) : (
              <View style={{
                flexDirection: 'column',
              }}>
                <Text style={[TEXTS.content, { color: COLORS.black }]}>Khung giờ</Text>
                <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>{eventDatas.startTime} - {eventDatas.endTime}</Text>
              </View>
            )}
          </View>
          {/* ===============Địa điểm================ */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingRight: SIZES.m,
            paddingVertical: SIZES.s / 1.5,
            width: '90%'
          }}>
            <View style={ICONS.coverCub}>
              <Ionicons name="location" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
            </View>
            {showRender ? (<Skeleton.Text lines={2} />) : (
              <View style={{
                flexDirection: 'column',
              }}>
                <Text style={[TEXTS.content, { color: COLORS.black }]}>Địa điểm tổ chức</Text>
                <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>{eventDatas.location}</Text>
              </View>
            )}
          </View>
          {/* ===============Người tham gia================ */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingRight: SIZES.m,
            paddingVertical: SIZES.s / 1.5,
          }}>
            <View style={ICONS.coverCub}>
              <Ionicons name="people" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
            </View>
            {showRender ? (<Skeleton.Text lines={2} />) : (
              <View style={{
                flexDirection: 'column',
              }}>
                <Text style={[TEXTS.content, { color: COLORS.black }]}>Người tham gia</Text>
                {eventData.totalJoinEvent === eventData.maxParticipants ? (
                  <Text style={[TEXTS.content, { fontWeight: '500', color: eventEnded ? COLORS.gray2 : COLORS.primary }]}>Đủ người tham gia</Text>
                ) : eventData.totalJoinEvent > 0 ? (
                  <Text style={[TEXTS.content, { fontWeight: '500', color: eventEnded ? COLORS.gray2 : COLORS.success }]}>{eventData.totalJoinEvent} người tham gia</Text>
                )
                  : (
                    <Text numberOfLines={1} style={[TEXTS.content, { fontWeight: '500', color: eventEnded ? COLORS.gray2 : COLORS.primary }]}>Chưa có người tham gia</Text>
                  )
                }
              </View>
            )}
          </View>
          {/* ===============Giới thiệu================ */}
          <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: SIZES.m
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Mô tả</Text>
            <Text style={[TEXTS.content, { paddingTop: SIZES.s }]}>
              {eventDatas.description}
            </Text>
            {/* ===============form đã đăng ký================ */}
            {eventData.isJoin && (
              <>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: SIZES.m,
                    color: COLORS.black,
                    paddingTop: SIZES.s,
                  }}>
                  Câu trả lời của bạn
                </Text>
                {loading ? (
                  <View style={{}}>
                    <SkeletonArea />
                  </View>
                ) : (
                  <>
                    {data !== null ? (
                      <>
                        {data.fields?.map((field, index) => {
                          const type = field.type;
                          const answerArr = field.answer?.split(';');
                          return (
                            <View
                              key={index}
                              style={{
                                paddingVertical: SIZES.s / 2,
                              }}>
                              <View
                                style={[
                                  {
                                    backgroundColor: 'white',
                                    paddingHorizontal: 20,
                                    paddingVertical: 18,
                                    borderRadius: 18,
                                  },
                                  SHADOWS.s,
                                ]}>
                                <Text
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: SIZES.m,
                                    color: COLORS.black,
                                    paddingBottom: SIZES.s,
                                  }}>
                                  {field.question}{' '}
                                  {field.isOptional === true && (
                                    <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                                  )}
                                </Text>
                                {(() => {
                                  switch (type) {
                                    case 'input':
                                      return (
                                        <Input
                                          size="lg"
                                          placeholder="Answer"
                                          isDisabled
                                          value={field.submittingContent}
                                        />
                                      );
                                    case 'radio':
                                      return (
                                        <Radio.Group defaultValue={field.submittingContent}>
                                          {answerArr.map((answer, index) => (
                                            <Radio
                                              isDisabled
                                              key={index}
                                              value={answer}
                                              my={1}>
                                              {answer}
                                            </Radio>
                                          ))}
                                        </Radio.Group>
                                      );
                                    default:
                                      return null; // Or render default component
                                  }
                                })()}
                                <View />
                              </View>
                            </View>
                          )
                        })}
                      </>
                    ) : (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: SIZES.m,
                        }}>
                        <Text style={TEXTS.content}>{USERS.noForm}</Text>
                        <Image
                          alt="noInformation"
                          source={require('../../../../../assets/noinfor.png')}
                          style={{
                            height: SIZES.height / 6,
                            width: SIZES.height / 6,
                            alignSelf: 'center',
                          }}
                        />
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </View>

        </View>

      </ScrollView>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  cancel: {
    height: SIZES.height / 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.s,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray1,
  },
});
