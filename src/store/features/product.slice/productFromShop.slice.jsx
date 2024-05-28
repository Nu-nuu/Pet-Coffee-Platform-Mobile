import { createSlice } from '@reduxjs/toolkit';
import { getProductFromShopThunk } from '../../apiThunk/productThunk';

export const productFromShopSlice = createSlice({
    name: 'productFromShop',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getProductFromShopThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getProductFromShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getProductFromShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default productFromShopSlice.reducer;
