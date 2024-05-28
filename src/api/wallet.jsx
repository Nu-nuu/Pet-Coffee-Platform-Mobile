import api from './api';

export const getWallet = async () => {
    const response = await api.get(`/api/v1/account/wallet`);
    return response.data;
};
