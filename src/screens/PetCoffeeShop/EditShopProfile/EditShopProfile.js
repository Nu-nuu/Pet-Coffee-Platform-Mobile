import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Center, NativeBaseProvider, Input, Heading } from 'native-base';
import { ALERTS, AVATARS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../components/Alert/errorModal';
import SuccessModal from '../../../components/Alert/successModal';
import LoadingModal from '../../../components/Alert/loadingModal';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { thisPetCoffeeShopSelector } from '../../../store/sellectors';
import {
  getAllPetCoffeeShopsThunk,
  getPetCoffeeShopDetailThunk,
  getThisPetCoffeeShopDetailThunk,
  updatePetCoffeeShopThunk,
} from '../../../store/apiThunk/petCoffeeShopThunk';

export default function EditShopProfile({ route, navigation }) {
  const id = route?.params?.id;
  const shopDetail = route?.params?.shopData;
  const dispatch = useDispatch();
  const latitude = shopDetail.latitude;
  const longitude = shopDetail.longitude;
  const formData = new FormData();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required(ALERTS.blank),
    phone: Yup.string()
      .matches(/^[0-9]+$/, ALERTS.phone)
      .required(ALERTS.blank)
      .min(10, ALERTS.phone)
      .max(10, ALERTS.phone),
    location: Yup.string().required(ALERTS.blank),
    avatarUrl: Yup.string().required(ALERTS.image),
    backgroundUrl: Yup.string().required(ALERTS.image),
  });

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
          const imagePart = {
            uri: imageUri,
            name: fileName,
            type: fileType,
          };
          if (type === 'avatarUrl') {
            const existingImageIndex = formData._parts.findIndex(
              ([name]) => name === 'Avatar',
            );
            if (existingImageIndex !== -1) {
              formData._parts.splice(existingImageIndex, 1, [
                'Avatar',
                imagePart,
              ]);
            } else {
              formData.append('Avatar', imagePart);
            }
            setFieldValue('avatarUrl', imageUri);
          } else {
            const existingImageIndex = formData._parts.findIndex(
              ([name]) => name === 'Background',
            );
            if (existingImageIndex !== -1) {
              formData._parts.splice(existingImageIndex, 1, [
                'Background',
                imagePart,
              ]);
            } else {
              formData.append('Background', imagePart);
            }
            setFieldValue('backgroundUrl', imageUri);
          }
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    formData.append('Id', id);
    formData.append('Name', values.name);
    formData.append('Email', shopDetail.email);
    formData.append('Phone', values.phone?.trim());
    formData.append('Latitude', latitude);
    formData.append('Location', values.location);
    formData.append('Longitude', longitude);
    formData.append('FbUrl', values.fbUrl);
    formData.append('InstagramUrl', values.instagramUrl);
    formData.append('WebsiteUrl', values.websiteUrl);

    setShowLoadingModal(true);
    dispatch(updatePetCoffeeShopThunk(formData))
      .unwrap()
      .then(() => {
        dispatch(getThisPetCoffeeShopDetailThunk());
        dispatch(getPetCoffeeShopDetailThunk({ id, latitude, longitude }));
        dispatch(
          getAllPetCoffeeShopsThunk({
            searchQuery: '',
            type: '',
            longitude: longitude,
            latitude: latitude,
            pageSize: 7,
            pageNumber: 1,
          }),
        );
        setShowLoadingModal(false);
        setSuccessMsg('Update Successfully');
        setShowSuccessModal(true);
      })
      .catch(error => {
        setShowLoadingModal(false);
        console.log(error);
        // setErrorMsg(`${error.message}`);
        // setShowErrorModal(true);
      });
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chỉnh sửa thông tin quán',
    })
  }, [])

  const [showDetail, setShowDetail] = useState(false);
  const [showConnect, setShowConnect] = useState(false)

  return (
    <NativeBaseProvider>
      <ScrollView>
        <LoadingModal
          showLoadingModal={showLoadingModal}
          setShowLoadingModal={setShowLoadingModal}
        />
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
        <SuccessModal
          showSuccessModal={showSuccessModal}
          setShowSuccessModal={setShowSuccessModal}
          successMsg={successMsg}
          direction={'editShopProfile'}
        />
        <View style={styles.smallBox}>
          <Formik
            initialValues={{
              name: shopDetail.name,
              phone: shopDetail.phone,
              location: shopDetail.location,
              avatarUrl: shopDetail.avatarUrl,
              backgroundUrl: shopDetail.backgroundUrl,
              fbUrl: shopDetail.fbUrl,
              instagramUrl: shopDetail.instagramUrl,
              websiteUrl: shopDetail.websiteUrl,
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
                {/* ======Ảnh đại diện====== */}
                <View style={{
                  borderBottomWidth: 1,
                  paddingBottom: SIZES.m,
                  borderColor: COLORS.gray2,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh đại diện</Text>
                    <Pressable onPress={() => pickImage(setFieldValue, 'avatarUrl')}>
                      <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa</Text>
                    </Pressable>
                  </View>
                  {values.avatarUrl !== '' ? (
                    <Image
                      key={values.avatarUrl}
                      source={{ uri: values.avatarUrl }}
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
                    <Pressable onPress={() => pickImage(setFieldValue, 'backgroundUrl')}>
                      <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa</Text>
                    </Pressable>
                  </View>
                  {values.backgroundUrl !== '' ? (
                    <Image
                      key={values.backgroundUrl}
                      source={{ uri: values.backgroundUrl }}
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
                  {/* ======Tên quán====== */}
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
                          placeholder="Nhập tên quán..."
                          value={values.name}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          autoCapitalize="words"
                          size="md"
                        />
                      </>

                    ) : (
                      <Text style={[TEXTS.content, {
                        paddingLeft: SIZES.s,
                      }
                      ]}>{shopDetail.name}</Text>
                    )}
                    {showDetail && touched.name && errors.name ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.name}</Text>
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
                      ]}>{shopDetail.phone}</Text>
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
                          placeholder="Address"
                          value={values.location}
                          onChangeText={handleChange('location')}
                          onBlur={handleBlur('location')}
                          size="lg"
                        />
                      </>

                    ) : (
                      <Text style={[TEXTS.content, {
                        paddingLeft: SIZES.s,
                      }
                      ]}>{shopDetail.location}</Text>
                    )}
                    {showDetail && touched.location && errors.location ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.location}</Text>
                    ) : null}
                  </View>
                </View>
                {/* ======Liên kết xã hội====== */}
                <View style={{
                  borderBottomWidth: 1,
                  paddingBottom: SIZES.m,
                  borderColor: COLORS.gray2,
                  marginTop: SIZES.s,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Liên kết xã hội</Text>
                    <Pressable onPress={() => setShowConnect(!showConnect)}>
                      <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa</Text>
                    </Pressable>
                  </View>
                  {/* ======Website====== */}
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
                        name="globe"
                        size={ICONS.m}
                        color={COLORS.primary}
                      />
                    </View>
                    {showConnect ? (
                      <>
                        <Input
                          variant="outline"
                          placeholder="Liên kết Website"
                          value={values.websiteUrl}
                          onChangeText={handleChange('websiteUrl')}
                          onBlur={handleBlur('websiteUrl')}
                          size="lg"
                        />
                      </>
                    ) : (
                      <Text style={[TEXTS.content, {
                        paddingLeft: SIZES.s,
                      }
                      ]}>{shopDetail.websiteUrl}</Text>
                    )}
                    {showConnect && touched.websiteUrl && errors.websiteUrl ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.websiteUrl}</Text>
                    ) : null}
                  </View>
                  {/* ======Facebook====== */}
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
                        name="logo-facebook"
                        size={ICONS.m}
                        color={COLORS.primary}
                      />
                    </View>
                    {showConnect ? (
                      <>
                        <Input
                          variant="outline"
                          placeholder="Liên kết Facebook"
                          value={values.fbUrl}
                          onChangeText={handleChange('fbUrl')}
                          onBlur={handleBlur('fbUrl')}
                          size="lg"
                        />
                      </>
                    ) : (
                      <Text style={[TEXTS.content, {
                        paddingLeft: SIZES.s,
                      }
                      ]}>{shopDetail.fbUrl}</Text>
                    )}
                    {showConnect && touched.fbUrl && errors.fbUrl ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.fbUrl}</Text>
                    ) : null}
                  </View>
                  {/* ======Instagram====== */}
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
                        name="globe"
                        size={ICONS.m}
                        color={COLORS.primary}
                      />
                    </View>
                    {showConnect ? (
                      <>
                        <Input
                          variant="outline"
                          placeholder="Liên kết Instagram"
                          value={values.instagramUrl}
                          onChangeText={handleChange('instagramUrl')}
                          onBlur={handleBlur('instagramUrl')}
                          size="lg"
                        />
                      </>
                    ) : (
                      <Text style={[TEXTS.content, {
                        paddingLeft: SIZES.s,
                      }
                      ]}>{shopDetail.instagramUrl}</Text>
                    )}
                    {showConnect && touched.instagramUrl && errors.instagramUrl ? (
                      <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.instagramUrl}</Text>
                    ) : null}
                  </View>
                </View>
                {(showDetail || showConnect) && (
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
                          <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Cập nhật</Text>
                        </View>
                      </Pressable>
                    </View>
                  </Center>
                )}

              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  validationError: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 3,
  },
  smallBox: {
    backgroundColor: COLORS.quaternary,
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
  cancel: {
    height: SIZES.height / 10,
    padding: SIZES.s,
  },
});
