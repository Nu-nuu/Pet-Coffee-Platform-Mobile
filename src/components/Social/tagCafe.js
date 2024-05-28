
// TagCafe.js
import React from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AVATARS, COLORS, SIZES } from '../../constants';

const TagCafe = ({ cafe }) => {
    return (
        <View style={styles.rowTag}>
            <Image source={{ uri: cafe.avatarUrl }} style={AVATARS.mini} />
            <Text style={styles.title} numberOfLines={1}>
                {cafe.name}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({


    imageTag: {
        width: 20,
        height: 20,
        borderRadius: 50,
    },
    rowTag: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        gap: SIZES.s / 2,
    },
    title: {
        fontWeight: 'bold',
        fontSize: SIZES.m,
        color: COLORS.black,
    },
});

export default TagCafe;
