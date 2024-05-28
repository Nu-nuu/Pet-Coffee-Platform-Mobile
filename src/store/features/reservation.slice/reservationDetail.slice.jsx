import { createSlice } from '@reduxjs/toolkit';
import { getReservationDetailThunk } from '../../apiThunk/reservationThunk';

export const reservationDetailSlice = createSlice({
    name: 'reservationDetail',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getReservationDetailThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getReservationDetailThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getReservationDetailThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default reservationDetailSlice.reducer;
