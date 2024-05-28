import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    createTopup
} from '../../api/topup';

export const createTopupThunk = createAsyncThunk(
    'topup/createTopup',
    async (data, thunkAPI) => {
        try {
            const response = await createTopup(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);
