import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {Modal, Text} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';

export default function SuccessModal(props) {
  const navigation = useNavigation();
  const direction = props.direction;
  return (
    <Modal
      backdropVisible={false}
      isOpen={props.showSuccessModal}
      onClose={() => props.setShowSuccessModal(false)}
      style={{flex: 1}}>
      <Modal.Content style={{flex: 0.4}}>
        <LottieView
          source={require('../../../assets/images/success.json')}
          autoPlay
          loop={false}
          style={{flex: 1}}
        />
        <Modal.Header>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 20,
              color: 'green',
            }}>
            Thành công
          </Text>
        </Modal.Header>
        <Text style={{textAlign: 'center', paddingTop: 15, paddingBottom: 15}}>
          {props.successMsg}
        </Text>
        <Modal.Footer>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              padding: 10,
              borderRadius: 10,
              width: 50,
              elevation: 5,
            }}
            onPress={() => {
              if (props.isSendEmail || direction === 'petDetail') {
                props.setShowSuccessModal(false);
                return;
              } else {
                props.setShowSuccessModal(false);
                if (direction === 'forgotPassword') {
                  navigation.navigate('NewPassword', {
                    email: props.email,
                  });
                } else if (
                  direction === 'newPassword' ||
                  direction === 'infoSignup' ||
                  direction === 'changePassword'
                ) {
                  navigation.navigate('Login');
                  AsyncStorage.clear();
                } else if (direction === 'editProfile') {
                  navigation.navigate('Profile');
                } else if (
                  direction === 'createPet' ||
                  direction === 'createArea' ||
                  direction === 'editPet' ||
                  direction === 'editArea'
                ) {
                  navigation.navigate('Profile');
                } else if (direction === 'createShop') {
                  navigation.navigate('TabGroup');
                } else if (
                  direction === 'createVaccination' ||
                  direction === 'editVaccination' ||
                  direction === 'createMoment' ||
                  direction === 'editMoment'
                ) {
                  navigation.navigate('PetDetail', {
                    id: props.petId,
                    direction: 'myShop',
                  });
                } else if (direction === 'joinEvent') {
                  navigation.navigate('ShopDetail', {id: props.shopId});
                } else if (direction === 'changePetArea') {
                  navigation.goBack()
                } 
              }
            }}>
            <Text color={'white'} textAlign={'center'}>
              OK
            </Text>
          </TouchableOpacity>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
