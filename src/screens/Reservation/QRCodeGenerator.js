import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, SIZES } from '../../constants';

const QRCodeGenerator = ({ data }) => {
    return (
        <View style={styles.container}>
            <Svg
                height={SIZES.height / 6}
                width={SIZES.height / 6}
            >
                <Rect x="0" y="0" width="200" height="200" fill="white" />
                <QRCode
                    value={data}
                    size={SIZES.height / 6}
                    backgroundColor={COLORS.bgr}
                    color={COLORS.primary}
                    quietZone={10}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export default QRCodeGenerator;
