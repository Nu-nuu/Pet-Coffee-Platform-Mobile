import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    reportPost, reportComment
} from '../../api/report';

export const reportPostThunk = createAsyncThunk(
    'report/reportPost',
    async ({ postId, data }, thunkAPI) => {
        console.log({ postId, data });
        try {
            return await reportPost(postId, data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const reportCommentThunk = createAsyncThunk(
    'report/reportPost',
    async ({ commentId, data }, thunkAPI) => {
        console.log({ commentId, data });

        try {
            return await reportComment(commentId, data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

