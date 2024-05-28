import {createSlice} from '@reduxjs/toolkit';
import {getRandomRatingThunk} from '../../apiThunk/ratePetThunk';

export const randomRatingSlice = createSlice({
  name: 'randomRating',
  initialState: {
    entities: [],
    draft: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(getRandomRatingThunk.pending, state => {
        state.loading = true;
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(getRandomRatingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(getRandomRatingThunk.rejected, (state, action) => {
        state.loading = false;
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default randomRatingSlice.reducer;
