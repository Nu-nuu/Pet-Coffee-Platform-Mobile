import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AVATARS, COLORS, SIZES, TEXTS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { petCoffeeShopDetailSelector, userDataSelector } from '../../store/sellectors';

const NewPost = () => {

    const userData = useSelector(userDataSelector)
    const shopData = useSelector(petCoffeeShopDetailSelector)

    const navigation = useNavigation();
    const shop = userData.role === 'Staff' ? true : false

    const onPressCreatePost = () => {
        navigation.navigate('CreatePost', { userData });
    };

    const selectImages = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 }, response => {
            if (!response.didCancel) {
                navigation.navigate('CreatePost', { selectedImages: response.assets });
            }
        });
    };


    return (
        <View style={styles.headerContainer}>
            <View style={styles.postTop}>
                <View style={styles.row}>
                    <Image
                        source={{ uri: userData.avatar }}
                        style={AVATARS.mid}
                    />
                    <Pressable onPress={onPressCreatePost}>
                        <View style={styles.content}>
                            <Text numberOfLines={1} style={TEXTS.subContent}>
                                {shop ? (
                                    `${shopData.name}, quán của bạn có gì mới?`
                                ) : (
                                    `${userData.fullName}, bạn đang nghĩ gì?`
                                )}
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <Pressable style={styles.iconHeader} onPress={selectImages}>
                    <Ionicons name="images" size={24} color={COLORS.primary} />
                </Pressable>
            </View>
        </View>
    )
}

export default NewPost;

const styles = StyleSheet.create({
    headerContainer: {
        padding: SIZES.m,
        borderBottomColor: COLORS.gray1,
        borderBottomWidth: SIZES.s - 6,
    },
    postTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageProfile: {
        height: 40,
        width: 40,
        borderRadius: 50,
    },
    content: {
        paddingLeft: SIZES.s,
        width: SIZES.width / 1.5,
    },
    iconHeader: {
        marginRight: SIZES.s,
    },
});
