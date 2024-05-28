import React, { useState } from 'react';
import { StyleSheet, Text, View, SectionList, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../../constants';
import { reportCommentThunk, reportPostThunk } from '../../../store/apiThunk/reportThunk';
import { useDispatch } from 'react-redux';
import ConfirmModal from '../../Alert/confirmModal';
import Loading from '../../Alert/modalSimple/loading';
import Success from '../../Alert/modalSimple/success';
import ErrorReservation from '../../Alert/modalSimple/errorReservation';

const Report = ({ route, navigation }) => {

    const dispatch = useDispatch();
    const { postId, commentId, isPost } = route.params;
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorReservationModal, setShowErrorReservationModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const reasons = [
        {
            title: 'Chọn lý do',
            data: [
                'Xuất hiện quá nhiều lần', // AppearTooMuch
                'Hình ảnh nhạy cảm', // Photos
                'Quá riêng tư', // TooPrivate
                'Không phù hợp', // NotSuitable
                'Ngôn ngữ không phù hợp',
                'Bạo lực', // Violence
                'Nguy hiểm', // Suicidal
                'Khác' // Other
            ]
        },
    ];
    const reasonToReportData = {
        'Xuất hiện quá nhiều lần': 'AppearTooMuch',
        'Hình ảnh nhạy cảm': 'NudePhotos',
        'Quá riêng tư': 'TooPrivate',
        'Không phù hợp': 'NotSuitable',
        'Nội dung không phù hợp': 'SensitiveContent',
        'Bạo lực': 'Violence',
        'Nguy hiểm': 'Suicidal',
        'Khác': otherReason
    };

    const handleSelectReason = (reason) => {
        setSelectedReason(reason)
        console.log(reason);
    };

    const handleOtherReasonChange = (reason) => {
        setOtherReason(reason)
    };

    const handleConfirmReport = () => {
        setShowConfirmModal(true)
    }


    const handleReport = async () => {
        setLoading(true);
        setShowConfirmModal(false);

        const reportData = {
            reportCategory: reasonToReportData[selectedReason]
        };
        try {
            let result;
            if (isPost) {
                result = await dispatch(reportPostThunk({
                    postId,
                    data: {
                        reportCategory: reportData.reportCategory
                    }
                })).unwrap();
            } else {
                console.log(reportData.reportCategory);
                result = await dispatch(reportCommentThunk({
                    commentId,
                    data: {
                        reportCategory: reportData.reportCategory
                    }
                })).unwrap();
            }

            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to report:', error);
            setErrorMsg(error.message || 'Failed to report due to an unexpected error');
            setShowErrorReservationModal(true);
        } finally {
            setLoading(false);
            setShowSuccessModal(false);
            navigation.goBack()

        }
    };


    const handleBack = () => {
        setShowErrorReservationModal(false)
        navigation.goBack();
    }
    return (
        <View style={styles.container}>
            {showConfirmModal && (
                <ConfirmModal
                    showConfirmModal={showConfirmModal}
                    setShowConfirmModal={setShowConfirmModal}
                    confirmMsg="Bạn chắc chắn muốn báo cáo vấn đề trên?"
                    onConfirm={handleReport}
                />
            )}
            {loading && (
                <Loading isModal={true} />
            )}
            {showSuccessModal && (
                <Success isModal={true} />
            )}
            {showErrorReservationModal && (
                <ErrorReservation
                    showErrorModal={showErrorReservationModal}
                    setShowErrorModal={setShowErrorReservationModal}
                    errorMsg={errorMsg}
                    onBackHome={handleBack} />

            )}
            <View style={{
                flexDirection: 'column',
                height: '100%',
                alignContent: 'space-between'

            }}>
                <SectionList

                    sections={reasons}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.item, selectedReason === item && styles.selectedItem]} // Apply selected style conditionally
                            onPress={() => handleSelectReason(item)}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                />
                {selectedReason === 'Khác' && (
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập lý do..."
                        value={otherReason}
                        onChangeText={handleOtherReasonChange}
                    />
                )}
                {selectedReason !== '' && (
                    <TouchableOpacity style={styles.doneButton} onPress={handleConfirmReport}>
                        <Text style={styles.doneText}>Báo cáo</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default Report;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 10,
        backgroundColor: COLORS.white,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray1,
    },
    selectedItem: {
        backgroundColor: COLORS.quaternary,
    },
    input: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    doneButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        borderRadius: 5,
    },
    doneText: {
        color: COLORS.white,
        fontSize: SIZES.m,
        fontWeight: '500'
    },
});
