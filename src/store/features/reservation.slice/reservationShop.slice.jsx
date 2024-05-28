import { createSlice } from '@reduxjs/toolkit';
import { getReservationShopThunk } from '../../apiThunk/reservationThunk';

export const reservationShopSlice = createSlice({
    name: 'reservationShop',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getReservationShopThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getReservationShopThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getReservationShopThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default reservationShopSlice.reducer;
