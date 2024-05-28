import { createAsyncThunk } from '@reduxjs/toolkit';
import { createInvoiceReservation, createReservation, deleteInvoiceReservation, getAllReservation, getAvailableSeat, getReservationDetail, getReservationShop, rateReservation, refundReservation } from '../../api/reservation';

export const getAvailableSeatThunk = createAsyncThunk(
    'reservation/getAvailableSeat',
    async ({ shopId, startTime, endTime, totalSeat }, thunkAPI) => {
        try {
            const response = await getAvailableSeat(shopId, startTime, endTime, totalSeat);
            return response.items;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const createReservationThunk = createAsyncThunk(
    'reservation/createReservation',
    async (data, thunkAPI) => {
        try {
            const response = await createReservation(data);
            return response;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getReservationDetailThunk = createAsyncThunk(
    'reservation/getReservationDetail',
    async (id, thunkAPI) => {
        try {
            const response = await getReservationDetail(id);
            return response;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getAllReservationThunk = createAsyncThunk(
    'reservation/getAllReservation',
    async ({ searchQuery, status }, thunkAPI) => {
        try {
            const response = await getAllReservation(searchQuery, status);
            return response.items;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getReservationShopThunk = createAsyncThunk(
    'reservation/getReservationShop',
    async ({ id, searchQuery, status }, thunkAPI) => {
        try {
            const response = await getReservationShop(id, searchQuery, status);
            return response.items;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const createInvoiceReservationThunk = createAsyncThunk(
    'reservation/createInvoiceReservation',
    async ({ id, data }) => {
        try {
            const response = await createInvoiceReservation(id, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
);

export const refundReservationThunk = createAsyncThunk(
    'reservation/refundReservation',
    async (id, thunkAPI) => {
        try {
            const response = await refundReservation(id);
            return response;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const rateReservationThunk = createAsyncThunk(
    'reservation/rateReservation',
    async ({ id, data }) => {
        try {
            const response = await rateReservation(id, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
);

export const deleteInvoiceReservationThunk = createAsyncThunk(
    'reservation/deleteInvoiceReservation',
    async (id, thunkAPI) => {
        try {
            const response = await deleteInvoiceReservation(id);
            return response;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);