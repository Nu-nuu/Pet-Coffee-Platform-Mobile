import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { AVATARS, BRS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import formatTime from '../Social/formatTime';
import AntDesign from 'react-native-vector-icons/AntDesign';

const RatingCard = ({ ratingData, petData }) => {
    const maxRate = [1, 2, 3, 4, 5];

    return (
        <View style={[styles.container, SHADOWS.s]}>
            <View style={styles.headerContainer}>
                <View style={styles.postTop}>
                    <Image
                        source={{ uri: ratingData.account?.avatar }}
                        style={[AVATARS.mid, { alignSelf: 'flex-start' }]}
                    />
                    <View>
                        <Text style={styles.title} numberOfLines={1}>{ratingData.account.fullName}</Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: SIZES.s / 2,
                            }}>
                                {maxRate.map(item => {
                                    return (
                                        <View activeOpacity={0.7} key={item}                                         >
                                            <AntDesign
                                                name={item <= ratingData.rate ? 'star' : 'staro'}
                                                color={COLORS.yellow}
                                                size={SIZES.xm}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                            <Text style={{ fontSize: SIZES.m, color: COLORS.blackBold }}>・{formatTime(ratingData.createdAt)}</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    alignSelf: 'flex-start',
                    paddingVertical: SIZES.s,
                }}>
                    <Text style={[styles.textContent]} >
                        {ratingData.comment}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default RatingCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SIZES.width - SIZES.m * 2,
        backgroundColor: COLORS.white,
        borderRadius: BRS.out,
    },
    headerContainer: {
        padding: SIZES.m,
    },
    imageProfile: {
        height: 40,
        width: 40,
        borderRadius: 50,
        alignSelf: 'flex-start'
    },
    row: {
        flexDirection: 'row',
        gap: 5,
    },
    isWith: {
        flexDirection: 'row',
        width: 200,
    },
    postTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.s,
    },
    inforProfile: {
        paddingLeft: SIZES.s,
    },
    imageContainer: {
        width: '100%',
        overflow: 'hidden',
    },
    image: {
        height: SIZES.height / 2,
        width: SIZES.width,
        resizeMode: 'cover',
        borderWidth: 0.5,
        borderColor: COLORS.gray2,
    },
    detail: {
        padding: SIZES.s,
    },
    title: {
        fontWeight: 'bold',
        fontSize: SIZES.m,
        color: COLORS.black,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.s,
        width: '50%',
        height: 40,
        gap: SIZES.s,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    text: {
        fontSize: SIZES.m,
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
        gap: 5,
    },
    totalLike: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        height: 40,
        gap: SIZES.s,
        paddingLeft: 22,
    },
    totalComment: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '50%',
        height: 40,
        gap: SIZES.s,
        paddingRight: 22,
    },
    contentContainer: {
        paddingHorizontal: SIZES.s,
    },
    textContent: {
        color: COLORS.black,
        fontSize: SIZES.m,
    },
    textTotalButton: {
        fontSize: SIZES.m,
        fontWeight: 'bold',
    },
})