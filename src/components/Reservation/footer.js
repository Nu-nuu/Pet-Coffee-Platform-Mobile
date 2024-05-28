// Footer.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../constants';
import formatDayReservation from './formatDayReservation';
import formatTime7Reservation from './formatTime7Reservation';

const Footer = ({ count, onPress, day, timeStart, timeEnd, area, title, titleStatus, onPressCancel, availableSeat }) => {
    const [step, setStep] = useState(1);
    const [isDisabled, setIsDisabled] = useState(true);

    const canProceedToArea = !!count && !!day && !!timeStart && !!timeEnd && availableSeat;
    const canProceedToPay = !!area;

    useEffect(() => {
        if (step === 1) {
            setIsDisabled(!canProceedToArea);
        } else if (step === 2) {
            setIsDisabled(!canProceedToPay);
        }
    }, [canProceedToArea, canProceedToPay, step, availableSeat])

    const handleStepStatusPress = () => {
        setStep(step + 1);
        onPress();
    };

    return (
        <View style={styles.container}>
            {!titleStatus ? (
                <>
                    <View>
                        {!!day && !!timeStart && !!timeEnd && (
                            <View>
                                <Text style={[TEXTS.content, { color: COLORS.black, }]}>{formatDayReservation(day)}</Text>
                                <Text style={[TEXTS.content, { color: COLORS.black, }]}>{formatTime7Reservation(timeStart)} - {formatTime7Reservation(timeEnd)}</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row' }}>
                            {!!count && (
                                <Text style={[TEXTS.content, { color: COLORS.black, }]}>{count} người </Text>
                            )}
                            {!!area && (
                                <Text style={[TEXTS.content, { color: COLORS.black, }]}>| Tầng {area}</Text>
                            )}
                        </View>
                    </View>
                </>
            ) : (
                <View>
                    <Pressable onPress={onPressCancel}
                        style={[{
                            paddingVertical: SIZES.s,
                            backgroundColor: COLORS.gray1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: SIZES.s
                        }, BUTTONS.recMax]}
                    >
                        <Text style={{ fontSize: SIZES.m, color: COLORS.black, fontWeight: '500' }}>Hủy</Text>
                    </Pressable>
                </View>
            )
            }
            <Pressable
                onPress={handleStepStatusPress}
                style={[{
                    paddingVertical: SIZES.s,
                    backgroundColor: isDisabled ? COLORS.gray1 : COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: SIZES.s
                }, BUTTONS.recMax]}
                disabled={isDisabled}
            >
                <Text style={{ fontSize: SIZES.m, color: isDisabled ? COLORS.black : COLORS.white, fontWeight: '500' }}>{title}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: SIZES.height / 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SIZES.s,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray1,
    },
});

export default Footer;
