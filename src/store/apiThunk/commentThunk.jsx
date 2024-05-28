import { createAsyncThunk } from '@reduxjs/toolkit';
import { createComment, deleteComment, getComment, getReply, updateComment } from '../../api/comment';

export const updateCommentThunk = createAsyncThunk(
    'comment/updateComment',
    async (data, thunkAPI) => {
        try {
            const response = await updateComment(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const createCommentThunk = createAsyncThunk(
    'comment/createComment',
    async (data, thunkAPI) => {
        try {
            const response = await createComment(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);


export const getCommentThunk = createAsyncThunk(
    'comment/getComment',
    async (id, thunkAPI) => {
        try {
            const response = await getComment(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getReplyThunk = createAsyncThunk(
    'comment/getReply',
    async (id, thunkAPI) => {
        try {
            const response = await getReply(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);


export const deleteCommentThunk = createAsyncThunk(
    'comment/deleteComment',
    async (id, thunkAPI) => {
        try {
            const response = await deleteComment(id);
            return response;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);