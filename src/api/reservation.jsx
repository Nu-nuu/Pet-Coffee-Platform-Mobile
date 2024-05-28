import api from './api';

export const getAvailableSeat = async (shopId, startTime, endTime, totalSeat) => {
    const response = await api.get(`/api/v1/petcoffeeshops/booking/areas?ShopId=${shopId}&StartTime=${startTime}&EndTime=${endTime}&TotalSeat=${totalSeat}`);
    return response.data;
};


export const createReservation = async data => {
    const response = await api.post(`/api/v1/orders`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getReservationDetail = async id => {
    const response = await api.get(`/api/v1/order/${id}`);
    return response.data;
};

export const getAllReservation = async (searchQuery, status) => {
    if (status != null) {
        const response = await api.get(`/api/v1/accounts/orders?Search=${searchQuery}&Status=${status}`)
        return response.data;
    } else {
        const response = await api.get(`/api/v1/accounts/orders`)
        return response.data;
    }
};

// export const getAllTransaction = async type => {
//     if (type) {
//         const response = await api.get(`/api/v1/transactions?Type=${type}`);
//         return response.data;
//     } else {
//         const response = await api.get(`/api/v1/transactions`);
//         return response.data;
//     }
// };

export const createInvoiceReservation = async (id, data) => {
    try {
        const response = await api.put(`/api/v1/orders/${id}/invoice`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data);
    }
};

export const refundReservation = async id => {
    const response = await api.put(`/api/v1/order/${id}/return`);
    return response.data;
};

export const deleteInvoiceReservation = async (id) => {
    const response = await api.delete(`/api/v1/orders/${id}/reservation-product`);
    return response.data;
};

export const getReservationShop = async (id, searchQuery, status) => {
    const response = await api.get(`/api/v1/orders?Search=${searchQuery}&Status=${status}&ShopId=${id}`);
    return response.data;
};


export const rateReservation = async (id, data) => {
    try {
        const response = await api.put(`/api/v1/order/${id}/rate`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data);
    }
};