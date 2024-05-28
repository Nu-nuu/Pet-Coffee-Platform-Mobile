import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Center, Skeleton, VStack } from 'native-base'
import { BRS, COLORS, SHADOWS, SIZES } from '../../constants'

const SkeletonPet = () => {
    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: SIZES.s,
            paddingTop: SIZES.m
        }}>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={styles.shopImageContainer}>
                    <Skeleton maxW="full" h="40" />
                </View>
                <View style={{ width: '80%' }}>
                    <Skeleton.Text lines={2} />
                </View>
            </View>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={styles.shopImageContainer}>
                    <Skeleton maxW="full" h="40" />
                </View>
                <View style={{ width: '80%' }}>
                    <Skeleton.Text lines={2} />
                </View>
            </View>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={styles.shopImageContainer}>
                    <Skeleton maxW="full" h="40" />
                </View>
                <View style={{ width: '80%' }}>
                    <Skeleton.Text lines={2} />
                </View>
            </View>
        </View>



    )
}

export default SkeletonPet

const styles = StyleSheet.create({
    shopContainer: {
        backgroundColor: COLORS.white,
        width: '100%',
        height: 78,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        justifyContent: 'space-between'
    },
    shopImageContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        overflow: 'hidden',
    },
})