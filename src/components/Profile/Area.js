import { Center, Image, ScrollView, Text, View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { areasFromShopSelector, userDataSelector } from '../../store/sellectors';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHOPS, SIZES, TEXTS } from '../../constants';

import {
  deleteAreaThunk,
  getAreasFromShopThunk,
} from '../../store/apiThunk/areaThunk';

import SkeletonArea from '../Alert/skeletonArea';
import AreaCard from './AreaCard';

export default function Area(props) {
  const dispatch = useDispatch();
  const shopId = props.shopId;
  const direction = props.direction;
  const userData = useSelector(userDataSelector);
  const role = userData.role;
  const navigation = useNavigation();
  const areas = useSelector(areasFromShopSelector);
  const [showRender, setShowRender] = useState(false);





  useEffect(() => {
    if (areas == [] || areas?.petcoffeeShopId != shopId) {
      handleFetchData()
    }
  }, []);

  const handleFetchData = async () => {
    setShowRender(true);
    dispatch(getAreasFromShopThunk(shopId)).then(() => {
      setShowRender(false);
    });
  }

  const handleAreaSelect = (areaId, pricePerHour, order, areaData) => {
    navigation.navigate('Reservation', {
      areaId: areaId,
      price: pricePerHour,
      order: order,
      shop: true,
      areaDatas: areaData
    });
  };
  const navigateToAreaDetail = (areaId, areaData) => {
    navigation.navigate('AreaDetail', {
      areaId: areaId,
      direction: direction,
      shopId: shopId,
      areaData: areaData,
    });
  };
  return (
    <View style={{
      backgroundColor: COLORS.bgr,
      padding: SIZES.m,
    }}>
      <View style={{
        paddingBottom: SIZES.m,
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Khu vực của quán</Text>
        {showRender ? (
          <SkeletonArea />
        ) :
          (
            <>
              {areas.length > 0 ? (
                <View
                  style={{ marginTop: SIZES.m }}
                >
                  {areas.map((area) => (
                    <Pressable key={area.id} onPress={() => navigateToAreaDetail(area.id, area)}>
                      <AreaCard areaData={area} onPress={() => handleAreaSelect(area.id, area.pricePerHour, area.order, area)} />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={{
                  alignItems: 'center', justifyContent: 'center',
                  padding: SIZES.m
                }}>
                  <Text style={TEXTS.content} >{SHOPS.noArea}</Text>
                  <Image alt='noInformation' source={require('../../../assets/noinfor.png')} style={{
                    height: SIZES.height / 6,
                    width: SIZES.height / 6,
                    alignSelf: 'center',
                  }} />
                </View>
              )}
            </>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});
