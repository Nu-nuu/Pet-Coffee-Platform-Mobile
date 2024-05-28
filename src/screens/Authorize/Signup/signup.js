import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
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
import ErrorModal from '../../../components/Alert/errorModal';
import { useDispatch } from 'react-redux';
import { ACCOUNTS, COLORS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import { checkEmailThunk } from '../../../store/apiThunk/userThunk';
import LottieView from 'lottie-react-native';
import Loading from '../../../components/Alert/modalSimple/loading';

export default function Signup({ navigation }) {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(ACCOUNTS.blankE)
      .email(ACCOUNTS.ipEmail),
    password: Yup.string()
      .required(ACCOUNTS.blankP)
      .min(8, ACCOUNTS.ipPass),
    confirmPassword: Yup.string()
      .required(ACCOUNTS.ipPassE)
      .oneOf([Yup.ref('password'), null], ACCOUNTS.ipPassE),
  });

  const handleFormikSubmit = values => {
    try {
      setShowLoadingModal(true);
      dispatch(checkEmailThunk(values.email))
        .unwrap()
        .then(res => {
          if (res) {
            setErrorMsg('Email đã tồn tại');
            setShowErrorModal(true);
            setShowLoadingModal(false);
          } else {
            navigation.navigate('InfoSignup', {
              email: values.email,
              password: values.password,
            });
            setShowLoadingModal(false);
          }
        })
        .catch(err => {
          setShowLoadingModal(false);
          setErrorMsg(err.message);
          setShowErrorModal(true);
        });
    } catch (error) {
      setErrorMsg('Error');
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
              initialValues={{ email: '', password: '', confirmPassword: '' }}
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
                  <Text pt={4} h='10' style={[TEXTS.title, { color: COLORS.primary, alignSelf: 'center' }]}>Đăng ký</Text>
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
                    size={'md'}
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
                      size={'md'}
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
                  <View>
                    <Input
                      style={styles.input}
                      marginTop={2}
                      variant="outline"
                      placeholder="Nhập lại Mật khẩu"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      size={'md'}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={styles.passIcon}>
                      <Ionicons
                        name={showConfirmPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword ? (
                    <Text style={styles.validationError}>
                      {errors.confirmPassword}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={[
                      styles.loginBtn,
                      { backgroundColor: COLORS.primary },
                    ]}
                    onPress={handleSubmit}>
                    <Text color={'white'} textAlign={'center'}>
                      Tiếp tục
                    </Text>
                  </TouchableOpacity>

                  <Center>
                    <Text style={{ marginTop: 15, marginBottom: 20 }}>
                      Đã có tài khoản?{'  '}
                      <Text
                        style={{ color: COLORS.primary }}
                        onPress={() => navigation.navigate('Login')}>
                        Đăng nhập ngay!
                      </Text>
                    </Text>
                  </Center>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  );
}
