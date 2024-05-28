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
  Checkbox,
  Divider,
  Image,
  Input,
  NativeBaseProvider,
  Radio,
} from 'native-base';
import {
  BRS,
  BUTTONS,
  COLORS,
  ICONS,
  SHADOWS,
  SHOPS,
  SIZES,
  TEXTS,
} from '../../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  petCoffeeShopDetailSelector,
  userDataSelector,
} from '../../../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEventDetailThunk,
  getEventsFromShopThunk,
  getJoinEventsThunk,
  joinEventThunk,
} from '../../../../store/apiThunk/eventThunk';
import SuccessModal from '../../../../components/Alert/successModal';
import ErrorModal from '../../../../components/Alert/errorModal';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../../components/Alert/questionModal';
import formatDayReservation from '../../../../components/Reservation/formatDayReservation';
import CarouselPost from '../../../../components/Social/carouselPost';
import SkeletonPost from '../../../../components/Alert/skeletonPost';
import SkeletonEvent from '../../../../components/Alert/skeletonEvent';
import Loading from '../../../../components/Alert/modalSimple/loading';
import Success from '../../../../components/Alert/modalSimple/success';
import SkeletonArea from '../../../../components/Alert/skeletonArea';

export default function JoinEvent({ route, navigation }) {
  const eventData = route?.params?.eventData;
  const checkFollow = route?.params?.checkFollow;

  const eventId = eventData?.eventId;
  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);
  const shopData = useSelector(petCoffeeShopDetailSelector);

  const staff = userData.role === 'Staff' ? true : false

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitData, setSubmitData] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [data, setData] = useState(eventData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [questionMsg, setQuestionMsg] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getEventDetailThunk(eventData.eventId))
      .unwrap()
      .then(res => {
        setData(res);
        setLoading(false);
      });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Đăng ký tham gia sự kiện',
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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date,
    );
    return formattedDate;
  }

  const handleInput = (eventFieldId, value, isOptional) => {
    const updatedSubmitData = [...submitData];
    const existingIndex = updatedSubmitData.findIndex(
      data => data.eventFieldId === eventFieldId,
    );

    if (existingIndex !== -1) {
      updatedSubmitData[existingIndex] = {
        eventFieldId,
        submittingContent: value,
      };
    } else {
      updatedSubmitData.push({ eventFieldId, submittingContent: value });
    }

    setSubmitData(updatedSubmitData);
    if (isOptional === false) {
      setFieldErrors(prevErrors => ({
        ...prevErrors,
        [eventFieldId]: value ? null : 'Thông tin bắt buộc',
      }));
    }
  };

  const handleRadio = (eventFieldId, value) => {
    setSubmitData(prevData => {
      const updatedData = prevData.filter(
        data => data.eventFieldId !== eventFieldId,
      );
      return [...updatedData, { eventFieldId, submittingContent: value }];
    });
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [eventFieldId]: value ? null : 'Chưa điền thông tin',
    }));
  };

  const handleSubmit = () => {
    const mandatoryFields = data.fields?.filter(field => !field.isOptional);

    const hasEmptyMandatoryFields = mandatoryFields.some(field => {
      const fieldValue = submitData.find(
        data => data.eventFieldId === field.id,
      )?.submittingContent;
      return !fieldValue || fieldValue.trim() === '';
    });

    if (hasEmptyMandatoryFields) {
      setFieldErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        mandatoryFields.forEach(field => {
          if (!submitData.find(data => data.eventFieldId === field.id)) {
            if (field.type === 'input') {
              updatedErrors[field.id] = 'Thông tin bắt buộc';
            } else if (field.type === 'radio') {
              updatedErrors[field.id] = 'Chưa điền thông tin';
            }
          }
        });
        return updatedErrors;
      });
      return;
    }
    const eventData = {
      eventId: eventId,
      answers: submitData,
    };
    setShowLoadingModal(true);

    dispatch(joinEventThunk(eventData))
      .unwrap()
      .then(() => {
        dispatch(getEventsFromShopThunk(shopData.id))
        dispatch(getEventDetailThunk(eventId))
        setShowLoadingModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate('ShopDetail', {
            id: shopData.id,
            shopData: shopData,
            checkFollow: checkFollow,
            event: true
          })
        }, 3000);

      })
      .catch(err => {
        setShowLoadingModal(false);
        setErrorMsg(err);
        setShowErrorModal(true);
      });
  };

  // const isEventEnded = (eventData) => {
  //   const endDate = new Date(eventData?.endDate);
  //   const endTime = eventData?.endTime.split(':');
  //   endDate.setHours(parseInt(endTime[0], 10), parseInt(endTime[1], 10));

  //   const now = new Date();
  //   return now > endDate;
  // };
  // const isEventNotStarted = (eventData) => {
  //   const startDate = new Date(eventData?.startDate);
  //   const startTime = eventData?.startTime.split(':');
  //   startDate.setHours(parseInt(startTime[0], 10), parseInt(startTime[1], 10));

  //   const now = new Date();
  //   return now < startDate;
  // };
  // const eventEnded = isEventEnded(data);
  // const eventNotStarted = isEventNotStarted(data);

  // let statusText = '';
  // let statusColor = '';

  // if (eventEnded) {
  //   statusText = 'Đã kết thúc';
  //   statusColor = COLORS.primary;
  // } else if (eventNotStarted) {
  //   statusText = 'Sắp diễn ra';
  //   statusColor = COLORS.yellow;
  // } else {
  //   statusText = 'Đang diễn ra';
  //   statusColor = COLORS.success;
  // }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Đăng ký tham gia sự kiện',
    });
  }, []);

  return (
    <NativeBaseProvider>
      <QuestionModal
        showQuestionModal={showQuestionModal}
        setShowQuestionModal={setShowQuestionModal}
        questionMsg={questionMsg}
      />
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />

      {/* <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        successMsg={successMsg}
        direction={'joinEvent'}
        shopId={shopId}
      /> */}

      {/* {showLoadingModal ? (
        <SkeletonEvent />
      ) : ( */}
      <ScrollView
        style={{
          backgroundColor: COLORS.bgr,
          flex: 1,
        }}>
        <View>
          {eventData.image && eventData.image !== '' ? (
            <View style={styles.imageContainer}>
              {eventData.image.split(';').length > 1 ? (
                <CarouselPost images={eventData.image.split(';')} />
              ) : (
                <Image
                  source={{ uri: eventData.image }}
                  alt=""
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                    height: SIZES.height / 5,
                    position: 'relative',
                  }}
                />
              )}
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                height: SIZES.height / 4,
                backgroundColor: COLORS.gray1,
              }}>
              <Text>Chưa có ảnh</Text>
            </View>
          )}
        </View>
        {/* ==============Thông tin của sự kiện=================== */}
        <View style={{
          padding: SIZES.m
        }}>
          <Text style={[TEXTS.titleMax,]}>{eventData.title}</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: SIZES.m
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin chi tiết</Text>
          </View>
          {/* ===============Thời gian================ */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingRight: SIZES.m,
              paddingVertical: SIZES.s / 1.5,
            }}>
            <View style={ICONS.coverCub}>
              <Ionicons
                name="calendar"
                size={ICONS.m}
                color={COLORS.primary}
                style={{ padding: 3 }}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <Text
                style={[
                  TEXTS.content,
                  { fontWeight: '500', color: COLORS.black },
                ]}>
                {formatDayReservation(eventData.startDate)}
              </Text>
              <Text
                style={[
                  TEXTS.content,
                  { fontWeight: '500', color: COLORS.black },
                ]}>
                {eventData.startTime} - {eventData.endTime}
              </Text>
            </View>
          </View>
          {/* ===============Địa điểm================ */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingRight: SIZES.m,
              paddingVertical: SIZES.s / 1.5,
              width: '90%',
            }}>
            <View style={ICONS.coverCub}>
              <Ionicons
                name="location"
                size={ICONS.m}
                color={COLORS.primary}
                style={{ padding: 3 }}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <Text style={[TEXTS.content, { color: COLORS.black }]}>
                Địa điểm tổ chức
              </Text>
              <Text
                style={[
                  TEXTS.content,
                  { fontWeight: '500', color: COLORS.black },
                ]}>
                {eventData.location}
              </Text>
            </View>
          </View>
          {/* ===============Giới thiệu================ */}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingTop: SIZES.m,
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: SIZES.m,
                color: COLORS.black,
              }}>
              Mô tả
            </Text>
            <Text style={[TEXTS.content, { paddingTop: SIZES.s }]}>
              {eventData.description}
            </Text>
          </View>
        </View>
        <Text
          style={{
            paddingHorizontal: SIZES.m,
            fontWeight: 'bold',
            fontSize: SIZES.m,
            color: COLORS.black,
          }}>
          Mẫu đăng ký
        </Text>
        {loading ? (
          <View style={{ paddingHorizontal: SIZES.m }}>
            <SkeletonArea />
          </View>
        ) : (
          <>
            {data !== null ? (
              <>
                {data.fields?.map((field, index) => {
                  const type = field.type;
                  const answerArr = field.answer?.split(';');
                  const error = fieldErrors[field.id];
                  return (
                    <View
                      key={index}
                      style={{
                        paddingHorizontal: SIZES.m,
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
                          {!field.isOptional && (
                            <Text style={{ color: 'red', fontSize: 18 }}>*</Text>
                          )}
                        </Text>
                        {(() => {
                          switch (type) {
                            case 'input':
                              return (
                                <Input
                                  multiline
                                  style={{
                                    borderRadius: BRS.out,
                                  }}
                                  size="lg"
                                  placeholder="Câu trả lời"
                                  onChangeText={value =>
                                    handleInput(
                                      field.id,
                                      value,
                                      field.isOptional,
                                    )
                                  }
                                  value={
                                    submitData.find(
                                      data => data.eventFieldId === field.id,
                                    )?.submittingContent || null
                                  }
                                />
                              );
                            case 'radio':
                              return (
                                <Radio.Group
                                  onChange={value =>
                                    handleRadio(field.id, value)
                                  }
                                  value={
                                    submitData.find(
                                      data => data.eventFieldId === field.id,
                                    )?.submittingContent || null
                                  }>
                                  {answerArr.map((answer, index) => (
                                    <Radio key={index} value={answer} my={1}>
                                      {answer}
                                    </Radio>
                                  ))}
                                </Radio.Group>
                              );
                            default:
                              return null;
                          }
                        })()}

                        {error && (
                          <Text
                            style={{ color: 'red', fontSize: 16, marginTop: 20 }}>
                            {error}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: SIZES.m,
                }}>
                <Text style={TEXTS.content}>{SHOPS.noForm}</Text>
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

        {showSuccessModal && <Success isModal={true} />}
        {showLoadingModal && <Loading isModal={true} />}

        <View style={styles.flexBetween}>
          <TouchableOpacity onPress={() => setSubmitData([])}>
            <Text
              style={[
                styles.value,
                styles.addNoteButtonText,
                { color: COLORS.primary },
              ]}>
              Xóa hết câu trả lời
            </Text>
          </TouchableOpacity>
          <Pressable
            onPress={() => handleSubmit()}
            style={[
              {
                paddingVertical: SIZES.s,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: SIZES.s,
                height: SIZES.width / 9,
                width: SIZES.width / 2 - SIZES.m * 2,
                borderRadius: 10,
              },
            ]}>
            <Text
              style={{
                fontSize: SIZES.m,
                color: COLORS.white,
                fontWeight: '500',
              }}>
              Tham gia
            </Text>
            <Ionicons name="arrow-redo" size={ICONS.xm} color={COLORS.white} />
          </Pressable>
        </View>
      </ScrollView>
      {/* )} */}
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: SIZES.m,
    marginBottom: SIZES.xl,
  },
});
