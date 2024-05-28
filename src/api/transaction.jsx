import api from './api';

export const getAllTransaction = async type => {
    if (type) {
        const response = await api.get(`/api/v1/transactions?Type=${type}`);
        return response.data;
    } else {
        const response = await api.get(`/api/v1/transactions`);
        return response.data;
    }
};

export const getTransactionFromUser = async id => {
    const response = await api.get(`/api/v1/transactions?CustomerId=${id}`);
    return response.data;
};

export const getTransactionFromShop = async id => {
    const response = await api.get(`/api/v1/transactions?ShopId=${id}`);
    return response.data;
};

export const getTransactionDetail = async id => {
    const response = await api.get(`/api/v1/transactions/${id}`);
    return response.data;
};

export const createItemsTransaction = async data => {
    const response = await api.post(`/api/v1/transactions/items`, data);
    return response.data;
};

///api/v1/transactions?CustomerId=5