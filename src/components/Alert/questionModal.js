import {Modal, Text} from 'native-base';
import React from 'react';
import LottieView from 'lottie-react-native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function QuestionModal(props) {
  const navigation = useNavigation();
  return (
    <Modal
      isOpen={props.showQuestionModal}
      onClose={() => props.setShowQuestionModal(false)}
      style={{flex: 1}}>
      <Modal.Content style={{flex: 0.4}}>
        <Modal.CloseButton />
        <LottieView
          source={require('../../../assets/images/question.json')}
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
              color: 'orange',
            }}>
            Quit {props.questionMsg}?
          </Text>
        </Modal.Header>
        <Text style={{textAlign: 'center', paddingTop: 15, paddingBottom: 15}}>
          Changes you made so far will not be saved
        </Text>
        <Modal.Footer>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              padding: 10,
              borderRadius: 10,
              elevation: 5,
              marginRight: 15,
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text color={'white'} textAlign={'center'}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'gray',
              padding: 10,
              borderRadius: 10,
              elevation: 5,
            }}
            onPress={() => {
              props.setShowQuestionModal(false);
            }}>
            <Text color={'white'} textAlign={'center'}>
              Close
            </Text>
          </TouchableOpacity>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
