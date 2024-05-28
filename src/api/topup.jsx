import api from './api';

export const createTopup = async data => {
    const response = await api.post(`/api/v1/recharges`, data);
    return response.data;
};

