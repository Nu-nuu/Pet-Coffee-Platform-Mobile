import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from '../../constants';

const Downloading = () => {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Image style={styles.itemsImage} source={require('../../../assets/items.png')} />
                <Text style={styles.text}>
                    Đang tải tài nguyên ...
                </Text>
            </View>
            <View style={styles.animationContainer}>
                <LottieView
                    source={require('../../../assets/images/loading.json')}
                    autoPlay
                    style={styles.animation}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.quaternary
    },
    animationContainer: {
        marginBottom: 20,
    },
    animation: {
        width: 100,
        height: 100,
    },
    textContainer: {
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: COLORS.primary

    },
    textFooter: {
        fontSize: 16,
        textAlign: 'center',
    },
    itemsImage: {
        height: 150,
        width: 150,
    },
});

export default Downloading;
