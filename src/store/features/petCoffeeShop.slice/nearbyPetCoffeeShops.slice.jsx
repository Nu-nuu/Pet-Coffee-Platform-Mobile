import { createSlice } from '@reduxjs/toolkit';
import { getAllShopsDistanceThunk } from '../../apiThunk/petCoffeeShopThunk';

export const nearbyPetCoffeeShopsSlice = createSlice({
    name: 'nearbyPetCoffeeShops',
    initialState: {
        entities: [],
        draft: [],
        loading: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(getAllShopsDistanceThunk.pending, state => {
                state.loading = true;
                state.loading = 'loading';
                state.error = null;
            })
            .addCase(getAllShopsDistanceThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.loading = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(getAllShopsDistanceThunk.rejected, (state, action) => {
                state.loading = false;
                state.loading = 'failed';
                state.error = action.payload;
            });
    },
});

export default nearbyPetCoffeeShopsSlice.reducer;
