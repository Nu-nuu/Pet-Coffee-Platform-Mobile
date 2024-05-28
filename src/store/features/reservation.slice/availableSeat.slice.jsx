import { createSlice } from '@reduxjs/toolkit';
import { getAvailableSeatThunk } from './../../apiThunk/reservationThunk';

export const availableSeatSlice = createSlice({
    name: 'availableSeat',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getAvailableSeatThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getAvailableSeatThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getAvailableSeatThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default availableSeatSlice.reducer;
