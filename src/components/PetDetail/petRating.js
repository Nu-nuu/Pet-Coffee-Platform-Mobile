import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Divider, Image, Input, Modal, NativeBaseProvider } from 'native-base';
import { AVATARS, BRS, COLORS, ICONS, PETS, SHADOWS, SIZES, TEXTS } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { petDetailSelector, ratingsFromPetSelector, userDataSelector } from '../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRatingsFromPetThunk,
  ratePetThunk,
} from '../../store/apiThunk/ratePetThunk';
import LottieView from 'lottie-react-native';
import SkeletonArea from '../Alert/skeletonArea';
import RatingCard from './ratingCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPetDetailThunk } from '../../store/apiThunk/petThunk';

export default function PetRating(props) {

  const CustomRatingBar = () => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.s / 2,
        paddingLeft: SIZES.s,
      }}>
        {maxRate.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{}}
              key={item}
              onPress={() => setDefaultRate(item)}>
              <AntDesign
                name={item <= defaultRate ? 'star' : 'staro'}
                color={COLORS.yellow}
                size={SIZES.l}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const dispatch = useDispatch();
  const ratings = useSelector(ratingsFromPetSelector);
  const thisPet = useSelector(petDetailSelector);
  const userData = useSelector(userDataSelector);
  const shop = userData.role === 'Staff' ? true : false

  const [render, setRender] = useState(false)
  const [petData, setPetData] = useState(props.petData)
  const [defaultRate, setDefaultRate] = useState(0);
  const maxRate = [1, 2, 3, 4, 5];
  const [comment, setComment] = useState('');
  const placeHolder = `${userData.fullName}` + ', bạn nghĩ gì về ' + `${petData.name}`
  const renderRatingBars = () => {
    return [5, 4, 3, 2, 1].map((rate, index) => {
      const count = ratings.filter(item => item.rate === rate).length;
      const width = count > 0 ? count / ratings.length : 0;
      return (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text>{rate}</Text>
          <View style={{ position: 'relative' }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: 5,
                backgroundColor: COLORS.gray1,
                width: SIZES.width / 2,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                height: 5,
                backgroundColor: COLORS.yellow,
                width: (SIZES.width / 2) * width,
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      );
    });
  };

  const handleRate = () => {
    const rateData = {
      petId: petData.id,
      rate: defaultRate,
      comment: comment,
    };
    dispatch(ratePetThunk(rateData))
      .unwrap()
      .then(() => {
        setDefaultRate(0)
        setComment('')
        setRender(true);
        dispatch(getPetDetailThunk(petData.id))
          .unwrap()
          .then(() => {
            setPetData(thisPet)
          })
        dispatch(getRatingsFromPetThunk(petData.id))
          .unwrap()
          .then(() => {
            setRender(false);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  };

  useEffect(() => {
    if (ratings == [] || ratings[0]?.petId != petData.id) {
      setRender(true);
      dispatch(getRatingsFromPetThunk(petData.id))
        .unwrap()
        .then(() => {
          setRender(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <View style={{
      backgroundColor: COLORS.bgr,
      padding: SIZES.m,
      minHeight: SIZES.height / 2,
    }}>
      <View style={{
        paddingBottom: SIZES.m,
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Đánh giá về {petData.name}</Text>
      </View>
      {/* ======================tổng quan đánh giá==================== */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: SIZES.m,
        paddingBottom: SIZES.s,
        gap: SIZES.width / 9,
      }}>
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: SIZES.s / 2,
        }}>
          <Text style={TEXTS.titleMax}>{petData.rate.toFixed(1)}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SIZES.s / 2,
          }}>
            {maxRate.map(item => {
              return (
                <View activeOpacity={0.7} key={item}                                         >
                  <AntDesign
                    name={item <= petData.rate ? 'star' : 'staro'}
                    color={COLORS.yellow}
                    size={SIZES.xm}
                  />
                </View>
              );
            })}
          </View>
          <Text style={TEXTS.subContent}>{ratings.length} đánh giá</Text>
        </View>
        <View>
          {renderRatingBars()}
        </View>
      </View>
      {/* ======================viết bài đánh giá==================== */}
      {shop ? (
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black, paddingTop: SIZES.s, }}>Danh sách những người đánh giá</Text>
        </View>
      ) : (
        <View style={[styles.headerContainer, SHADOWS.s]}>
          <View style={styles.postTop}>
            <View style={styles.row}>
              <Image
                source={{ uri: userData.avatar }}
                alt=""
                style={[AVATARS.mid, { alignSelf: 'flex-start' }]}
              />
              <View style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: SIZES.width - SIZES.m * 8
              }}>
                <TextInput
                  multiline
                  value={comment}
                  onChangeText={(text) => setComment(text)}
                  placeholder={placeHolder}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: COLORS.gray1,
                    paddingBottom: SIZES.s / 2,
                    paddingLeft: SIZES.s,
                  }}
                />
                <View style={{
                  flexDirection: 'row',
                  paddingLeft: SIZES.s,
                  marginTop: SIZES.s / 2
                }}>
                  <Text style={TEXTS.subContent}>Đánh giá</Text>
                  <CustomRatingBar />
                </View>
              </View>
            </View>
            <Pressable
              disabled={!defaultRate}
              onPress={handleRate}
              style={{ alignSelf: 'flex-end' }} >
              <Ionicons name="send" size={ICONS.xm} color={!defaultRate ? COLORS.gray2 : COLORS.primary} />
            </Pressable>
          </View>
        </View >
      )
      }

      {/* ======================những đánh giá==================== */}
      {
        render ? (
          <SkeletonArea />
        ) :
          (
            <View style={{ marginTop: SIZES.m }}>
              {ratings?.length > 0 ? (
                <>
                  {ratings.map((ratings, index) => (
                    <Pressable key={index} style={{ paddingBottom: SIZES.s }}>
                      <RatingCard ratingData={ratings} petData={petData} />
                    </Pressable>
                  ))}
                </>
              ) : (
                <View style={{
                  alignItems: 'center', justifyContent: 'center',
                  padding: SIZES.m
                }}>
                  <Text style={TEXTS.content} >{PETS.noRate}</Text>
                  <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                    height: SIZES.height / 6,
                    width: SIZES.height / 6,
                    alignSelf: 'center',
                  }} />
                </View>
              )}
            </View>
          )
      }
    </View >
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    width: SIZES.width - SIZES.m * 2,
    backgroundColor: COLORS.white,
    borderRadius: BRS.out,
    padding: SIZES.m,
  },
  postTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageProfile: {
    height: 40,
    width: 40,
    borderRadius: 50,
    alignSelf: 'flex-start'
  },
  content: {
    paddingLeft: SIZES.s,
  },
  iconHeader: {
    marginRight: SIZES.s,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  box: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: 180,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 30,
  },
  name: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  flexDirectionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 10,
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  flexRowEvenly: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flexBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexDirectionColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 5,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 8,
    backgroundColor: 'black',
    borderRadius: 15,
  },
  age: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ageText: {
    fontSize: 13,
    color: '#AEAEAE',
  },
  btn: {
    backgroundColor: 'white',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    marginBottom: 20,
  },
  rate: {
    backgroundColor: 'white',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 20,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  customRatingBar: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
});
