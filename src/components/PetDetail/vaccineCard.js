import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { AVATARS, BRS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CarouselPost from '../Social/carouselPost';
import { format } from 'date-fns';
import { userDataSelector } from '../../store/sellectors';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import VaccineDetail from './vaccineDetail';

const VaccineCard = ({ vaccineData, petData, deleteVaccine }) => {

    const userData = useSelector(userDataSelector)
    const navigation = useNavigation()
    const shop = userData.role === 'Staff' ? true : false
    const [showModal, setShowModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handlePressMenu = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleEditVaccine = (id) => {
        setShowModal(!showModal)
        navigation.navigate('CreateVaccination', {
            vaccineId: id,
            id: petData.id,
            vaccine: true,
            petData: petData
        })
    }

    const handleDeleteVaccine = (id) => {
        setShowModal(!showModal)
        deleteVaccine(id)
    }

    const MomentModal = ({ id }) => {
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => setShowModal(!showModal)}
                >
                    <View style={[styles.modal]}>
                        <View style={styles.modalContent}>
                            <View style={{ position: 'relative' }}>
                                <View style={{ padding: SIZES.s, flexDirection: 'column', alignItems: 'flex-start', gap: SIZES.m }}>
                                    <Pressable
                                        onPress={() => handleEditVaccine(id)}
                                        style={{ alignItems: 'center', flexDirection: 'row', gap: SIZES.s }}>
                                        <Ionicons name="create" size={ICONS.m} color={COLORS.primary} />
                                        <Text style={TEXTS.content} >Sửa</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => handleDeleteVaccine(id)}
                                        style={{ alignItems: 'center', flexDirection: 'row', gap: SIZES.s }}>
                                        <Ionicons name="trash" size={ICONS.m} color={COLORS.primary} />
                                        <Text style={TEXTS.content} >Xóa</Text>
                                    </Pressable>
                                </View>
                                <Pressable
                                    onPress={() => setShowModal(!showModal)}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                    }}>
                                    <Ionicons name="close-circle" size={ICONS.xm} color={COLORS.blackBold} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );

    }

    return (
        <View style={[styles.container, SHADOWS.s]}>
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
                <Pressable
                    onPress={handlePressMenu}
                    style={{
                        paddingTop: SIZES.s / 2,
                    }}>
                    <Text style={TEXTS.content}>Đã tiêm phòng Vắc-xin <Text style={{ color: COLORS.black, fontWeight: '500' }}>{vaccineData.vaccinationType}</Text></Text>
                    <Text style={TEXTS.content}>Từ ngày <Text style={{ color: COLORS.black, fontWeight: '500' }}>{format(vaccineData.vaccinationDate, 'dd/MM/yyyy')}</Text></Text>
                    <Text style={TEXTS.content}>Hạn đến <Text style={{ color: COLORS.black, fontWeight: '500' }}>{format(vaccineData.expireTime, 'dd/MM/yyyy')}</Text></Text>

                </Pressable>
                <VaccineDetail vaccineData={vaccineData} petData={petData} isVisible={modalVisible} onClose={handleCloseModal} />

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
            {shop && (
                <Pressable
                    onPress={() => setShowModal(!showModal)}
                    style={{
                        position: 'absolute',
                        top: "3%",
                        right: "5%",
                    }}>
                    <Ionicons name="ellipsis-horizontal" size={ICONS.m} color={COLORS.black} />
                </Pressable>
            )}
            <MomentModal id={vaccineData.id} />
        </View>
    )
}

export default VaccineCard

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
        padding: 20,
        width: '50%',
        maxHeight: '80%',
    },
    container: {
        flex: 1,
        width: SIZES.width - SIZES.m * 2,
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