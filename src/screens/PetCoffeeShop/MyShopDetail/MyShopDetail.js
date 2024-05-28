import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ImageBackgroundComponent,
} from 'react-native';
import React, { useState } from 'react';
import {
  Modal,
  NativeBaseProvider,
  ScrollView,
} from 'native-base';
import { AVATARS, COLORS, ICONS, SIZES, TEXTS } from '../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  petCoffeeShopDetailSelector,
} from '../../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import About from '../../Staff/About/about';
import { useNavigation } from '@react-navigation/native';

export default function MyShopDetail() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
  const shopData = useSelector(petCoffeeShopDetailSelector);

  return (
    <NativeBaseProvider>
      <ScrollView style={{ backgroundColor: COLORS.quaternary }}>
        <View>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Pressable onPress={() => setIsOpen(false)}>
              <Image
                source={{ uri: shopData.avatarUrl }}
                alt=""
                style={{ width: 350, height: 500, objectFit: 'contain' }}
              />
            </Pressable>
          </Modal>
          <Modal
            isOpen={isBackgroundOpen}
            onClose={() => setIsBackgroundOpen(false)}>
            <Pressable onPress={() => setIsBackgroundOpen(false)}>
              <Image
                source={{ uri: shopData.backgroundUrl }}
                alt=""
                style={{ width: 350, height: 500, objectFit: 'contain' }}
              />
            </Pressable>
          </Modal>
          <View style={{
            backgroundColor: COLORS.quaternary,
          }}>
            <Pressable
              onPress={() => {
                setIsBackgroundOpen(true);
              }}>
              <Image
                source={{ uri: shopData.backgroundUrl }}
                alt=""
                style={styles.backgroundImage}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setIsOpen(true);
              }}
              style={{
                position: 'absolute',
                top: '20%',
                left: SIZES.m,
              }}>
              <Image
                source={{ uri: shopData.avatarUrl }}
                alt=""
                style={AVATARS.max}
              />
            </Pressable>
            <View
              style={{
                padding: SIZES.m,
                marginTop: SIZES.xl,
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: SIZES.xs / 2,
              }}
            >
              <Text style={TEXTS.titleMax}>{shopData.name}</Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={[TEXTS.content, { fontWeight: '500', color: COLORS.black }]}>{shopData.totalFollow} </Text>
                <Text style={TEXTS.content}>người theo dõi</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2
              }}>
                <Text style={TEXTS.content}>
                  Cà phê
                  {shopData.type === 'Cat'
                    ? ' Mèo'
                    : shopData.type === 'Dog'
                      ? ' Chó'
                      : ' Chó và Mèo'}{' '}
                </Text>
                <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
              </View>
              {/* <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2
              }}>
                <Ionicons name="navigate-circle" size={ICONS.s} color={COLORS.primary} />
                <Text style={TEXTS.subContent}>{shopData?.distance?.toFixed(2)} Km</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <Pressable
                onPress={() => navigation.navigate('EditShopProfile', {id: shopData.id, shopData: shopData})}
                  style={{
                    paddingVertical: SIZES.s,
                    backgroundColor: COLORS.gray1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: SIZES.s,
                    height: 48,
                    width: 169 * 2 + SIZES.m,
                    borderRadius: 10,
                  }}
                >
                  <Ionicons name="pencil" size={ICONS.xm} color={COLORS.black} />
                  <Text style={{ fontSize: SIZES.m, color: COLORS.black, fontWeight: '500' }}>Chỉnh sửa thông tin quán</Text>
                </Pressable>
                <Menu
                  w="190"
                  marginTop={3}
                  marginRight={5}
                  trigger={triggerProps => {
                    return (
                      <Pressable
                        accessibilityLabel="More options menu"
                        {...triggerProps}
                        style={[{
                          paddingVertical: SIZES.s,
                          backgroundColor: COLORS.gray1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }, BUTTONS.cub]}
                      >
                        <Ionicons name="ellipsis-horizontal" size={ICONS.s} />
                      </Pressable>

                    );
                  }}>
                  <Menu.Item
                  >
                    <Ionicons name="navigate-circle-outline" size={ICONS.xm} color={COLORS.black} />
                    <Text style={{ fontSize: 16, color: 'black' }}>Đi tới</Text>
                  </Menu.Item>
                </Menu>
              </View> */}
            </View>
          </View>
          <About shopId={shopData.id} />
        </View>
      </ScrollView>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    objectFit: 'cover',
    height: 190,
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 21,
    color: COLORS.primary,
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary },
  text: { color: 'gray', fontSize: 17 },
  btn: {
    backgroundColor: 'white',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  shopRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  shopText: {
    fontSize: 14,
  },
  shopCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
});
