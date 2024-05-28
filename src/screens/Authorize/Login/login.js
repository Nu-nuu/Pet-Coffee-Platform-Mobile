import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NativeBaseProvider,
  Text,
  Input,
  Image,
  Center,

} from 'native-base';
import { styles } from './styles';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Yup from 'yup';
import Logo from '../../../../assets/shops.png';
import Google from '../../../../assets/images/google.png';
import { Formik } from 'formik';
import ErrorModal from '../../../components/Alert/errorModal';
import { useDispatch } from 'react-redux';
import {
  getUserDataThunk,
  loginGGThunk,
  loginThunk,
} from '../../../store/apiThunk/userThunk';
import { ACCOUNTS, COLORS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import Loading from '../../../components/Alert/modalSimple/loading';


GoogleSignin.configure({
  webClientId:
    '458181458037-t32p96402f2q0338tqn0hgbhhobv19qc.apps.googleusercontent.com',
});

export default function Login({ navigation }) {
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
console.log(AsyncStorage);
  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      const token = await userCredential.user.getIdToken();
      setShowLoadingModal(true);
      dispatch(loginGGThunk({ firebaseToken: token }))
        .unwrap()
        .then(res => {
          AsyncStorage.setItem('accessToken', JSON.stringify(res.accessToken));
          AsyncStorage.setItem(
            'status',
            JSON.stringify(res?.status),
          );
          dispatch(getUserDataThunk())
            .unwrap()
            .then((response) => {
              setShowLoadingModal(false);
              AsyncStorage.setItem(
                'role',
                JSON.stringify(response?.role),
              );
              if (response.status === 'Verifying') {
                navigation.navigate('Verify', {
                  direction: 'infoSignup',
                  email: response.email,
                });
              } else {
                navigation.navigate('Welcome', { screen: 'Home' });
              }
            })
            .catch((error) => {
              setShowLoadingModal(false);
              setErrorMsg(error.message);
              setShowErrorModal(true);
            })
        });
    } catch (error) {
      setShowLoadingModal(false);
      setErrorMsg(error.message);
      setShowErrorModal(true);
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(ACCOUNTS.blankE)
      .email(ACCOUNTS.ipEmail),
    password: Yup.string()
      .required(ACCOUNTS.blankP)
      .min(8, ACCOUNTS.ipPass),
  });

  const handleFormikSubmit = async values => {
    try {
      setShowLoadingModal(true);
      dispatch(
        loginThunk({
          email: values.email,
          password: values.password,
        })
      ).unwrap()
        .then((res) => {
          AsyncStorage.setItem(
            'accessToken',
            JSON.stringify(res?.accessToken),
          );
          AsyncStorage.setItem(
            'status',
            JSON.stringify(res?.status),
          );
          dispatch(getUserDataThunk())
            .unwrap()
            .then((response) => {
              setShowLoadingModal(false);
              AsyncStorage.setItem(
                'role',
                JSON.stringify(response?.role),
              );
              if (response.status === 'Verifying') {
                navigation.navigate('Verify', {
                  direction: 'infoSignup',
                  email: response.email,
                });
              } else {
                navigation.navigate('Welcome', { screen: 'Home' });
              }
            })
            .catch((error) => {
              setShowLoadingModal(false);
              setErrorMsg(error.message);
              setShowErrorModal(true);
            })
        })
        .catch((error) => {
          setShowLoadingModal(false);
          setErrorMsg(error.message);
          setShowErrorModal(true);
        })
    } catch (error) {
      setShowLoadingModal(false);
      setErrorMsg(error.message);
      setShowErrorModal(true);
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
          {showLoadingModal && (
            <Loading isModal={true} />
          )}
          <View style={[{
            backgroundColor: COLORS.white,
            width: '100%',
            marginTop: SIZES.m,
            height: SIZES.height / 2,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingTop: 12,
          }, SHADOWS.s]}>
            <Formik
              initialValues={{ email: '', password: '' }}
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
              }) => (
                <View>
                  <Text pt={4} h='10' style={[TEXTS.title, { color: COLORS.primary, alignSelf: 'center' }]}>Đăng nhập</Text>
                  <Input
                    style={styles.input}
                    variant="outline"
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    marginTop={2}
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email ? (
                    <Text style={styles.validationError}>{errors.email}</Text>
                  ) : null}
                  <View>
                    <Input
                      style={styles.input}
                      marginTop={2}
                      variant="outline"
                      placeholder="Mật khẩu"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.passIcon}>
                      <Ionicons
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password ? (
                    <Text style={styles.validationError}>
                      {errors.password}
                    </Text>
                  ) : null}
                  <View style={{ justifyContent: 'space-between' }}>
                    <Text
                      marginTop={2}
                      marginBottom={2}
                      style={{
                        alignSelf: 'flex-end',
                        color: COLORS.primary,
                      }}
                      onPress={() => navigation.navigate('ForgotPassword')}>
                      Quên mật khẩu?
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.loginBtn,
                      { backgroundColor: COLORS.primary },
                    ]}
                    onPress={handleSubmit}>
                    <Text color={'white'} textAlign={'center'}>
                      Đăng Nhập
                    </Text>
                  </TouchableOpacity>
                  <Center>
                    <Text style={{ marginTop: 15, marginBottom: 20 }}>
                      Không có tài khoản?{'  '}
                      <Text
                        style={{ color: COLORS.primary }}
                        onPress={() => navigation.navigate('Signup')}>
                        Đăng ký ngay!
                      </Text>
                    </Text>
                  </Center>
                </View>
              )}
            </Formik>
            <View>
              <View style={styles.flexContainer}>
                <View style={styles.divideLine} />
                <Text style={TEXTS.subContent}>hoặc đăng nhập với</Text>
                <View style={styles.divideLine} />
              </View>
              <Pressable
                onPress={() => onGoogleButtonPress()}
                style={styles.googleButton}>
                <Image source={Google} style={styles.googleImage} alt="gg" />
                <Text style={styles.googleText}>Google</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  );
}
