import api from './api';

export const getAllItems = async () => {
  const response = await api.get(`/api/v1/items`);
  return response.data;
};

export const getItemsFromUser = async () => {
  const response = await api.get(`/api/v1/account/items`);
  return response.data;
};

export const getItemDetail = async id => {
  const response = await api.get(`/api/v1/item/${id}`);
  return response.data;
};

export const createItem = async data => {
  const response = await api.post(`/api/v1/items`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const donatePet = async data => {
  const response = await api.post(`/api/v1/items/donation`, data);
  return response.data;
};
