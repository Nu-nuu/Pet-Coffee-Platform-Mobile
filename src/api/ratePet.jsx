import api from './api';

export const getRatingsFromPet = async id => {
  const response = await api.get(`/api/v1/pet/${id}/rate-pets`);
  return response.data;
};

export const getRandomRating = async id => {
  const response = await api.get(`/api/v1/pet/${id}/rate-pets/random`);
  return response.data;
};

export const ratePet = async data => {
  const response = await api.post(`/api/v1/rate-pets`, data);
  return response.data;
};
