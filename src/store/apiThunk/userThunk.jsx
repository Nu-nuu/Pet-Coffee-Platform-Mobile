import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getUserData,
  login,
  sendOTP,
  verifyUser,
  getUserDetail,
  signup,
  checkEmail,
  newPassword,
  sendOTPForgotPassword,
  updatePassword,
  updateUserData,
  verifyForgot,
  loginGG,
} from '../../api/user';

export const updateUserDataThunk = createAsyncThunk(
  'users/updateUserData',
  async (data, thunkAPI) => {
    try {
      const response = await updateUserData(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updatePasswordThunk = createAsyncThunk(
  'users/updatePassword',
  async (data, thunkAPI) => {
    try {
      const response = await updatePassword(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const sendOTPForgotPasswordThunk = createAsyncThunk(
  'users/sendOTPForgotPassword',
  async (data, thunkAPI) => {
    try {
      const response = await sendOTPForgotPassword(data);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const newPasswordThunk = createAsyncThunk(
  'users/newPassword',
  async (data, thunkAPI) => {
    try {
      const response = await newPassword(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const checkEmailThunk = createAsyncThunk(
  'users/checkEmail',
  async (data, thunkAPI) => {
    try {
      const response = await checkEmail(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const verifyForgotThunk = createAsyncThunk(
  'users/verifyForgot',
  async (data, thunkAPI) => {
    try {
      const response = await verifyForgot(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const verifyUserThunk = createAsyncThunk(
  'users/verifyUser',
  async (data, thunkAPI) => {
    try {
      const response = await verifyUser(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const sendOTPThunk = createAsyncThunk(
  'users/sendOTP',
  async thunkAPI => {
    try {
      const response = await sendOTP();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const loginGGThunk = createAsyncThunk(
  'users/loginGG',
  async (data, thunkAPI) => {
    try {
      const response = await loginGG(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const loginThunk = createAsyncThunk(
  'users/login',
  async (data, thunkAPI) => {
    try {
      const response = await login(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getUserDataThunk = createAsyncThunk(
  'users/getUserData',
  async thunkAPI => {
    try {
      const response = await getUserData();
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getUserDetailThunk = createAsyncThunk(
  'users/getUserDetail',
  async (id, thunkAPI) => {
    try {
      const response = await getUserDetail(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const signupThunk = createAsyncThunk(
  'users/signup',
  async (data, thunkAPI) => {
    try {
      const response = await signup(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);
