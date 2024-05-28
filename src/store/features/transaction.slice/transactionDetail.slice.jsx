import { createSlice } from '@reduxjs/toolkit';
import { getTransactionDetailThunk } from '../../apiThunk/transactionThunk';

export const transactionDetailSlice = createSlice({
    name: 'transactionDetail',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getTransactionDetailThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getTransactionDetailThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getTransactionDetailThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default transactionDetailSlice.reducer;
