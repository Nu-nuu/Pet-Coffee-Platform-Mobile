import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Center, Image, NativeBaseProvider} from 'native-base';
import {COLORS} from '../../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  momentDetailSelector,
  petDetailSelector,
} from '../../../../store/sellectors';
import {getMomentDetailThunk} from '../../../../store/apiThunk/momentThunk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getPetDetailThunk} from '../../../../store/apiThunk/petThunk';
import LottieView from 'lottie-react-native';

export default function MomentDetail({route, navigation}) {
  const momentId = route?.params?.momentId;
  const petId = route?.params?.petId;
  const dispatch = useDispatch();
  const momentDetail = useSelector(momentDetailSelector);
  const petDetail = useSelector(petDetailSelector);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  useEffect(() => {
    setShowLoadingModal(true);
    dispatch(getMomentDetailThunk(momentId));
    dispatch(getPetDetailThunk(petId)).then(() => {
      setShowLoadingModal(false);
    });
  }, [momentId]);

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const images =
    momentDetail.length !== 0 ? momentDetail?.image?.split(';') : [];

  return (
    <NativeBaseProvider>
      {!showLoadingModal ? (
        <View style={{padding: 20}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: 'black',
              padding: 7,
              borderRadius: 7,
              width: 40,
              marginBottom: 30,
            }}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View
            style={{backgroundColor: 'white', borderRadius: 20, padding: 20}}>
            <View style={styles.flexRow}>
              <Image
                source={{uri: petDetail.avatar}}
                alt=""
                style={{width: 70, height: 70, borderRadius: 50}}
              />
              <View style={styles.flexColumn}>
                <Text style={{fontSize: 20}}>
                  <Text style={{fontWeight: 'bold'}}>{petDetail.name}</Text>{' '}
                  Đang{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    {momentDetail.momentType}
                  </Text>
                </Text>
                <Text style={{color: 'gray', fontSize: 14}}>
                  {formatDate(momentDetail.createdAt)}
                </Text>
              </View>
            </View>
            <Text style={{marginTop: 30, fontSize: 18, marginBottom: 20}}>
              {momentDetail.content}
            </Text>
            <ScrollView horizontal style={{maxHeight: 300}}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{uri: image}}
                  style={{width: 200, height: 300, marginHorizontal: 5}}
                  alt=""
                />
              ))}
            </ScrollView>
          </View>
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
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  flexColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 5,
  },
});
