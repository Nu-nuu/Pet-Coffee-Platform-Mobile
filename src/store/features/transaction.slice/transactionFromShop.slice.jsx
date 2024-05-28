import { createSlice } from '@reduxjs/toolkit';
import { getTransactionFromShopThunk } from '../../apiThunk/transactionThunk';

export const transactionFromShopSlice = createSlice({
    name: 'transactionFromShop',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getTransactionFromShopThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getTransactionFromShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getTransactionFromShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default transactionFromShopSlice.reducer;
