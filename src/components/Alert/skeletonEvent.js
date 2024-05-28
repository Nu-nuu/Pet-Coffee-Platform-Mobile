import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Center, Skeleton, VStack } from 'native-base'
import { BRS, COLORS, SHADOWS, SIZES } from '../../constants'
import SkeletonArea from './skeletonArea'

const SkeletonEvent = () => {
    return (
        <View style={{
            flex: 1,
            backgroundColor: COLORS.bgr
        }}>
                <Skeleton w="full" h="56" />
            <Skeleton.Text lines={6} py={2} px={4} />
            <View style={{
                flexDirection: 'column',
                paddingHorizontal: SIZES.m,
                paddingVertical: SIZES.s / 2,
                alignItems: 'center'
            }}>
                <SkeletonArea />
                <SkeletonArea />
                <SkeletonArea />
            </View>
        </View>

    )
}

export default SkeletonEvent

const styles = StyleSheet.create({
  
})