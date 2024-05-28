import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    createItemsTransaction,
    getAllTransaction,
    getTransactionDetail,
    getTransactionFromUser,
    getTransactionFromShop,

} from '../../api/transaction';

export const getAllTransactionThunk = createAsyncThunk(
    'transaction/getAllTransaction',
    async ({type}, thunkAPI) => {
        try {
            const response = await getAllTransaction(type);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getTransactionDetailThunk = createAsyncThunk(
    'transaction/getTransactionDetail',
    async (id, thunkAPI) => {
        try {
            const response = await getTransactionDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const createItemsTransactionThunk = createAsyncThunk(
    'transaction/createTransaction',
    async (data, thunkAPI) => {
        try {
            const response = await createItemsTransaction(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getTransactionFromUserThunk = createAsyncThunk(
    'transaction/getTransactionFromUser',
    async (id, thunkAPI) => {
        try {
            const response = await getTransactionFromUser(id);
            return response;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getTransactionFromShopThunk = createAsyncThunk(
    'transaction/getTransactionFromShop',
    async (id, thunkAPI) => {
        try {
            const response = await getTransactionFromShop(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);


