import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  NativeBaseProvider,
  Text,
  Input,
  Image,
  Center,
  Box,
  Heading,
  ScrollView,
} from 'native-base';
import { styles } from './styles';
import * as Yup from 'yup';
import Logo from '../../../../assets/shops.png';
import { Formik } from 'formik';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../components/Alert/errorModal';
import SuccessModal from '../../../components/Alert/successModal';
import { signupThunk } from '../../../store/apiThunk/userThunk';
import { ALERTS, AVATARS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loading from '../../../components/Alert/modalSimple/loading';
import Success from '../../../components/Alert/modalSimple/success';

export default function InfoSignup({ route, navigation }) {
  const dispatch = useDispatch();
  const { email, password } = route.params;
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [avatarPic, setAvatarPic] = useState({});
  const [backgroundPic, setBackgroundPic] = useState({});

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

  const formData = new FormData();

  const pickImage = async (setFieldValue, type) => {
    try {
      const options = {
        mediaType: 'photo',
      };
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('Image picker error: ', response.error);
        } else {
          let imageUri = response.uri || response.assets?.[0]?.uri;
          let fileName = response.assets?.[0]?.fileName;
          let fileType = response.assets?.[0]?.type;
          type === 'avatar'
            ? setAvatarPic({
              uri: imageUri,
              name: fileName,
              type: fileType,
            })
            : setBackgroundPic({
              uri: imageUri,
              name: fileName,
              type: fileType,
            });
          setFieldValue(
            type === 'avatar' ? 'avatar' : 'backgroundImg',
            imageUri,
          );
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('FullName', values.fullName);
    formData.append('Address', values.address);
    formData.append('PhoneNumber', values.phone.trim());
    formData.append('Avatar', avatarPic);
    formData.append('Background', backgroundPic);
    setShowLoadingModal(true);
    dispatch(signupThunk(formData))
      .unwrap()
      .then(res => {
        setShowLoadingModal(false);
        AsyncStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          navigation.navigate('Verify', {
            direction: 'infoSignup',
            email: email,
          });
        }, 2000);
      })
      .catch(error => {
        setShowLoadingModal(false);
        setErrorMsg(`${error.message}`);
        setShowErrorModal(true);
      });
  };

  return (
    <NativeBaseProvider>
      <ScrollView style={{
        padding: SIZES.m,
        backgroundColor: COLORS.bgr,
        flex: 1,
      }}>
        <View style={{ marginTop: SIZES.m }}>
          <Text pt={4} h='10' style={[TEXTS.title, { color: COLORS.primary, alignSelf: 'center' }]}>Hoàn thành trang cá nhân</Text>
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
          <View style={[{
            backgroundColor: COLORS.white,
            width: '100%',
            marginTop: SIZES.m,
            height: SIZES.height,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingTop: 12,
          }, SHADOWS.s]}>
            <Formik
              initialValues={{
                fullName: '',
                phone: '',
                address: '',
                avatar: '',
                backgroundImg: '',
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
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh đại diện</Text>
                    <TouchableOpacity
                      onPress={() => pickImage(setFieldValue, 'avatar')}>
                      {values.avatar !== '' ? (
                        <Image
                          key={values.avatar}
                          source={{ uri: values.avatar }}
                          alt=""
                          style={[AVATARS.max, { alignSelf: 'center', marginTop: SIZES.s }]}
                        />
                      ) :
                        <View style={[AVATARS.max, { alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingTop: SIZES.s }]}>
                          <Ionicons name='images' size={ICONS.m} color={COLORS.blackBold} />
                          <Text style={{ color: COLORS.black, }}>Thêm hình ảnh</Text>
                        </View>}
                    </TouchableOpacity>
                    {touched.avatar && errors.avatar ? (
                      <Text style={styles.validationError}>
                        {errors.avatar}
                      </Text>
                    ) : null}
                  </View>
                  {/* ======Ảnh bìa====== */}
                  <View style={{
                    borderBottomWidth: 1,
                    paddingBottom: SIZES.m,
                    borderColor: COLORS.gray2,
                    marginTop: SIZES.s,
                  }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh bìa</Text>
                    <TouchableOpacity
                      onPress={() => pickImage(setFieldValue, 'background')}>
                      {values.backgroundImg ? (
                        <Image
                          key={values.backgroundImg}
                          source={{ uri: values.backgroundImg }}
                          alt=""
                          style={[AVATARS.mini, {
                            alignSelf:
                              'center',
                            marginTop: SIZES.s,
                            height: SIZES.height / 5,
                            width: SIZES.width - SIZES.m * 4,
                            alignItems: 'center', justifyContent: 'center',
                          }]}
                        />
                      ) : (
                        <View style={[AVATARS.mini, {
                          alignSelf:
                            'center',
                          marginTop: SIZES.s,
                          height: SIZES.height / 5,
                          width: SIZES.width - SIZES.m * 4,
                          alignItems: 'center', justifyContent: 'center',
                        }]} >
                          <Ionicons name='images' size={ICONS.m} color={COLORS.blackBold} />
                          <Text style={{ color: COLORS.black, }}>Thêm hình ảnh</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    {touched.backgroundImg && errors.backgroundImg ? (
                      <Text style={styles.validationError}>{errors.backgroundImg}</Text>
                    ) : null}
                  </View>
                  {/* ==========Chi tiết========== */}
                  <View style={{
                    paddingBottom: SIZES.m,
                    marginTop: SIZES.s,
                  }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin chi tiết</Text>
                    {/* ======Tên====== */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: SIZES.s,
                      marginTop: SIZES.s,
                      width: (SIZES.width - SIZES.m * 5),
                      height: SIZES.width / 9.53,
                      position: 'relative'
                    }}>
                      {/* <View style={ICONS.coverD}>
                        <Ionicons
                          name="paw"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                      </View> */}
                      <Input
                        variant="outline"
                        placeholder="Họ và Tên"
                        value={values.fullName}
                        onChangeText={handleChange('fullName')}
                        onBlur={handleBlur('fullName')}
                        autoCapitalize="words"
                        size="lg"
                      />
                      {touched.fullName && errors.fullName ? (
                        <Text style={[styles.validationError, { position: 'absolute', bottom: '25%', right: '5%' }]}>{errors.fullName}</Text>
                      ) : null}
                    </View>
                    {/* ======Số điện thoại====== */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: SIZES.s,
                      marginTop: SIZES.s,
                      width: (SIZES.width - SIZES.m * 5),
                      height: SIZES.width / 9.53,
                      position: 'relative'
                    }}>
                      {/* <View style={ICONS.coverD}>
                        <Ionicons
                          name="paw"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                      </View> */}
                      <Input
                        variant="outline"
                        placeholder="Số điện thoại"
                        value={values.phone}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        keyboardType="numeric"
                        size="lg"
                      />
                      {touched.phone && errors.phone ? (
                        <Text style={[styles.validationError, { position: 'absolute', bottom: '25%', right: '5%' }]}>{errors.phone}</Text>
                      ) : null}
                    </View>
                    {/* ======Địa chỉ====== */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: SIZES.s,
                      marginTop: SIZES.s,
                      width: (SIZES.width - SIZES.m * 5),
                      height: SIZES.width / 9.53,
                      position: 'relative'
                    }}>
                      {/* <View style={ICONS.coverD}>
                        <Ionicons
                          name="paw"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                      </View> */}
                      <Input
                        variant="outline"
                        placeholder="Địa chỉ"
                        value={values.address}
                        onChangeText={handleChange('address')}
                        onBlur={handleBlur('address')}
                        keyboardType="default"
                        size={'lg'}
                        multiline={true}
                      />
                      {touched.address && errors.address ? (
                        <Text style={[styles.validationError, { position: 'absolute', bottom: '25%', right: '5%' }]}>{errors.address}</Text>
                      ) : null}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.loginBtn,
                      {
                        backgroundColor: !dirty ? COLORS.gray1 : COLORS.primary,
                      },
                    ]}
                    onPress={handleSubmit}>
                    <Text
                      style={[TEXTS.content, {
                        color: !dirty ? COLORS.black : COLORS.white,
                        fontWeight: '500',
                        alignSelf: 'center'
                      }]}
                    >
                      Đăng ký
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}
