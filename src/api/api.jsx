// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const url = 'https://petcoffeshops.azurewebsites.net';

const api = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const token = JSON.parse(accessToken);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
