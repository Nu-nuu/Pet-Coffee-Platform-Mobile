import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import { COLORS, ICONS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TimePicker = ({ onSelectStartTime, onSelectEndTime, start, end, startSelect, endSelect }) => {

    const startTimeDefault = parseInt(start?.split(':')[0]);
    const endTimeDefault = parseInt(end?.split(':')[0]);

    const startTimeSelect = new Date(startSelect).getUTCHours();
    const endTimeSelect = new Date(endSelect).getUTCHours();

    const [selectedStartHour, setSelectedStartHour] = useState(startTimeSelect ? startTimeSelect : startTimeDefault);
    const [selectedEndHour, setSelectedEndHour] = useState(endTimeSelect ? endTimeSelect : startTimeDefault + 1);

    const [isModalStartVisible, setIsModalStartVisible] = useState(false);
    const [isModalEndVisible, setIsModalEndVisible] = useState(false);


    const timeFrom = startTimeDefault;
    const timeTo = endTimeDefault;

    const startHours = Array.from({ length: timeTo - timeFrom }, (_, index) => (timeFrom + index) % 24);
    const endHours = selectedStartHour ? Array.from({ length: timeTo - selectedStartHour }, (_, index) => (selectedStartHour + 1 + index) % 24) : [];

    const handleStartHourSelect = (hour) => {
        setIsModalStartVisible(false);
        setSelectedStartHour(hour);
        setSelectedEndHour(null);
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const selectedStartTime = new Date(`${year}-${month}-${day}T${String(hour).padStart(2, '0')}:00:00.000Z`).toISOString();
        const selectedEndTime = new Date(`${year}-${month}-${day}T${String(hour + 1).padStart(2, '0')}:00:00.000Z`).toISOString();
        onSelectStartTime(selectedStartTime);
        onSelectEndTime(selectedEndTime);

    };
    const handleEndHourSelect = (hour) => {
        setIsModalEndVisible(false);
        setSelectedEndHour(hour);
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const selectedEndTime = new Date(`${year}-${month}-${day}T${String(hour).padStart(2, '0')}:00:00.000Z`).toISOString();
        onSelectEndTime(selectedEndTime);
    };

    const renderHour = ({ item }) => (
        <TouchableOpacity onPress={() => handleStartHourSelect(item)} style={[styles.hour, item === selectedStartHour && styles.selectedHour]}>
            <Text style={[TEXTS.heading, item === selectedStartHour && styles.selectedText]}>{String(item).padStart(2, '0')}:00</Text>
        </TouchableOpacity>
    );

    const renderEndHour = ({ item }) => (
        <TouchableOpacity disable={selectedStartHour} onPress={() => handleEndHourSelect(item)} style={[styles.hour, item === selectedEndHour && styles.selectedHour]}>
            <Text style={[TEXTS.heading, item === selectedEndHour && styles.selectedText]}>{String(item).padStart(2, '0')}:00</Text>
        </TouchableOpacity>
    );

    return (

        <View style={styles.container}>
            <View style={styles.timeContainer}>
                <View style={styles.titleTime}>
                    <Ionicons name="alarm" size={ICONS.m} color={COLORS.primary} />
                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Thời gian bắt đầu</Text>
                </View>
                <TouchableOpacity onPress={() => setIsModalStartVisible(true)} style={styles.containerPicker}>
                    <Text style={TEXTS.heading}>{selectedStartHour !== null ? `${String(selectedStartHour).padStart(2, '0')}:00` : 'Chọn giờ'}</Text>
                </TouchableOpacity>
                <Modal
                    visible={isModalStartVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setIsModalStartVisible(false)}
                >
                    <Pressable onPress={() => setIsModalStartVisible(false)} style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={startHours}
                                renderItem={renderHour}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.hourList}
                                getItemLayout={(data, index) => ({
                                    length: 50,
                                    offset: 50 * index,
                                    index,
                                })}
                                snapToInterval={50}
                                decelerationRate="fast"
                                showsVerticalScrollIndicator={false}
                            />

                        </View>
                    </Pressable>
                </Modal>
            </View>
            <View style={styles.timeContainer}>
                <View style={styles.titleTime}>
                    <Ionicons name="alarm" size={ICONS.m} color={COLORS.primary} />
                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Thời gian kết thúc</Text>
                </View>
                <TouchableOpacity onPress={() => setIsModalEndVisible(true)} style={styles.containerPicker}>
                    <Text style={TEXTS.heading}>{selectedEndHour !== null ? `${String(selectedEndHour).padStart(2, '0')}:00` : `${String(selectedStartHour + 1).padStart(2, '0')}:00`}</Text>
                </TouchableOpacity>
                <Modal
                    visible={isModalEndVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setIsModalEndVisible(false)}
                >
                    <Pressable onPress={() => setIsModalEndVisible(false)} style={styles.modalContainer}>
                        <View style={styles.modalEndContent}>
                            <FlatList
                                data={endHours}
                                renderItem={renderEndHour}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.hourList}
                                getItemLayout={(data, index) => ({
                                    length: 50,
                                    offset: 50 * index,
                                    index,
                                })}
                                snapToInterval={50}
                                decelerationRate="fast"
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </Pressable>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: COLORS.gray2,
        flexDirection: 'column',
        gap: SIZES.m,

    },
    containerPicker: {
        width: SIZES.width / 3.4 + SIZES.s / 2,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: SIZES.s,
        borderStartWidth: 1,
        borderColor: COLORS.gray1,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    hourList: {
        flexGrow: 1,
    },
    hour: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 49,
    },
    selectedHour: {
        borderRadius: 8,
        backgroundColor: COLORS.gray1
    },
    selectedText: {
        color: COLORS.black

    },
    timeText: {
        fontSize: 18,
        color: COLORS.blackBold,

    },
    titleTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,

    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.white500,
    },
    modalContent: {
        height: SIZES.height / 6,
        width: SIZES.width / 3.4,
        position: 'absolute',
        right: '30%',
        bottom: SIZES.height / 4.35,
        backgroundColor: COLORS.white,
        padding: 5,
        borderRadius: 10,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    modalEndContent: {
        height: SIZES.height / 6,
        width: SIZES.width / 3.4,
        position: 'absolute',
        right: '30%',
        bottom: SIZES.height / 6.35,
        backgroundColor: COLORS.white,
        padding: 5,
        borderRadius: 10,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },

});

export default TimePicker;
