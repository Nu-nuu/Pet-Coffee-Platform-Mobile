import { Modal } from 'native-base';
import React from 'react';
import LottieView from 'lottie-react-native';
import { SIZES } from '../../constants';

export default function LoadingModal(props) {
  return (
    <Modal
      isOpen={props.showLoadingModal}
      style={{ flex: 1 }}>
      <Modal.Content style={{ flex: 1, width: SIZES.height / 12 }}>
        <LottieView
          source={require('../../../assets/images/loading.json')}
          autoPlay
          style={{ flex: 1 }}
        />
      </Modal.Content>
    </Modal>
  );
}
