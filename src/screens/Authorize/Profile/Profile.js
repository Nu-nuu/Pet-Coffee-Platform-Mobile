import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import { NativeBaseProvider, Menu, Modal, Divider, Skeleton } from 'native-base';
import TopTabsGroup from '../../../components/TopTabsGroup/TopTabsGroup';
import { AVATARS, BUTTONS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../../constants';
import { userDataSelector } from '../../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AboutComponent from '../../../components/Profile/About';
import Post from '../../../components/Profile/Post';
import Event from '../../../components/Profile/Event';
import { useRoute } from '@react-navigation/native';
import { getUserDataThunk } from '../../../store/apiThunk/userThunk';

export default function Profile({ navigation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
  const userData = useSelector(userDataSelector);
  const dispatch = useDispatch()
  const route = useRoute()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (route.params) {
      setLoading(true)
      handleRefresh()
      setSelectedComponent(<AboutComponent direction={'profile'} />)
    }
  }, [route.params]);

  const handleRefresh = async () => {
    dispatch(getUserDataThunk())
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }

  const handleEditProfile = () => {
    navigation.navigate('EditProfile')
  }
  const handleChangePassword = () => {
    navigation.navigate('ChangePassword')
  }

  const flatListRef = useRef(null);
  const [selectedComponent, setSelectedComponent] = useState(<AboutComponent direction={'profile'} />);
  const [selectedId, setSelectedId] = useState(0);

  const ScreenNames = [
    { id: 0, name: 'Giới thiệu', component: <AboutComponent direction={'profile'} /> },
    { id: 1, name: 'Bài viết', component: <Post direction={'profile'} /> },
    { id: 2, name: 'Sự kiện', component: <Event direction={'profile'} /> },
  ];


  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => [setSelectedComponent(item.component), setSelectedId(item.id)]}
      style={{
        width: SIZES.width / 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderBottomStartRadius: 3,
        borderBottomEndRadius: 3,
        borderColor: selectedId === item.id ? COLORS.primary : 'transparent',
      }}>
      <Text style={{
        textTransform: 'none',
        fontSize: SIZES.m,
        fontWeight: selectedId === item.id ? '500' : 'normal',
        color: selectedId === item.id ? COLORS.primary : COLORS.blackBold,
      }} >{item.name}</Text>
    </TouchableOpacity>
  );


  return (
    <NativeBaseProvider>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: COLORS.bgr
        }}
      >
        <View>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <Pressable onPress={() => setIsOpen(false)}>
              <Image
                source={{ uri: userData.avatar }}
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
                source={{ uri: userData.background }}
                alt=""
                style={{ width: 350, height: 500, objectFit: 'contain' }}
              />
            </Pressable>
          </Modal>
          <View style={{
            backgroundColor: COLORS.bgr,
          }}>
            <View
              style={{
                position: 'relative',
              }}
            >
              {loading ? (
                <View style={{ height: SIZES.height / 5, width: SIZES.width, overflow: 'hidden', alignSelf: 'center', }}>
                  <Skeleton w="full" h="full" />
                </View>
              ) : (
                <Pressable
                  onPress={
                    () => {
                      setIsBackgroundOpen(true);
                    }
                  }>
                  <Image
                    source={{ uri: userData.background }}
                    alt=""
                    style={styles.backgroundImage}
                  />
                </Pressable>
              )}
              {loading ? (
                <View style={{
                  position: 'absolute',
                  left: SIZES.width / 2 - 65,
                  bottom: '-15%'
                }}>
                  <View style={{
                    width: 130,
                    height: 130,
                    borderRadius: 65,
                    backgroundColor: COLORS.bgr,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    <Skeleton w="40" h="40" />
                  </View>
                </View>

              ) : (
                <Pressable
                  onPress={() => {
                    setIsOpen(true);
                  }}
                  style={{
                    position: 'absolute',
                    left: SIZES.width / 2 - 65,
                    bottom: '-15%'
                  }}>
                  <View style={{
                    width: 130,
                    height: 130,
                    borderRadius: 65,
                    backgroundColor: COLORS.bgr,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Image
                      source={{ uri: userData.avatar }}
                      alt=""
                      style={AVATARS.max}
                    />
                  </View>
                </Pressable>
              )}
            </View>

            <View
              style={{
                padding: SIZES.m,
                marginTop: SIZES.xl,
                flexDirection: 'column',
                alignItems: 'center',
                gap: SIZES.xs / 2,
              }}
            >
              {loading ? (
                <Skeleton w="24" h="10" rounded='md' />
              ) :
                (<Text style={TEXTS.titleMax}>{userData.fullName}</Text>
                )}
              {userData.description && (
                <Text style={TEXTS.content}>{userData.description}</Text>
              )}
              <View style={{
                flexDirection: 'row',
                width: SIZES.width,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
                <View style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: SIZES.width / 3,
                  borderRightWidth: 1,
                  borderColor: COLORS.gray1,

                }}>
                  <Text style={[TEXTS.heading, { fontWeight: 'bold', color: COLORS.black }]}>{userData.totalPost} </Text>
                  <Text style={TEXTS.content}>Bài viết</Text>
                </View>
                <View style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: SIZES.width / 3,
                }}>
                  <Text style={[TEXTS.heading, { fontWeight: 'bold', color: COLORS.black }]}>{userData.totalIsFollowing} </Text>
                  <Text style={TEXTS.content}>Đang theo dõi</Text>
                </View>
                <View style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: SIZES.width / 3,
                  borderLeftWidth: 1,
                  borderColor: COLORS.gray1
                }}>
                  <Text style={[TEXTS.heading, { fontWeight: 'bold', color: COLORS.black }]}>{userData.totalReservation} </Text>
                  <Text style={TEXTS.content}>Đã đặt chỗ</Text>
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <Pressable
                  onPress={handleEditProfile}
                  style={{
                    paddingVertical: SIZES.s,
                    backgroundColor: COLORS.gray1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: SIZES.s,
                    height: SIZES.width / 9,
                    width: SIZES.width / 1.3,
                    borderRadius: 10,
                  }}
                >
                  <Ionicons name="pencil" size={ICONS.xm} color={COLORS.black} />
                  <Text style={{ fontSize: SIZES.m, color: COLORS.black, fontWeight: '500' }}>Chỉnh sửa trang cá nhân</Text>
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
                    onPress={handleChangePassword}>
                    <Ionicons name="shield-outline" size={ICONS.xm} color={COLORS.black} />
                    <Text style={{ fontSize: 16, color: 'black' }}>Mật khẩu</Text>
                  </Menu.Item>
                </Menu>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={ScreenNames}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[{
            height: 48,
            backgroundColor: COLORS.bgr,
          }, SHADOWS.s]}
        />
        {selectedComponent}

      </ScrollView>
    </NativeBaseProvider >
  );
}
