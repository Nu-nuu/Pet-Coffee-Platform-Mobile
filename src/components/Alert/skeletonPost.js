import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Center, Skeleton, VStack } from 'native-base'
import { BRS, COLORS, SHADOWS, SIZES } from '../../constants'

const SkeletonPost = () => {
    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: SIZES.s,
            paddingTop: SIZES.m
        }}>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={{ width: SIZES.width - SIZES.m * 2, }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: SIZES.s / 2,
                        padding: SIZES.s,
                        width: SIZES.width / 1.5
                    }}>
                        <View style={styles.image}>
                            <Skeleton w="16" h="16" />
                        </View>
                        <Skeleton.Text lines={2} py={2} px={4} />
                    </View>
                    <Skeleton.Text lines={2} py={1} px={4} />
                </View>

                <View style={styles.shopImageContainer}>
                    <Skeleton maxW="full" h="56" />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SIZES.width - SIZES.m * 3
                }}>
                    <Skeleton.Text w='32' lines={1} py={1} pr={4} />
                    <Skeleton.Text w='32' lines={1} py={1} px={4} />
                </View>
            </View>
            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={{ width: SIZES.width - SIZES.m * 2, }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: SIZES.s / 2,
                        padding: SIZES.s,
                        width: SIZES.width / 1.5
                    }}>
                        <View style={styles.image}>
                            <Skeleton w="16" h="16" />
                        </View>
                        <Skeleton.Text lines={2} py={2} px={4} />
                    </View>
                    <Skeleton.Text lines={2} py={1} px={4} />
                </View>

                <View style={styles.shopImageContainer}>
                    <Skeleton maxW="full" h="56" />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SIZES.width - SIZES.m * 3
                }}>
                    <Skeleton.Text w='32' lines={1} py={1} pr={4} />
                    <Skeleton.Text w='32' lines={1} py={1} px={4} />
                </View>
            </View>

            <View style={[styles.shopContainer, SHADOWS.s]}>
                <View style={{ width: SIZES.width - SIZES.m * 2, }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: SIZES.s / 2,
                        padding: SIZES.s,
                        width: SIZES.width / 1.5
                    }}>
                        <View style={styles.image}>
                            <Skeleton w="16" h="16" />
                        </View>
                        <Skeleton.Text lines={2} py={2} px={4} />
                    </View>
                    <Skeleton.Text lines={2} py={1} px={4} />
                </View>

                <View style={styles.shopImageContainer}>
                    <Skeleton maxW="full" h="56" />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SIZES.width - SIZES.m * 3
                }}>
                    <Skeleton.Text w='32' lines={1} py={1} pr={4} />
                    <Skeleton.Text w='32' lines={1} py={1} px={4} />
                </View>
            </View>

        </View>

    )
}

export default SkeletonPost

const styles = StyleSheet.create({
    shopContainer: {
        backgroundColor: COLORS.white,
        width: '100%',
        height: SIZES.height / 2,
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        justifyContent: 'space-between'
    },
    shopImageContainer: {
        width: SIZES.width - SIZES.m * 2,
        height: SIZES.height / 4,
        overflow: 'hidden',
    },

    image: {
        width: SIZES.width / 8,
        height: SIZES.width / 8,
        borderRadius: SIZES.width / 8 / 2,
        overflow: 'hidden',
    }
})