import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { getPetCoffeeShopsThunk } from '../../store/apiThunk/petCoffeeShopThunk';
import Geolocation from '@react-native-community/geolocation';
import LoadingModal from '../Alert/loadingModal';
import { NativeBaseProvider } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const SearchBar = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    defaultString,
    direction,
    type,
    data,
    shops,
    updateShopsData,
    updateData,
    updatePetType,
  } = props;

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [queryString, setQueryString] = useState('');

  const handleSearch = () => {
    setShowLoadingModal(true);

    Geolocation.getCurrentPosition(
      position => {
        let longitude = JSON.stringify(position.coords.longitude);
        let latitude = JSON.stringify(position.coords.latitude);
        if (direction === 'homepage') {
          dispatch(
            getPetCoffeeShopsThunk({
              searchQuery: queryString,
              longitude: longitude,
              latitude: latitude,
              pageNumber: 1,
              pageSize: 30,
            }),
          )
            .unwrap()
            .then(res => {
              setShowLoadingModal(false);
              navigation.navigate('CafeList', {
                shops: res,
                defaultString: queryString,
              });
            });
        } else {
          if (type) {
            if (data?.length !== 0) {
              updateData(
                data?.filter
                  (shop => shop?.name?.includes(queryString)),
              );
            }
          } else {
            if (shops?.length !== 0) {
              updateShopsData(
                shops?.filter(shop => shop?.name?.includes(queryString)),
              );
            }
          }
          updatePetType('');
          setShowLoadingModal(false);
        }
      },
      error => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };





  return (
    <NativeBaseProvider>
      <LoadingModal
        showLoadingModal={showLoadingModal}
        setShowLoadingModal={setShowLoadingModal}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: SIZES.m,
          padding: SIZES.s / 2,
        }}
      >
        <Ionicons name="search-outline" size={SIZES.l} color={COLORS.white} />
        <View
        >
          <TextInput
            style={[styles.searchInput, TEXTS.content, { color: COLORS.white }]}
            value={queryString}
            onChangeText={setQueryString}
            placeholder={defaultString ? defaultString : 'Bạn đang tìm gì ?'}
            placeholderTextColor={COLORS.white300}
            onSubmitEditing={() => handleSearch()}
          />
        </View>
      </View>
    </NativeBaseProvider>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.m,
    height: 50,
    width: '100%',
  },
  searchIcon: {
    marginHorizontal: 10,
    color: 'white',
  },
  filterIcon: {
    color: COLORS.primary,
  },
  filterText: {
    color: 'white',
  },
  searchWrapper: {
    flex: 1,
    marginRight: SIZES.s,
    borderRadius: SIZES.s,
  },
  searchInput: {
    width: '100%',
    height: '100%',
    textDecorationColor: 'white',
    paddingHorizontal: SIZES.s,
  },
  searchButton: {
    width: 50,
    height: '100%',
    borderRadius: SIZES.m,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
});
