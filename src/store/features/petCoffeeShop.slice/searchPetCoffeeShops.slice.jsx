import { createSlice } from '@reduxjs/toolkit';
import { searchPetCoffeeShopsThunk } from '../../apiThunk/petCoffeeShopThunk';

export const searchPetCoffeeShopsSlice = createSlice({
    name: 'searchPetCoffeeShops',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(searchPetCoffeeShopsThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(searchPetCoffeeShopsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(searchPetCoffeeShopsThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default searchPetCoffeeShopsSlice.reducer;
