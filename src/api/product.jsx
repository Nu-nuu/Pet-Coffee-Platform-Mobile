import api from './api';

export const getProductFromShop = async id => {
    const response = await api.get(`/api/v1/petCoffeeShops/products?ShopId=${id}`);
    return response.data;
};

export const getProductDetail = async id => {
    const response = await api.get(`/api/v1/products/${id}`);
    return response.data;
};

export const createProduct = async data => {
    const response = await api.post(`/api/v1/products`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const editProduct = async data => {
    const response = await api.put(`/api/v1/products`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteProduct = async id => {
    const response = await api.delete(`/api/v1/products/${id}`);
    return response.data;
};
