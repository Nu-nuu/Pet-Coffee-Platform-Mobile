import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { areasFromShopSelector, petCoffeeShopDetailSelector, userDataSelector } from '../../../store/sellectors';
import { deleteAreaThunk, getAreasFromShopThunk } from '../../../store/apiThunk/areaThunk';
import { BUTTONS, COLORS, ICONS, SHOPS, SIZES, TEXTS } from '../../../constants';
import SkeletonArea from '../../../components/Alert/skeletonArea';
import AreaCard from '../../../components/Profile/AreaCard';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Areas = () => {
  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);
  const navigation = useNavigation();
  const areaData = useSelector(areasFromShopSelector);
  const [showRender, setShowRender] = useState(false);
  const shopData = useSelector(petCoffeeShopDetailSelector);

  useEffect(() => {
    handleFetchData()
  }, []);

  const handleFetchData = async () => {
    setShowRender(true);
    dispatch(getAreasFromShopThunk(shopData.id)).then(() => {
      setShowRender(false);
    });
  }

  const navigateToAreaDetail = (areaId, areaData) => {
    navigation.navigate('AreaDetail', {
      areaId: areaId,
      areaData: areaData,
    });
  };

  const navigateToCreateArea = () => {
    navigation.navigate('CreateArea', {
      id: shopData.id
    });
  };

  const handleEditArea = (areaId) => {
    navigation.navigate('EditArea', {
      shopId: shopData.id,
      areaId: areaId
    });
  }


  return (
    <View style={{
      backgroundColor: COLORS.quaternary,
      padding: SIZES.m,
      minHeight: SIZES.height,
    }}>
      <View style={{
        paddingBottom: SIZES.m,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Khu vực của quán</Text>
          <Pressable
            onPress={navigateToCreateArea}
            style={[
              BUTTONS.recMid,
              {
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                width: SIZES.width / 3.5,
                flexDirection: 'row',
                paddingHorizontal: 5,
                gap: 5,
              }]}>
            <Ionicons name='add-circle' size={ICONS.m} color={COLORS.white} />
            <Text style={[{
              fontWeight: '500',
              color: COLORS.white,
              fontSize: SIZES.m
            }]}>Khu vực</Text>
          </Pressable>
        </View>
        {showRender ? (
          <SkeletonArea />
        ) :
          (
            <>
              {areaData.length > 0 ? (
                <View
                  style={{ marginTop: SIZES.m }}
                >
                  {areaData.map((area) => (
                    <Pressable key={area.id} onPress={() => navigateToAreaDetail(area.id, area)}>
                      <AreaCard areaData={area} shop={true} onPress={() => handleEditArea(area.id)} />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={{
                  alignItems: 'center', justifyContent: 'center',
                  padding: SIZES.m
                }}>
                  <Text style={TEXTS.content} >{SHOPS.noArea}</Text>
                  <Image alt='noInformation' source={require('../../../../assets/noinfor.png')} style={{
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
  )
}

export default Areas

const styles = StyleSheet.create({})