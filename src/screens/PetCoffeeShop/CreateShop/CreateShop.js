import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import React, {useState} from 'react';
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
} from 'native-base';
import {COLORS} from '../../../constants';
import * as ImagePicker from 'react-native-image-picker';
import ErrorModal from '../../../components/Alert/errorModal';
import SuccessModal from '../../../components/Alert/successModal';
import LoadingModal from '../../../components/Alert/loadingModal';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {createPetCoffeeShopThunk} from '../../../store/apiThunk/petCoffeeShopThunk';
import Geolocation from '@react-native-community/geolocation';
import {getUserDataThunk} from '../../../store/apiThunk/userThunk';

export default function CreateShop({navigation}) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [background, setBackground] = useState({});

  const dispatch = useDispatch();
  const formData = new FormData();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name cannot be blank'),
    email: Yup.string()
      .required('Email cannot be blank')
      .email('Please enter valid email'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone number can only contain numeric digits')
      .required('Phone number cannot be blank')
      .min(10, 'Phone number must be 10 digits')
      .max(10, 'Phone number must be 10 digits'),
    location: Yup.string().required('Location cannot be blank'),
    taxCode: Yup.string()
      .matches(/^[0-9]+$/, 'Phone number can only contain numeric digits')
      .required('TaxCode cannot be blank')
      .min(10, 'TaxCode must be 10 digits')
      .max(10, 'TaxCode must be 10 digits'),
    avatar: Yup.string().required('Please choose avatar'),
    background: Yup.string().required('Please choose background'),
    shopType: Yup.string().required('Shop type cannot be blank'),
    fbUrl: Yup.string(),
    instagramUrl: Yup.string(),
    websiteUrl: Yup.string(),
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
          type === 'avatar'
            ? setAvatar({
                uri: imageUri,
                name: fileName,
                type: fileType,
              })
            : setBackground({
                uri: imageUri,
                name: fileName,
                type: fileType,
              });
          setFieldValue(type === 'avatar' ? 'avatar' : 'background', imageUri);
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleFormikSubmit = values => {
    setShowLoadingModal(true);
    Geolocation.getCurrentPosition(
      position => {
        let longitude = JSON.stringify(position.coords.longitude);
        let latitude = JSON.stringify(position.coords.latitude);
        formData.append('Latitude', latitude);
        formData.append('Longitude', longitude);
      },
      error => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
    formData.append('Name', values.name);
    formData.append('Email', values.email);
    formData.append('ShopType', values.shopType);
    formData.append('Phone', values.phone?.trim());
    formData.append('TaxCode', values.taxCode?.trim());
    formData.append('Location', values.location);
    formData.append('FbUrl', values.fbUrl);
    formData.append('InstagramUrl', values.instagramUrl);
    formData.append('WebUrl', values.websiteUrl);
    formData.append('Avatar', avatar);
    formData.append('Background', background);

    dispatch(createPetCoffeeShopThunk(formData))
      .unwrap()
      .then(() => {
        dispatch(getUserDataThunk());
        setShowLoadingModal(false);
        setSuccessMsg('Create Successfully');
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
      <View style={{padding: 30}}>
        <ScrollView>
          <TouchableOpacity
            onPress={() => navigation.navigate('TabGroup')}
            style={{
              backgroundColor: 'black',
              width: 40,
              padding: 7,
              borderRadius: 7,
              marginBottom: 20,
            }}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Center>
            <Heading style={styles.heading}>Become A Shop Manager</Heading>
            <Text style={styles.desc}>Enter shop informations</Text>
          </Center>
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
            direction={'createShop'}
          />
          <View style={styles.smallBox}>
            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                location: '',
                avatar: '',
                background: '',
                shopType: '',
                taxCode: '',
                fbUrl: '',
                instagramUrl: '',
                websiteUrl: '',
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
                  {/* name */}
                  <View style={[styles.flexRow, {width: '88%'}]}>
                    <Ionicons
                      name="person-circle-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Input
                      variant="outline"
                      placeholder="Name"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      autoCapitalize="words"
                      size="lg"
                    />
                  </View>
                  {touched.name && errors.name ? (
                    <Text style={styles.validationError}>{errors.name}</Text>
                  ) : null}
                  {/* email */}
                  <View style={[styles.flexRow, {width: '88%', marginTop: 7}]}>
                    <Ionicons
                      name="mail-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Input
                      variant="outline"
                      placeholder="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      autoCapitalize="words"
                      keyboardType="email-address"
                      size="lg"
                    />
                  </View>
                  {touched.email && errors.email ? (
                    <Text style={styles.validationError}>{errors.email}</Text>
                  ) : null}
                  {/* phone */}
                  <View style={[styles.flexRow, {width: '88%', marginTop: 7}]}>
                    <AntDesign name="phone" size={24} color={COLORS.primary} />
                    <Input
                      variant="outline"
                      placeholder="Phone Number"
                      value={values.phone}
                      onChangeText={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      keyboardType="number-pad"
                      size="lg"
                    />
                  </View>
                  {touched.phone && errors.phone ? (
                    <Text style={styles.validationError}>{errors.phone}</Text>
                  ) : null}
                  {/* location */}
                  <View style={[styles.flexRow, {width: '88%', marginTop: 7}]}>
                    <Ionicons
                      name="location-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Input
                      variant="outline"
                      placeholder="Address"
                      value={values.location}
                      onChangeText={handleChange('location')}
                      onBlur={handleBlur('location')}
                      size="lg"
                    />
                  </View>
                  {touched.location && errors.location ? (
                    <Text style={styles.validationError}>
                      {errors.location}
                    </Text>
                  ) : null}
                  {/* taxCode */}
                  <View style={[styles.flexRow, {width: '88%', marginTop: 7}]}>
                    <Ionicons
                      name="location-outline"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Input
                      variant="outline"
                      placeholder="TaxCode"
                      value={values.taxCode}
                      onChangeText={handleChange('taxCode')}
                      onBlur={handleBlur('taxCode')}
                      size="lg"
                      keyboardType="number-pad"
                    />
                  </View>
                  {touched.taxCode && errors.taxCode ? (
                    <Text style={styles.validationError}>{errors.taxCode}</Text>
                  ) : null}
                  {/* shopType */}
                  <View style={[styles.flexRow, {width: '88%', marginTop: 7}]}>
                    <MaterialIcons
                      name="pets"
                      size={24}
                      color={COLORS.primary}
                    />
                    <FormControl
                      isRequired={touched.shopType && errors.shopType}
                      isInvalid={touched.shopType && errors.shopType}>
                      <Select
                        placeholder="Choose Shop Type"
                        _selectedItem={{
                          endIcon: <CheckIcon size={5} />,
                        }}
                        mt="1"
                        onValueChange={value =>
                          setFieldValue('shopType', value)
                        }
                        selectedValue={values.shopType}>
                        <Select.Item label="Cat" value="cat" />
                        <Select.Item label="Dog" value="dog" />
                        <Select.Item label="Cat And Dog" value="CatAndDog" />
                      </Select>
                      {touched.shopType && errors.shopType && (
                        <FormControl.ErrorMessage
                          leftIcon={<WarningOutlineIcon size="md" />}>
                          <Text style={styles.validationError}>
                            Please make a selection!
                          </Text>
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                  </View>
                  {/* Avatar */}
                  <View style={[styles.flexRow, {marginTop: 15}]}>
                    <TouchableOpacity
                      style={[
                        styles.loginBtn,
                        {
                          backgroundColor: COLORS.primary,
                          marginTop: 0,
                          marginRight: 30,
                        },
                      ]}
                      onPress={() => pickImage(setFieldValue, 'avatar')}>
                      <Text style={{color: 'white'}}>Upload Avatar</Text>
                    </TouchableOpacity>
                    {values.avatar ? (
                      <Image
                        key={values.avatar}
                        source={{uri: values.avatar}}
                        alt=""
                        size="xl"
                        style={{borderRadius: 100}}
                      />
                    ) : null}
                  </View>
                  {touched.avatar && errors.avatar ? (
                    <Text style={styles.validationError}>{errors.avatar}</Text>
                  ) : null}
                  {/* Background */}
                  <View style={[{marginTop: 15}]}>
                    <TouchableOpacity
                      style={[
                        styles.loginBtn,
                        {
                          backgroundColor: COLORS.primary,
                          marginTop: 0,
                          width: 145,
                          marginBottom: 15,
                        },
                      ]}
                      onPress={() => pickImage(setFieldValue, 'background')}>
                      <Text style={{color: 'white'}}>Upload Background</Text>
                    </TouchableOpacity>
                    {values.background ? (
                      <Center>
                        <Image
                          key={values.background}
                          source={{uri: values.background}}
                          alt=""
                          size="xl"
                          style={{width: 250, borderRadius: 10}}
                        />
                      </Center>
                    ) : null}
                  </View>
                  {touched.background && errors.background ? (
                    <Text style={styles.validationError}>
                      {errors.background}
                    </Text>
                  ) : null}
                  {/* fbUrl */}
                  <View style={[styles.flexRow, {width: '88%', marginTop: 15}]}>
                    <Ionicons
                      name="logo-facebook"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Input
                      variant="outline"
                      placeholder="Facebook Url"
                      value={values.fbUrl}
                      onChangeText={handleChange('fbUrl')}
                      onBlur={handleBlur('fbUrl')}
                      size="lg"
                    />
                  </View>
                  {/* instagramUrl */}
                  <View style={[styles.flexRow, {width: '88%', marginTop: 7}]}>
                    <Ionicons
                      name="logo-instagram"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Input
                      variant="outline"
                      placeholder="Instagram Url"
                      value={values.instagramUrl}
                      onChangeText={handleChange('instagramUrl')}
                      onBlur={handleBlur('instagramUrl')}
                      size="lg"
                    />
                  </View>
                  {/* websiteUrl */}
                  <View style={[styles.flexRow, {width: '88%', marginTop: 7}]}>
                    <MaterialCommunityIcons
                      name="web"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Input
                      variant="outline"
                      placeholder="Website Url"
                      value={values.websiteUrl}
                      onChangeText={handleChange('websiteUrl')}
                      onBlur={handleBlur('websiteUrl')}
                      size="lg"
                    />
                  </View>
                  <Center>
                    <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                      <Text style={{fontSize: 18, color: COLORS.primary}}>
                        Create
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
  heading: {color: COLORS.primary, fontSize: 20},
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
  number: {fontSize: 19, fontWeight: 'bold', color: 'black'},
  text: {color: 'gray', fontSize: 17},
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
