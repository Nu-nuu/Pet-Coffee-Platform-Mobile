import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {COLORS} from '../../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../../components/Alert/errorModal';
import SuccessModal from '../../../../components/Alert/successModal';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {vaccinationDetailSelector} from '../../../../store/sellectors';
import {useDispatch, useSelector} from 'react-redux';
import {
  getVaccinationDetailThunk,
  editVaccinationThunk,
  getVaccinationsFromPetThunk,
} from '../../../../store/apiThunk/vaccinationThunk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../../components/Alert/questionModal';

export default function EditVaccination({route, navigation}) {
  const vaccineId = route?.params?.vaccineId;
  const petId = route?.params?.petId;
  const dispatch = useDispatch();
  const vaccinationDetail = useSelector(vaccinationDetailSelector);
  const formData = new FormData();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [questionMsg, setQuestionMsg] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [vaccineDate, setVaccineDate] = useState(new Date());
  const [showVaccineDate, setshowVaccineDate] = useState(false);
  const [expireDate, setExpireDate] = useState(new Date());
  const [showExpireDate, setshowExpireDate] = useState(false);
  const [showRender, setShowRender] = useState(false);

  useEffect(() => {
    setShowRender(true);
    dispatch(getVaccinationDetailThunk(vaccineId))
      .unwrap()
      .then(res => {
        setVaccineDate(new Date(res.vaccinationDate));
        setExpireDate(new Date(res.expireTime));
        setShowRender(false);
      });
  }, [vaccineId]);

  const validationSchema = Yup.object().shape({
    vaccinationDate: Yup.string().required('Vaccination date cannot be blank'),
    expireTime: Yup.string().required('Expire time cannot be blank'),
    vaccinationType: Yup.string().required('Vaccination type cannot be blank'),
    photoEvidence: Yup.string().required('Please choose photo'),
  });

  const pickImage = async setFieldValue => {
    try {
      const options = {mediaType: 'photo'};
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('Image picker error: ', response.error);
        } else {
          let imageUri = response.uri || response.assets?.[0]?.uri;
          let fileName = response.assets?.[0]?.fileName;
          let type = response.assets?.[0]?.type;
          let existingImageIndex = formData._parts.findIndex(
            ([name]) => name === 'NewPhotoEvidence',
          );
          if (existingImageIndex !== -1) {
            formData._parts.splice(existingImageIndex, 1, [
              'NewPhotoEvidence',
              {
                uri: imageUri,
                name: fileName,
                type: type,
              },
            ]);
          } else {
            formData.append('NewPhotoEvidence', {
              uri: imageUri,
              name: fileName,
              type: type,
            });
          }
          setFieldValue('photoEvidence', imageUri);
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    setShowLoadingModal(true);
    formData.append('Id', vaccineId);
    formData.append('VaccinationDate', new Date(vaccineDate).toUTCString());
    formData.append('ExpireTime', new Date(expireDate).toUTCString());
    formData.append('VaccinationType', values.vaccinationType);
    dispatch(editVaccinationThunk(formData))
      .unwrap()
      .then(() => {
        dispatch(getVaccinationsFromPetThunk(petId));
        setShowLoadingModal(false);
        setSuccessMsg('Update Successfully');
        setShowSuccessModal(true);
      })
      .catch(error => {
        setShowLoadingModal(false);
        setErrorMsg(error.message);
        setShowErrorModal(true);
      });
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

  const handleVaccineDateChange = ({type}, selectedDate, setFieldValue) => {
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

  const handleExpireDateChange = ({type}, selectedDate, setFieldValue) => {
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
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setQuestionMsg('updating');
            setShowQuestionModal(true);
          }}
          style={{
            backgroundColor: 'black',
            width: 40,
            padding: 7,
            borderRadius: 7,
            marginBottom: 40,
          }}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Center>
          <Heading style={styles.heading}>Update Vaccine Detail</Heading>
          <Text style={styles.desc}>Enter new vaccine informations</Text>
        </Center>
        <QuestionModal
          showQuestionModal={showQuestionModal}
          setShowQuestionModal={setShowQuestionModal}
          questionMsg={questionMsg}
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
          direction={'editVaccination'}
          petId={petId}
        />
        {!showRender ? (
          <View style={styles.smallBox}>
            <Formik
              initialValues={{
                vaccinationDate: formatDate(vaccinationDetail.vaccinationDate),
                expireTime: formatDate(vaccinationDetail.expireTime),
                vaccinationType: vaccinationDetail.vaccinationType,
                photoEvidence: vaccinationDetail.photoEvidence,
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
                        onChange={({type}, selectedDate) =>
                          handleVaccineDateChange(
                            {type},
                            selectedDate,
                            setFieldValue,
                          )
                        }
                      />
                    )}
                    <TouchableOpacity onPress={toggleVaccineDatePicker}>
                      <TextInput
                        variant="outline"
                        placeholder="08/01/2002"
                        value={values.vaccinationDate}
                        onChangeText={handleChange('vaccinationDate')}
                        onBlur={handleBlur('vaccinationDate')}
                        size="lg"
                        editable={false}
                        style={{
                          borderWidth: 1,
                          borderColor: '#cdd1ce',
                          borderRadius: 4,
                          width: 280,
                          paddingLeft: 14,
                          color: 'black',
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
                  <View style={[styles.flexRow, {marginTop: 15}]}>
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
                        onChange={({type}, selectedDate) =>
                          handleExpireDateChange(
                            {type},
                            selectedDate,
                            setFieldValue,
                          )
                        }
                      />
                    )}
                    <TouchableOpacity onPress={toggleExpireDatePicker}>
                      <TextInput
                        variant="outline"
                        placeholder="08/01/2002"
                        value={values.expireTime}
                        onChangeText={handleChange('expireTime')}
                        onBlur={handleBlur('expireTime')}
                        size="lg"
                        editable={false}
                        style={{
                          borderWidth: 1,
                          borderColor: '#cdd1ce',
                          borderRadius: 4,
                          width: 280,
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
                  <View style={[styles.flexRow, {width: '85%', marginTop: 13}]}>
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
                        placeholder="Choose pet type"
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        mt="1"
                        onValueChange={value =>
                          setFieldValue('vaccinationType', value)
                        }
                        selectedValue={values.vaccinationType}>
                        <Select.Item label="Parvovirus" value="Parvovirus" />
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
                            Please make a selection!
                          </Text>
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                  </View>
                  {/* photoEvidence */}
                  <View style={{marginTop: 15}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.primary,
                        width: 100,
                        padding: 7,
                        borderRadius: 7,
                      }}
                      onPress={() => pickImage(setFieldValue)}>
                      <Text style={{color: 'white'}}>Upload Photo</Text>
                    </TouchableOpacity>
                    {values.photoEvidence ? (
                      <Center>
                        <Image
                          key={values.photoEvidence}
                          source={{uri: values.photoEvidence}}
                          alt=""
                          size="xl"
                          style={{
                            width: '100%',
                            borderRadius: 10,
                            marginTop: 20,
                            marginBottom: 10,
                            height: 150,
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
                    {!showLoadingModal ? (
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles.btn}>
                        <Text style={{fontSize: 18, color: COLORS.primary}}>
                          Confirm
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <LottieView
                        source={require('../../../../../assets/images/loading.json')}
                        autoPlay
                        style={{width: 100, height: 100}}
                      />
                    )}
                  </Center>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <Center style={{marginTop: 30}}>
            <LottieView
              source={require('../../../../../assets/images/loading.json')}
              autoPlay
              style={{width: 100, height: 100}}
            />
          </Center>
        )}
      </View>
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    paddingTop: 20,
    paddingBottom: 0,
  },
  heading: {color: COLORS.primary, fontSize: 20},
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
  number: {fontSize: 19, fontWeight: 'bold', color: 'black'},
  text: {color: 'gray', fontSize: 17},
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
});
