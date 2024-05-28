import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import {COLORS} from '../../constants';

export default function Carousel({images}) {
  
  return (
    <View style={styles.carouselContainer}>
      <SliderBox
        images={images}
        dotColor={COLORS.primary}
        inactiveDotColor={COLORS.white}
        ImageComponentStyle={styles.imageSlide}
        autoplay
        circleLoop
        autoplayInterval={10000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageSlide: {
    borderRadius: 15,
    width: '90%',
    marginTop: 15,
    height: 150,
    objectFit:'cover'
  },

  carouselContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
