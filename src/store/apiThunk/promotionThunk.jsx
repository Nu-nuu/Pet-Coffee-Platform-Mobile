import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPromotionDetail, getPromotionFromShop } from '../../api/promotion';


export const getPromotionFromShopThunk = createAsyncThunk(
    'promotion/getPromotionFromShop',
    async (id, thunkAPI) => {
        try {
            const response = await getPromotionFromShop(id);
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);


export const getPromotionDetailThunk = createAsyncThunk(
    'promotion/getPromotionDetail',
    async (id, thunkAPI) => {
        try {
            const response = await getPromotionDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);