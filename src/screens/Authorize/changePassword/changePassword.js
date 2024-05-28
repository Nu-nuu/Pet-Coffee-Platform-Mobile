import React, { useLayoutEffect, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  NativeBaseProvider,
  Text,
  Input,
  Center,
  Box,
  Heading,
} from 'native-base';
import { styles } from './styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import SuccessModal from '../../../components/Alert/successModal';
import { updatePasswordThunk } from '../../../store/apiThunk/userThunk';
import { useDispatch } from 'react-redux';
import ErrorModal from '../../../components/Alert/errorModal';
import { ACCOUNTS, BUTTONS, COLORS, SIZES, TEXTS } from '../../../constants';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../components/Alert/questionModal';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import Loading from '../../../components/Alert/modalSimple/loading';
import Success from '../../../components/Alert/modalSimple/success';

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [showExistingPassword, setShowExistingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [questionMsg, setQuestionMsg] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const validationSchema = Yup.object({
    existingPassword: Yup.string()
      .required(ACCOUNTS.blankP)
      .min(8, ACCOUNTS.ipPass),
    newPassword: Yup.string()
      .required(ACCOUNTS.blankP)
      .min(8, ACCOUNTS.ipPass),
    confirmPassword: Yup.string()
      .required(ACCOUNTS.blankP)
      .oneOf([Yup.ref('newPassword'), null], ACCOUNTS.ipPassE),
  });

  const handleFormikSubmit = values => {
    setShowLoadingModal(true);
    dispatch(
      updatePasswordThunk({
        currentPassword: values.existingPassword,
        newPassword: values.newPassword,
      }),
    )
      .unwrap()
      .then(() => {
        setShowLoadingModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate('Login');
          AsyncStorage.clear();
        }, 3000);
      })
      .catch(error => {
        setShowLoadingModal(false);
        setShowErrorModal(true);
        setErrorMsg(error.message);
      });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Mật khẩu',
    })
  }, [])

  return (
    <NativeBaseProvider>
      <View >
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
        <View style={styles.smallBox}>
          <Formik
            initialValues={{
              existingPassword: '',
              newPassword: '',
              confirmPassword: '',
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
              dirty
            }) => (
              <View>
                <View style={{
                  borderBottomWidth: 1,
                  paddingBottom: SIZES.m,
                  borderColor: COLORS.gray2,
                  marginTop: SIZES.s,
                }}>
                  <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Đổi mật khẩu</Text>
                    <Text style={TEXTS.subContent}>Mật khẩu của bạn phải có tối thiểu 6 ký tự, đồng thời bao gồm cả chữ số, chữ cái và ký tự đặc biệt (!$@%).</Text>
                  </View>
                  <View style={{
                    position: 'relative',
                    marginTop: SIZES.s,
                  }}>
                    <Input
                      style={styles.input}
                      marginTop={2}
                      variant="outline"
                      placeholder="Mật khẩu hiện tại"
                      value={values.existingPassword}
                      onChangeText={handleChange('existingPassword')}
                      onBlur={handleBlur('existingPassword')}
                      secureTextEntry={!showExistingPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowExistingPassword(!showExistingPassword)
                      }
                      style={styles.passIcon}>
                      <Ionicons
                        name={showExistingPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                    {touched.existingPassword && errors.existingPassword ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '30%', right: '10%' }]}>
                        {errors.existingPassword}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{
                    position: 'relative',
                    marginTop: SIZES.s,
                  }}>
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
                    {touched.newPassword && errors.newPassword ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '30%', right: '10%' }]}>
                        {errors.newPassword}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{
                    position: 'relative',
                    marginTop: SIZES.s,
                  }}>
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
                    {touched.confirmPassword && errors.confirmPassword ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '30%', right: '10%' }]}>{errors.confirmPassword}</Text>
                    ) : null}
                  </View>
                </View>
                <Center>
                  <View style={styles.cancel}>
                    <Pressable
                      disabled={!dirty}
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
                          backgroundColor: !dirty ? COLORS.gray1 : COLORS.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          gap: SIZES.s
                        }, BUTTONS.recFull]}
                      >
                        <Text style={{ fontSize: SIZES.m, color: !dirty ? COLORS.black : COLORS.white, fontWeight: '500' }}>Cập nhật</Text>
                      </View>
                    </Pressable>
                  </View>
                </Center>
              </View>

            )}
          </Formik>
        </View>

      </View>
    </NativeBaseProvider>
  );
}
