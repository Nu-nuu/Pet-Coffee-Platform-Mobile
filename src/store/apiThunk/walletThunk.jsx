import {createAsyncThunk} from '@reduxjs/toolkit';
import {getWallet} from '../../api/wallet';

export const getWalletThunk = createAsyncThunk(
  'wallet/getWallet',
  async thunkAPI => {
    try {
      const response = await getWallet();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
