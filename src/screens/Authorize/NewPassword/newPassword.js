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
import SuccessModal from '../../../components/Alert/successModal';
import { useDispatch } from 'react-redux';
import { ACCOUNTS, ALERTS, COLORS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import { newPasswordThunk } from '../../../store/apiThunk/userThunk';
import LottieView from 'lottie-react-native';
import Loading from '../../../components/Alert/modalSimple/loading';
import Success from '../../../components/Alert/modalSimple/success';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewPassword({ route, navigation }) {
  const dispatch = useDispatch();
  const email = route.params.email;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required(ACCOUNTS.blankP)
      .min(8, ACCOUNTS.ipPass),
    confirmPassword: Yup.string()
      .required(ACCOUNTS.blankP)
      .oneOf([Yup.ref('newPassword'), null], ACCOUNTS.ipPassE),
  });

  const handleFormikSubmit = values => {
    setShowLoadingModal(true);
    dispatch(newPasswordThunk({ email: email, newPassword: values.newPassword }))
      .unwrap()
      .then(() => {
        setShowLoadingModal(false);
        setShowSuccessModal(true);
        setSuccessMsg('Change password successfully');
        setTimeout(() => {
          setShowSuccessModal(false)
          navigation.navigate('Login');
          AsyncStorage.clear();
        }, 2000);
      })
      .catch(error => {
        setShowLoadingModal(false);
        console.log(error);
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
            height: SIZES.height / 3,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingTop: 12,
          }, SHADOWS.s]}>
            <Formik
              initialValues={{ newPassword: '', confirmPassword: '' }}
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
                  <Text pt={4} h='10' style={[TEXTS.title, { color: COLORS.primary, alignSelf: 'center' }]}>Mật khẩu mới</Text>
                  <View>
                    <Input
                      style={styles.input}
                      marginTop={2}
                      variant="outline"
                      placeholder="Mật khẩu mới"
                      value={values.newPassword}
                      onChangeText={handleChange('newPassword')}
                      onBlur={handleBlur('newPassword')}
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
                  {touched.newPassword && errors.newPassword ? (
                    <Text style={styles.validationError}>
                      {errors.newPassword}
                    </Text>
                  ) : null}
                  <View>
                    <Input
                      style={styles.input}
                      marginTop={2}
                      variant="outline"
                      placeholder="Nhập lại mật khẩu mới"
                      label="Confirm Password"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
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
                      Xác nhận
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
