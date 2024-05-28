import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, subDays, addDays, isSameDay, getYear, eachMonthOfInterval } from 'date-fns';
import { COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import { Modal } from 'react-native';
import { FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DayPicker = ({ onSelectDay, daySelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(daySelect);
    const [isMonthYearModalVisible, setIsMonthYearModalVisible] = useState(false);

    const toggleMonthYearModal = () => {
        setIsMonthYearModalVisible(!isMonthYearModalVisible);
    };

    const handleMonthYearPress = (item) => {
        setCurrentDate(new Date(item.year, item.monthIndex));
        toggleMonthYearModal();
    };

    const getMonthName = (monthIndex) => {
        const MonthNames = [
            'Tháng một',
            'Tháng hai',
            'Tháng ba',
            'Tháng tư',
            'Tháng năm',
            'Tháng sáu',
            'Tháng bảy',
            'Tháng tám',
            'Tháng chín',
            'Tháng mười',
            'Tháng mười một',
            'Tháng mười hai',
        ];

        return MonthNames[monthIndex];
    };

    const generateMonthYearList = () => {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const months = eachMonthOfInterval({ start: new Date(), end: new Date(nextYear, 11) });

        return months.map((month) => ({
            monthIndex: month.getMonth(),
            monthName: getMonthName(month.getMonth()),
            year: month.getFullYear(),
        }));
    };

    const renderMonthYearPicker = () => (
        <View style={styles.monthYearPicker}>
            <TouchableOpacity onPress={toggleMonthYearModal} style={{
                flexDirection: 'row',
                margin: SIZES.s,
                paddingHorizontal: SIZES.s / 2,
                gap: SIZES.s,
                alignItems: 'center'
            }}>
                <Text style={styles.monthYearText}>{getMonthName(currentDate.getMonth())}, {currentDate.getFullYear()}</Text>

                <Ionicons name="caret-down-outline" size={20} color={COLORS.black} />
            </TouchableOpacity>

            <Modal
                visible={isMonthYearModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={toggleMonthYearModal}
            >
                <TouchableWithoutFeedback onPress={toggleMonthYearModal}>
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={generateMonthYearList()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.monthYearItem}
                                        onPress={() => handleMonthYearPress(item)}
                                    >
                                        <Text style={styles.monthYearItemText}>{item.monthName}, {item.year}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );

    const goToPreviousMonth = () => {
        const previousMonth = subMonths(currentDate, 1);
        const today = new Date();
        if (previousMonth >= startOfMonth(today)) {
            setCurrentDate(previousMonth);
        }
    };

    const goToNextMonth = () => {
        const nextMonth = addMonths(currentDate, 1);
        const maxAllowedMonth = addMonths(new Date(), 12 * 2);

        if (nextMonth <= maxAllowedMonth) {
            setCurrentDate(nextMonth);
        }
    };

    const handleDayPress = (day) => {
        setSelectedDate(day);
        onSelectDay(day)
    };

    const renderDays = () => {
        const today = new Date();
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const daysOfMonth = eachDayOfInterval({ start, end });

        const firstDayOfWeek = getDay(start);
        const daysBefore = Array.from({ length: firstDayOfWeek }, (_, index) => {
            const day = subMonths(start, 1);
            return subDays(day, firstDayOfWeek - index);
        });

        const lastDayOfWeek = getDay(end);
        const daysAfter = Array.from({ length: 6 - lastDayOfWeek }, (_, index) => {
            const day = addMonths(end, 1);
            return addDays(day, index + 1);
        });

        const allDays = [...daysBefore, ...daysOfMonth, ...daysAfter];

        return allDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(selectedDate, day);
            const isToday = isSameDay(day, today);
            const isPastDay = isCurrentMonth && day < subDays(today, 1);
            const dayStyle = {
                ...styles.day,
                opacity: isCurrentMonth ? (isPastDay ? 0.5 : 1) : 0,
                backgroundColor: isSelected ? COLORS.primary : isToday ? COLORS.primary300 : 'transparent',
            };

            return (
                <TouchableOpacity
                    key={index}
                    style={dayStyle}
                    onPress={() => handleDayPress(day)}
                    disabled={!isCurrentMonth || isPastDay || isToday}
                >
                    <Text style={[TEXTS.subContent, { color: isSelected ? COLORS.white : isToday ? COLORS.error : COLORS.black, },]}>
                        {format(day, 'd')}
                    </Text>
                </TouchableOpacity>
            );
        });
    };

    const renderWeeks = () => {
        const days = renderDays();
        const weeks = [];
        let week = [];
        days.forEach((day, index) => {
            week.push(day);
            if ((index + 1) % 7 === 0) {
                weeks.push(week);
                week = [];
            }
        });
        if (week.length > 0) {
            weeks.push(week);
        }
        return weeks.map((week, index) => (
            <View key={index} style={styles.week}>
                {week}
            </View>
        ));
    };

    const renderDates = () => {
        const dates = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return (
            <View style={{
                flexDirection: 'row',
                width: SIZES.width - SIZES.m * 2,
                paddingBottom: SIZES.s,
            }}>
                {dates.map((dates, index) => (
                    <View key={index} style={{
                        width: ((SIZES.width - SIZES.m * 2) / 7),
                        alignItems: 'center',
                    }}>
                        <Text style={[{
                            fontSize: SIZES.m,
                            fontWeight: '500',
                        }]}>
                            {dates}
                        </Text>
                    </View>
                ))
                }
            </View >
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {renderMonthYearPicker()}
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: SIZES.xl,
                    alignItems: 'center',
                    gap: SIZES.xxl
                }}>
                    <TouchableOpacity onPress={goToPreviousMonth}>
                        <Ionicons name="chevron-back" size={ICONS.xm} color={COLORS.black} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToNextMonth}>
                        <Ionicons name="chevron-forward" size={ICONS.xm} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>{renderDates()}</View>
            <View style={styles.daysContainer}>{renderWeeks()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: SIZES.height / 2,
        borderWidth: 1,
        borderColor: COLORS.gray1,
        borderRadius: SIZES.s,
        backgroundColor: COLORS.white,
        ...SHADOWS.s
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SIZES.s,
    },
    daysContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    week: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 5,
    },
    day: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        borderRadius: 20,
    },
    monthYearPicker: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    monthYearText: {
        fontSize: SIZES.l,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: COLORS.white500,
    },
    modalContent: {
        width: SIZES.width / 2.2,
        height: SIZES.height / 9,
        margin: 10,
        padding: 10,
        borderRadius: 8,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        position: 'absolute',
        top: SIZES.height / 5,
        left: SIZES.s * 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: COLORS.white,

    },
    monthYearItem: {
        paddingVertical: 10,
    },
    monthYearItemText: {
        fontSize: 18,
    },
});

export default DayPicker;
