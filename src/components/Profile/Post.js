import { Text, View } from 'native-base'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SHOPS, SIZES, TEXTS, USERS } from '../../constants';
import { Image, Pressable, ScrollView } from 'react-native';
import PostCard from '../Social/postCard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { postAccountSelector, postShopSelector, postTagsShopSelector, userDataSelector } from '../../store/sellectors';
import { getCurrentAccountPostThunk, getPostShopThunk, getPostTagShopThunk } from '../../store/apiThunk/postThunk';
import SkeletonPost from '../Alert/skeletonPost';

export default function Post(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector(userDataSelector);
  const [showRender, setShowRender] = useState(false);
  const [data, setData] = useState([]);
  const [shopData, setShopData] = useState([]);

  const shopId = props.shopId;
  const postData = useSelector(postAccountSelector)
  const postShopData = useSelector(postShopSelector)


  useEffect(() => {
    if (data == [] || postData[0]?.createdById != userData.id) {
      handleFetchDataUser()
      setData(postData)
    }
    setData(postData)

  }, [])

  useEffect(() => {
    if (shopId) {
      if (postShopData == [] || postShopData[0]?.shopId != shopId) {
        handleFetchData()
        setShopData(postShopData)
      } else if (shopData != [] && postShopData[0]?.shopId == shopId) {
        setShopData(postShopData)
      }
    }
  }, [])

  const handleFetchDataUser = async () => {
    setShowRender(true);
    dispatch(
      getCurrentAccountPostThunk())
      .unwrap()
      .then((res) => {
        setData(res);
        setShowRender(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const handleFetchData = async () => {
    setShowRender(true);
    dispatch(
      getPostShopThunk(shopId))
      .unwrap()
      .then((res) => {
        setShopData(res)
        setShowRender(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const shop = userData.role === 'Staff' ? true : false

  return (
    <ScrollView style={{
      backgroundColor: shop ? COLORS.quaternary : COLORS.bgr,
      minHeight: SIZES.height,
    }}>
      {shopId ? (
        <View style={{
          paddingBottom: SIZES.m,
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black, paddingHorizontal: SIZES.m, paddingTop: SIZES.m }}>Bài viết của quán</Text>
          {showRender ? (
            <SkeletonPost />
          ) :
            (
              <>
                {shopData?.length > 0 ? (
                  <View
                    style={{ marginTop: SIZES.m }}
                  >
                    {shopData.map((post, index) => (
                      <Pressable key={post.id}>
                        <PostCard post={post} userId={userData.id} shop={true} />
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <View style={{
                    alignItems: 'center', justifyContent: 'center',
                    padding: SIZES.m
                  }}>
                    <Text style={TEXTS.content} >{SHOPS.noPost}</Text>
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
      ) : (
        <View style={{
          paddingBottom: SIZES.m,
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black, paddingHorizontal: SIZES.m, paddingTop: SIZES.m }}>Bài viết của tôi</Text>
          {showRender ? (
            <SkeletonPost />
          ) :
            (
              <>
                {data.length > 0 ? (
                  <View
                    style={{ marginTop: SIZES.m }}
                  >
                    {data.map((post, index) => (
                      <Pressable key={post.id}>
                        <PostCard post={post} userId={userData.id} shop={true} />
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <View style={{
                    alignItems: 'center', justifyContent: 'center',
                    padding: SIZES.m
                  }}>
                    <Text style={TEXTS.content} >{USERS.noPost}</Text>
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
      )}
    </ScrollView>
  );
}
