import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AVATARS, COLORS, ICONS, SIZES, SOCIALS, TEXTS } from '../../constants';
import CreateComment from '../../components/Social/comments/createComment';
import { allNotificationsSelector, commentSelector, postDetailSelector, unreadNotificationsSelector, userDataSelector } from '../../store/sellectors';
import { FlatList } from 'react-native';
import CommentList from '../../components/Social/comments/commentList';
import ModalEllipsis from '../../components/Social/reports/modalEllipsis';
import formatTime from '../../components/Social/formatTime';
import { LikePostThunk, UnLikePostThunk, deletePostThunk, getPostDetailThunk } from '../../store/apiThunk/postThunk';
import { deleteCommentThunk, getCommentThunk } from '../../store/apiThunk/commentThunk';
import Loading from '../../components/Alert/modalSimple/loading';
import CarouselPost from '../../components/Social/carouselPost';
import ConfirmModal from '../../components/Alert/confirmModal';
import { getAllNotificationsThunk, getUnreadNotificationsThunk } from '../../store/apiThunk/notificationThunk';
import {
    HubConnectionBuilder,
    LogLevel,
    HttpTransportType,
} from '@microsoft/signalr';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

export default function PostDetail({ route, navigation }) {
    //post, like, comment, sub comment
    const dispatch = useDispatch();

    const postDetail = useSelector(postDetailSelector);
    const userData = useSelector(userDataSelector);
    // const comments = useSelector(commentSelector);
    const shop = userData.role === 'Staff' ? true : false
    const userId = userData.id
    const { posts, isLikedBefore } = route.params;
    const [post, setPost] = useState(posts);
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [likeCount, setLikeCount] = useState(post?.totalLike);
    const [commentCount, setCommentCount] = useState(post?.totalComment);
    const [isLike, setIsLike] = useState(post?.isLiked);
    const [loading, setLoading] = useState(true);
    const [showFullContent, setShowFullContent] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    const fetchPostAndComments = async () => {
        try {
            const postDetails = await dispatch(getPostDetailThunk(posts?.id)).unwrap();
            setPost(postDetails);
            setLikeCount(postDetails.totalLike);
            setCommentCount(postDetails.totalComment);

            if (postDetails.totalComment > 0) {
                const commentsData = await dispatch(getCommentThunk(postDetails?.id)).unwrap();
                setComments(commentsData);
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching post and comments:', error);
        } finally {
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchPostAndComments();
            const interval = setInterval(fetchPostAndComments, 3000);

            return () => clearInterval(interval);
        }, [posts?.id])
    );

    useEffect(() => {
        if (isLikedBefore !== undefined) {
            setIsLike(isLikedBefore);
        }

    }, [isLikedBefore]);

    useEffect(() => {
        setFilteredComments(comments?.items?.filter(c => !c.parentCommentId) || []);
    }, [comments]);
    const handleLike = () => {
        setIsLike(!isLike);
        const currentCount = likeCount + (isLike ? -1 : 1);
        setLikeCount(currentCount);

        if (isLike) {
            dispatch(UnLikePostThunk(post?.id));
        } else {
            dispatch(LikePostThunk(post?.id));
        }
    };


    const toggleShowFullContent = () => {
        setShowFullContent(!showFullContent);
    };
    const [modalVisible, setModalVisible] = useState(false);

    const handlePressEllipsis = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    useLayoutEffect(() => {
        if (userData.id === post?.createdById) {
            navigation.setOptions({
                headerTitle: `Bài viết của bạn`,
                //về home
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
                headerTitle: `Bài viết của ${post?.namePoster}`,
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

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showConfirmModalComment, setShowConfirmModalComment] = useState(false);

    const [delPostId, setDelPostId] = useState(0);
    const [delCommentId, setDelCommentId] = useState(0);


    const handlePressDelPost = (id) => {
        setShowConfirmModal(true)
        setDelPostId(id)
    }

    const handleDeletePost = async () => {
        setShowConfirmModal(false);
        setLoadingModal(true);
        await dispatch(deletePostThunk(delPostId))
            .unwrap()
            .then((response) => {
                setLoadingModal(false);
                navigation.navigate('Social', { response });

            })
            .catch((err) => console.log(err))
    }

    const handleDelComment = (id) => {
        setShowConfirmModalComment(true)
        setDelCommentId(id)
    }

    const handleDeleteComment = async () => {
        setShowConfirmModalComment(false);
        setLoadingModal(true);
        await dispatch(deleteCommentThunk(delCommentId))
            .unwrap()
            .then((response) => {
                fetchPostAndComments()
                setLoadingModal(false);
            })
            .catch((err) => console.log(err))
    }

    const handleReload = () => {
        fetchPostAndComments()
    }

    const handleEditPost = (id) => {
        navigation.navigate('CreatePost', {
            id: id,
            content: post.content,
            images: post.image,
        })
    }

    return (
        // <>
        //     {loading ? (
        //         <Loading isModal={false} />
        //     ) : (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                {showConfirmModal && (
                    <ConfirmModal
                        showConfirmModal={showConfirmModal}
                        setShowConfirmModal={setShowConfirmModal}
                        confirmMsg={SOCIALS.confirmDelPost}
                        onConfirm={handleDeletePost}
                    />
                )}
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
                <View style={styles.postTop}>
                    <View style={[styles.row, { position: 'relative' }]}>
                        <Pressable>
                            <Image
                                source={{ uri: post?.posterAvatar }}
                                style={AVATARS.mid}
                            />
                        </Pressable>
                        <View style={styles.inforProfile}>
                            <Text numberOfLines={2}>
                                <Text style={styles.title}>
                                    {post.namePoster}
                                </Text>
                                {post.petCoffeeShops != '' && (<Text style={styles.text}> đang ở
                                    <Text style={styles.title} > {post.petCoffeeShops[0].name}.</Text>
                                </Text>)}
                            </Text>
                            <View style={styles.row}>
                                <Text>{formatTime(post.createdAt)}</Text>
                                <View style={styles.category}>
                                    <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
                                </View>
                                {post.categories.map((category, index) => (
                                    <View key={index} style={styles.row}>
                                        <Text > {category.name} </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                    <Pressable style={{ position: 'absolute', top: 0, right: 0 }} onPress={handlePressEllipsis}>
                        <Ionicons name="ellipsis-horizontal" size={20} />
                    </Pressable>
                    <ModalEllipsis onPressEditPost={handleEditPost} onPressDeletePost={handlePressDelPost} isVisible={modalVisible} onClose={handleCloseModal} isOwner={!!(post?.createdById === userId)} postId={post?.id} isPost={true} />
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.textContent, { paddingBottom: SIZES.s }]} numberOfLines={showFullContent ? undefined : 7}>
                    {post?.content?.length > 100 && !showFullContent
                        ? post?.content.substring(0, 100) + '...'
                        : post?.content}
                </Text>
                {!showFullContent && post?.content?.length > 100 && (
                    <Pressable onPress={toggleShowFullContent}>
                        <Text style={[styles.title, { paddingBottom: SIZES.s }]}>Xem thêm</Text>
                    </Pressable>
                )}
            </View>

            {post?.image && post?.image !== '' && (
                <View style={styles.imageContainer}>
                    {post?.image?.split(';').length > 1 ? (
                        <CarouselPost images={post?.image.split(';')} />
                    ) : (
                        <Image
                            source={{ uri: post?.image }}
                            style={styles.image}
                        />
                    )}
                </View>
            )}
            {(likeCount == null || likeCount == 0 && commentCount == null) ? (
                <View >
                </View>
            ) :
                (
                    <View style={styles.header}>
                        {likeCount == 0 ? (
                            <View ></View>
                        ) :
                            <View style={styles.totalLike}>
                                <Ionicons name="heart" size={24} color={'red'} />
                                <Text style={styles.text}>{likeCount}</Text>

                            </View>
                        }
                        {commentCount == 0 ? (
                            <Text ></Text>
                        ) :
                            (
                                <View style={styles.totalComment}>
                                    <Text style={styles.text}>{commentCount} Bình luận</Text>
                                </View>
                            )}
                    </View>
                )
            }
            <View style={styles.header}>
                <Pressable onPress={handleLike} style={styles.button}>
                    <Ionicons name={isLike ? 'heart' : 'heart-outline'} size={24} color={isLike ? 'red' : COLORS.blackBold} />
                    <Text style={styles.textTotalButton}>Thích</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Ionicons name="chatbubble-outline" size={24} />
                    <Text style={styles.textTotalButton}>Bình luận</Text>
                </Pressable>
            </View>
            <CreateComment avt={40} mL={"5%"} width={"78%"} reply={"Viết bình luận..."} postId={post?.id} onSuccess={() => [fetchPostAndComments(), setCommentCount(commentCount + 1)]} />
            {commentCount > 0 ? (
                <>
                    {loading ?
                        (
                            <Loading isModal={false} />
                        ) : (
                            <View style={{ marginBottom: SIZES.m, }}>
                                <CommentList handleEdit={handleReload} deleteComment={handleDelComment} filteredComments={filteredComments} avt={40} mL={"5%"} width={"78%"} />
                            </View>
                        )}
                </>
            ) : (
                <>
                    {loading && (
                        <View style={[TEXTS.subContent, { alignSelf: 'center', marginBottom: SIZES.m }]}>
                            <Text >Không có bình luận nào</Text>
                        </View>
                    )}
                </>

            )}

        </ScrollView >
        // )}
        // </>



    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: COLORS.white,
        borderBottomColor: COLORS.gray1,
        borderBottomWidth: SIZES.s - 6,
        // minHeight: SIZES.height + SIZES.xl
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
        flexDirection: 'column',
        gap: 5,
        alignItems: 'flex-start',
        width: '80%',
    },
    imageContainer: {
        width: '100%',
        overflow: 'hidden',
    },
    image: {
        height: SIZES.height / 2,
        width: SIZES.width,
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
    comment: {
        flexDirection: 'row',
        marginLeft: "5%"
    },
});

