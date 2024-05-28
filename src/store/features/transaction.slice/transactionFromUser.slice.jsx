import { createSlice } from '@reduxjs/toolkit';
import { getTransactionFromUserThunk } from '../../apiThunk/transactionThunk';

export const transactionFromUserSlice = createSlice({
    name: 'transactionFromUser',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getTransactionFromUserThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getTransactionFromUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getTransactionFromUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default transactionFromUserSlice.reducer;
