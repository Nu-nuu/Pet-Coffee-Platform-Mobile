import { Text, View, ScrollView } from 'native-base'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SHOPS, SIZES, TEXTS } from '../../constants';
import { Pressable, } from 'react-native';
import PostCard from '../Social/postCard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { postAccountSelector, postShopSelector, postTagsShopSelector, userDataSelector } from '../../store/sellectors';
import { getCurrentAccountPostThunk, getPostShopThunk, getPostTagShopThunk } from '../../store/apiThunk/postThunk';
import { Image } from 'react-native';
import SkeletonPost from '../Alert/skeletonPost';

export default function Review(props) {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector(userDataSelector);
  const [showRender, setShowRender] = useState(false);
  const [shopData, setShopData] = useState([]);

  const shopId = props.shopId;
  const postShopData = useSelector(postTagsShopSelector)


  useEffect(() => {
    if (postShopData == [] || postShopData?.shopId == null) {
      handleFetchData()
      setShopData(postShopData)
    }
  }, [])
  const handleFetchData = async () => {
    setShowRender(true);
    dispatch(
      getPostTagShopThunk(shopId))
      .unwrap()
      .then((res) => {
        setShopData(res);
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
      <View style={{
        paddingBottom: SIZES.m,
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black, paddingHorizontal: SIZES.m, paddingTop: SIZES.s, }}>Lượt nhắc về quán</Text>
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
                  <Text style={TEXTS.content} >{SHOPS.noReview}</Text>
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
    </ScrollView>
  )
}
