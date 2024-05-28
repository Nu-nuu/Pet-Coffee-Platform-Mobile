
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS, ICONS, AVATARS, SOCIALS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import formatTime from './formatTime';
import ModalEllipsis from './reports/modalEllipsis';
import { LikePostThunk, UnLikePostThunk, deletePostThunk, getPostNewsFeedThunk } from '../../store/apiThunk/postThunk';
import { useDispatch, useSelector } from 'react-redux';
import CarouselPost from './carouselPost';
import ConfirmModal from '../Alert/confirmModal';
import Loading from '../Alert/modalSimple/loading';
import { allNotificationsSelector, unreadNotificationsSelector, userDataSelector } from '../../store/sellectors';

const PostCard = ({ post, delPost }) => {

    const dispatch = useDispatch();
    const [likeCount, setLikeCount] = useState(post.totalLike);
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [showFullContent, setShowFullContent] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const userData = useSelector(userDataSelector)
    const userId = userData.id

    const handleLike = () => {
        setIsLiked(!isLiked)
        if (!isLiked == true) {
            setLikeCount(likeCount + 1);
            dispatch(LikePostThunk(post.id));

        }
        if (!isLiked == false) {
            setLikeCount(likeCount - 1);
            dispatch(UnLikePostThunk(post.id));
        }
    };

    useEffect(() => {
        setLikeCount(post.totalLike)
        setIsLiked(post.isLiked)
    }, [post])

    const handlePressEllipsis = () => {
        setModalVisible(true);
    };

    useEffect(() => {
        setLikeCount(post.totalLike)
    }, [post])
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const toggleShowFullContent = () => {
        setShowFullContent(!showFullContent);
    };

    const navigation = useNavigation();

    const onPressPostDetail = () => {
        navigation.navigate('PostDetail', {
            posts: post,
            isLikedBefore: isLiked,
        });
    };



    const handlePressDelPost = (id) => {
        delPost(id)
    }

    const handleEditPost = (id) => {
        navigation.navigate('CreatePost', {
            id: id,
            content: post.content,
            images: post.image,
        })
    }
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.postTop}>
                    <View style={[styles.row, { position: 'relative' }]}>
                        <Pressable >
                            <Image
                                source={{ uri: post.posterAvatar }}
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
                    <ModalEllipsis onPressEditPost={handleEditPost} onPressDeletePost={handlePressDelPost} isVisible={modalVisible} onClose={handleCloseModal} isOwner={!!(post.createdById === userId)} postId={post.id} isPost={true} />

                </View>
            </View>
            <Pressable onPress={onPressPostDetail}>
                <View style={styles.contentContainer}>
                    <Text style={styles.textContent}>
                        {post.title}
                    </Text>
                    <Text style={[styles.textContent, { paddingBottom: SIZES.s }]} numberOfLines={showFullContent ? undefined : 7}>
                        {post.content.length > 100 && !showFullContent
                            ? post.content.substring(0, 100) + '...'
                            : post.content}
                    </Text>
                    {!showFullContent && post.content.length > 100 && (
                        <Pressable onPress={toggleShowFullContent}>
                            <Text style={[styles.title, { paddingBottom: SIZES.s }]}>Xem thêm</Text>
                        </Pressable>
                    )}
                </View>
            </Pressable>
            {post.image && post.image !== '' && (
                <View style={styles.imageContainer}>
                    {post.image.split(';').length > 1 ? (
                        <CarouselPost images={post.image.split(';')} />
                    ) : (
                        <Image
                            source={{ uri: post.image }}
                            style={styles.image}
                        />
                    )}
                </View>
            )}
            {(likeCount == null || likeCount == 0 && post.totalComment == null) ? (
                <View style={styles.header}>
                </View>
            ) :
                (
                    <View style={styles.header}>
                        {likeCount == null ? (
                            <View style={styles.totalLike}></View>
                        ) :
                            <View style={styles.totalLike}>
                                <Ionicons name="heart" size={24} color={'red'} />
                                <Text style={styles.text}>{likeCount}</Text>

                            </View>
                        }
                        {post.totalComment == null ? (
                            <Text style={styles.text}></Text>
                        ) :
                            (
                                <Pressable style={styles.totalComment}>
                                    <Text style={styles.text}>{post.totalComment} Bình luận</Text>
                                </Pressable>
                            )}
                    </View>
                )
            }
            <View style={styles.header}>
                <Pressable onPress={handleLike} style={styles.button}>
                    <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? 'red' : COLORS.blackBold} />
                    <Text style={styles.textTotalButton}>Thích</Text>
                </Pressable>
                <Pressable onPress={onPressPostDetail} style={styles.button}>
                    <Ionicons name="chatbubble-outline" size={24} />
                    <Text style={styles.textTotalButton}>Bình luận</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: COLORS.white,
        borderBottomColor: COLORS.gray1,
        borderBottomWidth: SIZES.s - 6,
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
});

export default PostCard;
