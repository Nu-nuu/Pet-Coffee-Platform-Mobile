import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { AVATARS, BRS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import formatTime from '../Social/formatTime';
import CarouselPost from '../Social/carouselPost';
import { useSelector } from 'react-redux';
import { userDataSelector } from '../../store/sellectors';
import { useNavigation } from '@react-navigation/native';
import MomentDetail from './momentDetail';

const MomentCard = ({ momentData, petData, deleteMoment }) => {
    const userData = useSelector(userDataSelector)
    const navigation = useNavigation()
    const shop = userData.role === 'Staff' ? true : false

    const [showFullContent, setShowFullContent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handlePressMenu = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };


    const toggleShowFullContent = () => {
        setShowFullContent(!showFullContent);
    };

    const handleEditMoment = (id) => {
        setShowModal(!showModal)
        navigation.navigate('CreateMoment', {
            momentId: id,
            id: petData.id,
            moment: true,
            petData: petData
        })
    }

    const handleDeleteMoment = (id) => {
        setShowModal(!showModal)
        deleteMoment(id)
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
                                        onPress={() => handleEditMoment(id)}
                                        style={{ alignItems: 'center', flexDirection: 'row', gap: SIZES.s }}>
                                        <Ionicons name="create" size={ICONS.m} color={COLORS.primary} />
                                        <Text style={TEXTS.content} >Sửa</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => handleDeleteMoment(id)}
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
                <View style={styles.postTop}>
                    <View style={styles.row}>
                        <View >
                            <Image
                                source={{ uri: petData.avatar }}
                                style={AVATARS.mid}
                            />
                        </View>
                        <View style={styles.inforProfile}>
                            <View>
                                <Text style={styles.title} numberOfLines={1}>{petData.name}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text>{formatTime(momentData.createdAt)}</Text>
                                <View style={styles.category}>
                                    <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
                                </View>
                                {momentData.momentType != '' && (
                                    <View style={styles.isWith}>
                                        <Text style={styles.text}>

                                            {momentData.momentType === 'Eating'
                                                ? 'Ăn uống'
                                                : momentData.momentType === 'Playing'
                                                    ? 'Vui chơi'
                                                    : momentData.momentType === 'Walking'
                                                        ? 'Đi dạo'
                                                        : null
                                            }
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View >
                <Pressable
                    onPress={handlePressMenu}
                    style={styles.contentContainer}>
                    <Text style={[styles.textContent, { paddingBottom: SIZES.s }]} numberOfLines={showFullContent ? undefined : 7}>
                        {momentData.content.length > 100 && !showFullContent
                            ? momentData.content.substring(0, 100) + '...'
                            : momentData.content}
                    </Text>
                    {!showFullContent && momentData.content.length > 100 && (
                        <Pressable onPress={toggleShowFullContent}>
                            <Text style={[styles.title, { paddingBottom: SIZES.s }]}>Xem thêm</Text>
                        </Pressable>
                    )}

                </Pressable>
                <MomentDetail momentData={momentData} petData={petData} isVisible={modalVisible} onClose={handleCloseModal} />
            </View>
            {momentData.image && momentData.image !== '' && (
                <View style={styles.imageContainer}>
                    {momentData.image.split(';').length > 1 ? (
                        <CarouselPost images={momentData.image.split(';')} />
                    ) : (
                        <Image
                            source={{ uri: momentData.image }}
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
            <MomentModal id={momentData.id} />
        </View>
    )
}

export default MomentCard

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
    modalDetail: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentDetail: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        // maxHeight: '90%',
    },
    container: {
        flex: 1,
        width: SIZES.width - SIZES.m * 2,
        backgroundColor: COLORS.white,
        borderRadius: BRS.out,
        position: 'relative'
    },
    containerModal: {
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
    imageDetail: {
        height: SIZES.height / 2,
        width: '100%',
        borderRadius: 10,
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