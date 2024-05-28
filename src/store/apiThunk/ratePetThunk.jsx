import {createAsyncThunk} from '@reduxjs/toolkit';
import {getRatingsFromPet, ratePet, getRandomRating} from '../../api/ratePet';

export const getRandomRatingThunk = createAsyncThunk(
  'ratePet/getRandomRating',
  async (id, thunkAPI) => {
    try {
      const response = await getRandomRating(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getRatingsFromPetThunk = createAsyncThunk(
  'ratePet/getRatingsFromPet',
  async (id, thunkAPI) => {
    try {
      const response = await getRatingsFromPet(id);
      return response.items;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const ratePetThunk = createAsyncThunk(
  'ratePet/ratePet',
  async (data, thunkAPI) => {
    try {
      const response = await ratePet(data);
      return response.items;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
