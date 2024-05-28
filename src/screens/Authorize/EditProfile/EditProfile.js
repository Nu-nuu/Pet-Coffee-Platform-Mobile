import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Center,
  NativeBaseProvider,
  Input,
  Heading,
  ScrollView,
} from 'native-base';
import { ALERTS, AVATARS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../components/Alert/errorModal';
import SuccessModal from '../../../components/Alert/successModal';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { userDataSelector } from '../../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDataThunk,
  updateUserDataThunk,
} from '../../../store/apiThunk/userThunk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../components/Alert/questionModal';
import { useNavigation } from '@react-navigation/native';
import Success from '../../../components/Alert/modalSimple/success';
import Loading from '../../../components/Alert/modalSimple/loading';

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const userDetail = useSelector(userDataSelector);
  const formData = new FormData();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [questionMsg, setQuestionMsg] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState([]);
  const today = new Date();

  const validationSchema = Yup.object({
    fullName: Yup.string().required(ALERTS.blank),
    phone: Yup.string()
      .matches(/^[0-9]+$/, ALERTS.number)
      .required(ALERTS.blank)
      .min(10, ALERTS.phone)
      .max(10, ALERTS.phone),
    address: Yup.string().required(ALERTS.blank),
    avatar: Yup.string().required(ALERTS.image),
    backgroundImg: Yup.string().required(ALERTS.image),
  });

  const selectAvatar = (setFieldValue, field) => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, response => {
      if (!response.didCancel) {
        setSelectedAvatar(response.assets || []);
        setFieldValue(field, response.assets[0].uri);
      }
    });
  };
  const selectBackground = (setFieldValue, field) => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, response => {
      if (!response.didCancel) {
        setSelectedBackground(response.assets || []);
        setFieldValue(field, response.assets[0].uri);
      }
    });
  };
  const handleFormikSubmit = values => {
    formData.append('FullName', values.fullName);
    formData.append('PhoneNumber', values.phone.trim());
    formData.append('Address', values.address);
    selectedAvatar.forEach((image, index) => {
      formData.append(`AvatarFile`, {
        uri: image.uri,
        type: image.type,
        name: `${image.fileName}-image-${today}.jpg`,
      });
    });
    selectedBackground.forEach((image, index) => {
      formData.append(`BackgroundFile`, {
        uri: image.uri,
        type: image.type,
        name: `${image.fileName}-image-${today}.jpg`,
      });
    });

    setShowLoadingModal(true);
    dispatch(updateUserDataThunk(formData))
      .unwrap()
      .then(() => {
        setShowLoadingModal(false);
        setShowSuccessModal(true);
        dispatch(getUserDataThunk());
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate('TabGroup', { screen: 'Profile', params: { res: true } });
        }, 3000);

      })
      .catch(error => {
        setShowLoadingModal(false);
        setErrorMsg(`${error.message}`);
        setShowErrorModal(true);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chỉnh sửa thông tin cá nhân',
    })
  }, [])

  const [showDetail, setShowDetail] = useState(false);
  const [showConnect, setShowConnect] = useState(false)
  const [showConnects, setShowConnects] = useState(false)
  const [changes, setChanges] = useState(false)

  return (
    <NativeBaseProvider>
      <ScrollView >
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
        {showLoadingModal && (
          <Loading isModal={true} />
        )}
        {showSuccessModal && (
          <Success isModal={true} />
        )}
        <ScrollView style={styles.smallBox}>
          <Formik
            initialValues={{
              fullName: userDetail.fullName,
              phone: userDetail.phoneNumber,
              address: userDetail.address,
              avatar: userDetail.avatar,
              backgroundImg: userDetail.background,
            }}
            onSubmit={values => handleFormikSubmit(values)}
            validateOnMount={true}
            validationSchema={validationSchema}>
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
              setFieldValue,
              dirty,
            }) => (
              <View>
                {/* ======Ảnh đại diện====== */}
                <View style={{
                  borderBottomWidth: 1,
                  paddingBottom: SIZES.m,
                  borderColor: COLORS.gray2,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh đại diện</Text>
                    <Pressable onPress={() => [selectAvatar(setFieldValue, 'avatar'), setShowConnect(!showConnect)]}>
                      <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa</Text>
                    </Pressable>
                  </View>
                  {values.avatar !== '' ? (
                    <Image
                      key={values.avatar}
                      source={{ uri: values.avatar }}
                      alt=""
                      style={[AVATARS.max, { alignSelf: 'center', marginTop: SIZES.s }]}
                    />
                  ) : <View style={[AVATARS.max, { alignSelf: 'center', paddingTop: SIZES.s }]} />}
                </View>
                {/* ======Ảnh bìa====== */}
                <View style={{
                  borderBottomWidth: 1,
                  paddingBottom: SIZES.m,
                  borderColor: COLORS.gray2,
                  marginTop: SIZES.s,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh bìa</Text>
                    <Pressable onPress={() => [selectBackground(setFieldValue, 'backgroundImg'), setShowConnects(!showConnects)]}>
                      <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa</Text>
                    </Pressable>
                  </View>
                  {values.backgroundImg !== '' ? (
                    <Image
                      key={values.backgroundImg}
                      source={{ uri: values.backgroundImg }}
                      alt=""
                      style={[AVATARS.mini, {
                        alignSelf:
                          'center',
                        marginTop: SIZES.s,
                        height: SIZES.height / 5,
                        width: SIZES.width - SIZES.m * 2,
                      }]}
                    />
                  ) : <View style={[AVATARS.mini, {
                    alignSelf:
                      'center',
                    marginTop: SIZES.s,
                    height: SIZES.height / 5,
                    width: SIZES.width - SIZES.m * 2,
                  }]} />}
                </View>
                {/* ======Chi tiết====== */}
                <View style={{
                  borderBottomWidth: 1,
                  paddingBottom: SIZES.m,
                  borderColor: COLORS.gray2,
                  marginTop: SIZES.s,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Chi tiết</Text>
                    <Pressable onPress={() => setShowDetail(!showDetail)}>
                      <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa</Text>
                    </Pressable>
                  </View>
                  {/* ======Tên ====== */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SIZES.s,
                    marginTop: SIZES.s,
                    width: SIZES.width - SIZES.m * 5,
                    height: SIZES.width / 9.53,
                    position: 'relative'
                  }}>
                    <View style={ICONS.coverD}>
                      <Ionicons
                        name="person-circle"
                        size={ICONS.m}
                        color={COLORS.primary}
                      />
                    </View>
                    {showDetail ? (
                      <>
                        <Input
                          variant="outline"
                          placeholder="Họ và Tên"
                          value={values.fullName}
                          onChangeText={handleChange('fullName')}
                          onBlur={handleBlur('fullName')}
                          autoCapitalize="words"
                          size="md"
                        />
                      </>

                    ) : (
                      <Text style={[TEXTS.content, {
                        paddingLeft: SIZES.s,
                      }
                      ]}>{userDetail.fullName}</Text>
                    )}
                    {showDetail && touched.fullName && errors.fullName ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.fullName}</Text>
                    ) : null}
                  </View>
                  {/* ======Số điện thoại====== */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SIZES.s,
                    marginTop: SIZES.s,
                    width: SIZES.width - SIZES.m * 5,
                    height: SIZES.width / 9.53,
                    position: 'relative'
                  }}>
                    <View style={ICONS.coverD}>
                      <Ionicons
                        name="call"
                        size={ICONS.m}
                        color={COLORS.primary}
                      />
                    </View>
                    {showDetail ? (
                      <>
                        <Input
                          variant="outline"
                          placeholder="Nhập số điện thoại..."
                          value={values.phone}
                          onChangeText={handleChange('phone')}
                          onBlur={handleBlur('phone')}
                          keyboardType="number-pad"
                          size="lg"
                        />
                      </>

                    ) : (
                      <Text style={[TEXTS.content, {
                        paddingLeft: SIZES.s,
                      }
                      ]}>{userDetail.phoneNumber}</Text>
                    )}
                    {showDetail && touched.phone && errors.phone ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.phone}</Text>
                    ) : null}
                  </View>
                  {/* ======Địa chỉ====== */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SIZES.s,
                    marginTop: SIZES.s,
                    width: SIZES.width - SIZES.m * 5,
                    height: SIZES.width / 9.53,
                    position: 'relative'
                  }}>
                    <View style={ICONS.coverD}>
                      <Ionicons
                        name="location"
                        size={ICONS.m}
                        color={COLORS.primary}
                      />
                    </View>
                    {showDetail ? (
                      <>
                        <Input
                          variant="outline"
                          placeholder="Địa chỉ"
                          value={values.address}
                          onChangeText={handleChange('address')}
                          onBlur={handleBlur('address')}
                          size="lg"
                        />
                      </>

                    ) : (
                      <Text style={[TEXTS.content, {
                        paddingLeft: SIZES.s,
                      }
                      ]}>{userDetail.address}</Text>
                    )}
                    {showDetail && touched.address && errors.address ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.address}</Text>
                    ) : null}
                  </View>
                </View>
                {/* {(showDetail || showConnect || showConnects) && ( */}
                <Center>
                  <View style={styles.cancel}>
                    <Pressable
                      disabled={!dirty || showLoadingModal}
                      style={{
                        width: SIZES.width - SIZES.s * 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: SIZES.s,
                      }} onPress={handleSubmit}>
                      <View
                        style={[{
                          paddingVertical: SIZES.s,
                          backgroundColor: (!dirty || showLoadingModal) ? COLORS.gray1 : COLORS.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          gap: SIZES.s
                        }, BUTTONS.recFull]}
                      >
                        <Text style={{ fontSize: SIZES.m, color: (!dirty || showLoadingModal) ? COLORS.black : COLORS.white, fontWeight: '500' }}>Cập nhật</Text>
                      </View>
                    </Pressable>
                  </View>
                </Center>
                {/* )} */}
              </View>
            )}
          </Formik>
        </ScrollView>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  cancel: {
    height: SIZES.height / 10,
    padding: SIZES.s,
  },
  validationError: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 3,
  },
  smallBox: {
    backgroundColor: COLORS.bgr,
    padding: SIZES.m,
    minHeight: SIZES.height,
  },
  heading: { color: COLORS.primary, fontSize: 20 },
  desc: {
    color: 'gray',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 30,
    textAlign: 'center',
  },
  container: {
    padding: 30,
    flex: 1,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  backgroundImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
    marginLeft: 15,
  },
  number: { fontSize: 19, fontWeight: 'bold', color: 'black' },
  text: { color: 'gray', fontSize: 17 },
  btn: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 90,
    padding: 10,
    marginTop: 20,
    borderColor: COLORS.primary,
    borderWidth: 1,
    marginBottom: 20,
  },
});
