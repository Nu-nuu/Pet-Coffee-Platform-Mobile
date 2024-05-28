import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BRS, BUTTONS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import CafeListComponent from '../../../components/CafeList/CafeListComponent';
import { useDispatch } from 'react-redux';
import {
  getAllPetCoffeeShopsThunk,
  getAllPopularShopsDistanceThunk,
  getAllShopsDistanceThunk,
  getRandomPetCoffeeShopsThunk,
} from '../../../store/apiThunk/petCoffeeShopThunk';
import { Center, NativeBaseProvider } from 'native-base';
import SearchBar from '../../../components/SearchBar/searchBar';
import Geolocation from '@react-native-community/geolocation';
import {
  getAllFollowShopsDistanceThunk,
} from '../../../store/apiThunk/followShopThunk';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const CafeList = ({route, navigation}) => {
//   const {type, shops, defaultString} = route.params;
//   const dispatch = useDispatch();

//   const [types, setTypes] = useState([]);
//   const [initialData, setInitialData] = useState([]);
//   const [initialShopsData, setInitialShopsData] = useState([]);
//   const [data, setData] = useState([]);
//   const [shopsData, setShopsData] = useState([]);
//   const [petType, setPetType] = useState('');
//   const [title, setTitle] = useState('');
//   const [showSearch, setShowSearch] = useState(false);
//   const [showLoadingModal, setShowLoadingModal] = useState(false);

//   const marginTopValue = type === 'random' ? 0 : 60;
//   const heightValue = type === 'random' || !type ? 700 : 650;

//   useEffect(() => {
//     setShowLoadingModal(true);
//     dispatch(getAllPetCoffeeShopsThunk())
//       .unwrap()
//       .then(res => {
//         setShowSearch(true);
//         const uniqueTypes = [...new Set(res.map(item => item.type))];
//         setTypes(uniqueTypes);
//         setShowLoadingModal(false);
//       });
//   }, []);

//   useEffect(() => {
//     setShowLoadingModal(true);
//     if (!shops) {
//       Geolocation.getCurrentPosition(
//         position => {
//           let longitude = JSON.stringify(position.coords.longitude);
//           let latitude = JSON.stringify(position.coords.latitude);
//           switch (type) {
//             case 'nearby':
//               dispatch(
//                 getAllShopsDistanceThunk({
//                   latitude: latitude,
//                   longitude: longitude,
//                 }),
//               )
//                 .unwrap()
//                 .then(res => {
//                   setInitialData(res);
//                   setData(res);
//                   setTitle('Gần Bạn');
//                   setShowLoadingModal(false);
//                 })
//                 .catch(err => console.log(err));
//               break;
//             case 'mostPopular':
//               dispatch(
//                 getAllPopularShopsDistanceThunk({
//                   latitude: latitude,
//                   longitude: longitude,
//                 }),
//               )
//                 .unwrap()
//                 .then(res => {
//                   setInitialData(res);
//                   setData(res);
//                   setTitle('Phổ Biến Nhất');
//                   setShowLoadingModal(false);
//                 })
//                 .catch(err => console.log(err));
//               break;
//             case 'random':
//               dispatch(
//                 getRandomPetCoffeeShopsThunk({
//                   longitude: longitude,
//                   latitude: latitude,
//                   size: 10,
//                   type: '',
//                 }),
//               )
//                 .unwrap()
//                 .then(res => {
//                   setInitialData(res);
//                   setData(res);
//                   setTitle('Quán Nào Hôm Nay');
//                   setShowLoadingModal(false);
//                 })
//                 .catch(err => console.log(err));
//               break;
//             case 'following':
//               dispatch(
//                 getAllFollowShopsDistanceThunk({
//                   longitude: longitude,
//                   latitude: latitude,
//                 }),
//               )
//                 .unwrap()
//                 .then(res => {
//                   setInitialData(res);
//                   setData(res);
//                   setTitle('Bạn đang theo dõi ');
//                   setShowLoadingModal(false);
//                 })
//                 .catch(err => console.log(err));
//               break;
//             default:
//               break;
//           }
//         },
//         error => console.log(error.message),
//         {
//           enableHighAccuracy: true,
//           timeout: 20000,
//           maximumAge: 1000,
//         },
//       );
//     } else {
//       setInitialShopsData(shops);
//       setShopsData(shops);
//       setShowLoadingModal(false);
//     }
//   }, [types]);

//   const updateData = newData => {
//     setData(newData);
//   };
//   const updateShopsData = newShopsData => {
//     setShopsData(newShopsData);
//   };
//   const updatePetType = type => {
//     setPetType(type);
//   };

//   return (
//     <NativeBaseProvider>
//       {!showLoadingModal ? (
//         <View style={styles.container}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={{
//               backgroundColor: 'black',
//               width: 40,
//               padding: 7,
//               borderRadius: 7,
//               marginBottom: 20,
//               marginTop: 30,
//               marginLeft: 20,
//             }}>
//             <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//           </TouchableOpacity>
//           <View style={styles.appBarWrapper}>
//             {type !== 'random' && showSearch ? (
//               <SearchBar
//                 defaultString={defaultString}
//                 direction="cafeList"
//                 type={type}
//                 shops={initialShopsData}
//                 data={initialData}
//                 updateData={updateData}
//                 updateShopsData={updateShopsData}
//                 updatePetType={updatePetType}
//               />
//             ) : null}
//             <View style={styles.flexRow}>
//               {types.map((type, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.btn,
//                     {
//                       marginTop: marginTopValue,
//                       backgroundColor:
//                         petType === type ? 'red' : COLORS.primary,
//                     },
//                   ]}
//                   onPress={() => setPetType(petType !== type ? type : '')}>
//                   {type === 'CatAndDog' ? (
//                     <Text style={styles.text}>Cat & Dog</Text>
//                   ) : (
//                     <Text style={styles.text}>{type}</Text>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={{height: heightValue}}>
//               <CafeListComponent
//                 petType={petType}
//                 shops={shopsData}
//                 data={data}
//                 title={title}
//               />
//             </View>
//           </View>
//         </View>
//       ) : (
//         <Center style={{marginTop: 30}}>
//           <LottieView
//             source={require('../../../../assets/images/loading.json')}
//             autoPlay
//             style={{width: 100, height: 100}}
//           />
//         </Center>
//       )}
//     </NativeBaseProvider>
//   );
// };

// export default CafeList;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: COLORS.white,
//     height: '100%',
//     marginBottom: SIZES.xxl * 2,
//   },
//   appBarWrapper: {
//     marginHorizontal: 22,
//     marginTop: 20,
//   },
//   flexRow: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 30,
//   },
//   btn: {
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     // backgroundColor: COLORS.primary,
//     borderColor: 'white',
//   },
//   text: {
//     color: 'white',
//     fontSize: 20,
//   },
// });

const CafeList = ({ route, navigation }) => {
  const { type, data, followedShopIds } = route.params;

  const getTitle = (type) => {
    switch (type) {
      case 'random':
        return 'Quán nào hôm nay';
      case 'mostPopular':
        return 'Phổ biến nhất';
      case 'nearby':
        return 'Gần bạn';
      case 'following':
        return 'Bạn đang theo dõi';
      default:
        return 'Danh sách quán';
    }
  };

  useLayoutEffect(() => {
    const headerTitle = getTitle(type);
    navigation.setOptions({
      headerTitle: headerTitle,
      headerRight: () => (
        <TouchableOpacity style={{
          marginRight: SIZES.s
        }} onPress={() => navigation.navigate('SearchPage', {
          followedShopIds: followedShopIds,
        })}>
          <Ionicons name="search" size={ICONS.m} color={COLORS.black} />
        </TouchableOpacity>
      ),
    });
  }, [type]);

  const renderCafeItem = ({ item }) => {
    const checkFollow = followedShopIds?.includes(item.id);
    return (
      <Pressable
        onPress={() => navigation.navigate('ShopDetail', { id: item.id, shopData: item, checkFollow })}
        style={{
          marginBottom: 12
        }} >
        <View style={[styles.shopContainer, SHADOWS.s]}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.shopImageContainer}>
              <Image
                source={{
                  uri: item.avatarUrl,
                }}
                style={styles.shopImage}
              />
            </View>
          </View>
          <View style={{ alignItems: 'flex-start', marginLeft: SIZES.m, alignSelf: 'flex-start', paddingTop: 10, width: '52%' }}>
            <View style={styles.shopDetail}>
              <Text numberOfLines={1} style={TEXTS.heading}>{item.name}</Text>
              <View style={styles.shopCategory}>
                <Text style={TEXTS.subContent}>
                  Cà phê
                  {item.type === 'Cat'
                    ? ' Mèo'
                    : item.type === 'Dog'
                      ? ' Chó'
                      : ' Chó và Mèo'}{' '}
                </Text>
                <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
              </View>
              <View style={styles.shopHeader}>
                <Ionicons name="navigate-circle" size={15} color={COLORS.primary} />
                <Text style={TEXTS.subContent}>{item?.distance?.toFixed(2)} Km</Text>
              </View>
              <View style={styles.shopHeader}>
                <Ionicons name="call" size={15} color={COLORS.primary} />
                <Text style={[TEXTS.subContent]}>{item.phone}</Text>
              </View>
              <View style={styles.shopHeader}>
                <Ionicons name="mail" size={15} color={COLORS.primary} />
                <Text numberOfLines={1} style={TEXTS.subContent}>{item.email}</Text>
              </View>
            </View>
          </View>
          {item.hasPromotion && (
            <View style={[ICONS.coverPro, {
              position: 'absolute',
              top: "2%",
              right: "2%",
            }]}>
              <MaterialIcons
                name="redeem"
                size={ICONS.xm}
                color={COLORS.primary}
              />
            </View>
          )}
        </View>
      </Pressable>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderCafeItem}
        style={styles.appBarWrapper}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: COLORS.bgr,
    paddingBottom: SIZES.m,
  },
  appBarWrapper: {
    width: '100%',
    padding: SIZES.s,
    paddingHorizontal: SIZES.l,
    marginTop: 12,
  },
  shopContainer: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: 168,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    gap: 12,
    position: 'relative'

  },
  shopImageContainer: {
    width: 132,
    height: 132,
    borderRadius: BRS.in,
    overflow: 'hidden',
  },
  shopImage: {
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  shopDetail: {
    maxWidth: SIZES.width / 2,
    // height: 68,
    flexDirection: 'column',
    // justifyContent: 'space-between'
    gap: SIZES.s / 2

  },
  shopTitle: {
    fontWeight: 'bold',
    fontSize: SIZES.l,
    marginBottom: 2,
    color: COLORS.black,

  },
  shopDistance: {
    gap: 2,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,

  },
  shopText: {
    fontSize: SIZES.s,
  },
  shopCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs / 2,
  },
});

export default CafeList;
