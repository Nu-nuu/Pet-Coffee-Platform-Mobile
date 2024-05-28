import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Center, Skeleton, VStack } from 'native-base'
import { BRS, COLORS, SHADOWS, SIZES } from '../../constants'

const SkeletonLoading = () => {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SIZES.m,
        }}>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.shopImageContainer}>
                        <Skeleton maxW="full" h="40" />
                    </View>
                </View>
                <View style={{ alignItems: 'flex-start', marginLeft: SIZES.m, marginTop: 14 }}>
                    <Skeleton.Text px="4" />
                </View>
            </View>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.shopImageContainer}>
                        <Skeleton maxW="full" h="40" />
                    </View>
                </View>
                <View style={{ alignItems: 'flex-start', marginLeft: SIZES.m, marginTop: 14 }}>
                    <Skeleton.Text px="4" />
                </View>
            </View>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.shopImageContainer}>
                        <Skeleton maxW="full" h="40" />
                    </View>
                </View>
                <View style={{ alignItems: 'flex-start', marginLeft: SIZES.m, marginTop: 14 }}>
                    <Skeleton.Text px="4" />
                </View>
            </View>
        </View>

    )
}

export default SkeletonLoading

const styles = StyleSheet.create({
    shopContainer: {
        width: 227,
        height: 235,
        borderRadius: BRS.out,
        paddingTop: SIZES.xs,
        backgroundColor: COLORS.white,
        flexDirection: 'column',
    },
    shopImageContainer: {
        width: 207,
        height: 131,
        borderRadius: BRS.in,
        overflow: 'hidden',
    },
})