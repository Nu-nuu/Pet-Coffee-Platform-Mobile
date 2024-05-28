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
} from 'native-base';
import { styles } from './styles';
import * as Yup from 'yup';
import Logo from '../../../../assets/shops.png';
import { Formik } from 'formik';
import { ACCOUNTS, COLORS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import { useDispatch } from 'react-redux';
import {
  checkEmailThunk,
  sendOTPForgotPasswordThunk,
} from '../../../store/apiThunk/userThunk';
import ErrorModal from '../../../components/Alert/errorModal';
import LottieView from 'lottie-react-native';
import Loading from '../../../components/Alert/modalSimple/loading';

export default function ForgotPassword({ navigation }) {
  const dispatch = useDispatch();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(ACCOUNTS.blankE)
      .email(ACCOUNTS.ipEmail),
  });

  const handleFormikSubmit = values => {
    setShowLoadingModal(true);
    dispatch(checkEmailThunk(values.email))
      .unwrap()
      .then(res => {
        if (res) {
          setShowLoadingModal(false);
          dispatch(sendOTPForgotPasswordThunk(values.email))
            .then(
              navigation.navigate('Verify', {
                email: values.email,
                direction: 'forgotPassword',
              }),
            )
            .catch(err => console.log(err));
        } else {
          setShowLoadingModal(false);
          setErrorMsg('Email is not registered yet');
          setShowErrorModal(true);
        }
      })
      .catch(error => {
        setShowLoadingModal(false);
        setErrorMsg(error.message);
        setShowErrorModal(true);
      });
  };

  return (
    <NativeBaseProvider>
      <View style={{
        padding: SIZES.m,
        backgroundColor: COLORS.bgr,
        flex: 1,
      }}>
        <View style={{ marginTop: SIZES.m }}>
          <View style={{
            padding: SIZES.m,
            alignItems: "flex-start",
            position: 'relative',
            marginTop: SIZES.l,
          }}>
            <Text pt={7} h='12' style={[TEXTS.titleLogo, { color: COLORS.primary }]}>Nền Tảng</Text>
            <Text pt={7} h='12' style={[TEXTS.titleLogo, { color: COLORS.primary }]}>Cà Phê</Text>
            <Text pt={7} h='12' style={[TEXTS.titleLogo, { color: COLORS.primary }]}>Thú Cưng</Text>
            <Text pt={6} h='16' style={[TEXTS.content, { color: COLORS.primary }]}>Trải Nghiệm Sự Đa Dạng Của Hệ Thống Chúng Tôi Ngay Bây Giờ</Text>
            <Image source={Logo}
              alt='logo'
              style={{
                height: SIZES.height / 5,
                width: SIZES.height / 5,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            />
          </View>
          <ErrorModal
            showErrorModal={showErrorModal}
            setShowErrorModal={setShowErrorModal}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
          />
          {showLoadingModal && (
            <Loading isModal={true} />
          )}
          <View style={[{
            backgroundColor: COLORS.white,
            width: '100%',
            marginTop: SIZES.m,
            height: SIZES.height / 3,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingTop: 12,
            // paddingBottom: SIZES.m,
          }, SHADOWS.s]}>
            <Formik
              initialValues={{ email: '' }}
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
                dirty
              }) => (
                <View>
                  <Text pt={4} h='10' style={[TEXTS.title, { color: COLORS.primary, alignSelf: 'center' }]}>Quên mật khẩu</Text>
                  <View>
                    <Input
                      style={styles.input}
                      marginTop={2}
                      variant="outline"
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      size={'lg'}
                    />
                  </View>
                  {touched.email && errors.email ? (
                    <Text style={styles.validationError}>{errors.email}</Text>
                  ) : null}
                  <View style={{ alignSelf: 'flex-end' }}>
                    <Text style={{ marginTop: 15, marginBottom: 20 }}>
                      Nhớ mật khẩu?{'  '}
                      <Text
                        style={{ color: COLORS.primary }}
                        onPress={() => navigation.navigate('Login')}>
                        Đăng nhập ngay!
                      </Text>
                    </Text>
                  </View>
                    <TouchableOpacity
                      style={[
                        styles.loginBtn,
                        {
                          backgroundColor: !dirty ? COLORS.gray1 : COLORS.primary,
                          marginTop: 10,
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
                        Gửi mã
                      </Text>
                    </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  );
}
