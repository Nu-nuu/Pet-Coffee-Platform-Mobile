import {createSlice} from '@reduxjs/toolkit';
import {getRatingsFromPetThunk} from '../../apiThunk/ratePetThunk';

export const ratingsFromPetSlice = createSlice({
  name: 'ratingsFromPet',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getRatingsFromPetThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getRatingsFromPetThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getRatingsFromPetThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default ratingsFromPetSlice.reducer;
