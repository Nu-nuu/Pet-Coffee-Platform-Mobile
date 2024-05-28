import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, ICONS, SIZES, SOCIALS, TEXTS } from '../../constants';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import PostCard from '../../components/Social/postCard';
import NewPost from '../../components/Social/newPost';
import { deletePostThunk, getPostNewsFeedThunk } from '../../store/apiThunk/postThunk';
import { postSelector, userDataSelector } from '../../store/sellectors';
import Loading from '../../components/Alert/modalSimple/loading';
import Success from '../../components/Alert/modalSimple/success';
import ConfirmModal from '../../components/Alert/confirmModal';

export default function Social() {
    const dispatch = useDispatch();
    const selectorPosts = useSelector(postSelector);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [allPosts, setAllPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);
    const route = useRoute();
    const navigation = useNavigation();
    const intervalRef = useRef(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (route.params && route.params.response) {
            handleRefresh();
        }
    }, [route.params]);

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            fetchPosts();
            intervalRef.current = setInterval(fetchPosts, 5000);
        });

        const unsubscribeBlur = navigation.addListener('blur', () => {
            clearInterval(intervalRef.current);
        });

        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
            clearInterval(intervalRef.current);
        };
    }, [navigation]);

    const fetchPosts = useCallback((newPageNumber = pageNumber, newPageSize = pageSize) => {
        if (loadingMore || !isFocused) return;
        setLoadingMore(true);
        let isComponentMounted = true;
        dispatch(getPostNewsFeedThunk({ pageNumber: newPageNumber, pageSize: newPageSize }))
            .unwrap()
            .then(({ items, hasNext }) => {
                if (!isComponentMounted) return;

                setAllPosts(prev => newPageNumber === 1 ? items : [...prev, ...items]);
                setHasMore(hasNext);
                if (pageNumber !== newPageNumber) setPageNumber(newPageNumber);
                if (pageSize !== newPageSize) setPageSize(newPageSize);
            })
            .catch(error => {
                console.error('Failed to fetch posts:', error);
            })
            .finally(() => {
                if (!isComponentMounted) return;
                setLoadingMore(false);
                setRefreshing(false);
            });

        return () => {
            isComponentMounted = false;
        };
    }, [pageNumber, pageSize, isFocused, loadingMore]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPosts(1, 5);
    };

    const [loadingModal, setLoadingModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [delPostId, setDelPostId] = useState(0);


    const renderItem = ({ item }) => item.id === 'empty'
        ? <Loading isModal={false} />
        : <PostCard key={item.id} post={item} delPost={handlePressDelPost} />;

    const handlePressDelPost = (id) => {
        setDelPostId(id)
        setShowConfirmModal(true);

    }

    const handleDeletePost = async () => {
        setShowConfirmModal(false);
        setLoadingModal(true);
        await dispatch(deletePostThunk(delPostId))
            .unwrap()
            .then((response) => {
                setLoadingModal(false);
                handleRefresh();

            })
            .catch((err) => console.log(err))
    }

    const renderFooter = () => {
        if (allPosts.length === 0) return null;
        if (loadingMore) return <ActivityIndicator style={{ margin: 20 }} />;
        if (!hasMore) return <View style={styles.allPostsLoadedContainer}><Text>Bạn đã xem hết bài viết</Text></View>;
        return null;
    };
    const handleScroll = ({ nativeEvent }) => {
        if (nativeEvent.contentOffset.y > nativeEvent.contentSize.height / 2.5 && !loadingMore) {
            fetchPosts(pageNumber, pageSize + 5);
        }
    };


    return (
        <View style={styles.container}>
            {loadingModal &&
                <Loading isModal={true} />
            }
            {showConfirmModal && (
                <ConfirmModal
                    showConfirmModal={showConfirmModal}
                    setShowConfirmModal={setShowConfirmModal}
                    confirmMsg={SOCIALS.confirmDelPost}
                    onConfirm={handleDeletePost}
                />
            )}
            <View style={{
                paddingTop: SIZES.m,
                paddingHorizontal: SIZES.m,
                paddingBottom: SIZES.s,
                backgroundColor: COLORS.white
            }}
            >
                <View style={{
                    flexDirection: 'row',
                    gap: SIZES.s,
                    alignItems: 'center',
                }}>
                    <Text style={TEXTS.title}>Yêu thú cưng</Text>
                    <Ionicons name='paw' size={ICONS.m} color={COLORS.primary} />
                </View>
            </View>
            <NewPost />
            <View>

                <FlatList
                    ref={flatListRef}
                    data={allPosts.length > 0 ? allPosts : [{ id: 'empty' }]}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={renderFooter}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onScroll={handleScroll}
                    onEndReachedThreshold={0.1}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginBottom: SIZES.xxl,
    },
    appBarWrapper: {
        marginHorizontal: 22,
        marginTop: SIZES.s,
    },
    containerFeed: {
        marginTop: SIZES.m,
        marginHorizontal: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontWeight: '500',
        fontSize: SIZES.xl - 2,
        color: 'black',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    allPostsLoadedContainer: {
        padding: 10,
        alignItems: 'center',
        width: '100%',
        height: 100,
    },
    allPostsLoadedText: {
        color: COLORS.gray,
    },
});
