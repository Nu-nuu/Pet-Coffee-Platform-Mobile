import { Image, Pressable, StyleSheet, Text, View, Modal } from 'react-native'
import React from 'react'
import { AVATARS, BRS, COLORS, ICONS, SIZES, TEXTS } from '../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import CarouselPost from '../Social/carouselPost';
import { format } from 'date-fns';

const VaccineDetail = ({ isVisible, onClose, vaccineData, petData }) => {
    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={[styles.modal]}>
                    <View style={styles.modalContent}>
                        <View style={[styles.container]}>
                            <View style={styles.headerContainer}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }} >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: SIZES.s,
                                    }} >
                                        <Image
                                            source={{ uri: petData.avatar }}
                                            style={[AVATARS.mid, { alignSelf: 'flex-start' }]}
                                        />
                                        <View style={{
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                        }}>
                                            <Text style={styles.title} numberOfLines={1}>{petData.name}</Text>

                                        </View>
                                    </View>

                                </View>
                                <View style={{
                                    paddingTop: SIZES.s / 2,
                                }}>
                                    <Text style={TEXTS.content}>Đã tiêm phòng Vắc-xin <Text style={{ color: COLORS.black, fontWeight: '500' }}>{vaccineData.vaccinationType}</Text></Text>
                                    <Text style={TEXTS.content}>Từ ngày <Text style={{ color: COLORS.black, fontWeight: '500' }}>{format(vaccineData.vaccinationDate, 'dd/MM/yyyy')}</Text></Text>
                                    <Text style={TEXTS.content}>Hạn đến <Text style={{ color: COLORS.black, fontWeight: '500' }}>{format(vaccineData.expireTime, 'dd/MM/yyyy')}</Text></Text>

                                </View>
                            </View>
                            {vaccineData.photoEvidence && vaccineData.photoEvidence !== '' && (
                                <View style={styles.imageContainer}>
                                    {vaccineData.photoEvidence.split(';').length > 1 ? (
                                        <CarouselPost images={vaccineData.photoEvidence.split(';')} />
                                    ) : (
                                        <Image
                                            source={{ uri: vaccineData.photoEvidence }}
                                            style={styles.image}
                                        />
                                    )}
                                </View>
                            )}

                            <Pressable
                                onPress={onClose}
                                style={{
                                    position: 'absolute',
                                    top: "3%",
                                    right: "5%",
                                }}>
                                <Ionicons name="close-circle" size={ICONS.m} color={COLORS.black} />
                            </Pressable>

                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default VaccineDetail

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
    },
    container: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: BRS.out,
        position: 'relative'
    },
    headerContainer: {
        padding: SIZES.m,
    },
    imageProfile: {
        height: 40,
        width: 40,
        borderRadius: 50,
        alignSelf: 'flex-start'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    isWith: {
        flexDirection: 'row',
        width: 200,
    },
    postTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inforProfile: {
        paddingLeft: SIZES.s,
    },
    imageContainer: {
        width: '100%',
        overflow: 'hidden',

    },
    image: {
        height: SIZES.height / 2,
        width: SIZES.width - SIZES.m * 2,
        resizeMode: 'cover',
        borderWidth: 0.5,
        borderColor: COLORS.gray2,
    },
    detail: {
        padding: SIZES.s,
    },
    title: {
        fontWeight: 'bold',
        fontSize: SIZES.m,
        color: COLORS.black,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.s,
        width: '50%',
        height: 40,
        gap: SIZES.s,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    text: {
        fontSize: SIZES.m,
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
        gap: 5,
    },
    totalLike: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        height: 40,
        gap: SIZES.s,
        paddingLeft: 22,
    },
    totalComment: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '50%',
        height: 40,
        gap: SIZES.s,
        paddingRight: 22,
    },
    contentContainer: {
        paddingHorizontal: SIZES.s,
    },
    textContent: {
        color: COLORS.black,
        fontSize: SIZES.m,
    },
    textTotalButton: {
        fontSize: SIZES.m,
        fontWeight: 'bold',
    },
})