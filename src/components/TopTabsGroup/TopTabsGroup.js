import React, { useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AboutComponent from '../../components/Profile/About';
import Event from '../../components/Profile/Event';
import Post from '../../components/Profile/Post';
import Review from '../../components/Profile/Review';
import Pets from '../../components/Profile/Pets';
import Area from '../Profile/Area';
import { COLORS, SIZES } from '../../constants';

const TopTabs = createMaterialTopTabNavigator();

export default function TopTabsGroup(props) {
  const { scrollDefault } = props;
  const direction = props.direction;
  const shopId = props.shopId;

  const handleIndexChange = index => {
    console.log('Tab index changed:', index);
  };

  const handleScrollDefault = () => {
    scrollDefault()
  };

  return (
    <TopTabs.Navigator
      onIndexChange={handleIndexChange}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: SIZES.width / 4, height: 48 },
        tabBarLabelStyle: {
          textTransform: 'none',
          fontSize: SIZES.m,
          color: COLORS.black,
        },
        tabBarStyle: { backgroundColor: COLORS.bgr },
        tabBarIndicatorStyle: {
          height: 3,
          borderRadius: 3,
          backgroundColor: COLORS.primary,
        },
      }}
    >
      {direction === 'profile' ? (
        <>
          <TopTabs.Screen name="Giới thiệu">
            {() => <AboutComponent direction={direction} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>
          <TopTabs.Screen name="Bài viết">
            {() => <Post direction={direction} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>
          <TopTabs.Screen name="Sự kiện">
            {() => <Event direction={direction} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>
        </>
      ) : (
        <>
          <TopTabs.Screen name="Giới thiệu">
            {() => <AboutComponent shopId={shopId} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>

          <TopTabs.Screen name="Thú cưng">
            {() => <Pets shopId={shopId} direction={direction} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>

          <TopTabs.Screen name="Khu vực">
            {() => <Area shopId={shopId} direction={direction} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>

          <TopTabs.Screen name="Sự kiện">
            {() => <Event shopId={shopId} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>

          <TopTabs.Screen name="Bài viết">
            {() => <Post shopId={shopId} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>

          <TopTabs.Screen name="Lượt nhắc">
            {() => <Review shopId={shopId} scrollDefault={handleScrollDefault} />}
          </TopTabs.Screen>
        </>
      )}
    </TopTabs.Navigator>
  );
}
