// DayTime.js
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DayPicker from '../../components/Calendar/dayPicker';
import TimePicker from '../../components/Calendar/timePicker';
import Person from './person';
import { COLORS, SHADOWS, SIZES } from '../../constants';

const DayTime = ({ seat, endSelect, startSelect, daySelect, onSelectDay, onSelectTimeStart, onSelectTimeEnd, onSelectPerson, maxAvailableSeat, start, end }) => {

    const handleDaySelect = (day) => {
        onSelectDay(day);
    };

    const handleTimeStartSelect = (time) => {
        onSelectTimeStart(time);

    };

    const handleTimeEndSelect = (time) => {
        onSelectTimeEnd(time);

    }

    const handleCountChange = (newCount) => {
        onSelectPerson(newCount);
    };

    return (
        <View style={styles.daytime}>
            <View style={{
                padding: SIZES.m,
                flexDirection: 'column',
                gap: SIZES.s,
            }}>
                <Text style={{ fontWeight: 'bold', fontSize: SIZES.l, color: COLORS.black }}>Chọn ngày và thời gian đặt chỗ</Text>
                <View style={styles.selectDay} >
                    <DayPicker daySelect={daySelect} onSelectDay={handleDaySelect} />
                </View>
                <View style={[styles.selectTime, SHADOWS.s]}>
                    <TimePicker startSelect={startSelect} endSelect={endSelect} start={start} end={end} onSelectStartTime={handleTimeStartSelect} onSelectEndTime={handleTimeEndSelect} />
                    <Person seat={seat} onCountChange={handleCountChange} maxAvailableSeat={maxAvailableSeat} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    daytime: {
        flex: 1,
        backgroundColor: COLORS.bgr,
    },
    selectDay: {
    },
    selectTime: {
        backgroundColor: COLORS.white,
        padding: SIZES.m,
        flexDirection: 'column',
        gap: SIZES.m,
        paddingHorizontal: SIZES.m,
        borderWidth: 1,
        borderColor: COLORS.gray1,
        borderRadius: SIZES.s,
    },

});

export default DayTime;
