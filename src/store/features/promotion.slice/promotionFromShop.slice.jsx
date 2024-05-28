import { createSlice } from '@reduxjs/toolkit';
import { getPromotionFromShopThunk } from '../../apiThunk/promotionThunk';

export const promotionFromShopSlice = createSlice({
    name: 'promotionFromShop',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getPromotionFromShopThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getPromotionFromShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getPromotionFromShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default promotionFromShopSlice.reducer;
