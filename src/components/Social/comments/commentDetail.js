import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import CommentCard from './commentCard';
import CommentList from './commentList';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCommentThunk, getReplyThunk } from '../../../store/apiThunk/commentThunk';
import { commentSelector, userDataSelector } from '../../../store/sellectors';
import CreateComment from './createComment';
import { COLORS, SIZES, SOCIALS } from '../../../constants';
import Loading from '../../Alert/modalSimple/loading';
import LoadingMin from '../../Alert/modalSimple/loadingMin';
import ConfirmModal from '../../Alert/confirmModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CommentDetail = ({ route, navigation }) => {
    const { postId, commentId } = route.params;
    const dispatch = useDispatch();
    const userData = useSelector(userDataSelector)
    const comments = useSelector(commentSelector);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchCommentAndReplies();
    }, []);

    const commentCard = comments?.items.filter(comment => comment.postId === postId && comment.id === commentId)

    const [filteredComments, setFilteredComments] = useState(comments.items.filter(comment => comment.postId === postId && comment.parentCommentId === commentId))

    const fetchCommentAndReplies = async () => {
        try {
            await dispatch(getReplyThunk(commentId))
                .unwrap()
                .then((response) => {
                    setFilteredComments(response?.items);
                    setLoading(false)
                }
                )
        } catch (error) {
            console.error('Error fetching post and comments:', error);
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        if (userData.id === commentCard[0].createdById) {
            navigation.setOptions({
                headerTitle: `Bình luận của bạn`,
                headerRight: () => (
                    <Pressable style={{ paddingRight: SIZES.m }} onPress={() => {
                        navigation.navigate('TabGroup', { screen: 'Social' })
                    }}>
                        <Ionicons name="home" size={24} color={COLORS.black} />
                    </Pressable>
                ),
            })
        } else {
            navigation.setOptions({
                headerTitle: `Bình luận của ${commentCard[0].commentorName}`,
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

    const [showConfirmModalComment, setShowConfirmModalComment] = useState(false);
    const [delCommentId, setDelCommentId] = useState(0);
    const [loadingModal, setLoadingModal] = useState(false);

    const handleDelComment = (id) => {
        setShowConfirmModalComment(true)
        setDelCommentId(id)
    }

    const handleDeleteComment = async () => {
        setShowConfirmModalComment(false);
        setLoadingModal(true)
        await dispatch(deleteCommentThunk(delCommentId))
            .unwrap()
            .then((response) => {
                fetchCommentAndReplies()
                setLoadingModal(false)
            })
            .catch((err) => console.log(err))
    }

    const handleReload = () => {
        fetchCommentAndReplies()
    }

    return (
        <>

            <ScrollView style={styles.container}>
                {showConfirmModalComment && (
                    <ConfirmModal
                        showConfirmModal={showConfirmModalComment}
                        setShowConfirmModal={setShowConfirmModalComment}
                        confirmMsg={SOCIALS.confirmDelComment}
                        onConfirm={handleDeleteComment}
                    />
                )}
                {loadingModal &&
                    <Loading isModal={true} />
                }
                <View style={styles.commentContainer}>
                    <CommentCard comment={commentCard[0]} avt={40} mL={"0%"} width={"85%"} reply={false} />
                </View>
                <View style={styles.commentContainer}>
                    {loading ? (
                        <LoadingMin />
                    ) : (
                        <CommentList handleEdit={handleReload} deleteComment={handleDelComment} filteredComments={filteredComments} avt={30} mL={"5%"} width={"85%"} reply={false} />
                    )}
                    <CreateComment
                        avt={30}
                        mL={"5%"}
                        width={"80%"}
                        reply={"Viết phản hồi..."}
                        postId={postId}
                        commentId={commentId}
                        onSuccess={() => fetchCommentAndReplies()}
                    />
                </View>
            </ScrollView>
        </>
    );
};

export default CommentDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: COLORS.white,
        borderBottomColor: COLORS.gray1,
        borderBottomWidth: SIZES.s - 6,
    },
    commentContainer: {
        padding: SIZES.s,
    },
});
