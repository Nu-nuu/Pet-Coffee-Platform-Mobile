import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Center,
  NativeBaseProvider,
  Heading,
  Select,
  FormControl,
  CheckIcon,
  WarningOutlineIcon,
  Image,
} from 'native-base';
import { ALERTS, BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../../components/Alert/errorModal';
import SuccessModal from '../../../../components/Alert/successModal';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createVaccinationThunk,
  editVaccinationThunk,
  getVaccinationDetailThunk,
  getVaccinationsFromPetThunk,
} from '../../../../store/apiThunk/vaccinationThunk';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../../components/Alert/questionModal';
import Loading from '../../../../components/Alert/modalSimple/loading';
import Success from '../../../../components/Alert/modalSimple/success';
import { vaccinationDetailSelector } from '../../../../store/sellectors';

export default function CreateVaccination({ route, navigation }) {
  const id = route.params?.id;
  const petData = route.params?.petData;
  const vaccine = route.params?.vaccine;
  const vaccineId = route?.params?.vaccineId;
  const vaccinationDetail = useSelector(vaccinationDetailSelector);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [vaccineDate, setVaccineDate] = useState(new Date());
  const [showVaccineDate, setshowVaccineDate] = useState(false);
  const [expireDate, setExpireDate] = useState(new Date());
  const [showExpireDate, setshowExpireDate] = useState(false);
  const [photo, setPhoto] = useState({});

  const dispatch = useDispatch();
  const formData = new FormData();

  const validationSchema = Yup.object().shape({
    vaccinationDate: Yup.string().required(ALERTS.blank),
    expireTime: Yup.string().required(ALERTS.blank),
    vaccinationType: Yup.string().required(ALERTS.blank),
    photoEvidence: Yup.string().required(ALERTS.image),
  });

  useEffect(() => {
    if (vaccine) {
      setShowLoadingModal(true);
      dispatch(getVaccinationDetailThunk(vaccineId))
        .unwrap()
        .then(res => {
          setVaccineDate(new Date(res.vaccinationDate));
          setExpireDate(new Date(res.expireTime));
          setShowLoadingModal(false);
        })
    }
  }, [route.params]);


  const pickImage = async setFieldValue => {
    try {
      const options = { mediaType: 'photo' };
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('Image picker error: ', response.error);
        } else {
          let imageUri = response.uri || response.assets?.[0]?.uri;
          let fileName = response.assets?.[0]?.fileName;
          let type = response.assets?.[0]?.type;
          setPhoto({
            uri: imageUri,
            name: fileName,
            type: type,
          });
          setFieldValue('photoEvidence', imageUri);
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    if (vaccine) {
      setShowLoadingModal(true);
      formData.append('Id', vaccineId);
      formData.append('VaccinationDate', new Date(vaccineDate).toUTCString());
      formData.append('ExpireTime', new Date(expireDate).toUTCString());
      formData.append('VaccinationType', values.vaccinationType);
      formData.append('NewPhotoEvidence', photo);

      dispatch(editVaccinationThunk(formData))
        .unwrap()
        .then(() => {
          dispatch(getVaccinationsFromPetThunk(id))
            .unwrap()
            .then((res) => {
              setShowLoadingModal(false);
              setShowSuccessModal(true);
              setTimeout(() => {
                setShowSuccessModal(false)
                navigation.navigate('PetDetail', { id: id, petDatas: petData, role: 'Staff', vaccine: true })
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
      formData.append('VaccinationDate', new Date(vaccineDate).toUTCString());
      formData.append('ExpireTime', new Date(expireDate).toUTCString());
      formData.append('VaccinationType', values.vaccinationType);
      formData.append('PhotoEvidence', photo);

      dispatch(createVaccinationThunk(formData))
        .unwrap()
        .then(() => {
          dispatch(getVaccinationsFromPetThunk(id))
            .unwrap()
            .then((res) => {
              setShowLoadingModal(false);
              setShowSuccessModal(true);
              setTimeout(() => {
                setShowSuccessModal(false)
                navigation.navigate('PetDetail', { id: id, petDatas: petData, role: 'Staff', vaccine: true })
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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const toggleVaccineDatePicker = () => {
    setshowVaccineDate(!showVaccineDate);
  };

  const handleVaccineDateChange = ({ type }, selectedDate, setFieldValue) => {
    if (type === 'set') {
      const currentDate = selectedDate;
      setVaccineDate(currentDate);
      toggleVaccineDatePicker();
      setFieldValue('vaccinationDate', formatDate(currentDate.toDateString()));
    } else {
      toggleVaccineDatePicker();
    }
  };

  const toggleExpireDatePicker = () => {
    setshowExpireDate(!showExpireDate);
  };

  const handleExpireDateChange = ({ type }, selectedDate, setFieldValue) => {
    if (type === 'set') {
      const currentDate = selectedDate;
      setExpireDate(currentDate);
      toggleExpireDatePicker();
      setFieldValue('expireTime', formatDate(currentDate.toDateString()));
    } else {
      toggleExpireDatePicker();
    }
  };

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
          <View style={styles.smallBox}>
            <Formik
              initialValues={{
                vaccinationDate: vaccine ? formatDate(vaccinationDetail.vaccinationDate) : '',
                expireTime: vaccine ? formatDate(vaccinationDetail.expireTime) : '',
                vaccinationType: vaccine ? vaccinationDetail.vaccinationType : '',
                photoEvidence: vaccine ? vaccinationDetail.photoEvidence : '',
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
                <View >
                  {/* vaccinationDate */}
                  <View style={[styles.flexRow]}>
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    {showVaccineDate && (
                      <DateTimePicker
                        value={vaccineDate}
                        maximumDate={new Date()}
                        mode="date"
                        display="spinner"
                        onChange={({ type }, selectedDate) =>
                          handleVaccineDateChange(
                            { type },
                            selectedDate,
                            setFieldValue,
                          )
                        }
                      />
                    )}
                    <TouchableOpacity onPress={toggleVaccineDatePicker}>

                      <TextInput
                        variant="outline"
                        placeholder="ngày/tháng/năm"
                        value={values.vaccinationDate}
                        onChangeText={handleChange('vaccinationDate')}
                        onBlur={handleBlur('vaccinationDate')}
                        size="lg"
                        editable={false}
                        style={{
                          borderWidth: 1,
                          borderColor: '#cdd1ce',
                          borderRadius: 4,
                          paddingLeft: 14,
                          color: 'black',
                          width: 288,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.vaccinationDate && errors.vaccinationDate ? (
                    <Text style={styles.validationError}>
                      {errors.vaccinationDate}
                    </Text>
                  ) : null}
                  {/* expireTime */}
                  <View style={[styles.flexRow, { marginTop: 15 }]}>
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    {showExpireDate && (
                      <DateTimePicker

                        value={expireDate}
                        minimumDate={vaccineDate}
                        mode="date"
                        display="spinner"
                        onChange={({ type }, selectedDate) =>
                          handleExpireDateChange(
                            { type },
                            selectedDate,
                            setFieldValue,
                          )
                        }
                      />
                    )}
                    <TouchableOpacity onPress={toggleExpireDatePicker}>
                      <TextInput
                        variant="outline"
                        placeholder="ngày/tháng/năm"
                        value={values.expireTime}
                        onChangeText={handleChange('expireTime')}
                        onBlur={handleBlur('expireTime')}
                        size="lg"
                        editable={false}
                        style={{
                          borderWidth: 1,
                          borderColor: '#cdd1ce',
                          borderRadius: 4,
                          width: 288,
                          paddingLeft: 14,
                          color: 'black',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.expireTime && errors.expireTime ? (
                    <Text style={styles.validationError}>
                      {errors.expireTime}
                    </Text>
                  ) : null}
                  {/* vaccinationType */}
                  <View style={[styles.flexRow, { width: '85%', marginTop: 13 }]}>
                    <MaterialCommunityIcons
                      name="pill"
                      size={24}
                      color={COLORS.primary}
                    />
                    <FormControl
                      isRequired={
                        touched.vaccinationType && errors.vaccinationType
                      }
                      isInvalid={
                        touched.vaccinationType && errors.vaccinationType
                      }>
                      <Select
                        placeholder="Loại Vắc-xin"
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        mt="1"
                        w='72'
                        onValueChange={value =>
                          setFieldValue('vaccinationType', value)
                        }
                        selectedValue={values.vaccinationType}>
                        <Select.Item label="Pavrovirus" value="Pavrovirus" />
                        <Select.Item label="Carre" value="Carre" />
                        <Select.Item label="Hepatitis" value="Hepatitis" />
                        <Select.Item
                          label="Leptospirosis"
                          value="Leptospirosis"
                        />
                        <Select.Item
                          label="Parainfluenza"
                          value="Parainfluenza"
                        />
                        <Select.Item
                          label="Rhinotracheitis"
                          value="Rhinotracheitis"
                        />
                        <Select.Item label="Calicivirus" value="Calicivirus" />
                        <Select.Item
                          label="Panleukopenia"
                          value="Panleukopenia"
                        />
                        <Select.Item label="Herpes" value="Herpes" />
                        <Select.Item label="Rabies" value="Rabies" />
                        <Select.Item label="Bordetella" value="Bordetella" />
                        <Select.Item label="Chlamydia" value="Chlamydia" />
                      </Select>
                      {touched.vaccinationType && errors.vaccinationType && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="md" />}>
                          <Text style={styles.validationError}>
                            Hãy chọn loại Vắc-xin
                          </Text>
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                  </View>
                  {/* photoEvidence */}
                  <View style={{}}>
                    <TouchableOpacity
                      style={[
                        styles.loginBtn,
                        {
                          backgroundColor: COLORS.primary,
                          marginBottom: 10,
                          width: 105,
                          alignItems: 'center',
                          flexDirection: 'row',
                          gap: 5,

                        },
                      ]}
                      onPress={() => pickImage(setFieldValue)}>
                      <Ionicons name='image' size={ICONS.s} color={COLORS.white} />
                      <Text style={{ color: 'white', fontWeight: '500' }}>Hình ảnh</Text>
                    </TouchableOpacity>
                    {values.photoEvidence ? (
                      <Center>
                        <Image
                          key={values.photoEvidence}
                          source={{ uri: values.photoEvidence }}
                          alt=""
                          size="xl"
                          style={{
                            width: '100%',
                            borderRadius: 10,
                            marginTop: 20,
                            marginBottom: 10,
                            height: SIZES.height / 5,
                          }}
                        />
                      </Center>
                    ) : null}
                  </View>
                  {touched.photoEvidence && errors.photoEvidence ? (
                    <Text style={styles.validationError}>
                      {errors.photoEvidence}
                    </Text>
                  ) : null}
                  <Center>
                    <TouchableOpacity
                      style={!dirty ? [BUTTONS.recFull, { alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: COLORS.gray1, }] : [BUTTONS.recFull, { alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: COLORS.primary }]}
                      onPress={handleSubmit}
                      disabled={!dirty}
                    >
                      <Text style={!dirty ? [TEXTS.content, { color: COLORS.black, fontWeight: '500' }] : [TEXTS.content, { color: COLORS.white, fontWeight: '500' }]}>
                        {vaccine ? 'Cập nhật' : 'Đăng'}
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
