import React, { useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import SuccessModal from '../../../components/Alert/successModal';
import ErrorModal from '../../../components/Alert/errorModal';
import { COLORS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import {
  sendOTPThunk,
  verifyUserThunk,
  verifyForgotThunk,
  sendOTPForgotPasswordThunk,
} from '../../../store/apiThunk/userThunk';
import { useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';
import Loading from '../../../components/Alert/modalSimple/loading';
import Success from '../../../components/Alert/modalSimple/success';

export default function Verify({ route, navigation }) {
  const { email, direction } = route.params;
  const [showCode, setShowCode] = useState(false);
  const [isSent, setIsSent] = useState(true);
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    code: Yup.string().required('Vui lòng nhập mã xác thực'),
  });

  const sendEmail = () => {
    setShowLoadingModal(true);
    {
      direction === 'infoSignup'
        ? dispatch(sendOTPThunk())
          .unwrap()
          .then(() => {
            setShowLoadingModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false);
            }, 2000);
          })
          .catch(err => {
            setShowLoadingModal(false);
            console.log(err.message);
          })
        : dispatch(sendOTPForgotPasswordThunk(email))
          .unwrap()
          .then(() => {
            console.log('gửi mã thành công');
            setShowLoadingModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false);
            }, 2000);
          })
          .catch(err => {
            setShowLoadingModal(false);
            console.log(err.message);
          });
    }
  };
  console.log(direction);
  const handleFormikSubmit = values => {
    setIsSent(true);
    setShowLoadingModal(true);
    {
      direction === 'infoSignup'
        ? dispatch(verifyUserThunk({ otp: values.code }))
          .then(res => {
            setShowLoadingModal(false);
            setIsSent(true);
            setIsSendEmail(false);
            if (res.payload) {
              setSuccessMsg('Xác thực thành công');
              setShowSuccessModal(true);
              setTimeout(() => {
                setShowSuccessModal(false);
                navigation.navigate('Login')
              }, 2000);
            } else {
              setErrorMsg('Mã xác thực chưa đúng');
              setShowErrorModal(true);
              values.code = '';
            }
          })
          .catch(err => {
            setShowLoadingModal(false);
            setErrorMsg(err.message);
            setShowErrorModal(true);
            values.code = '';
          })
        : dispatch(verifyForgotThunk({ email: email, otp: values.code }))
          .then(res => {
            setShowLoadingModal(false);
            setIsSent(true);
            setIsSendEmail(false);
            if (res.payload) {
              setSuccessMsg('Xác thực thành công');
              setShowSuccessModal(true);
              setTimeout(() => {
                setShowSuccessModal(false);
                navigation.navigate('NewPassword', {
                  email: email,
                });
              }, 2000);

            } else {
              setErrorMsg('Mã xác thực chưa đúng');
              setShowErrorModal(true);
              values.code = '';
            }
          })
          .catch(err => {
            setShowLoadingModal(false);
            setErrorMsg(err.message);
            setShowErrorModal(true);
            values.code = '';
          });
    }
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
          {showSuccessModal && (
            <Success isModal={true} />
          )}
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
          }, SHADOWS.s]}>
            <Formik
              initialValues={{ code: '' }}
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
                dirty,
              }) => (
                <View>
                  <Text pt={4} h='10' style={[TEXTS.title, { color: COLORS.primary, alignSelf: 'center' }]}>Xác Thực Tài Khoản</Text>
                  <Text style={styles.desc}>
                    Chúng tôi đã gửi mã xác thực tới{'\n'}
                    <Text
                      style={{ color: COLORS.primary }}
                      onPress={() => Linking.openURL('https://mail.google.com')}>
                      {email}
                    </Text>
                  </Text>
                  <View>
                    <Input
                      style={styles.input}
                      marginTop={2}
                      variant="outline"
                      placeholder="Mã xác thực"
                      value={values.code}
                      onChangeText={handleChange('code')}
                      onBlur={handleBlur('code')}
                      secureTextEntry={!showCode}
                      size={'lg'}
                    />
                    <TouchableOpacity
                      onPress={() => setShowCode(!showCode)}
                      style={styles.passIcon}>
                      <Ionicons
                        name={showCode ? 'eye' : 'eye-off'}
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.code && errors.code ? (
                    <Text style={styles.validationError}>{errors.code}</Text>
                  ) : null}
                  <Center>
                    <Text style={{ marginTop: 15, marginBottom: 20 }}>
                      Chưa nhận được?{'  '}
                      <Text
                        style={{ color: isSent ? COLORS.primary : 'gray' }}
                        disabled={!isSent}
                        onPress={() => sendEmail()}>
                        Gửi lại!
                      </Text>
                    </Text>
                  </Center>
                  <TouchableOpacity
                    disabled={!dirty}
                    style={[
                      styles.loginBtn,
                      {
                        backgroundColor: !dirty ? COLORS.gray1 : COLORS.primary,
                        marginTop: 10,
                        padding: 10,
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
                      Xác thực
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
