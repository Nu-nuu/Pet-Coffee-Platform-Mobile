import React, { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../../constants';
import { createCommentThunk } from '../../../store/apiThunk/commentThunk';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'react-native-image-picker';
import { NativeBaseProvider } from 'native-base';
import ErrorModal from '../../Alert/errorModal';
import LoadingModal from '../../Alert/loadingModal';
import { userDataSelector } from '../../../store/sellectors';
import Loading from '../../Alert/modalSimple/loading';
import LoadingMin from '../../Alert/modalSimple/loadingMin';

const CreateComment = ({ avt, mL, width, reply, postId, commentId, onSuccess, navigation }) => {

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const userData = useSelector(userDataSelector)
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const shopId = userData?.shopResponses[0]?.id
    const today = new Date();

    const selectImages = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, response => {
            if (!response.didCancel) {
                setSelectedImages(response.assets || []);
            }
        });
    };
    const handleSendComment = () => {
        const formData = new FormData();
        formData.append('Content', text);
        formData.append('PostId', postId);

        if (shopId) {
            formData.append('shopId', shopId);
        }

        if (reply === 'Viết phản hồi...') {
            formData.append('ParentCommentId', commentId);
        }
        selectedImages.forEach((image, index) => {
            formData.append(`image`, {
                uri: image.uri,
                type: image.type,
                name: `${image.fileName}-image-${today}.jpg`,
            });
        });
        setShowLoadingModal(true);
        dispatch(createCommentThunk(formData))
            .unwrap()
            .then(() => {
                setText('');
                setSelectedImages([]);
                setShowLoadingModal(false);
                onSuccess();
            })
            .catch(error => {
                console.error('Error creating comment:', error);
                setShowLoadingModal(false);
                setErrorMsg(`${error.message}`);
                setShowErrorModal(true);
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

    return (
        <NativeBaseProvider>
            <View style={{ flexDirection: 'row', marginLeft: mL }}>
                <ErrorModal
                    showErrorModal={showErrorModal}
                    setShowErrorModal={setShowErrorModal}
                    errorMsg={errorMsg}
                    setErrorMsg={setErrorMsg}
                />
                <Image
                    source={{ uri: userData.avatar }}
                    style={{ height: avt, width: avt, borderRadius: 50 }}
                />
                <View style={[styles.commentContainer, { width: width }]}>
                    <TextInput
                        onChangeText={setText}
                        value={text}
                        placeholder={reply}
                        multiline
                        placeholderTextColor={COLORS.gray2}
                        style={styles.input}
                    />
                    {selectedImages.length > 0 && (
                        <FlatList
                            data={selectedImages}
                            renderItem={renderSelectedImages}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                        />
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
                </View>

            </View>
            {showLoadingModal && (
                <LoadingMin />
            )}
        </NativeBaseProvider>
    );
};

export default CreateComment;

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
    selectedImage: {
        width: 150,
        height: 200,
        resizeMode: "cover",
        margin: SIZES.s,
        borderRadius: SIZES.s,
    },
});
