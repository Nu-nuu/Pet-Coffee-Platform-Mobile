import api from './api';

export const getPromotionFromShop = async id => {
    const response = await api.get(`/api/v1/petCoffeeShops/promotion?ShopId=${id}`);
    return response.data;
};


export const getPromotionDetail = async id => {
    const response = await api.get(`/api/v1/promotion/${id}`);
    return response.data;
};
