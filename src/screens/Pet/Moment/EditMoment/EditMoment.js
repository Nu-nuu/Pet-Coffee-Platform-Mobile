import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
  Input,
} from 'native-base';
import {COLORS} from '../../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../../components/Alert/errorModal';
import SuccessModal from '../../../../components/Alert/successModal';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {momentDetailSelector} from '../../../../store/sellectors';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  editMomentThunk,
  getMomentDetailThunk,
  getMomentsFromPetThunk,
} from '../../../../store/apiThunk/momentThunk';
import LottieView from 'lottie-react-native';
import QuestionModal from '../../../../components/Alert/questionModal';

export default function EditMoment({route, navigation}) {
  const momentId = route?.params?.momentId;
  const petId = route?.params?.petId;
  const dispatch = useDispatch();
  const momentDetail = useSelector(momentDetailSelector);
  const formData = new FormData();
  const momentImages = momentDetail?.image?.split(';');

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [questionMsg, setQuestionMsg] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showRender, setShowRender] = useState(false);

  useEffect(() => {
    setShowRender(true);
    dispatch(getMomentDetailThunk(momentId))
      .unwrap()
      .then(() => {
        setShowRender(false);
      });
  }, [momentId]);

  const validationSchema = Yup.object().shape({
    content: Yup.string().required('Content cannot be blank'),
    momentType: Yup.string().required('Moment type cannot be blank'),
    images: Yup.array().min(1, 'Please choose photo'),
  });

  const pickImage = async setFieldValue => {
    try {
      const options = {mediaType: 'photo', selectionLimit: 10};
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
          let existingImageIndex = formData._parts.findIndex(
            ([name]) => name === 'Images',
          );
          imagesArray.forEach(image => {
            if (existingImageIndex !== -1) {
              formData._parts.splice(existingImageIndex, 1, [
                'NewImages',
                image,
              ]);
            } else {
              formData.append('NewImages', image);
            }
          });
          setFieldValue('images', imageUris);
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    setShowLoadingModal(true);
    formData.append('Id', momentId);
    formData.append('Content', values.content);
    formData.append('MomentType', values.momentType);

    dispatch(editMomentThunk(formData))
      .unwrap()
      .then(() => {
        dispatch(getMomentsFromPetThunk(petId));
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

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <ScrollView>
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
            <Heading style={styles.heading}>Update Moment Detail</Heading>
            <Text style={styles.desc}>Enter new moment informations</Text>
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
            direction={'editMoment'}
            petId={petId}
          />
          {!showRender ? (
            <View style={styles.smallBox}>
              <Formik
                initialValues={{
                  content: momentDetail.content,
                  momentType: momentDetail.momentType,
                  images: momentImages,
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
                    {/* content */}
                    <View style={[styles.flexRow, {width: '85%'}]}>
                      <Ionicons
                        name="file-tray-full"
                        size={24}
                        color={COLORS.primary}
                      />
                      <Input
                        variant="outline"
                        placeholder="Content"
                        value={values.content}
                        onChangeText={handleChange('content')}
                        onBlur={handleBlur('content')}
                        autoCapitalize="words"
                        size="lg"
                        multiline={true}
                      />
                    </View>
                    {touched.content && errors.content ? (
                      <Text style={styles.validationError}>
                        {errors.content}
                      </Text>
                    ) : null}
                    {/* momentType */}
                    <View
                      style={[styles.flexRow, {width: '85%', marginTop: 15}]}>
                      <Ionicons
                        name="file-tray-full"
                        size={24}
                        color={COLORS.primary}
                      />
                      <FormControl
                        isRequired={touched.momentType && errors.momentType}
                        isInvalid={touched.momentType && errors.momentType}>
                        <Select
                          placeholder="Choose moment type"
                          _selectedItem={{
                            endIcon: <CheckIcon size={5} />,
                          }}
                          mt="1"
                          onValueChange={value =>
                            setFieldValue('momentType', value)
                          }
                          selectedValue={values.momentType}>
                          <Select.Item label="Playing" value="Playing" />
                          <Select.Item label="Eating" value="Eating" />
                          <Select.Item label="Walking" value="Walking" />
                        </Select>
                        {touched.momentType && errors.momentType && (
                          <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="md" />}>
                            <Text style={styles.validationError}>
                              Please make a selection!
                            </Text>
                          </FormControl.ErrorMessage>
                        )}
                      </FormControl>
                    </View>
                    {/* images */}
                    <View style={{marginTop: 15}}>
                      <TouchableOpacity
                        style={[
                          styles.loginBtn,
                          {
                            backgroundColor: COLORS.primary,
                            marginTop: 0,
                            width: 105,
                            marginBottom: 10,
                          },
                        ]}
                        onPress={() => pickImage(setFieldValue)}>
                        <Text style={{color: 'white'}}>Upload Photo</Text>
                      </TouchableOpacity>
                      {values.images?.length !== 0 ? (
                        <Center>
                          {values.images?.map(uri => {
                            return (
                              <Image
                                key={uri}
                                source={{uri: uri}}
                                alt=""
                                size="xl"
                                style={{
                                  width: '100%',
                                  height: 150,
                                  borderRadius: 10,
                                  marginTop: 10,
                                  marginBottom: 10,
                                }}
                              />
                            );
                          })}
                        </Center>
                      ) : null}
                    </View>
                    {touched.images && errors.images ? (
                      <Text style={styles.validationError}>
                        {errors.images}
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
    paddingTop: 20,
    paddingBottom: 20,
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
  btn: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 90,
    padding: 10,
    marginTop: 20,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
});
