import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Center,
  NativeBaseProvider,
  Input,
  Heading,
  Image,
  Select,
  FormControl,
  CheckIcon,
  WarningOutlineIcon,
  Radio,
  Stack,
  FlatList,
  Skeleton
} from 'native-base';
import { ALERTS, AVATARS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../components/Alert/errorModal';
import SuccessModal from '../../../components/Alert/successModal';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { petCoffeeShopDetailSelector, petDetailSelector } from '../../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  getPetDetailThunk,
  getPetsFromShopThunk,
  updatePetThunk,
} from '../../../store/apiThunk/petThunk';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../components/Alert/questionModal';
import Loading from '../../../components/Alert/modalSimple/loading';
import Success from '../../../components/Alert/modalSimple/success';

export default function EditPet({ route, navigation }) {
  const petId = route?.params?.petId;
  const shopId = route?.params?.shopId;
  const dispatch = useDispatch();
  const petDetail = useSelector(petDetailSelector);
  const formData = new FormData();
  const currentYear = new Date().getFullYear();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [questionMsg, setQuestionMsg] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showRender, setShowRender] = useState(false);
  const [reload, setReload] = useState(false)
  const backgroundsArray = petDetail?.backgrounds?.split(';');

  useEffect(() => {
    setReload(false)
    setShowRender(true);
    dispatch(getPetDetailThunk(petId)).then(() => {
      setShowRender(false);
    });
  }, [petId]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(ALERTS.blank),
    spayed: Yup.string().required(ALERTS.blank),
    petStatus: Yup.string().required(ALERTS.blank),
    birthYear: Yup.string()
      .required(ALERTS.blank)
      .matches(/^\d+$/, ALERTS.number)
      .min(4, ALERTS.birth)
      .max(4, ALERTS.birth)
      .test(
        'valid-year',
        ALERTS.year,
        value => {
          const year = parseInt(value);
          return year >= 1980 && year <= currentYear;
        },
      ),
    weight: Yup.string()
      .required(ALERTS.blank)
      .matches(/^[0-9]+$/, ALERTS.number),
    description: Yup.string().required(ALERTS.blank),
    gender: Yup.string().required(ALERTS.blank),
    petType: Yup.string().required(ALERTS.blank),
    typeSpecies: Yup.string().required(ALERTS.blank),
    avatar: Yup.string().required(ALERTS.image),
    backgrounds: Yup.array().min(1, ALERTS.image),
  });

  const pickImage = async (setFieldValue, type) => {
    try {
      const options =
        type === 'avatar'
          ? { mediaType: 'photo' }
          : { mediaType: 'photo', selectionLimit: 10 };
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('Image picker error: ', response.error);
        } else {
          if (type === 'avatar') {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            let fileName = response.assets?.[0]?.fileName;
            let fileType = response.assets?.[0]?.type;
            let existingImageIndex = formData._parts.findIndex(
              ([name]) => name === 'Avatar',
            );
            if (existingImageIndex !== -1) {
              formData._parts.splice(existingImageIndex, 1, [
                'NewAvatar',
                {
                  uri: imageUri,
                  name: fileName,
                  type: fileType,
                },
              ]);
            } else {
              formData.append('NewAvatar', {
                uri: imageUri,
                name: fileName,
                type: fileType,
              });
            }
            setFieldValue('avatar', imageUri);
          } else {
            const backgroundUris = response.assets?.map(item => item.uri);
            const backgroundsArray = response.assets?.map(item => ({
              uri: item.uri,
              type: item.type,
              name: item.fileName,
            }));
            let existingImageIndex = formData._parts.findIndex(
              ([name]) => name === 'NewBackgrounds',
            );
            if (existingImageIndex !== -1) {
              backgroundsArray.forEach(background => {
                formData._parts.splice(existingImageIndex, 1, [
                  'NewBackgrounds',
                  background,
                ]);
              });
            } else {
              backgroundsArray.forEach(background => {
                formData.append('NewBackgrounds', background);
              });
            }
            setFieldValue('backgrounds', backgroundUris);
          }
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    setShowLoadingModal(true);
    formData.append('Id', petId);
    formData.append('Name', values.name);
    formData.append('BirthYear', values.birthYear?.trim());
    formData.append('Weight', values.weight?.trim());
    formData.append('Description', values.description);
    formData.append('Spayed', values.spayed);
    formData.append('PetType', values.petType);
    formData.append('Gender', values.gender);
    formData.append('PetStatus', values.petStatus);
    formData.append('TypeSpecies', values.typeSpecies);

    dispatch(updatePetThunk(formData))
      .unwrap()
      .then(() => {
        dispatch(getPetsFromShopThunk(shopId))
        dispatch(getPetDetailThunk(petId))
          .unwrap()
          .then((res) => {
            setShowLoadingModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false)
              navigation.navigate('PetDetail', { id: petId, petDatas: res, role: 'Staff', edit: true })
            }, 3000);
          })
          .catch((err) => console.log(err))
      })
      .catch(error => {
        setShowLoadingModal(false);
        setErrorMsg(error.message);
        setShowErrorModal(true);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chỉnh sửa thông tin thú cưng',
    })
  }, [])

  const [showDetail, setShowDetail] = useState(false);
  const [showConnect, setShowConnect] = useState(false)

  return (
    <NativeBaseProvider>
      <ScrollView>
        <View style={{
          backgroundColor: COLORS.quaternary,
          padding: SIZES.m,
          minHeight: SIZES.height,
        }}>
          <ErrorModal
            showErrorModal={showErrorModal}
            setShowErrorModal={setShowErrorModal}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
          />
          <Formik
            initialValues={{
              name: petDetail.name,
              birthYear: petDetail.birthYear?.toString(),
              weight: petDetail.weight?.toString(),
              spayed: petDetail.spayed,
              description: petDetail.description,
              avatar: petDetail.avatar,
              backgrounds: backgroundsArray,
              gender: petDetail.gender,
              petType: petDetail.petType,
              petStatus: petDetail.petStatus,
              typeSpecies: petDetail.typeSpecies,
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
            }) => {
              const speciesData =
                values.petType === 'Cat'
                  ? [
                    { label: 'Mèo Ba Tư', value: 'Persian' },
                    { label: 'Mèo Xiêm', value: 'Siamese' },
                    { label: 'Mèo Maine Coon', value: 'MaineCoon' },
                    { label: 'Mèo Sphynx', value: 'Sphynx' },
                    {
                      label: 'Mèo Anh lông ngắn',
                      value: 'BritishShorthair',
                    },
                    { label: 'Mèo Abyssinian', value: 'Abyssinian' },
                    { label: 'Mèo Tai Cụp', value: 'ScottishFold' },
                    { label: 'Loài khác', value: 'Others' },
                  ]
                  : [
                    {
                      label: 'Chó Golden Retriever',
                      value: 'GoldenRetriever',
                    },
                    { label: 'Chó săn cừu Đức', value: 'GermanShepherd' },
                    { label: 'Chó Bulldog Pháp', value: 'FrenchBulldog' },
                    { label: 'Chó Poodle', value: 'Poodle' },
                    {
                      label: 'Chó Labrador Retriever',
                      value: 'LabradorRetriever',
                    },
                    { label: 'Chó Beagle', value: 'Beagle' },
                    { label: 'Chó Dachshund', value: 'Dachshund' },
                    { label: 'Loài khác', value: 'Others' },
                  ];
              return (
                <View>
                  {/* ======Ảnh đại diện====== */}
                  <View style={{
                    borderBottomWidth: 1,
                    paddingBottom: SIZES.m,
                    borderColor: COLORS.gray2,
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh đại diện</Text>
                      <Pressable onPress={() => pickImage(setFieldValue, 'avatar')}>
                        <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa</Text>
                      </Pressable>
                    </View>
                    <View>
                      {showRender ? (
                        <View style={{ height: 150, width: 150, borderRadius: 75, overflow: 'hidden', alignSelf: 'center', marginTop: SIZES.s }}>
                          <Skeleton w="40" h="40" />
                        </View>
                      ) : (
                        <>
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
                        </>
                      )}
                    </View>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh bìa</Text>
                      <Pressable onPress={() => pickImage(setFieldValue, 'background')}>
                        <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa ({values.backgrounds?.length})</Text>
                      </Pressable>
                    </View>
                    <View
                    >
                      {showRender ? (
                        <View style={{ height: SIZES.height / 5, width: SIZES.width - SIZES.m * 2, borderRadius: 10, overflow: 'hidden', alignSelf: 'center', marginTop: SIZES.s }}>
                          <Skeleton w="full" h="full" />
                        </View>
                      ) : (
                        <>
                          {values.backgrounds?.length > 0 ?
                            (
                              <FlatList
                                horizontal
                                data={values.backgrounds}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                  <View style={
                                    values.backgrounds?.length > 1 &&
                                    {
                                      paddingRight: SIZES.s,
                                      width: (SIZES.width) - SIZES.m * 3
                                    }
                                  }>
                                    <Image
                                      source={{ uri: item }}
                                      alt=""
                                      size="xl"
                                      style={[
                                        AVATARS.mini,
                                        {
                                          alignSelf: 'center',
                                          marginTop: SIZES.s,
                                          height: SIZES.height / 5,
                                          width: (SIZES.width) - SIZES.m * 2,
                                        },
                                      ]}
                                    />
                                  </View>
                                )}
                              />
                            )
                            : (
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
                        </>
                      )}
                    </View>
                    {touched.backgrounds && errors.backgrounds ? (
                      <Text style={styles.validationError}>{errors.backgrounds}</Text>
                    ) : null}
                  </View>
                  {/* ==========Chi tiết========== */}
                  <View style={{
                    paddingBottom: SIZES.m,
                    marginTop: SIZES.s,
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin chi tiết</Text>
                      <Pressable onPress={() => setShowDetail(!showDetail)}>
                        <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Chỉnh sửa</Text>
                      </Pressable>
                    </View>
                    {/* ======Trạng thái====== */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: SIZES.s,
                      marginTop: SIZES.s,
                      width: (SIZES.width - SIZES.m * 5),
                      height: SIZES.width / 9.53,
                      position: 'relative'
                    }}>
                      <FormControl
                        isRequired={touched.petStatus && errors.petStatus}
                        isInvalid={touched.petStatus && errors.petStatus}>
                        <Radio.Group
                          isDisabled={!showDetail}
                          name="type"
                          value={values.petStatus}
                          onChange={newValue => setFieldValue('petStatus', newValue)}>
                          <Stack flexDirection='row' space={5}>
                            <Stack space={4}>
                              <Radio value="Active">Hoạt động</Radio>
                            </Stack>
                            <Stack px={4} space={4}>
                              <Radio value="Sick">Chữa trị</Radio>
                            </Stack>
                            <Stack px={4} space={4}>
                              <Radio value="Inactive">Tưởng nhớ</Radio>
                            </Stack>
                          </Stack>

                        </Radio.Group>
                        {showDetail && touched.petStatus && errors.petStatus && (
                          <FormControl.ErrorMessage>
                            <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>Hãy chọn trạng thái hiện tại</Text>
                          </FormControl.ErrorMessage>
                        )}
                      </FormControl>
                    </View>
                    {/* ======Tên====== */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: SIZES.s,
                      marginTop: SIZES.m,
                      width: (SIZES.width - SIZES.m * 5),
                      height: SIZES.width / 9.53,
                      position: 'relative'
                    }}>
                      <View style={ICONS.coverD}>
                        <Ionicons
                          name="paw"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                      </View>
                      {showDetail ? (
                        <>
                          <Input
                            variant="outline"
                            placeholder="Tên"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            autoCapitalize="words"
                            size="lg"
                          />
                        </>
                      ) : (
                        <Text style={[TEXTS.content, {
                          paddingLeft: SIZES.s,
                        }
                        ]}>{petDetail.name}</Text>
                      )}
                      {showDetail && touched.name && errors.name ? (
                        <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>{errors.name}</Text>
                      ) : null}
                    </View>
                    {/* ======Tuổi, chó/mèo====== */}
                    <View style={{
                      flexDirection: 'row',
                      gap: (SIZES.width - SIZES.m * 5) / 5,
                      marginTop: SIZES.m,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: SIZES.s,
                        marginTop: SIZES.s,
                        width: (SIZES.width - SIZES.m * 5) / 2,
                        height: SIZES.width / 9.53,
                        position: 'relative'
                      }}>
                        <View style={ICONS.coverD}>
                          <Ionicons
                            name="time"
                            size={ICONS.m}
                            color={COLORS.primary}
                          />
                        </View>
                        {showDetail ? (
                          <>
                            <Input
                              variant="outline"
                              placeholder="Năm sinh"
                              value={values.birthYear}
                              onChangeText={handleChange('birthYear')}
                              onBlur={handleBlur('birthYear')}
                              keyboardType="number-pad"
                              size="lg"
                            />
                          </>

                        ) : (
                          <Text style={[TEXTS.content, {
                            paddingLeft: SIZES.s,
                          }
                          ]}>{petDetail.birthYear}</Text>
                        )}
                        {showDetail && touched.birthYear && errors.birthYear ? (
                          <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>{errors.birthYear}</Text>
                        ) : null}
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: SIZES.s,
                        marginTop: SIZES.s,
                        width: (SIZES.width - SIZES.m * 5),
                        height: SIZES.width / 9.53,
                        position: 'relative'
                      }}>
                        <FormControl
                          isRequired={touched.petType && errors.petType}
                          isInvalid={touched.petType && errors.petType}>
                          <Radio.Group
                            isDisabled={!showDetail}
                            name="type"
                            value={values.petType}
                            onChange={newValue => setFieldValue('petType', newValue)}>
                            <Stack flexDirection='row' space={4}>
                              <Stack space={4}>
                                <Radio value="Dog">Chó</Radio>
                              </Stack>
                              <Stack px={2} space={4}>
                                <Radio value="Cat">Mèo</Radio>
                              </Stack>
                            </Stack>
                          </Radio.Group>
                          {showDetail && touched.petType && errors.petType && (
                            <FormControl.ErrorMessage>
                              <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>Hãy chọn Chó hoặc Mèo</Text>
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>
                      </View>
                    </View>
                    {/* ======Loài, giới tính====== */}
                    <View style={{
                      flexDirection: 'row',
                      gap: (SIZES.width - SIZES.m * 5) / 5,
                      marginTop: SIZES.m,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: SIZES.s,
                        marginTop: SIZES.s,
                        width: (SIZES.width - SIZES.m * 5) / 2,
                        height: SIZES.width / 9.53,
                        position: 'relative'
                      }}>
                        <View style={ICONS.coverD}>
                          <Ionicons
                            name="male-female"
                            size={ICONS.m}
                            color={COLORS.primary}
                          />
                        </View>
                        <FormControl
                          isRequired={touched.typeSpecies && errors.typeSpecies}
                          isInvalid={touched.typeSpecies && errors.typeSpecies}>
                          <Select
                            isDisabled={!showDetail}
                            placeholder="Chọn giống loài"
                            _selectedItem={{
                              endIcon: <CheckIcon size={5} />,
                            }}
                            mt="1"
                            onValueChange={value =>
                              setFieldValue('typeSpecies', value)
                            }
                            selectedValue={values.typeSpecies}>
                            {speciesData.map((specie, index) => {
                              return (
                                <Select.Item
                                  label={specie.label}
                                  value={specie.value}
                                  key={index}
                                />
                              );
                            })}
                          </Select>
                          {showDetail && touched.typeSpecies && errors.typeSpecies && (
                            <FormControl.ErrorMessage
                              leftIcon={<WarningOutlineIcon size="md" />}>
                              <Text style={styles.validationError}>
                                Hãy chọn giống loài
                              </Text>
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: SIZES.s,
                        marginTop: SIZES.s,
                        width: (SIZES.width - SIZES.m * 5),
                        height: SIZES.width / 9.53,
                        position: 'relative'
                      }}>
                        <FormControl
                          isRequired={touched.gender && errors.gender}
                          isInvalid={touched.gender && errors.gender}>
                          <Radio.Group
                            isDisabled={!showDetail}
                            name="gender"
                            value={values.gender}
                            onChange={newValue => setFieldValue('gender', newValue)}>
                            <Stack flexDirection='row' space={4}>
                              <Stack space={4}>
                                <Radio value="MALE">Đực</Radio>
                              </Stack>
                              <Stack px={2} space={4}>
                                <Radio value="FEMALE">Cái</Radio>
                              </Stack>
                            </Stack>
                          </Radio.Group>
                          {showDetail && touched.gender && errors.gender && (
                            <FormControl.ErrorMessage>
                              <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>Hãy chọn giới tính</Text>
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>
                      </View>
                    </View>
                    {/* ======Cân nặng,Triệt sản====== */}
                    <View style={{
                      flexDirection: 'row',
                      gap: (SIZES.width - SIZES.m * 5) / 8,
                      marginTop: SIZES.m,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: SIZES.s,
                        marginTop: SIZES.s,
                        width: (SIZES.width - SIZES.m * 5) / 2,
                        height: SIZES.width / 9.53,
                        position: 'relative',
                      }}>
                        <View style={ICONS.coverD}>
                          <Ionicons
                            name="cut"
                            size={ICONS.m}
                            color={COLORS.primary}
                          />
                        </View>
                        <FormControl
                          isRequired={touched.spayed && errors.spayed}
                          isInvalid={touched.spayed && errors.spayed}>
                          <Radio.Group
                            isDisabled={!showDetail}
                            name="spayed"
                            value={values.spayed}
                            onChange={newValue => setFieldValue('spayed', newValue)}>
                            <Stack flexDirection='row' space={4}>
                              <Stack space={4}>
                                <Radio value={true}>Có</Radio>
                              </Stack>
                              <Stack px={2} space={4}>
                                <Radio value={false}>Không</Radio>
                              </Stack>
                            </Stack>
                          </Radio.Group>
                          {showDetail && touched.spayed && errors.spayed && (
                            <FormControl.ErrorMessage>
                              <Text style={[styles.validationError, { position: 'absolute', bottom: '0%', right: '-40%' }]}>Hãy chọn có/không</Text>
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: SIZES.s,
                        marginTop: SIZES.s,
                        width: (SIZES.width - SIZES.m * 5) / 2.5,
                        height: SIZES.width / 9.53,
                        position: 'relative'
                      }}>
                        <MaterialIcons
                          name="scale"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                        {showDetail ? (
                          <>
                            <Input
                              variant="outline"
                              placeholder="Cân nặng (kg)"
                              value={values.weight}
                              onChangeText={handleChange('weight')}
                              onBlur={handleBlur('weight')}
                              keyboardType="number-pad"
                              size="lg"
                            />
                          </>
                        ) : (
                          <Text style={[TEXTS.content, {
                            paddingLeft: SIZES.s,
                          }
                          ]}>{petDetail.weight} kg</Text>
                        )}
                        {showDetail && touched.weight && errors.weight ? (
                          <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.weight}</Text>
                        ) : null}
                      </View>
                    </View>
                    {/* ======Mô tả====== */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: SIZES.s,
                      marginTop: SIZES.m * 2,
                      width: SIZES.width - SIZES.m * 5,
                      position: 'relative',

                    }}>
                      <View style={ICONS.coverD}>
                        <Ionicons
                          name="information-circle"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                      </View>
                      {showDetail ? (
                        <>
                          <Input
                            variant="outline"
                            placeholder="Mô tả về thú cưng"
                            value={values.description}
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            size="lg"
                            multiline={true}
                          />
                        </>

                      ) : (
                        <Text style={[TEXTS.content, {
                          paddingLeft: SIZES.s,
                          paddingTop: SIZES.s / 2,
                        }
                        ]}>{petDetail.description}</Text>
                      )}
                      {showDetail && touched.description && errors.description ? (
                        <Text style={[styles.validationError, { position: 'absolute', top: '25%', right: '-10%' }]}>{errors.description}</Text>
                      ) : null}
                    </View>
                  </View>
                  {showLoadingModal && (
                    <Loading isModal={true} />
                  )}
                  {showSuccessModal && (
                    <Success isModal={true} />
                  )}
                  <Center>
                    <View style={styles.cancel}>
                      <Pressable
                        disabled={showLoadingModal}
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
                            backgroundColor: showLoadingModal ? COLORS.gray2 : COLORS.primary,
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
                </View>
              );
            }}
          </Formik>
        </View>

      </ScrollView>
    </NativeBaseProvider>
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
  container: {
    padding: 30,
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
