import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Center, NativeBaseProvider, Input, Heading, Image } from 'native-base';
import { ALERTS, AVATARS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../../components/Alert/errorModal';
import SuccessModal from '../../../../components/Alert/successModal';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  createAreaThunk,
  getAreasFromShopThunk,
} from '../../../../store/apiThunk/areaThunk';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../../components/Alert/questionModal';
import Coin from '../../../../components/Wallet/coin';
import ShopDetail from '../../ShopDetail/ShopDetail';
import { petCoffeeShopDetailSelector } from '../../../../store/sellectors';
import Loading from '../../../../components/Alert/modalSimple/loading';
import Success from '../../../../components/Alert/modalSimple/success';

export default function CreateArea({ route, navigation }) {
  const id = route.params?.id;
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [questionMsg, setQuestionMsg] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [image, setImage] = useState({});

  const dispatch = useDispatch();
  const formData = new FormData();

  const validationSchema = Yup.object().shape({
    description: Yup.string().required(ALERTS.blank),
    totalSeat: Yup.string()
      .required(ALERTS.blank)
      .matches(/^[0-9]+$/, ALERTS.number),
    image: Yup.string().required(ALERTS.image),
    order: Yup.string()
      .required(ALERTS.blank)
      .matches(/^[0-9]+$/, ALERTS.number)
      .test(
        ALERTS.more0,
        ALERTS.more0,
        value => {
          return parseInt(value) > 0;
        },
      ),
    pricePerHour: Yup.string()
      .required(ALERTS.blank)
      .matches(/^[0-9]+$/, ALERTS.number),
  });

  const pickImage = async setFieldValue => {
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
          setImage({
            uri: imageUri,
            name: fileName,
            type: fileType,
          });
          setFieldValue('image', imageUri);
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    setShowLoadingModal(true);

    formData.append('PetcoffeeShopId', id);
    formData.append('Description', values.description?.trim());
    formData.append('TotalSeat', values.totalSeat?.trim());
    formData.append('Order', values.order?.trim());
    formData.append('Image', image);
    formData.append('PricePerHour', values.pricePerHour?.trim());

    dispatch(createAreaThunk(formData))
      .unwrap()
      .then(() => {
        dispatch(getAreasFromShopThunk(id))
          .then(() => {
            setShowLoadingModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false)
              navigation.goBack()
            }, 3000);
          });
      })
      .catch(error => {
        setShowLoadingModal(false);
        setErrorMsg(error.message);
        setShowErrorModal(true);
      });
  };

  const shopData = useSelector(petCoffeeShopDetailSelector)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Thêm khu vực ' + `${shopData.name}`,
    })
  }, [])


  return (
    <NativeBaseProvider>
      <ScrollView>
        {/* <QuestionModal
          showQuestionModal={showQuestionModal}
          setShowQuestionModal={setShowQuestionModal}
          questionMsg={questionMsg}
        /> */}
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
        {/* <SuccessModal
          showSuccessModal={showSuccessModal}
          setShowSuccessModal={setShowSuccessModal}
          successMsg={successMsg}
          direction={'createArea'}
        /> */}
        <View style={{
          backgroundColor: COLORS.quaternary,
          padding: SIZES.m,
          minHeight: SIZES.height,
        }}>
          <Formik
            initialValues={{
              description: '',
              totalSeat: '',
              image: '',
              order: '',
              pricePerHour: '',
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
            }) => (
              <View>
                {/* ==========Thêm ảnh========== */}
                <View style={{
                  borderBottomWidth: 1,
                  paddingBottom: SIZES.m,
                  borderColor: COLORS.gray2,
                  marginTop: SIZES.s,
                }}>
                  <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh khu vực</Text>
                  <TouchableOpacity
                    onPress={() => pickImage(setFieldValue)}>
                    {values.image ? (
                      <Image
                        key={values.image}
                        source={{ uri: values.image }}
                        alt=""
                        style={[AVATARS.mini, {
                          alignSelf:
                            'center',
                          marginTop: SIZES.s,
                          height: SIZES.height / 5,
                          width: SIZES.width - SIZES.m * 2,
                          alignItems: 'center', justifyContent: 'center',
                        }]}
                      />
                    ) : (
                      <View style={[AVATARS.mini, {
                        alignSelf:
                          'center',
                        marginTop: SIZES.s,
                        height: SIZES.height / 5,
                        width: SIZES.width - SIZES.m * 2,
                        alignItems: 'center', justifyContent: 'center',
                      }]} >
                        <Ionicons name='images' size={ICONS.m} color={COLORS.blackBold} />
                        <Text style={{ color: COLORS.black, }}>Thêm hình ảnh</Text>
                      </View>
                    )}

                  </TouchableOpacity>
                  {touched.image && errors.image ? (
                    <Text style={styles.validationError}>{errors.image}</Text>
                  ) : null}
                </View>
                {/* ==========Chi tiết========== */}
                <View style={{
                  paddingBottom: SIZES.m,
                  marginTop: SIZES.s,
                }}>
                  <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin chi tiết</Text>
                  <View style={{
                    flexDirection: 'row',
                    gap: (SIZES.width - SIZES.m * 5) / 5
                  }}>
                    {/* ======Tầng====== */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: SIZES.s,
                      marginTop: SIZES.s,
                      width: (SIZES.width - SIZES.m * 5) / 2.5,
                      height: SIZES.width / 9.53,
                      position: 'relative'
                    }}>
                      <View style={ICONS.coverD}>
                        <Ionicons
                          name="home"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                      </View>
                      <Input
                        variant="outline"
                        placeholder="Tầng"
                        value={values.order}
                        onChangeText={handleChange('order')}
                        onBlur={handleBlur('order')}
                        keyboardType="number-pad"
                        size="lg"
                      />

                      {touched.order && errors.order ? (
                        <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>{errors.order}</Text>
                      ) : null}
                    </View>
                    {/* ======Chỗ ngồi====== */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: SIZES.s,
                      marginTop: SIZES.s,
                      width: (SIZES.width - SIZES.m * 5) / 2.5,
                      height: SIZES.width / 9.53,
                      position: 'relative'
                    }}>
                      <View style={ICONS.coverD}>
                        <Ionicons
                          name="people"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                      </View>
                      <Input
                        variant="outline"
                        placeholder="Số chỗ tối đa"
                        value={values.totalSeat}
                        onChangeText={handleChange('totalSeat')}
                        onBlur={handleBlur('totalSeat')}
                        keyboardType="number-pad"
                        size="lg"
                      />

                      {touched.totalSeat && errors.totalSeat ? (
                        <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>{errors.totalSeat}</Text>
                      ) : null}
                    </View>
                  </View>

                  {/* ======Giá====== */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SIZES.s,
                    marginTop: SIZES.s,
                    width: (SIZES.width - SIZES.m * 5) / 2.5,
                    height: SIZES.width / 9.53,
                    position: 'relative'
                  }}>
                    <View style={ICONS.coverD}>
                      <Ionicons
                        name="cash"
                        size={ICONS.m}
                        color={COLORS.primary}
                      />
                    </View>
                    <Input
                      variant="outline"
                      placeholder="Giá 1h"
                      value={values.pricePerHour}
                      onChangeText={handleChange('pricePerHour')}
                      onBlur={handleBlur('pricePerHour')}
                      keyboardType="number-pad"
                      size="lg"
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Image alt='coin' style={[styles.coin, { width: 24, height: 24 }]} source={require('../../../../../assets/coin.png')} />
                      <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>/1h</Text>
                    </View>
                    {touched.pricePerHour && errors.pricePerHour ? (
                      <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>{errors.pricePerHour}</Text>
                    ) : null}
                  </View>

                  {/* ======Mô tả====== */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: SIZES.s,
                    marginTop: SIZES.s,
                    width: SIZES.width - SIZES.m * 5,
                    position: 'relative'
                  }}>
                    <View style={ICONS.coverD}>
                      <Ionicons
                        name="information-circle"
                        size={ICONS.m}
                        color={COLORS.primary}
                      />
                    </View>
                    <Input
                      variant="outline"
                      placeholder="Mô tả về khu vực"
                      value={values.description}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      size="lg"
                      multiline={true}
                    />
                    {touched.description && errors.description ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.description}</Text>
                    ) : null}
                  </View>
                </View>

                {/* order */}
                {/* <View style={[styles.flexRow, { width: '85%' }]}>
                  <FontAwesome6
                    name="house"
                    size={21}
                    color={COLORS.primary}
                  />
                  <Input
                    variant="outline"
                    placeholder="Order"
                    value={values.order}
                    onChangeText={handleChange('order')}
                    onBlur={handleBlur('order')}
                    keyboardType="number-pad"
                    size="lg"
                  />
                </View>
                {touched.order && errors.order ? (
                  <Text style={styles.validationError}>{errors.order}</Text>
                ) : null} */}
                {/* totalSeat */}
                {/* <View style={[styles.flexRow, { width: '85%', marginTop: 15 }]}>
                  <MaterialIcons
                    name="event-seat"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Input
                    variant="outline"
                    placeholder="Total seats"
                    value={values.totalSeat}
                    onChangeText={handleChange('totalSeat')}
                    onBlur={handleBlur('totalSeat')}
                    keyboardType="number-pad"
                    size="lg"
                  />
                </View>
                {touched.totalSeat && errors.totalSeat ? (
                  <Text style={styles.validationError}>
                    {errors.totalSeat}
                  </Text>
                ) : null} */}
                {/* pricePerHour */}
                {/* <View style={[styles.flexRow, { width: '85%', marginTop: 15 }]}>
                  <FontAwesome6
                    name="money-bill-wave"
                    size={21}
                    color={COLORS.primary}
                  />
                  <Input
                    variant="outline"
                    placeholder="Price Per Hour"
                    value={values.pricePerHour}
                    onChangeText={handleChange('pricePerHour')}
                    onBlur={handleBlur('pricePerHour')}
                    keyboardType="number-pad"
                    size="lg"
                  />
                </View>
                {touched.pricePerHour && errors.pricePerHour ? (
                  <Text style={styles.validationError}>
                    {errors.pricePerHour}
                  </Text>
                ) : null} */}

                {/* description */}
                {/* <View style={[styles.flexRow, { width: '85%', marginTop: 15 }]}>
                  <Ionicons
                    name="file-tray-full"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Input
                    variant="outline"
                    placeholder="Descriptions"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    size="lg"
                    multiline={true}
                  />
                </View>
                {touched.description && errors.description ? (
                  <Text style={styles.validationError}>
                    {errors.description}
                  </Text>
                ) : null} */}
                {/* <Center>
                  {!showLoadingModal ? (
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={styles.btn}>
                      <Text style={{ fontSize: 18, color: COLORS.primary }}>
                        Create
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <LottieView
                      source={require('../../../../../assets/images/loading.json')}
                      autoPlay
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                </Center> */}

                <Center>
                  <View style={styles.cancel}>
                    <Pressable style={{
                      width: SIZES.width - SIZES.s * 2,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: SIZES.s,
                    }} onPress={handleSubmit}>
                      <View
                        style={[{
                          paddingVertical: SIZES.s,
                          backgroundColor: COLORS.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          gap: SIZES.s
                        }, BUTTONS.recFull]}
                      >
                        <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Thêm Khu vực</Text>
                      </View>
                    </Pressable>
                  </View>
                </Center>
              </View>
            )}
          </Formik>
        </View >
      </ScrollView >
    </NativeBaseProvider >
  );
}

const styles = StyleSheet.create({
  loginBtn: {
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    marginTop: 30,
  },
  validationError: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 3,
  },
  smallBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    paddingTop: 30,
    paddingBottom: 0,
  },
  heading: { color: COLORS.primary, fontSize: 20 },
  desc: {
    color: 'gray',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 30,
    textAlign: 'center',
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
    width: 80,
    padding: 10,
    marginTop: 20,
    borderColor: COLORS.primary,
    borderWidth: 1,
    marginBottom: 20,
  },
  cancel: {
    height: SIZES.height / 10,
    padding: SIZES.s,
  },
});
