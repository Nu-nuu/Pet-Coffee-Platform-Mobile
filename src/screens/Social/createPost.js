import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { createPostThunk, updatePostThunk } from '../../store/apiThunk/postThunk';
import { BUTTONS, COLORS, ICONS, SIZES, TEXTS } from '../../constants';
import TagCafe from '../../components/Social/tagCafe';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getPostCategoryThunk } from '../../store/apiThunk/postCategoryThunk';
import { allPetCoffeeShopsSelector, petCoffeeShopDetailSelector, postCategorySelector, userDataSelector } from '../../store/sellectors';
import ErrorModal from '../../components/Alert/errorModal';
import LoadingModal from '../../components/Alert/loadingModal';
import { NativeBaseProvider } from 'native-base';
import Loading from '../../components/Alert/modalSimple/loading';

export default function CreatePost() {
    const navigation = useNavigation();
    const route = useRoute();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCafeShop, setSelectedCafeShop] = useState(null);
    const [isModalCategory, setIsModalCategory] = useState(false);
    const [isModalCafeShop, setIsModalCafeShop] = useState(false);
    const [text, setText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const postCategory = useSelector(postCategorySelector);
    const shopList = useSelector(allPetCoffeeShopsSelector);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const userData = useSelector(userDataSelector)
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const today = new Date();

    const shopData = useSelector(petCoffeeShopDetailSelector)
    const shop = userData.role === 'Staff' ? true : false
    //========================EDIT POST=========================//
    const [editPost, setEditPost] = useState(false)
    const id = route.params?.id
    const content = route.params?.content
    const images = route.params?.images

    useEffect(() => {
        if (!id || !content) return;
        setText(content);
        setEditPost(true);
        if (images) {
            const imageUrls = images.split(';').map(uri => ({ uri, type: 'image/jpeg', name: uri.split('/').pop() }));
            setSelectedImages(imageUrls);
        }
    }, [id, content, images]);

    useLayoutEffect(() => {
        if (id) {
            navigation.setOptions({
                headerTitle: `Chỉnh sửa bài viết`,
                //về home
                headerRight: () => (
                    <Pressable style={{ paddingRight: SIZES.m }} onPress={() => {
                        navigation.navigate('TabGroup', { screen: 'Social' })
                    }}>
                        <Ionicons name="home" size={24} color={COLORS.black} />
                    </Pressable>
                ),
            })
        }
    }, [])

    const handleEditPost = async () => {
        const formData = new FormData();
        formData.append('PostId', id);
        formData.append('Content', text);
        selectedImages.forEach((image, index) => {
            formData.append('Image', {
                uri: image.uri,
                type: image.type,
                name: `${image.fileName}-image-${today}.jpg`,
            });
        });
        try {
            setShowLoadingModal(true);
            const res = await dispatch(updatePostThunk(formData)).unwrap();
            navigation.navigate('Social', { res });
        } catch (error) {
            console.error('Error updating post:', error);
            setErrorMsg(`${error.message}`);
            setShowErrorModal(true);
        } finally {
            setText('');
            setSelectedImages([]);
            setShowLoadingModal(false);
        }
    };

    //========================CREATE POST=========================//
    useEffect(() => {
        dispatch(getPostCategoryThunk())
    }, []);
    const shopId = userData?.shopResponses[0]?.id

    useEffect(() => {
        const passedImages = route.params?.selectedImages;

        if (passedImages) {
            setSelectedImages(passedImages);
        }
    }, []);

    const selectImages = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 }, response => {
            if (!response.didCancel) {
                setSelectedImages(response.assets || []);
            }
        });
    };

    const handlePost = () => {
        const formData = new FormData();
        formData.append('Content', text);

        if (shopId) {
            formData.append('shopId', shopId);
        }

        if (selectedCategory) {
            formData.append('CategoryIds', selectedCategory.id);
        }
        if (selectedCafeShop) {
            formData.append('PetCafeShopTagIds', selectedCafeShop.id);
        }
        selectedImages.forEach((image, index) => {
            formData.append(`image`, {
                uri: image.uri,
                type: image.type,
                name: `${image.fileName}-image-${today}.jpg`,
            });
        });
        setShowLoadingModal(true);
        dispatch(createPostThunk(formData))
            .unwrap()
            .then((response) => {
                setText('');
                setSelectedImages([]);
                setShowLoadingModal(false);
                navigation.navigate('Social', { response });
            })
            .catch(error => {
                console.error('Error creating post:', error);
                setShowLoadingModal(false);
                setErrorMsg(`${error.message}`);
                setShowErrorModal(true);
            })
    };

    const filteredShopList = shopList.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (query) => {
        setSearchQuery(query);
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

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
        setIsModalCategory(!isModalCategory);
    };

    const handleCafeShopPress = (cafeShop) => {
        setSelectedCafeShop(cafeShop);
        setIsModalCafeShop(!isModalCafeShop);
    };

    const cleanModalCafe = () => {
        setSelectedCafeShop(null);
    };
    const modalCafeShop = () => {
        setIsModalCafeShop(!isModalCafeShop);
        setSearchQuery('');
    };
    const modalCategory = () => {
        setIsModalCategory(!isModalCategory);
    };

    const renderCafeShopItem = ({ item }) => (
        <TouchableOpacity style={styles.categoryItem} onPress={() => handleCafeShopPress(item)}>
            <TagCafe cafe={item} />
        </TouchableOpacity >
    );

    const renderCategoryPicker = () => (
        <View style={[styles.rowCategory,]}>
            <Pressable style={styles.row} onPress={modalCategory}>
                <View style={[styles.showCategory,]}>
                    <Ionicons name='paw' size={ICONS.s} color={COLORS.black} />
                    <View style={{ width: - SIZES.m, }}>
                        <Text numberOfLines={1}>{selectedCategory ? selectedCategory.name : 'Chủ đề'}</Text>
                    </View>
                    <Ionicons name='caret-down' size={ICONS.s} color={COLORS.black} />
                </View>
            </Pressable>
            <Modal visible={isModalCategory} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={modalCategory}>
                    <View style={styles.modalView}>
                        <View style={styles.modalCategory}>
                            <FlatList
                                data={postCategory}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
                                        <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );

    const renderCafeShopPicker = () => (
        <View style={styles.rowCategory}>
            <Pressable style={styles.row} onPress={modalCafeShop}>
                <View style={styles.showCategory}>
                    <Text>Gắn thẻ quán</Text>
                </View>
            </Pressable>
            <Modal visible={isModalCafeShop} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={modalCafeShop}>
                    <View style={styles.modalView}>
                        <View style={styles.modalCafe}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Tìm quán cà phê..."
                                onChangeText={handleSearch}
                                value={searchQuery}
                            />
                            <FlatList
                                data={filteredShopList}
                                renderItem={renderCafeShopItem}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    {showLoadingModal && (
                        <Loading isModal={true} />
                    )}
                    <ErrorModal
                        showErrorModal={showErrorModal}
                        setShowErrorModal={setShowErrorModal}
                        errorMsg={errorMsg}
                        setErrorMsg={setErrorMsg}
                    />
                    <View style={styles.row}>
                        <Pressable>
                            <Image source={{ uri: userData.avatar }} style={styles.imageProfile} />
                        </Pressable>
                        {editPost ? (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '85%' }}>
                                <View style={styles.inforProfile}>
                                    <Text style={[styles.titleDefault, styles.title]} numberOfLines={1}>
                                        {userData.fullName}
                                    </Text>
                                </View>
                                <Pressable style={[ICONS.coverD, { alignSelf: 'flex-end' }]} onPress={selectImages}>
                                    <Ionicons name='images' size={ICONS.s} color={COLORS.black} />
                                </Pressable>
                            </View>

                        ) : (
                            <View style={styles.inforProfile}>
                                {selectedCafeShop != null ? (
                                    <>
                                        <View style={styles.row}>
                                            <Text style={styles.title} numberOfLines={1}>
                                                {userData.fullName}
                                            </Text>
                                            <Text style={styles.text}>đang ở</Text>
                                        </View>
                                        <View style={styles.tag}>
                                            <View style={styles.rowTag}>
                                                <Image source={{ uri: selectedCafeShop.avatarUrl }} style={styles.imageTag} />
                                                <Text style={styles.title} numberOfLines={1}>
                                                    {selectedCafeShop.name}
                                                </Text>
                                            </View>
                                            <Pressable onPress={cleanModalCafe}>
                                                <Ionicons name='close' size={20} color={COLORS.black} style={styles.iconTag} />
                                            </Pressable>
                                        </View>
                                    </>
                                ) : (
                                    <Text style={[styles.titleDefault, styles.title]} numberOfLines={1}>
                                        {userData.fullName}
                                    </Text>
                                )}
                                <View style={styles.rowSubHeader}>
                                    {renderCategoryPicker()}
                                    {shopId == null && (
                                        renderCafeShopPicker()
                                    )}
                                    <View style={styles.rowCategory}>
                                        <Pressable style={styles.row} onPress={selectImages}>
                                            <View style={styles.showCategory}>
                                                <Ionicons name='images' size={18} color={COLORS.black} />
                                            </View>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        )}

                    </View>
                </View>
                {editPost ? (
                    <ScrollView style={styles.inputField}>
                        <TextInput
                            onChangeText={setText}
                            value={text}
                            placeholder={shop ? `${shopData.name}, quán của bạn có gì mới?` : `${userData.fullName}` + ', Bạn đang nghĩ gì?'}
                            multiline
                            placeholderTextColor={COLORS.gray2}
                            style={styles.textInput}
                        />
                        {selectedImages.length > 0 && (
                            <FlatList
                                data={selectedImages}
                                renderItem={renderSelectedImages}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                            />
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.m }}>
                            <TouchableOpacity
                                style={[BUTTONS.recMax, { backgroundColor: COLORS.gray1, alignItems: 'center', justifyContent: 'center' }]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={!text || /^\s*$/.test(text) ? [BUTTONS.recMax, { backgroundColor: COLORS.gray1, alignItems: 'center', justifyContent: 'center' }] : [BUTTONS.recMax, { backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }]}
                                onPress={handleEditPost}
                                disabled={!text || /^\s*$/.test(text)}
                            >
                                <Text style={!text || /^\s*$/.test(text) ? [TEXTS.content, { color: COLORS.black, fontWeight: '500' }] : [TEXTS.content, { color: COLORS.white, fontWeight: '500' }]}>Cập nhật</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                ) : (
                    <ScrollView style={styles.inputField}>
                        <TextInput
                            onChangeText={setText}
                            value={text}
                            placeholder={shop ? `${shopData.name}, quán của bạn có gì mới?` : `${userData.fullName}` + ', Bạn đang nghĩ gì?'}
                            multiline
                            placeholderTextColor={COLORS.gray2}
                            style={styles.textInput}
                        />
                        {selectedImages.length > 0 && (
                            <FlatList
                                data={selectedImages}
                                renderItem={renderSelectedImages}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                            />
                        )}
                        <TouchableOpacity
                            style={!text || /^\s*$/.test(text) ? [BUTTONS.recFull, { alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }, styles.postButtonDisabled] : [BUTTONS.recFull, { alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: COLORS.primary }]}
                            onPress={handlePost}
                            disabled={!text || /^\s*$/.test(text)}
                        >
                            <Text style={!text || /^\s*$/.test(text) ? [TEXTS.content, { color: COLORS.black, fontWeight: '500' }] : [TEXTS.content, { color: COLORS.white, fontWeight: '500' }]}>Đăng</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </NativeBaseProvider >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        padding: SIZES.m,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageProfile: {
        height: 55,
        width: 55,
        borderRadius: 50,
    },
    inforProfile: {
        paddingLeft: SIZES.m,
    },
    title: {
        fontWeight: 'bold',
        fontSize: SIZES.m,
        color: COLORS.black,
    },
    titleDefault: {
        paddingBottom: SIZES.m,
    },
    text: {
        fontSize: SIZES.m,
        paddingLeft: SIZES.s / 2,
    },
    rowCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    modalCategory: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginLeft: '22%',
        width: '60%',
        marginRight: '48%',
        marginTop: '40%',
        borderRadius: SIZES.s - 2,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalCafe: {
        backgroundColor: 'white',
        position: 'absolute',
        width: '80%',
        top: "20%",
        left: "10%",
        borderRadius: SIZES.s - 2,
        padding: SIZES.s,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '60%',
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    categoryItem: {
        width: '100%',
        alignItems: 'flex-start',
        paddingVertical: SIZES.s,
    },
    buttonModel: {
        paddingLeft: '70%',
        paddingTop: 5,
    },
    showCategory: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: SIZES.s,
        backgroundColor: COLORS.quaternary,
        padding: SIZES.s - 4,
        borderRadius: SIZES.s,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: COLORS.tertiary,
        borderWidth: 1,
        marginVertical: SIZES.s / 2,
        borderRadius: 50,
        width: 'auto',
        gap: SIZES.s / 2,
    },
    iconTag: {
        paddingRight: SIZES.s,
    },
    imageTag: {
        width: 20,
        height: 20,
        borderRadius: 50,
    },
    rowTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.s / 2,
    },
    textInput: {
        fontSize: SIZES.l,
    },
    inputField: {
        paddingBottom: SIZES.m,
        paddingHorizontal: SIZES.s / 2,
    },
    rowSubHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.m,
    },
    column: {
        flexDirection: 'column',
    },
    selectedImage: {
        width: SIZES.width / 2,
        height: SIZES.height / 3,
        resizeMode: "cover",
        marginBottom: 20,
        marginRight: 10,
    },
    postButton: {
        backgroundColor: COLORS.primary,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        margin: SIZES.m,
    },
    postButtonDisabled: {
        backgroundColor: COLORS.gray1,
    },
    postButtonText: {
        color: COLORS.white,
        fontSize: 16,
    },
    postButtonTextDisabled: {
        color: COLORS.blackBold,
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
});
