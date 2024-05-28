import React from 'react';
import { StyleSheet, Text, View, Modal, SectionList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';

const ModalEllipsis = ({ isVisible, onClose, isOwner, postId, commentId, isPost, onPressEditPost, onPressEditComment, onPressDeleteComment, onPressDeletePost }) => {
    const navigation = useNavigation();
    const title = isPost ? 'Bài viết' : 'Bình luận';
    const sections = [
        ...(isOwner
            ? [
                { title: title, data: ['Sửa ' + title, 'Xóa ' + title] },

            ]
            : [
                { title: title, data: ['Báo cáo ' + title] },

            ]),
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            {renderIcon(item)}
            <Text>  {item}</Text>
        </TouchableOpacity>
    );

    const handleDeletePost = (postId) => {
        onPressDeletePost(postId)
    }
    const handleDeleteComment = (commentId) => {
        onPressDeleteComment(commentId)
    }

    const handleEditPost = (postId) => {
        onPressEditPost(postId)
    }
    const handleEditComment = (commentId) => {
        onPressEditComment(commentId)
    }

    const handlePress = (action) => {
        if (isPost) {
            onClose();
            if (action === 'Sửa ' + title) {
                handleEditPost(postId)
            } else if (action === 'Báo cáo ' + title) {
                navigation.navigate('Report', {
                    postId: postId,
                    commentId: commentId,
                    isPost: true
                });
            } else {
                handleDeletePost(postId)
            }
        } else {
            onClose();
            if (action === 'Sửa ' + title) {
                handleEditComment(commentId)
            } else if (action === 'Báo cáo ' + title) {
                navigation.navigate('Report', {
                    postId: postId,
                    commentId: commentId,
                });
            } else {
                handleDeleteComment(commentId)
            }
        }

    };


    const renderIcon = (item) => {
        switch (item) {
            case 'Sửa ' + title:
                return <Ionicons name="create" size={24} color={COLORS.secondary} />;
            case 'Xóa ' + title:
                return <Ionicons name="trash" size={24} color={COLORS.secondary} />;
            case 'Tắt thông báo bài viết':
                return <Ionicons name="notifications-off" size={24} color={COLORS.secondary} />;
            case 'Báo cáo ' + title:
                return <Ionicons name="flag" size={24} color={COLORS.secondary} />;
            default:
                return null;
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modal}>
                <View style={styles.modalContent}>
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => item + index}
                        renderItem={renderItem}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.sectionHeader}>{title}</Text>
                        )}
                    />
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ModalEllipsis;

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
        width: '80%',
        maxHeight: '80%',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cancelButton: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: 'red',
        fontSize: 16,
    },
});
