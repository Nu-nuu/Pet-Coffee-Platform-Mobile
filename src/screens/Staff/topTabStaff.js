import React, { useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { COLORS, SIZES } from '../../constants';
import Pets from './Pet/pets';
import Shops from './About/shops';
import Areas from './Area/areas';
import MyShopDetail from '../PetCoffeeShop/MyShopDetail/MyShopDetail';
import Products from './Product/products';
import Post from '../../components/Profile/Post';
import Review from '../../components/Profile/Review';
import Event from '../../components/Profile/Event';

const TopTabs = createMaterialTopTabNavigator();

export default function TopTabStaff({ shopId }) {

    return (
        <TopTabs.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarItemStyle: { width: SIZES.width / 3, height: 48 },
                tabBarLabelStyle: {
                    textTransform: 'none',
                    fontSize: SIZES.m,
                },
                tabBarStyle: { backgroundColor: COLORS.quaternary },
                tabBarIndicatorStyle: {
                    height: 3,
                    borderRadius: 3,
                    backgroundColor: COLORS.primary,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.black,
            }}
        >
            <TopTabs.Screen name="Quán của bạn">
                {() =>
                    <MyShopDetail />
                }
            </TopTabs.Screen>
            <TopTabs.Screen name="Thú cưng">
                {() =>
                    <Pets />
                }
            </TopTabs.Screen>
            <TopTabs.Screen name="Khu vực">
                {() =>
                    <Areas />
                }
            </TopTabs.Screen>
            <TopTabs.Screen name="Sự kiện">
                {() =>
                    <Event shopId={shopId} />
                }
            </TopTabs.Screen>
            <TopTabs.Screen name="Bài viết">
                {() =>
                    <Post shopId={shopId} />
                }
            </TopTabs.Screen>
            <TopTabs.Screen name="Lượt nhắc">
                {() =>
                    <Review shopId={shopId} />
                }
            </TopTabs.Screen>

        </TopTabs.Navigator >
    );
}