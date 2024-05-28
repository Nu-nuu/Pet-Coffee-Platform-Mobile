import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommentCard from './commentCard';
import { SIZES } from '../../../constants';

const CommentList = ({ filteredComments, avt, mL, width, reply, deleteComment, handleEdit }) => {

    const handleDeleteComment = (id) => {
        deleteComment(id)
    }
    const handleEditComment = () => {
        handleEdit()
    }
    return (
        <View>
            {filteredComments != '' ? (
                filteredComments.map((comment) => (
                    <CommentCard editComment={handleEditComment} key={comment.id} comment={comment} avt={avt} mL={mL} width={width} reply={reply} delComment={handleDeleteComment} />
                ))
            ) :
                (
                    <View style={styles.noComment}>
                        <Text >Không có bình luận nào</Text>
                    </View>
                )
            }
        </View>
    )
}

export default CommentList

const styles = StyleSheet.create({
    noComment: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.m
    }
})