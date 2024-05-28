import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import {COLORS} from '../../constants';

export default function PetCarousel(props) {
  const images = props.images;

  return (
    <View style={styles.carouselContainer}>
      <SliderBox
        images={images}
        dotColor={COLORS.primary}
        inactiveDotColor={COLORS.quaternary}
        ImageComponentStyle={styles.imageSlide}
        autoplay
        circleLoop
        autoplayInterval={3000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageSlide: {
    width: '100%',
    height: 510,
    marginBottom: 20,
    position: 'relative',
    objectFit: 'cover',
  },

  carouselContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
