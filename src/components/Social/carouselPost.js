import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SliderBox } from 'react-native-image-slider-box';
import { COLORS, SIZES } from '../../constants';

export default function CarouselPost(props) {
    const images = props.images;

    return (
        <View style={styles.carouselContainer}>
            <SliderBox
                images={images}
                dotColor={COLORS.primary}
                inactiveDotColor={COLORS.quaternary}
                ImageComponentStyle={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    image: {
        height: SIZES.height / 2,
        width: SIZES.width,
        resizeMode: 'cover',
    },

    carouselContainer: {
        flex: 1,
        alignItems: 'center',
    },
});
