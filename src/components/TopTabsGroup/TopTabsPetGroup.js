import React, { useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { COLORS, SIZES } from '../../constants';
import PetProfile from '../../screens/Pet/PetDetail/PetProfile';

const TopTabs = createMaterialTopTabNavigator();

export default function TopTabsPetGroup({petData, direction}) {

    return (
        <TopTabs.Navigator
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
            <TopTabs.Screen name="Giới thiệu">
                {() =>
                    <PetProfile petData={petData} direction={direction} />
                }
            </TopTabs.Screen>

        </TopTabs.Navigator >
    );
}