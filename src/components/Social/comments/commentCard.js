import { StyleSheet, Text, View, Image, Pressable, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { COLORS, SIZES, TEXTS } from '../../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import formatTime from './../formatTime';
import { userDataSelector } from '../../../store/sellectors';
import { useDispatch, useSelector } from 'react-redux';
import ModalEllipsis from '../reports/modalEllipsis';
import * as ImagePicker from 'react-native-image-picker';
import { updateCommentThunk } from '../../../store/apiThunk/commentThunk';
import LoadingMin from '../../Alert/modalSimple/loadingMin';
import ErrorModal from '../../Alert/errorModal';

const CommentCard = ({ comment, avt, mL, width, reply, delComment, editComment }) => {
    const userData = useSelector(userDataSelector);
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [showEditComment, setShowEditComment] = useState(false);
    const [commentId, setCommentId] = useState(0);

    const handleCloseModal = () => {
        setModalVisible(false);
    };
    const onPressCommentDetail = () => {
        navigation.navigate('CommentDetail', {
            postId: comment.postId,
            commentId: comment.id,
        });
    };

    const handleReportPress = () => {
        setModalVisible(true);
    };

    const [text, setText] = useState('');
    const [showPickImage, setShowPickImage] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [clearImage, setClearImage] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const today = new Date();

    const selectImages = () => {
        setShowPickImage(true)
        ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, response => {
            if (!response.didCancel) {
                setSelectedImages(response.assets || []);
            } else {
                setShowPickImage(false)
                setClearImage(true)

            }
        });
    };

    const renderSelectedImages = ({ item, index }) => (
        <View style={styles.selectedImageContainer}>
            <Image source={{ uri: item.uri }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeSelectedImage(index)}>
                <Ionicons name='close' size={20} color={COLORS.black} />
            </TouchableOpacity>
        </View>
    );

    const removeSelectedImage = (indexToRemove) => {
        setSelectedImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };


    const handlePressDelComment = (id) => {
        delComment(id)
    }

    const handlePressEditComment = (id) => {
        setShowEditComment(true)
        setText(comment.content)
        setCommentId(id)
        if (comment?.image?.length > 0) {
            setClearImage(true)
        }

    }

    const handleShowEditComment = () => {
        setShowEditComment(false)
        setShowPickImage(false)
        setClearImage(true)
        setSelectedImages([])

    }
    const handleEditComment = () => {
        editComment()
    }


    const handleSendComment = () => {
        const formData = new FormData();
        formData.append('Id', commentId);
        formData.append('Content', text);

        selectedImages.forEach((image, index) => {
            formData.append(`NewImage`, {
                uri: image.uri,
                type: image.type,
                name: `${image.fileName}-image-${today}.jpg`,
            });
        });

        setShowLoadingModal(true);
        dispatch(updateCommentThunk(formData))
            .unwrap()
            .then(() => {
                handleShowEditComment()
                handleEditComment()
                setShowLoadingModal(false);

            })
            .catch(error => {
                console.error('Error creating comment:', error);
                setShowLoadingModal(false);
                setErrorMsg(`${error.message}`);
                setShowErrorModal(true);
            });
    };

    return (
        <View>
            <View style={{
                flexDirection: 'row',
                marginLeft: mL,
                width: width
            }}>
                <ErrorModal
                    showErrorModal={showErrorModal}
                    setShowErrorModal={setShowErrorModal}
                    errorMsg={errorMsg}
                    setErrorMsg={setErrorMsg}
                />
                <Image source={{ uri: comment.commentorImage }}
                    style={{ height: avt, width: avt, borderRadius: 50 }}
                />
                {showEditComment ? (
                    <View style={[styles.commentContainer, { width: '95%', position: 'relative' }]}>
                        <TextInput
                            onChangeText={setText}
                            value={text}
                            multiline
                            placeholderTextColor={COLORS.gray2}
                            style={styles.input}
                        />
                        {showPickImage ? (
                            <>
                                {selectedImages.length > 0 && (
                                    <FlatList
                                        data={selectedImages}
                                        renderItem={renderSelectedImages}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {clearImage &&
                                    (<View style={styles.selectedImageContainer}>
                                        <Image source={{ uri: comment.image }} style={styles.selectedImage} />
                                        <TouchableOpacity style={styles.deleteButtons} onPress={() => setClearImage(false)}>
                                            <Ionicons name='close' size={20} color={COLORS.black} />
                                        </TouchableOpacity>
                                    </View>)
                                }
                            </>
                        )}
                        <View style={styles.iconsContainer}>
                            <Pressable
                                disabled={showLoadingModal}
                                onPress={selectImages}>
                                <Ionicons name="images" size={18} color={COLORS.primary} />
                            </Pressable>
                            <Pressable
                                onPress={handleSendComment} disabled={(!text || /^\s*$/.test(text) || showLoadingModal)}>
                                <Ionicons name="send" size={18} color={(!text || /^\s*$/.test(text) || showLoadingModal) ? COLORS.gray2 : COLORS.primary} />
                            </Pressable>
                        </View>
                        {!showLoadingModal && (
                            <Pressable
                                onPress={handleShowEditComment}
                                style={{ position: 'absolute', bottom: '3%', left: '3%', }}>
                                <Text style={[TEXTS.subContent, { color: COLORS.primary, textDecorationLine: 'underline' }]}>Hủy</Text>
                            </Pressable>
                        )}
                        {showLoadingModal && (
                            <LoadingMin />
                        )}
                    </View>
                ) : (
                    <View>
                        <View style={{
                            flexDirection: 'column',
                            marginLeft: "5%",
                            backgroundColor: COLORS.quaternary,
                            padding: SIZES.s,
                            borderRadius: SIZES.s / 2,
                        }}>
                            <Text style={{
                                fontSize: SIZES.m,
                                fontWeight: 'bold',
                            }}>{comment.commentorName}</Text>
                            <Text style={{}}>
                                {comment.content}
                            </Text>
                            {comment.image != null && (
                                <View style={{

                                }}>
                                    <FlatList
                                        data={comment.image.split(';')}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <Image
                                                source={{ uri: item }}
                                                style={{
                                                    height: 200, width: 150,
                                                    borderRadius: SIZES.s, marginHorizontal: SIZES.s / 2,
                                                    marginTop: SIZES.s / 2,
                                                    borderWidth: 0.5,
                                                    borderColor: COLORS.gray2,
                                                }}
                                            />
                                        )}
                                    />
                                </View>
                            )}
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: SIZES.s,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: mL,
                                gap: SIZES.s,
                            }}>
                                <Text style={{}} >{formatTime(comment.createdAt)}</Text>
                                {reply !== false && (<Pressable onPress={onPressCommentDetail}>
                                    <Ionicons name="chatbubble-outline" size={22} />
                                </Pressable>)}
                            </View>
                            <Pressable onPress={handleReportPress}>
                                <Ionicons name="ellipsis-horizontal" size={20} />
                            </Pressable>
                            <ModalEllipsis onPressEditComment={handlePressEditComment} onPressDeleteComment={handlePressDelComment} isVisible={modalVisible} onClose={handleCloseModal} isOwner={!!(comment.createdById === userData.id)} commentId={comment.id} isPost={false} />
                        </View>
                        {comment.totalSubComments != '0' && comment.totalSubComments !== '' && reply !== false && (
                            <Pressable onPress={onPressCommentDetail}>
                                <View style={{
                                    flexDirection: 'row',
                                    gap: SIZES.s,
                                    paddingLeft: SIZES.xxl,
                                    marginBottom: SIZES.s,
                                }}>
                                    <Ionicons name="return-down-forward" size={20} />
                                    <Text style={{
                                        fontSize: SIZES.m,
                                        fontWeight: 'bold',
                                    }}>{comment.totalSubComments} phản hồi</Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                )
                }
            </View >

        </View >

    )
}

export default CommentCard

const styles = StyleSheet.create({
    commentContainer: {
        flexDirection: 'column',
        backgroundColor: COLORS.quaternary,
        borderRadius: SIZES.m,
        marginLeft: SIZES.s,
        marginBottom: SIZES.s,
    },
    input: {
        padding: SIZES.s,
        fontSize: SIZES.body3
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: SIZES.s,
        paddingRight: SIZES.s / 2,
        paddingBottom: SIZES.s / 2
    },
    selectedImageContainer: {
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
        padding: 5,
    },
    deleteButtons: {
        position: 'absolute',
        top: 5,
        left: 145,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
        padding: 5,
    },
    selectedImage: {
        width: 150,
        height: 200,
        resizeMode: "cover",
        margin: SIZES.s,
        borderRadius: SIZES.s,

    },

})