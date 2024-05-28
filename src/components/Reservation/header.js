// Header.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SIZES } from '../../constants';

const Header = ({ title, showBackButton, onPressBack, image, nextStep }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: image }} style={[styles.image,
            { height: nextStep === 3 ? 500 : 200 }
            ]} />
            {showBackButton && (
                <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
                    <Text>Back</Text>
                </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 10,
    },
    titleContainer: {
        position: 'absolute',
        bottom: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white', // Adjust text color as needed
    },
});

export default Header;
