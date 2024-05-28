import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import {
  Center,
  NativeBaseProvider,
  Input,
  Heading,
  Select,
  FormControl,
  CheckIcon,
  WarningOutlineIcon,
  Image,
  Radio,
  Stack
} from 'native-base';
import { ALERTS, AVATARS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../components/Alert/errorModal';
import SuccessModal from '../../../components/Alert/successModal';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  createPetThunk,
  getPetsFromShopThunk,
} from '../../../store/apiThunk/petThunk';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../components/Alert/questionModal';
import { petCoffeeShopDetailSelector } from '../../../store/sellectors';
import Loading from '../../../components/Alert/modalSimple/loading';
import Success from '../../../components/Alert/modalSimple/success';

export default function CreatePet({ route, navigation }) {
  const id = route.params?.id;
  const dispatch = useDispatch();
  const formData = new FormData();
  const currentYear = new Date().getFullYear();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [questionMsg, setQuestionMsg] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [backgrounds, setBackgrounds] = useState([]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(ALERTS.blank),
    spayed: Yup.string().required(ALERTS.blank),
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
            setAvatar({
              uri: imageUri,
              name: fileName,
              type: fileType,
            });
            setFieldValue('avatar', imageUri);
          } else {
            const backgroundUris = response.assets?.map(item => item.uri);
            const backgroundsArray = response.assets?.map(item => ({
              uri: item.uri,
              type: item.type,
              name: item.fileName,
            }));
            setBackgrounds(backgroundsArray);
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
    formData.append('Name', values.name);
    formData.append('BirthYear', values.birthYear?.trim());
    formData.append('Weight', values.weight?.trim());
    formData.append('Description', values.description?.trim());
    formData.append('Spayed', values.spayed);
    formData.append('PetType', values.petType);
    formData.append('TypeSpecies', values.typeSpecies);
    formData.append('Gender', values.gender);
    formData.append('PetCoffeeShopId', id);
    formData.append('Avatar', avatar);
    backgrounds.forEach(background => {
      formData.append('Backgrounds', background);
    });

    dispatch(createPetThunk(formData))
      .unwrap()
      .then(() => {
        dispatch(getPetsFromShopThunk(id))
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
      headerTitle: 'Thêm thú cưng ' + `${shopData.name}`,
    })
  }, [])

  return (
    <NativeBaseProvider>
      <ScrollView>
        <ErrorModal
          showErrorModal={showErrorModal}
          setShowErrorModal={setShowErrorModal}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
        <View style={{
          backgroundColor: COLORS.quaternary,
          padding: SIZES.m,
          minHeight: SIZES.height,
        }}>
          <Formik
            initialValues={{
              name: '',
              birthYear: '',
              weight: '',
              spayed: '',
              description: '',
              avatar: '',
              backgrounds: [],
              gender: '',
              petType: '',
              typeSpecies: '',
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
                values.petType === 'cat'
                  ? [
                    { label: 'Mèo Ba Tư', value: 'Persian' },
                    { label: 'Mèo Xiêm', value: 'Siamese' },
                    { label: 'Mèo Maine Coon', value: 'MaineCoon' },
                    { label: 'Mèo Sphynx', value: 'Sphynx' },
                    { label: 'Mèo Anh lông ngắn', value: 'BritishShorthair' },
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
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Ảnh đại diện</Text>
                    <TouchableOpacity
                      onPress={() => pickImage(setFieldValue, 'avatar')}>
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
                    </TouchableOpacity>
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
                      {values.backgrounds?.length > 1 && (
                        <Pressable onPress={() => pickImage(setFieldValue, 'background')}>
                          <Text style={[TEXTS.subContent, { color: COLORS.primary, fontWeight: '500', textDecorationLine: 'underline' },]}>Đang chọn ({values.backgrounds?.length})</Text>
                        </Pressable>
                      )}
                    </View>
                    <TouchableOpacity
                      disabled={values.backgrounds?.length > 1}
                      onPress={() => pickImage(setFieldValue, 'background')}>
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
                    </TouchableOpacity>
                    {touched.backgrounds && errors.backgrounds ? (
                      <Text style={styles.validationError}>{errors.backgrounds}</Text>
                    ) : null}
                  </View>
                  {/* ==========Chi tiết========== */}
                  <View style={{
                    paddingBottom: SIZES.m,
                    marginTop: SIZES.s,
                  }}>
                    <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin chi tiết</Text>
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
                      <Input
                        variant="outline"
                        placeholder="Tên"
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        autoCapitalize="words"
                        size="lg"
                      />
                      {touched.name && errors.name ? (
                        <Text style={[styles.validationError, { position: 'absolute', bottom: '-35%', left: '14%' }]}>{errors.name}</Text>
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
                        marginTop: SIZES.m,
                        width: (SIZES.width - SIZES.m * 5) / 1.75,
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
                        <Input
                          variant="outline"
                          placeholder="Năm sinh (ví dụ: 2020)"
                          value={values.birthYear}
                          onChangeText={handleChange('birthYear')}
                          onBlur={handleBlur('birthYear')}
                          keyboardType="number-pad"
                          size="lg"
                        />
                        {touched.birthYear && errors.birthYear ? (
                          <Text style={[styles.validationError, { position: 'absolute', bottom: '-35%', left: '24%' }]}>{errors.birthYear}</Text>
                        ) : null}
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: SIZES.s,
                        marginTop: SIZES.m,
                        width: (SIZES.width - SIZES.m * 5),
                        height: SIZES.width / 9.53,
                        position: 'relative'
                      }}>
                        <FormControl
                          isRequired={touched.petType && errors.petType}
                          isInvalid={touched.petType && errors.petType}>
                          <Radio.Group
                            name="type"
                            value={values.petType}
                            onChange={value => setFieldValue('petType', value)}>
                            <Stack flexDirection='row' space={4}>
                              <Stack space={4}>
                                <Radio value="dog">Chó</Radio>
                              </Stack>
                              <Stack px={2} space={4}>
                                <Radio value="cat">Mèo</Radio>
                              </Stack>
                            </Stack>
                          </Radio.Group>
                          {touched.petType && errors.petType && (
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
                        marginTop: SIZES.m,
                        width: (SIZES.width - SIZES.m * 5) / 1.75,
                        height: SIZES.width / 9.53,
                        position: 'relative',
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
                            placeholder="Chọn giống loài"
                            _selectedItem={{
                              endIcon: <CheckIcon size={5} />,
                            }}
                            mt={touched.typeSpecies && errors.typeSpecies ? 6 : 0}
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
                          {touched.typeSpecies && errors.typeSpecies && (
                            <FormControl.ErrorMessage>
                              <Text style={[styles.validationError]}>Hãy chọn giống loài</Text>
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: SIZES.s,
                        marginTop: SIZES.m,
                        width: (SIZES.width - SIZES.m * 5),
                        height: SIZES.width / 9.53,
                        position: 'relative'
                      }}>
                        <FormControl
                          isRequired={touched.gender && errors.gender}
                          isInvalid={touched.gender && errors.gender}>
                          <Radio.Group
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
                          {touched.gender && errors.gender && (
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
                        marginTop: SIZES.m,
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
                            name="spayed"
                            value={values.spayed}
                            onChange={value => setFieldValue('spayed', value)}>
                            <Stack flexDirection='row' space={4}>
                              <Stack space={4}>
                                <Radio value="true">Có</Radio>
                              </Stack>
                              <Stack px={2} space={4}>
                                <Radio value="false">Không</Radio>
                              </Stack>
                            </Stack>
                          </Radio.Group>
                          {touched.spayed && errors.spayed && (
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
                        marginTop: SIZES.m,
                        width: (SIZES.width - SIZES.m * 5) / 2.5,
                        height: SIZES.width / 9.53,
                        position: 'relative'
                      }}>
                        <MaterialIcons
                          name="scale"
                          size={ICONS.m}
                          color={COLORS.primary}
                        />
                        <Input
                          variant="outline"
                          placeholder="Cân nặng (kg)"
                          value={values.weight}
                          onChangeText={handleChange('weight')}
                          onBlur={handleBlur('weight')}
                          keyboardType="number-pad"
                          size="lg"
                        />
                        {touched.weight && errors.weight ? (
                          <Text style={[styles.validationError, { position: 'absolute', bottom: '-30%', left: '25%' }]}>{errors.weight}</Text>
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
                        placeholder="Mô tả về thú cưng"
                        value={values.description}
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        size="lg"
                        multiline={true}
                      />
                      {touched.description && errors.description ? (
                        <Text style={[styles.validationError, { position: 'absolute', bottom: '-35%', left: '14%' }]}>{errors.description}</Text>
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
                          <Text style={{ fontSize: SIZES.m, color: COLORS.white, fontWeight: '500' }}>Thêm thú cưng</Text>
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
  cancel: {
    height: SIZES.height / 10,
    padding: SIZES.s,
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
