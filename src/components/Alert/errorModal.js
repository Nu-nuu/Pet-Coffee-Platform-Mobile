import { Modal, Text} from 'native-base';
import React from 'react';
import LottieView from 'lottie-react-native';
import {TouchableOpacity} from 'react-native';

export default function ErrorModal(props) {
  return (
    <Modal
      isOpen={props.showErrorModal}
      onClose={() => props.setShowErrorModal(false)}
      style={{flex: 1}}>
      <Modal.Content style={{flex: 0.4}}>
        <Modal.CloseButton />
        <LottieView
          source={require('../../../assets/images/error.json')}
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
              color: 'red',
            }}>
            Lỗi rồi !!!
          </Text>
        </Modal.Header>
        <Text style={{textAlign: 'center', paddingTop: 15, paddingBottom: 15}}>
          {props.errorMsg}
        </Text>
        <Modal.Footer>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              padding: 10,
              borderRadius: 10,
              width: 50,
              elevation: 5,
            }}
            onPress={() => {
              props.setShowErrorModal(false);
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
