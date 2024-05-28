import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Center,
  NativeBaseProvider,
  Heading,
  Select,
  FormControl,
  CheckIcon,
  WarningOutlineIcon,
  Image,
  Input,
} from 'native-base';
import { ALERTS, AVATARS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../../components/Alert/errorModal';
import SuccessModal from '../../../../components/Alert/successModal';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  createMomentThunk,
  editMomentThunk,
  getMomentDetailThunk,
  getMomentsFromPetThunk,
} from '../../../../store/apiThunk/momentThunk';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../../components/Alert/questionModal';
import Loading from '../../../../components/Alert/modalSimple/loading';
import Success from '../../../../components/Alert/modalSimple/success';
import { momentDetailSelector } from '../../../../store/sellectors';

export default function CreateMoment({ route, navigation }) {
  const id = route.params?.id;
  const petData = route.params?.petData;
  const moment = route.params?.moment;
  const momentId = route?.params?.momentId;
  const momentDetail = useSelector(momentDetailSelector);


  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [images, setImages] = useState([]);

  const dispatch = useDispatch();
  const formData = new FormData();

  const validationSchema = Yup.object().shape({
    content: Yup.string().required(ALERTS.blank),
    momentType: Yup.string().required(ALERTS.blank),
    images: Yup.array().min(1, ALERTS.image),
  });


  useEffect(() => {
    if (moment) {
      setShowLoadingModal(true);
      dispatch(getMomentDetailThunk(momentId))
        .unwrap()
        .then(() => {
          setShowLoadingModal(false);
        });
    }
  }, [route.params]);

  useLayoutEffect(() => {
    if (moment) {
      navigation.setOptions({
        headerTitle: 'Chỉnh sửa khoảnh khắc thú cưng',
      })
    }

  }, [route.params])

  const momentImages = momentDetail ? momentDetail?.image?.split(';') : null;


  const pickImage = async setFieldValue => {
    try {
      const options = { mediaType: 'photo', selectionLimit: 10 };
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('Image picker error: ', response.error);
        } else {
          const imageUris = response.assets?.map(item => item.uri);
          const imagesArray = response.assets?.map(item => ({
            uri: item.uri,
            type: item.type,
            name: item.fileName,
          }));
          setImages(imagesArray);
          setFieldValue('images', imageUris);
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    if (moment) {
      setShowLoadingModal(true);
      formData.append('Id', momentId);
      formData.append('Content', values.content);
      formData.append('MomentType', values.momentType);
      images.forEach(image => {
        formData.append('NewImages', image);
      });
      
      dispatch(editMomentThunk(formData))
        .unwrap()
        .then(() => {
          dispatch(getMomentsFromPetThunk(id))
            .unwrap()
            .then((res) => {
              setShowLoadingModal(false);
              setShowSuccessModal(true);
              setTimeout(() => {
                setShowSuccessModal(false)
                navigation.navigate('PetDetail', { id: id, petDatas: petData, role: 'Staff', moment: true })
              }, 3000);
            });
        })
        .catch(error => {
          setShowLoadingModal(false);
          setErrorMsg(error.message);
          setShowErrorModal(true);
        });

    } else {
      setShowLoadingModal(true);
      formData.append('PetId', id);
      formData.append('Content', values.content);
      formData.append('MomentType', values.momentType);
      images.forEach(image => {
        formData.append('Image', image);
      });

      dispatch(createMomentThunk(formData))
        .unwrap()
        .then(() => {
          dispatch(getMomentsFromPetThunk(id))
            .unwrap()
            .then((res) => {
              setShowLoadingModal(false);
              setShowSuccessModal(true);
              setTimeout(() => {
                setShowSuccessModal(false)
                navigation.navigate('PetDetail', { id: id, petDatas: petData, role: 'Staff', moment: true })
              }, 3000);
            });
        })
        .catch(error => {
          setShowLoadingModal(false);
          setErrorMsg(error.message);
          setShowErrorModal(true);
        });
    }

  };

  // const handleFormikSubmit = values => {
  //   setShowLoadingModal(true);
  //   formData.append('Id', momentId);
  //   formData.append('Content', values.content);
  //   formData.append('MomentType', values.momentType);

  //   dispatch(editMomentThunk(formData))
  //     .unwrap()
  //     .then(() => {
  //       dispatch(getMomentsFromPetThunk(petId));
  //       setShowLoadingModal(false);
  //       setSuccessMsg('Update Successfully');
  //       setShowSuccessModal(true);
  //     })
  //     .catch(error => {
  //       setShowLoadingModal(false);
  //       setErrorMsg(error.message);
  //       setShowErrorModal(true);
  //     });
  // };

  const renderSelectedImages = ({ item, index }) => (
    <Image source={{ uri: item }} style={styles.selectedImage} alt='images' />
  );


  return (
    <NativeBaseProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView>
          <>
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
          </>
          <View style={{ backgroundColor: COLORS.white }}>
            <Formik
              initialValues={{
                content: moment ? momentDetail.content : '',
                momentType: moment ? momentDetail.momentType : '',
                images: moment ? momentImages : [],
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
                dirty
              }) => (
                <View>
                  <View style={styles.postTop}>
                    <View style={styles.row}>
                      <View >
                        <Image
                          source={{ uri: petData.avatar }}
                          style={AVATARS.mid}
                          alt='avatar'
                        />
                      </View>
                      <View style={styles.inforProfile}>
                        <View>
                          <Text style={styles.title} numberOfLines={1}>{petData.name}</Text>
                        </View>
                        <View style={styles.row}>
                          <Pressable
                            onPress={() => pickImage(setFieldValue)}   >
                            <Ionicons name='images' size={ICONS.xm} color={COLORS.primary} />
                          </Pressable>
                          <FormControl
                            isRequired={touched.momentType && errors.momentType}
                            isInvalid={touched.momentType && errors.momentType}>
                            <Select
                              placeholder="Khoảnh khắc"
                              w='1/4'
                              h='8'
                              onValueChange={value =>
                                setFieldValue('momentType', value)
                              }
                              selectedValue={values.momentType}>
                              <Select.Item label="Vui chơi" value="Playing" />
                              <Select.Item label="Ăn uống" value="Eating" />
                              <Select.Item label="Đi dạo" value="Walking" />
                            </Select>
                            {touched.momentType && errors.momentType && (
                              <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="md" />}>
                                <Text style={styles.validationError}>
                                  Chọn loại khoảnh khắc
                                </Text>
                              </FormControl.ErrorMessage>
                            )}
                          </FormControl>
                        </View>
                      </View>
                    </View>

                  </View>
                  <TextInput
                    variant="outline"
                    value={values.content}
                    onChangeText={handleChange('content')}
                    onBlur={handleBlur('content')}
                    autoCapitalize="words"
                    size="lg"
                    multiline={true}
                    placeholder={`Khoảnh khắc của ${petData.name}`}
                    placeholderTextColor={COLORS.gray2}
                    style={{ fontSize: SIZES.l, }}
                  />
                  {touched.content && errors.content ? (
                    <Text style={styles.validationError}>{errors.content}</Text>
                  ) : null}
                  <View style={{ marginTop: 15 }}>
                    {values.images?.length !== 0 ? (
                      <FlatList
                        data={values.images}
                        renderItem={renderSelectedImages}
                        ListEmptyComponent={null}
                        keyExtractor={(items, index) => index.toString()}
                        horizontal
                      />
                    ) : null}
                  </View>
                  {touched.images && errors.images ? (
                    <Text style={styles.validationError}>{errors.images}</Text>
                  ) : null}
                  <Center>
                    <TouchableOpacity
                      style={!dirty ? [BUTTONS.recFull, { alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: COLORS.gray1, }] : [BUTTONS.recFull, { alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: COLORS.primary }]}
                      onPress={handleSubmit}
                      disabled={!dirty}
                    >
                      <Text style={!dirty ? [TEXTS.content, { color: COLORS.black, fontWeight: '500' }] : [TEXTS.content, { color: COLORS.white, fontWeight: '500' }]}>
                        {moment ? 'Cập nhật' : 'Đăng'}
                      </Text>
                    </TouchableOpacity>
                  </Center>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  selectedImage: {
    width: SIZES.width / 2,
    height: SIZES.height / 3,
    resizeMode: "cover",
    marginBottom: 20,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.s,
  },
  title: {
    fontWeight: 'bold',
    fontSize: SIZES.m,
    color: COLORS.black,
  },
  category: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    gap: 5,
  },
  postTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.m
  },
  inforProfile: {
    paddingLeft: SIZES.s,
  },
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
});
