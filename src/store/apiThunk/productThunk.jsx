import { createAsyncThunk } from '@reduxjs/toolkit';
import { createProduct, deleteProduct, editProduct, getProductDetail, getProductFromShop } from '../../api/product';

export const getProductFromShopThunk = createAsyncThunk(
    'product/getProductFromShop',
    async (id, thunkAPI) => {
        try {
            const response = await getProductFromShop(id);
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getProductDetailThunk = createAsyncThunk(
    'product/getProductDetail',
    async (id, thunkAPI) => {
        try {
            const response = await getProductDetail(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const createProductThunk = createAsyncThunk(
    'product/createProduct',
    async (data, thunkAPI) => {
        try {
            const response = await createProduct(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const editProductThunk = createAsyncThunk(
    'product/editProduct',
    async (data, thunkAPI) => {
        try {
            const response = await editProduct(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const deleteProductThunk = createAsyncThunk(
    'product/deleteProduct',
    async (id, thunkAPI) => {
        try {
            const response = await deleteProduct(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

